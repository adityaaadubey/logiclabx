"""
Number System Converter for LogicLab X
Supports Binary (2), Octal (8), Decimal (10), Hexadecimal (16).
Handles Integers, Fractions, Negative values, case-insensitive Hex, and Precision control.
Generates step-by-step mathematical explanations for all conversions.
"""

from decimal import Decimal, getcontext
import re

getcontext().prec = 28

VALID_DIGITS = {
    2: set("01"),
    8: set("01234567"),
    10: set("0123456789"),
    16: set("0123456789ABCDEFabcdef")
}

BASE_NAMES = {
    2: "Binary",
    8: "Octal",
    10: "Decimal",
    16: "Hexadecimal"
}

HEX_MAP = {i: "0123456789ABCDEF"[i] for i in range(16)}
REVERSE_HEX_MAP = {c: i for i, c in enumerate("0123456789ABCDEF")}


def clean_input(val_str: str) -> str:
    """Strip whitespace and normalize decimal separator."""
    if not isinstance(val_str, str):
        val_str = str(val_str)
    return val_str.strip().replace(",", ".")


def validate_number(val_str: str, base: int):
    """
    Validates input string for a given base.
    Returns (is_valid, error_message, sign, int_part, frac_part).
    """
    if base not in VALID_DIGITS:
        return False, f"Unsupported base {base}. Supported bases are 2, 8, 10, 16.", "+", "", ""

    s = clean_input(val_str)
    if not s:
        return False, "Input value cannot be empty.", "+", "", ""

    sign = "+"
    if s.startswith("-"):
        sign = "-"
        s = s[1:].strip()
    elif s.startswith("+"):
        s = s[1:].strip()

    if not s:
        return False, "Sign must be followed by valid digits.", "+", "", ""

    if s.count(".") > 1:
        return False, "Number cannot have more than one radix (decimal) point.", "+", "", ""

    if "." in s:
        parts = s.split(".")
        int_part = parts[0]
        frac_part = parts[1]
    else:
        int_part = s
        frac_part = ""

    if not int_part and not frac_part:
        return False, "Number must contain at least one digit.", "+", "", ""

    valid_set = VALID_DIGITS[base]
    for char in int_part:
        if char not in valid_set:
            return False, f"Invalid character '{char}' for base {base} ({BASE_NAMES[base]}).", "+", "", ""

    for char in frac_part:
        if char not in valid_set:
            return False, f"Invalid character '{char}' for base {base} ({BASE_NAMES[base]}).", "+", "", ""

    int_part = int_part.upper() if int_part else "0"
    frac_part = frac_part.upper()

    return True, "", sign, int_part, frac_part


def base_to_decimal_value(int_part: str, frac_part: str, base: int) -> Decimal:
    """Convert parts in given base into exact Decimal representation."""
    int_val = Decimal(0)
    for c in int_part:
        int_val = int_val * base + REVERSE_HEX_MAP[c]

    frac_val = Decimal(0)
    if frac_part:
        power = Decimal(base)
        for c in frac_part:
            frac_val += Decimal(REVERSE_HEX_MAP[c]) / power
            power *= base

    return int_val + frac_val


def decimal_to_base_string(dec_val: Decimal, target_base: int, precision: int = 4) -> tuple[str, str]:
    """
    Convert a positive Decimal value to integer and fractional strings in target_base.
    Returns (target_int_str, target_frac_str).
    """
    int_val = int(dec_val)
    frac_val = dec_val - Decimal(int_val)

    # Integer conversion
    if int_val == 0:
        int_str = "0"
    else:
        digits = []
        n = int_val
        while n > 0:
            rem = n % target_base
            digits.append(HEX_MAP[rem])
            n //= target_base
        int_str = "".join(reversed(digits))

    # Fractional conversion
    frac_digits = []
    curr_frac = frac_val
    for _ in range(precision):
        if curr_frac == 0:
            break
        curr_frac *= target_base
        d = int(curr_frac)
        frac_digits.append(HEX_MAP[d])
        curr_frac -= Decimal(d)

    frac_str = "".join(frac_digits)
    return int_str, frac_str


