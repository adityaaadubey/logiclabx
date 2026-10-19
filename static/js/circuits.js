/**
 * LogicLab X — Circuit Schematics SVG Generator (circuits.js)
 * Draws accurate animated schematics for:
 * 1. Half Adder
 * 2. Full Adder (with Two Half-Adder decomposition)
 * 3. Half Subtractor
 * 4. Full Subtractor (with Two Half-Subtractor decomposition)
 */

window.CircuitRenderer = {
    renderCircuit: function(circuitType, signals, containerEl) {
        if (!containerEl) return;
        const type = circuitType.toUpperCase();

        if (type === "HALF_ADDER" || type === "HA") {
            containerEl.innerHTML = this.getHalfAdderSVG(signals);
        } else if (type === "FULL_ADDER" || type === "FA") {
            containerEl.innerHTML = this.getFullAdderSVG(signals);
        } else if (type === "HALF_SUBTRACTOR" || type === "HS") {
            containerEl.innerHTML = this.getHalfSubtractorSVG(signals);
        } else if (type === "FULL_SUBTRACTOR" || type === "FS") {
            containerEl.innerHTML = this.getFullSubtractorSVG(signals);
        }
    },

    wireClass: function(val, colorClass = "wire-high") {
        return (val === 1) ? `circuit-wire ${colorClass}` : "circuit-wire wire-low";
    },

    badge: function(x, y, val, id = "") {
        return `
            <g transform="translate(${x - 14}, ${y - 11})" ${id ? `id="${id}"` : ''}>
                <rect width="28" height="22" rx="4" class="wire-badge-bg"/>
                <text x="14" y="16" text-anchor="middle" class="wire-badge-text ${val === 1 ? 'text-info font-weight-bold' : ''}">${val}</text>
            </g>
        `;
    },

    // 1. Half Adder SVG
    getHalfAdderSVG: function(s) {
        const a = s.A || 0;
        const b = s.B || 0;
        const sum = s.Sum || 0;
        const carry = s.Carry || 0;

        return `
            <!-- Input Wires -->
            <path d="M 60 70 L 250 70" class="${this.wireClass(a)}" stroke-width="4"/>
            <path d="M 60 130 L 250 130" class="${this.wireClass(b)}" stroke-width="4"/>
            <path d="M 120 70 L 120 200 L 250 200" class="${this.wireClass(a)}" stroke-width="3.5"/>
            <path d="M 160 130 L 160 240 L 250 240" class="${this.wireClass(b)}" stroke-width="3.5"/>

            <!-- Junction Dots -->
            <circle cx="120" cy="70" r="5" fill="${a ? 'var(--neon-cyan)' : 'var(--wire-low)'}"/>
            <circle cx="160" cy="130" r="5" fill="${b ? 'var(--neon-cyan)' : 'var(--wire-low)'}"/>

            <!-- XOR Gate for Sum -->
            <g transform="translate(250, 40)">
                <path d="M -10 0 Q 15 60 -10 120" fill="none" stroke="var(--neon-cyan)" stroke-width="3.5"/>
                <path d="M 0 0 Q 25 60 0 120 Q 75 120 100 60 Q 75 0 0 0 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-cyan)" stroke-width="3.5"/>
                <text x="40" y="68" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="16" font-weight="bold" text-anchor="middle">XOR</text>
            </g>

            <!-- AND Gate for Carry -->
            <g transform="translate(250, 160)">
                <path d="M 0 0 L 50 0 C 90 0 90 120 50 120 L 0 120 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-amber)" stroke-width="3.5"/>
                <text x="40" y="68" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="16" font-weight="bold" text-anchor="middle">AND</text>
            </g>

            <!-- Output Wires -->
            <path d="M 350 100 L 560 100" class="${this.wireClass(sum, 'wire-high-emerald')}" stroke-width="4"/>
            <path d="M 340 220 L 560 220" class="${this.wireClass(carry, 'wire-high-amber')}" stroke-width="4"/>

            <!-- Badges -->
            ${this.badge(80, 70, a)}
            ${this.badge(80, 130, b)}
            ${this.badge(460, 100, sum)}
            ${this.badge(460, 220, carry)}

            <!-- Output LEDs inside SVG -->
            <circle cx="580" cy="100" r="14" class="led-svg-base" stroke="var(--border-color)" stroke-width="2.5"/>
            <circle cx="580" cy="100" r="10" class="led-svg-core ${sum ? 'led-on' : 'led-off'}" style="${sum ? 'fill:var(--neon-cyan);' : ''}"/>
            <circle cx="580" cy="220" r="14" class="led-svg-base" stroke="var(--border-color)" stroke-width="2.5"/>
            <circle cx="580" cy="220" r="10" class="led-svg-core ${carry ? 'led-on' : 'led-off'}" style="${carry ? 'fill:var(--neon-amber);' : ''}"/>

            <text x="40" y="75" class="wire-label">A</text>
            <text x="40" y="135" class="wire-label">B</text>
            <text x="610" y="105" class="wire-label">SUM (S)</text>
            <text x="610" y="225" class="wire-label">CARRY (C)</text>
        `;
    },

    // 2. Full Adder SVG (Decomposed into HA1, HA2, and OR gate)
    getFullAdderSVG: function(s) {
        const a = s.A || 0;
        const b = s.B || 0;
        const cin = s.Cin || 0;
        const s1 = s.S1 || 0;
        const c1 = s.C1 || 0;
        const c2 = s.C2 || 0;
        const sum = s.Sum || 0;
        const cout = s.Cout || 0;

        return `
            <!-- Input Pins -->
            <path d="M 40 50 L 130 50" class="${this.wireClass(a)}" stroke-width="3"/>
            <path d="M 40 90 L 130 90" class="${this.wireClass(b)}" stroke-width="3"/>
            <path d="M 40 180 L 320 180" class="${this.wireClass(cin)}" stroke-width="3"/>

            <!-- Branches to HA1 AND -->
            <path d="M 80 50 L 80 130 L 130 130" class="${this.wireClass(a)}" stroke-width="2.5"/>
            <path d="M 100 90 L 100 150 L 130 150" class="${this.wireClass(b)}" stroke-width="2.5"/>
            <circle cx="80" cy="50" r="4" fill="${a ? 'var(--neon-cyan)' : 'var(--wire-low)'}"/>
            <circle cx="100" cy="90" r="4" fill="${b ? 'var(--neon-cyan)' : 'var(--wire-low)'}"/>

            <!-- HA 1 Box Group (XOR 1 & AND 1) -->
            <g transform="translate(130, 30)">
                <!-- XOR1 -->
                <path d="M 0 0 Q 15 30 0 60 Q 45 60 65 30 Q 45 0 0 0 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-cyan)" stroke-width="2.5"/>
                <text x="25" y="35" fill="var(--text-primary)" font-size="11" font-weight="bold" text-anchor="middle">XOR₁</text>
            </g>
            <g transform="translate(130, 110)">
                <!-- AND1 -->
                <path d="M 0 0 L 30 0 C 55 0 55 60 30 60 L 0 60 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-amber)" stroke-width="2.5"/>
                <text x="25" y="35" fill="var(--text-primary)" font-size="11" font-weight="bold" text-anchor="middle">AND₁</text>
            </g>

            <!-- Intermediate Wires S1 and C1 -->
            <path d="M 195 60 L 320 60" class="${this.wireClass(s1)}" stroke-width="3"/>
            <path d="M 185 140 L 440 140 L 440 240 L 470 240" class="${this.wireClass(c1)}" stroke-width="2.5"/>

            <!-- Branch from S1 to HA2 AND -->
            <path d="M 260 60 L 260 110 L 320 110" class="${this.wireClass(s1)}" stroke-width="2.5"/>
            <!-- Branch from Cin to HA2 AND -->
            <path d="M 290 180 L 290 130 L 320 130" class="${this.wireClass(cin)}" stroke-width="2.5"/>
            <circle cx="260" cy="60" r="4" fill="${s1 ? 'var(--neon-cyan)' : 'var(--wire-low)'}"/>
            <circle cx="290" cy="180" r="4" fill="${cin ? 'var(--neon-cyan)' : 'var(--wire-low)'}"/>

            <!-- HA 2 Box Group (XOR 2 & AND 2) -->
            <g transform="translate(320, 40)">
                <!-- XOR2 for final Sum -->
                <path d="M 0 0 Q 15 30 0 60 Q 45 60 65 30 Q 45 0 0 0 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-cyan)" stroke-width="2.5"/>
                <text x="25" y="35" fill="var(--text-primary)" font-size="11" font-weight="bold" text-anchor="middle">XOR₂</text>
            </g>
            <g transform="translate(320, 100)">
                <!-- AND2 for C2 -->
                <path d="M 0 0 L 30 0 C 55 0 55 60 30 60 L 0 60 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-amber)" stroke-width="2.5"/>
                <text x="25" y="35" fill="var(--text-primary)" font-size="11" font-weight="bold" text-anchor="middle">AND₂</text>
            </g>

            <!-- C2 Wire to OR gate -->
            <path d="M 375 130 L 420 130 L 420 210 L 470 210" class="${this.wireClass(c2)}" stroke-width="2.5"/>

            <!-- Final Sum Wire -->
            <path d="M 385 70 L 580 70" class="${this.wireClass(sum, 'wire-high-emerald')}" stroke-width="3.5"/>

            <!-- OR Gate combining C1 and C2 -->
            <g transform="translate(470, 195)">
                <path d="M 0 0 Q 15 30 0 60 Q 45 60 65 30 Q 45 0 0 0 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-amber)" stroke-width="2.5"/>
                <text x="25" y="35" fill="var(--text-primary)" font-size="11" font-weight="bold" text-anchor="middle">OR</text>
            </g>

            <!-- Cout Wire -->
            <path d="M 535 225 L 580 225" class="${this.wireClass(cout, 'wire-high-amber')}" stroke-width="3.5"/>

            <!-- Badges -->
            ${this.badge(230, 60, s1)}
            ${this.badge(385, 230, c1)}
            ${this.badge(400, 130, c2)}
            ${this.badge(520, 70, sum)}
            ${this.badge(555, 225, cout)}

            <!-- LEDs -->
            <circle cx="600" cy="70" r="13" class="led-svg-base" stroke="var(--border-color)" stroke-width="2"/>
            <circle cx="600" cy="70" r="9" class="led-svg-core ${sum ? 'led-on' : 'led-off'}" style="${sum ? 'fill:var(--neon-cyan);' : ''}"/>
            <circle cx="600" cy="225" r="13" class="led-svg-base" stroke="var(--border-color)" stroke-width="2"/>
            <circle cx="600" cy="225" r="9" class="led-svg-core ${cout ? 'led-on' : 'led-off'}" style="${cout ? 'fill:var(--neon-amber);' : ''}"/>

            <text x="25" y="55" class="wire-label">A</text>
            <text x="25" y="95" class="wire-label">B</text>
            <text x="20" y="185" class="wire-label">Cin</text>
            <text x="635" y="75" class="wire-label">SUM</text>
            <text x="635" y="230" class="wire-label">COUT</text>
        `;
    },

    // 3. Half Subtractor SVG
    getHalfSubtractorSVG: function(s) {
        const a = s.A || 0;
        const b = s.B || 0;
        const notA = s.NotA !== undefined ? s.NotA : (a === 0 ? 1 : 0);
        const diff = s.Diff || 0;
        const borrow = s.Borrow || 0;

        return `
            <!-- Input Wires -->
            <path d="M 60 70 L 260 70" class="${this.wireClass(a)}" stroke-width="4"/>
            <path d="M 60 130 L 260 130" class="${this.wireClass(b)}" stroke-width="4"/>
            <!-- Branch A to NOT gate -->
            <path d="M 120 70 L 120 200 L 150 200" class="${this.wireClass(a)}" stroke-width="3"/>
            <!-- Branch B to AND gate -->
            <path d="M 180 130 L 180 240 L 260 240" class="${this.wireClass(b)}" stroke-width="3"/>

            <circle cx="120" cy="70" r="5" fill="${a ? 'var(--neon-cyan)' : 'var(--wire-low)'}"/>
            <circle cx="180" cy="130" r="5" fill="${b ? 'var(--neon-cyan)' : 'var(--wire-low)'}"/>

            <!-- XOR Gate for Difference -->
            <g transform="translate(260, 40)">
                <path d="M -10 0 Q 15 60 -10 120" fill="none" stroke="var(--neon-magenta)" stroke-width="3.5"/>
                <path d="M 0 0 Q 25 60 0 120 Q 75 120 100 60 Q 75 0 0 0 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-magenta)" stroke-width="3.5"/>
                <text x="40" y="68" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="16" font-weight="bold" text-anchor="middle">XOR</text>
            </g>

            <!-- NOT Gate on input A -->
            <g transform="translate(150, 180)">
                <polygon points="0,5 35,20 0,35" fill="var(--bg-surface-elevated)" stroke="var(--neon-coral)" stroke-width="2.5"/>
                <circle cx="40" cy="20" r="4" fill="var(--bg-surface-elevated)" stroke="var(--neon-coral)" stroke-width="2"/>
            </g>

            <!-- Wire from NOT A to AND gate -->
            <path d="M 195 200 L 260 200" class="${this.wireClass(notA, 'wire-high-coral')}" stroke-width="3"/>

            <!-- AND Gate for Borrow -->
            <g transform="translate(260, 160)">
                <path d="M 0 0 L 50 0 C 90 0 90 120 50 120 L 0 120 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-coral)" stroke-width="3.5"/>
                <text x="40" y="68" fill="var(--text-primary)" font-family="var(--font-mono)" font-size="16" font-weight="bold" text-anchor="middle">AND</text>
            </g>

            <!-- Outputs -->
            <path d="M 360 100 L 560 100" class="${this.wireClass(diff, 'wire-high-magenta')}" stroke-width="4"/>
            <path d="M 350 220 L 560 220" class="${this.wireClass(borrow, 'wire-high-coral')}" stroke-width="4"/>

            ${this.badge(80, 70, a)}
            ${this.badge(80, 130, b)}
            ${this.badge(225, 200, notA)}
            ${this.badge(460, 100, diff)}
            ${this.badge(460, 220, borrow)}

            <!-- LEDs -->
            <circle cx="580" cy="100" r="14" class="led-svg-base" stroke="var(--border-color)" stroke-width="2.5"/>
            <circle cx="580" cy="100" r="10" class="led-svg-core ${diff ? 'led-on' : 'led-off'}" style="${diff ? 'fill:var(--neon-magenta);' : ''}"/>
            <circle cx="580" cy="220" r="14" class="led-svg-base" stroke="var(--border-color)" stroke-width="2.5"/>
            <circle cx="580" cy="220" r="10" class="led-svg-core ${borrow ? 'led-on' : 'led-off'}" style="${borrow ? 'fill:var(--neon-coral);' : ''}"/>

            <text x="40" y="75" class="wire-label">A</text>
            <text x="40" y="135" class="wire-label">B</text>
            <text x="610" y="105" class="wire-label">DIFF (D)</text>
            <text x="610" y="225" class="wire-label">BORROW (B)</text>
        `;
    },

    // 4. Full Subtractor SVG (Decomposed into HS1, HS2, and OR gate)
    getFullSubtractorSVG: function(s) {
        const a = s.A || 0;
        const b = s.B || 0;
        const bin = s.Bin || 0;
        const d1 = s.D1 || 0;
        const b1 = s.B1 || 0;
        const b2 = s.B2 || 0;
        const diff = s.Diff || 0;
        const bout = s.Bout || 0;

        return `
            <!-- Inputs -->
            <path d="M 40 50 L 140 50" class="${this.wireClass(a)}" stroke-width="3"/>
            <path d="M 40 90 L 140 90" class="${this.wireClass(b)}" stroke-width="3"/>
            <path d="M 40 180 L 330 180" class="${this.wireClass(bin)}" stroke-width="3"/>

            <!-- Branches to NOT & AND for B1 -->
            <path d="M 70 50 L 70 120 L 90 120" class="${this.wireClass(a)}" stroke-width="2.5"/>
            <circle cx="70" cy="50" r="4" fill="${a ? 'var(--neon-cyan)' : 'var(--wire-low)'}"/>

            <!-- NOT on A -->
            <g transform="translate(90, 110)">
                <polygon points="0,3 25,10 0,17" fill="var(--bg-surface-elevated)" stroke="var(--neon-coral)" stroke-width="2"/>
                <circle cx="28" cy="10" r="3" fill="var(--bg-surface-elevated)" stroke="var(--neon-coral)" stroke-width="1.5"/>
            </g>
            <path d="M 121 120 L 140 120" class="${this.wireClass(a === 0 ? 1 : 0, 'wire-high-coral')}" stroke-width="2.5"/>

            <path d="M 85 90 L 85 145 L 140 145" class="${this.wireClass(b)}" stroke-width="2.5"/>
            <circle cx="85" cy="90" r="4" fill="${b ? 'var(--neon-cyan)' : 'var(--wire-low)'}"/>

            <!-- HS 1 XOR & AND -->
            <g transform="translate(140, 30)">
                <path d="M 0 0 Q 15 30 0 60 Q 45 60 65 30 Q 45 0 0 0 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-magenta)" stroke-width="2.5"/>
                <text x="25" y="35" fill="var(--text-primary)" font-size="11" font-weight="bold" text-anchor="middle">HS₁-D</text>
            </g>
            <g transform="translate(140, 105)">
                <path d="M 0 0 L 30 0 C 55 0 55 50 30 50 L 0 50 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-coral)" stroke-width="2.5"/>
                <text x="25" y="30" fill="var(--text-primary)" font-size="11" font-weight="bold" text-anchor="middle">HS₁-B</text>
            </g>

            <!-- D1 wire -->
            <path d="M 205 60 L 330 60" class="${this.wireClass(d1, 'wire-high-magenta')}" stroke-width="3"/>

            <!-- Branches to HS2 NOT and AND -->
            <path d="M 250 60 L 250 115 L 275 115" class="${this.wireClass(d1, 'wire-high-magenta')}" stroke-width="2.5"/>
            <circle cx="250" cy="60" r="4" fill="${d1 ? 'var(--neon-magenta)' : 'var(--wire-low)'}"/>

            <!-- NOT on D1 -->
            <g transform="translate(275, 105)">
                <polygon points="0,3 25,10 0,17" fill="var(--bg-surface-elevated)" stroke="var(--neon-coral)" stroke-width="2"/>
                <circle cx="28" cy="10" r="3" fill="var(--bg-surface-elevated)" stroke="var(--neon-coral)" stroke-width="1.5"/>
            </g>
            <path d="M 306 115 L 330 115" class="${this.wireClass(d1 === 0 ? 1 : 0, 'wire-high-coral')}" stroke-width="2.5"/>

            <path d="M 290 180 L 290 140 L 330 140" class="${this.wireClass(bin)}" stroke-width="2.5"/>
            <circle cx="290" cy="180" r="4" fill="${bin ? 'var(--neon-cyan)' : 'var(--wire-low)'}"/>

            <!-- HS 2 XOR & AND -->
            <g transform="translate(330, 40)">
                <path d="M 0 0 Q 15 30 0 60 Q 45 60 65 30 Q 45 0 0 0 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-magenta)" stroke-width="2.5"/>
                <text x="25" y="35" fill="var(--text-primary)" font-size="11" font-weight="bold" text-anchor="middle">HS₂-D</text>
            </g>
            <g transform="translate(330, 105)">
                <path d="M 0 0 L 30 0 C 55 0 55 50 30 50 L 0 50 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-coral)" stroke-width="2.5"/>
                <text x="25" y="30" fill="var(--text-primary)" font-size="11" font-weight="bold" text-anchor="middle">HS₂-B</text>
            </g>

            <!-- B1 and B2 routing to OR -->
            <path d="M 195 130 L 220 130 L 220 240 L 460 240" class="${this.wireClass(b1, 'wire-high-coral')}" stroke-width="2.5"/>
            <path d="M 385 130 L 430 130 L 430 215 L 460 215" class="${this.wireClass(b2, 'wire-high-coral')}" stroke-width="2.5"/>

            <!-- Final Difference Wire -->
            <path d="M 395 70 L 580 70" class="${this.wireClass(diff, 'wire-high-magenta')}" stroke-width="3.5"/>

            <!-- OR Gate for Bout -->
            <g transform="translate(460, 200)">
                <path d="M 0 0 Q 15 30 0 60 Q 45 60 65 30 Q 45 0 0 0 Z" fill="var(--bg-surface-elevated)" stroke="var(--neon-coral)" stroke-width="2.5"/>
                <text x="25" y="35" fill="var(--text-primary)" font-size="11" font-weight="bold" text-anchor="middle">OR</text>
            </g>

            <!-- Final Bout Wire -->
            <path d="M 525 230 L 580 230" class="${this.wireClass(bout, 'wire-high-coral')}" stroke-width="3.5"/>

            <!-- Badges -->
            ${this.badge(230, 60, d1)}
            ${this.badge(360, 240, b1)}
            ${this.badge(415, 130, b2)}
            ${this.badge(520, 70, diff)}
            ${this.badge(550, 230, bout)}

            <!-- Output LEDs -->
            <circle cx="600" cy="70" r="13" class="led-svg-base" stroke="var(--border-color)" stroke-width="2"/>
            <circle cx="600" cy="70" r="9" class="led-svg-core ${diff ? 'led-on' : 'led-off'}" style="${diff ? 'fill:var(--neon-magenta);' : ''}"/>
            <circle cx="600" cy="230" r="13" class="led-svg-base" stroke="var(--border-color)" stroke-width="2"/>
            <circle cx="600" cy="230" r="9" class="led-svg-core ${bout ? 'led-on' : 'led-off'}" style="${bout ? 'fill:var(--neon-coral);' : ''}"/>

            <text x="25" y="55" class="wire-label">A</text>
            <text x="25" y="95" class="wire-label">B</text>
            <text x="20" y="185" class="wire-label">Bin</text>
            <text x="635" y="75" class="wire-label">DIFF</text>
            <text x="635" y="235" class="wire-label">BOUT</text>
        `;
    }
};