def convert_all_bases(val_str: str, source_base: int, precision: int = 4) -> dict:
    """Generate representations in all 4 bases."""
    is_valid, err, sign, int_part, frac_part = validate_number(val_str, source_base)
    if not is_valid:
        return {"error": err}

    dec_val = base_to_decimal_value(int_part, frac_part, source_base)
    prefix = "-" if sign == "-" and dec_val > 0 else ""

    result = {}
    for base in [2, 8, 10, 16]:
        t_int, t_frac = decimal_to_base_string(dec_val, base, precision)
        res_str = f"{prefix}{t_int}" + (f".{t_frac}" if t_frac else "")
        result[str(base)] = res_str
        result[BASE_NAMES[base].lower()] = res_str

    return result


def convert_number(val_str: str, source_base: int, target_base: int, precision: int = 4) -> dict:
    """
    Main conversion handler.
    Returns full result dict with steps, math explanations, comparison, and verification.
    """
    precision = max(1, min(12, int(precision)))
    is_valid, err, sign, int_part, frac_part = validate_number(val_str, source_base)

    if not is_valid:
        return {
            "success": False,
            "error": err,
            "input_value": val_str,
            "source_base": source_base,
            "target_base": target_base,
            "precision": precision
        }

    clean_num = (f"{sign}" if sign == "-" else "") + int_part + (f".{frac_part}" if frac_part else "")
    all_bases = convert_all_bases(clean_num, source_base, precision)

    # Same base case
    if source_base == target_base:
        norm_result = (f"{sign}" if sign == "-" else "") + int_part + (f".{frac_part}" if frac_part else "")
        return {
            "success": True,
            "input_value": clean_num,
            "source_base": source_base,
            "target_base": target_base,
            "result": norm_result,
            "is_negative": (sign == "-"),
            "has_fraction": bool(frac_part),
            "precision": precision,
            "method": "Identity / Validation",
            "explanation": f"The source base and target base are both {BASE_NAMES[source_base]} (Base {source_base}). The number is verified and normalized.",
            "steps": [{
                "title": "Base Validation",
                "content": f"Value '{clean_num}' is a syntactically valid Base {source_base} number.",
                "details": []
            }],
            "all_bases": all_bases
        }

    # Directed conversions with tailored steps
    steps = []
    explanation = ""
    method = ""

    # Case 1: Decimal to Base (2, 8, or 16)
    if source_base == 10 and target_base in [2, 8, 16]:
        method = "Repeated Division and Multiplication"
        int_val = int(int_part)
        dec_frac = Decimal("0." + frac_part) if frac_part else Decimal(0)

        # Division steps for Integer
        div_steps = []
        curr = int_val
        rem_digits = []
        if curr == 0:
            div_steps.append({
                "quotient_in": 0,
                "base": target_base,
                "quotient_out": 0,
                "remainder": 0,
                "symbol": "0",
                "step_text": f"0 ÷ {target_base} = 0 with remainder 0"
            })
            rem_digits.append("0")
        else:
            step_num = 1
            while curr > 0:
                q = curr // target_base
                rem = curr % target_base
                sym = HEX_MAP[rem]
                rem_digits.append(sym)
                div_steps.append({
                    "step": step_num,
                    "quotient_in": curr,
                    "base": target_base,
                    "quotient_out": q,
                    "remainder": rem,
                    "symbol": sym,
                    "step_text": f"{curr} ÷ {target_base} = {q} (Remainder: {rem} → '{sym}')"
                })
                curr = q
                step_num += 1

        t_int_str = "".join(reversed(rem_digits))

        steps.append({
            "title": f"Integer Part ({int_part}₁₀ → Base {target_base})",
            "type": "division",
            "description": f"Repeatedly divide by {target_base}. Keep track of the remainders. Read remainders from bottom to top (Least Significant to Most Significant digit).",
            "table": div_steps,
            "reading_order": "Bottom to Top (↑): " + t_int_str
        })

        # Multiplication steps for Fraction
        t_frac_str = ""
        if frac_part and dec_frac > 0:
            mult_steps = []
            f_curr = dec_frac
            frac_digits = []
            for i in range(precision):
                if f_curr == 0:
                    break
                prod = f_curr * target_base
                int_bit = int(prod)
                rem_frac = prod - Decimal(int_bit)
                sym = HEX_MAP[int_bit]
                frac_digits.append(sym)
                mult_steps.append({
                    "step": i + 1,
                    "fraction_in": str(f_curr),
                    "base": target_base,
                    "product": str(prod),
                    "extracted": sym,
                    "remaining": str(rem_frac),
                    "step_text": f"{f_curr} × {target_base} = {prod} → Extract '{sym}', Remainder: {rem_frac}"
                })
                f_curr = rem_frac
            t_frac_str = "".join(frac_digits)
            steps.append({
                "title": f"Fractional Part (0.{frac_part}₁₀ → Base {target_base})",
                "type": "multiplication",
                "description": f"Repeatedly multiply the fractional part by {target_base}. Extract the integer part as the next digit. Read from top to bottom (↓).",
                "table": mult_steps,
                "reading_order": f"Top to Bottom (↓): .{t_frac_str}" + (" (truncated at precision)" if f_curr > 0 else "")
            })

        prefix = "-" if sign == "-" and (int_val > 0 or dec_frac > 0) else ""
        final_result = f"{prefix}{t_int_str}" + (f".{t_frac_str}" if t_frac_str else "")
        explanation = (
            f"Converting Decimal {clean_num}₁₀ to {BASE_NAMES[target_base]} (Base {target_base}): "
            f"Integer part {int_part} is divided by {target_base} repeatedly yielding {t_int_str}."
        )
        if frac_part:
            explanation += f" Fractional part 0.{frac_part} is multiplied by {target_base} yielding .{t_frac_str}."

    # Case 2: Base (2, 8, or 16) to Decimal (10)
    elif target_base == 10 and source_base in [2, 8, 16]:
        method = "Positional Weight Expansion"
        int_table = []
        n_int = len(int_part)
        total_int = 0

        for i, char in enumerate(int_part):
            power = n_int - 1 - i
            val = REVERSE_HEX_MAP[char]
            term_val = val * (source_base ** power)
            total_int += term_val
            int_table.append({
                "digit": char,
                "digit_value": val,
                "power": power,
                "weight": f"{source_base}^{power} = {source_base ** power}",
                "calculation": f"{val} × {source_base ** power} = {term_val}",
                "term_value": term_val
            })

        frac_table = []
        total_frac = Decimal(0)
        if frac_part:
            for j, char in enumerate(frac_part):
                neg_power = -(j + 1)
                val = REVERSE_HEX_MAP[char]
                weight = Decimal(source_base) ** neg_power
                term_val = Decimal(val) * weight
                total_frac += term_val
                frac_table.append({
                    "digit": char,
                    "digit_value": val,
                    "power": neg_power,
                    "weight": f"{source_base}^({neg_power}) = {1 / (source_base ** (j + 1)):.6g}",
                    "calculation": f"{val} × ({source_base}^{neg_power}) = {term_val:.6g}",
                    "term_value": str(term_val)
                })

        steps.append({
            "title": f"Integer Expansion ({int_part} in Base {source_base})",
            "type": "positional_integer",
            "description": f"Multiply each digit by its positional weight {source_base}^position and sum them up.",
            "table": int_table,
            "sum_formula": " + ".join([f"({row['digit']} × {source_base}^{row['power']})" for row in int_table]),
            "sum_result": total_int
        })

        if frac_part:
            steps.append({
                "title": f"Fractional Expansion (.{frac_part} in Base {source_base})",
                "type": "positional_fraction",
                "description": f"Multiply each fractional digit by negative powers of {source_base} ({source_base}^-1, {source_base}^-2, ...) and sum them up.",
                "table": frac_table,
                "sum_formula": " + ".join([f"({row['digit']} × {source_base}^{row['power']})" for row in frac_table]),
                "sum_result": str(total_frac)
            })

        dec_sum = Decimal(total_int) + total_frac
        prefix = "-" if sign == "-" and dec_sum > 0 else ""
        # Format decimal string nicely up to precision
        if frac_part:
            dec_str = f"{dec_sum:.{precision}f}".rstrip("0").rstrip(".")
            final_result = f"{prefix}{dec_str}"
        else:
            final_result = f"{prefix}{total_int}"

        explanation = (
            f"Converting {BASE_NAMES[source_base]} {clean_num} to Decimal (Base 10): "
            f"Each digit is multiplied by its positional weight ({source_base}^n) and accumulated, "
            f"giving a total decimal value of {final_result}₁₀."
        )

    # Case 3: Binary to Hexadecimal (Direct 4-bit grouping)
    elif source_base == 2 and target_base == 16:
        method = "4-bit Nibble Grouping"
        # Pad integer from left to multiple of 4
        rem_int = len(int_part) % 4
        pad_int = (4 - rem_int) % 4
        padded_int = ("0" * pad_int) + int_part
        int_groups = [padded_int[i:i + 4] for i in range(0, len(padded_int), 4)]

        group_steps_int = []
        hex_int_digits = []
        for grp in int_groups:
            dec_grp = int(grp, 2)
            hex_ch = HEX_MAP[dec_grp]
            hex_int_digits.append(hex_ch)
            group_steps_int.append({
                "group": grp,
                "binary_eval": f"({grp[0]}×8) + ({grp[1]}×4) + ({grp[2]}×2) + ({grp[3]}×1)",
                "decimal_value": dec_grp,
                "hex_digit": hex_ch
            })

        steps.append({
            "title": "Integer 4-bit Grouping (Right-to-Left)",
            "type": "bit_grouping",
            "description": f"Group bits into sets of 4 from right to left (LSB). Padded with {pad_int} leading zero(s) to form complete 4-bit nibbles.",
            "groups": group_steps_int,
            "padded_binary": " ".join(int_groups),
            "mapped_result": "".join(hex_int_digits)
        })

        hex_frac_digits = []
        if frac_part:
            rem_frac = len(frac_part) % 4
            pad_frac = (4 - rem_frac) % 4
            padded_frac = frac_part + ("0" * pad_frac)
            frac_groups = [padded_frac[i:i + 4] for i in range(0, len(padded_frac), 4)]
            group_steps_frac = []
            for grp in frac_groups:
                dec_grp = int(grp, 2)
                hex_ch = HEX_MAP[dec_grp]
                hex_frac_digits.append(hex_ch)
                group_steps_frac.append({
                    "group": grp,
                    "binary_eval": f"({grp[0]}×8) + ({grp[1]}×4) + ({grp[2]}×2) + ({grp[3]}×1)",
                    "decimal_value": dec_grp,
                    "hex_digit": hex_ch
                })
            steps.append({
                "title": "Fractional 4-bit Grouping (Left-to-Right)",
                "type": "bit_grouping_frac",
                "description": f"Group fractional bits into sets of 4 from left to right. Padded with {pad_frac} trailing zero(s).",
                "groups": group_steps_frac,
                "padded_binary": "." + " ".join(frac_groups),
                "mapped_result": "." + "".join(hex_frac_digits)
            })

        prefix = "-" if sign == "-" and clean_num != "0" else ""
        t_int_res = "".join(hex_int_digits).lstrip("0") or "0"
        t_frac_res = "".join(hex_frac_digits)
        final_result = f"{prefix}{t_int_res}" + (f".{t_frac_res}" if t_frac_res else "")

        explanation = (
            f"Converting Binary to Hexadecimal: Group bits into 4-bit nibbles ({2}^4 = 16). "
            f"Each 4-bit group corresponds directly to one hexadecimal digit (0–F)."
        )

    # Case 4: Binary to Octal (Direct 3-bit grouping)
    elif source_base == 2 and target_base == 8:
        method = "3-bit Octet Grouping"
        rem_int = len(int_part) % 3
        pad_int = (3 - rem_int) % 3
        padded_int = ("0" * pad_int) + int_part
        int_groups = [padded_int[i:i + 3] for i in range(0, len(padded_int), 3)]

        group_steps_int = []
        oct_int_digits = []
        for grp in int_groups:
            dec_grp = int(grp, 2)
            oct_int_digits.append(str(dec_grp))
            group_steps_int.append({
                "group": grp,
                "binary_eval": f"({grp[0]}×4) + ({grp[1]}×2) + ({grp[2]}×1)",
                "decimal_value": dec_grp,
                "octal_digit": str(dec_grp)
            })

        steps.append({
            "title": "Integer 3-bit Grouping (Right-to-Left)",
            "type": "bit_grouping",
            "description": f"Group bits into sets of 3 from right to left (LSB). Padded with {pad_int} leading zero(s).",
            "groups": group_steps_int,
            "padded_binary": " ".join(int_groups),
            "mapped_result": "".join(oct_int_digits)
        })

        oct_frac_digits = []
        if frac_part:
            rem_frac = len(frac_part) % 3
            pad_frac = (3 - rem_frac) % 3
            padded_frac = frac_part + ("0" * pad_frac)
            frac_groups = [padded_frac[i:i + 3] for i in range(0, len(padded_frac), 3)]
            group_steps_frac = []
            for grp in frac_groups:
                dec_grp = int(grp, 2)
                oct_frac_digits.append(str(dec_grp))
                group_steps_frac.append({
                    "group": grp,
                    "binary_eval": f"({grp[0]}×4) + ({grp[1]}×2) + ({grp[2]}×1)",
                    "decimal_value": dec_grp,
                    "octal_digit": str(dec_grp)
                })
            steps.append({
                "title": "Fractional 3-bit Grouping (Left-to-Right)",
                "type": "bit_grouping_frac",
                "description": f"Group fractional bits into sets of 3 from left to right. Padded with {pad_frac} trailing zero(s).",
                "groups": group_steps_frac,
                "padded_binary": "." + " ".join(frac_groups),
                "mapped_result": "." + "".join(oct_frac_digits)
            })

        prefix = "-" if sign == "-" and clean_num != "0" else ""
        t_int_res = "".join(oct_int_digits).lstrip("0") or "0"
        t_frac_res = "".join(oct_frac_digits)
        final_result = f"{prefix}{t_int_res}" + (f".{t_frac_res}" if t_frac_res else "")

        explanation = (
            f"Converting Binary to Octal: Group bits into 3-bit sets ({2}^3 = 8). "
            f"Each 3-bit group corresponds directly to one octal digit (0–7)."
        )

    # Case 5: Hexadecimal to Binary (Direct 4-bit expansion)
    elif source_base == 16 and target_base == 2:
        method = "4-bit Nibble Expansion"
        exp_int = []
        bits_int = []
        for ch in int_part:
            val = REVERSE_HEX_MAP[ch]
            b = bin(val)[2:].zfill(4)
            bits_int.append(b)
            exp_int.append({
                "digit": ch,
                "value": val,
                "bits": b,
                "weights": f"{b[0]}×8 + {b[1]}×4 + {b[2]}×2 + {b[3]}×1 = {val}"
            })

        steps.append({
            "title": "Integer Hex Digit Expansion",
            "type": "digit_expansion",
            "description": "Expand each hexadecimal digit into its exact 4-bit binary equivalent.",
            "table": exp_int,
            "expanded_binary": " ".join(bits_int)
        })

        bits_frac = []
        if frac_part:
            exp_frac = []
            for ch in frac_part:
                val = REVERSE_HEX_MAP[ch]
                b = bin(val)[2:].zfill(4)
                bits_frac.append(b)
                exp_frac.append({
                    "digit": ch,
                    "value": val,
                    "bits": b,
                    "weights": f"{b[0]}×8 + {b[1]}×4 + {b[2]}×2 + {b[3]}×1 = {val}"
                })
            steps.append({
                "title": "Fractional Hex Digit Expansion",
                "type": "digit_expansion_frac",
                "description": "Expand each fractional hexadecimal digit into its 4-bit binary equivalent.",
                "table": exp_frac,
                "expanded_binary": "." + " ".join(bits_frac)
            })

        prefix = "-" if sign == "-" and clean_num != "0" else ""
        raw_int = "".join(bits_int).lstrip("0") or "0"
        raw_frac = "".join(bits_frac)
        final_result = f"{prefix}{raw_int}" + (f".{raw_frac}" if raw_frac else "")

        explanation = (
            f"Converting Hexadecimal to Binary: Replace each hexadecimal character with its corresponding "
            f"4-bit binary representation. Leading zeros on the integer part can be omitted."
        )

    # Case 6: Octal to Binary (Direct 3-bit expansion)
    elif source_base == 8 and target_base == 2:
        method = "3-bit Octet Expansion"
        exp_int = []
        bits_int = []
        for ch in int_part:
            val = int(ch)
            b = bin(val)[2:].zfill(3)
            bits_int.append(b)
            exp_int.append({
                "digit": ch,
                "value": val,
                "bits": b,
                "weights": f"{b[0]}×4 + {b[1]}×2 + {b[2]}×1 = {val}"
            })

        steps.append({
            "title": "Integer Octal Digit Expansion",
            "type": "digit_expansion",
            "description": "Expand each octal digit into its exact 3-bit binary equivalent.",
            "table": exp_int,
            "expanded_binary": " ".join(bits_int)
        })

        bits_frac = []
        if frac_part:
            exp_frac = []
            for ch in frac_part:
                val = int(ch)
                b = bin(val)[2:].zfill(3)
                bits_frac.append(b)
                exp_frac.append({
                    "digit": ch,
                    "value": val,
                    "bits": b,
                    "weights": f"{b[0]}×4 + {b[1]}×2 + {b[2]}×1 = {val}"
                })
            steps.append({
                "title": "Fractional Octal Digit Expansion",
                "type": "digit_expansion_frac",
                "description": "Expand each fractional octal digit into its 3-bit binary equivalent.",
                "table": exp_frac,
                "expanded_binary": "." + " ".join(bits_frac)
            })

        prefix = "-" if sign == "-" and clean_num != "0" else ""
        raw_int = "".join(bits_int).lstrip("0") or "0"
        raw_frac = "".join(bits_frac)
        final_result = f"{prefix}{raw_int}" + (f".{raw_frac}" if raw_frac else "")

        explanation = (
            f"Converting Octal to Binary: Replace each octal digit (0–7) with its corresponding "
            f"3-bit binary code (000–111)."
        )

    # Case 7: Octal <-> Hexadecimal (Via intermediate Binary bridge!)
    elif (source_base == 8 and target_base == 16) or (source_base == 16 and target_base == 8):
        method = f"{BASE_NAMES[source_base]} → Binary → {BASE_NAMES[target_base]}"
        # Step 1: Expand to Binary
        if source_base == 8:
            intermediate_conv = convert_number(clean_num, 8, 2, precision)
            bin_val = intermediate_conv["result"]
            steps.append({
                "title": f"Step 1: Expand Octal to Binary (3-bit groups)",
                "description": "Expand each octal digit into a 3-bit binary string.",
                "substeps": intermediate_conv["steps"]
            })
            # Step 2: Group Binary to Hex
            final_conv = convert_number(bin_val, 2, 16, precision)
            steps.append({
                "title": f"Step 2: Regroup Binary into Hexadecimal (4-bit nibbles)",
                "description": "Take the intermediate binary stream and group into 4-bit nibbles.",
                "substeps": final_conv["steps"]
            })
            final_result = final_conv["result"]
        else: # 16 -> 8
            intermediate_conv = convert_number(clean_num, 16, 2, precision)
            bin_val = intermediate_conv["result"]
            steps.append({
                "title": f"Step 1: Expand Hexadecimal to Binary (4-bit groups)",
                "description": "Expand each hexadecimal digit into a 4-bit binary string.",
                "substeps": intermediate_conv["steps"]
            })
            # Step 2: Group Binary to Octal
            final_conv = convert_number(bin_val, 2, 8, precision)
            steps.append({
                "title": f"Step 2: Regroup Binary into Octal (3-bit octets)",
                "description": "Take the intermediate binary stream and group into 3-bit octets.",
                "substeps": final_conv["steps"]
            })
            final_result = final_conv["result"]

        explanation = (
            f"Converting {BASE_NAMES[source_base]} directly to {BASE_NAMES[target_base]} is most reliably "
            f"done using Binary as an intermediate bridge: "
            f"First expand {clean_num} into binary, then regroup the bits according to the target base's power of 2."
        )

    else:
        # Fallback via Decimal
        dec_val = base_to_decimal_value(int_part, frac_part, source_base)
        t_int, t_frac = decimal_to_base_string(dec_val, target_base, precision)
        prefix = "-" if sign == "-" and dec_val > 0 else ""
        final_result = f"{prefix}{t_int}" + (f".{t_frac}" if t_frac else "")
        method = f"{BASE_NAMES[source_base]} → Decimal → {BASE_NAMES[target_base]}"
        explanation = f"Convert to intermediate Decimal, then convert to {BASE_NAMES[target_base]}."

    return {
        "success": True,
        "input_value": clean_num,
        "source_base": source_base,
        "target_base": target_base,
        "source_name": BASE_NAMES[source_base],
        "target_name": BASE_NAMES[target_base],
        "result": final_result,
        "is_negative": (sign == "-"),
        "has_fraction": bool(frac_part),
        "precision": precision,
        "method": method,
        "explanation": explanation,
        "steps": steps,
        "all_bases": all_bases
    }
