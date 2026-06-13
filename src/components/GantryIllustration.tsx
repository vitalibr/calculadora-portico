import { useState } from 'react';
import type { GantryInputs, GantryResults } from '../engineering/types';

// ══════════════════════════════════════════════════
// Types & mode definitions
// ══════════════════════════════════════════════════

type Mode = 'overview' | 'casters' | 'compression' | 'buckling' | 'deflection';

const MODES: { id: Mode; label: string }[] = [
  { id: 'overview',    label: 'Vista geral'  },
  { id: 'casters',     label: 'Rodízios'     },
  { id: 'compression', label: 'Compressão'   },
  { id: 'buckling',    label: 'Flambagem'    },
  { id: 'deflection',  label: 'Flecha'       },
];

// Explicações didáticas por modo (linguagem simples para leigos)
const MODE_EXPLANATIONS: Record<Mode, string> = {
  overview:
    'Esta vista mostra o conjunto completo do pórtico e a posição da carga. Aqui você enxerga as dimensões principais, o peso próprio da viga e onde a carga útil atua.',
  casters:
    'A capacidade nominal soma as 4 rodas. Já a conta conservadora usa apenas 3, porque em piso irregular uma delas pode aliviar ou perder parte do contato com o chão.',
  compression:
    'Compressão é o esforço de apertar a coluna no sentido vertical. A carga total é dividida entre as duas colunas, gerando uma tensão de compressão que pode ser verificada e comparada com o limite do material.',
  buckling:
    'Flambagem é a tendência de uma coluna longa e esbelta entortar lateralmente quando comprimida. Mesmo sem esmagar o material, a peça pode perder estabilidade se esse efeito for crítico.',
  deflection:
    'Flecha é a pequena deformação vertical da viga sob carga. Toda viga flete um pouco; o importante é verificar se essa deformação fica pequena e aceitável para o uso.',
};

// ══════════════════════════════════════════════════
// SVG geometry constants  (viewBox 640 × 430)
// ══════════════════════════════════════════════════

const VW = 640, VH = 430;

// I-beam
const BL  = 120;               // beam left x
const BR  = 520;               // beam right x
const BCX = 320;               // beam center x
const TFY = 92;                // top flange top y
const FH  = 9;                 // flange height px
const WH  = 22;                // web height px
const WW  = 9;                 // web width px
const BFY = TFY + FH + WH;    // 123 — bottom flange top y
const BB  = BFY + FH;         // 132 — beam bottom y (= column top)

// Columns
const CW  = 18;                // column width px
const LCR = BL + CW;          // 138 — left col right edge x
const LCC = BL + CW / 2;      // 129 — left col center x
const RCL = BR - CW;          // 502 — right col left edge x
const RCC = BR - CW / 2;      // 511 — right col center x
const CT  = BB;                // 132 — column top y
const CB  = 295;               // column bottom y
const CH  = CB - CT;          // 163 — column height px

// Gussets (≈45° knee braces from column to beam)
const GS   = 72;               // gusset length px
const LGX1 = LCR;             // 138
const LGY1 = CT + CH * 0.45;  // ≈205
const LGX2 = LCR + GS;        // 210
const LGY2 = CT;              // 132
const RGX1 = RCL;             // 502
const RGY1 = LGY1;
const RGX2 = RCL - GS;        // 430
const RGY2 = CT;              // 132

// Bases
const BAH = 14;               // base height px
const BAT = CB;               // 295 — base top y
const BAB = CB + BAH;         // 309 — base bottom y
const LBL = LCC - 50;        // 79  — left base left x
const LBR = LCC + 50;        // 179 — left base right x
const RBL = RCC - 50;        // 461 — right base left x
const RBR = RCC + 50;        // 561 — right base right x

// Casters
const CR  = 11;               // caster radius px
const CY  = BAB + CR;        // 320 — caster center y
const LC1 = LBL + 16;        // 95  — left caster 1 cx
const LC2 = LBR - 16;        // 163 — left caster 2 cx
const RC1 = RBL + 16;        // 477 — right caster 1 cx
const RC2 = RBR - 16;        // 545 — right caster 2 cx

// Hook / chain
const HX  = BCX;              // 320
const HTY = BB;               // 132 — chain top y
const HBY = 238;              // hook block top-of-hook y

// Floor
const FLOOR_Y = CY + CR;     // 331

// ══════════════════════════════════════════════════
// Number formatter
// ══════════════════════════════════════════════════
function f(n: number, d = 0): string {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

// ══════════════════════════════════════════════════
// SVG label helper — white rounded box with text
// ══════════════════════════════════════════════════
interface BoxProps {
  x: number;
  y: number;
  lines: string[];
  fs?: number;
  bold?: boolean;
  tc?: string;
  bg?: string;
  bc?: string;
  pad?: number;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
}

function Box({
  x, y, lines,
  fs = 11, bold = false,
  tc = '#334155', bg = 'white', bc = '#cbd5e1',
  pad = 6, anchor = 'middle',
  opacity = 1,
}: BoxProps) {
  const lh = fs + 5;
  const bh = lh * lines.length + pad * 2;
  const maxLen = Math.max(...lines.map((l) => l.length));
  const bw = Math.max(maxLen * (fs * 0.57) + pad * 2, 48);
  const ox = anchor === 'middle' ? -bw / 2 : anchor === 'end' ? -bw : 0;

  return (
    <g transform={`translate(${x + ox},${y - bh / 2})`} opacity={opacity}>
      <rect x={0} y={0} width={bw} height={bh} rx={5} fill={bg} stroke={bc} strokeWidth={1}
        filter="url(#lbl-sh)" />
      {lines.map((line, i) => (
        <text
          key={i}
          x={bw / 2}
          y={pad + (i + 0.75) * lh}
          textAnchor="middle"
          fontSize={fs}
          fontWeight={bold ? 700 : 400}
          fill={tc}
          fontFamily="'Segoe UI', system-ui, sans-serif"
        >
          {line}
        </text>
      ))}
    </g>
  );
}

// ══════════════════════════════════════════════════
// SVG defs — filters and arrow markers
// ══════════════════════════════════════════════════
function Defs() {
  const ap = 'M0,0.5 L7.5,4 L0,7.5 Z';
  const mk = (id: string, fill: string) => (
    <marker key={id} id={id} markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto">
      <path d={ap} fill={fill} />
    </marker>
  );
  return (
    <defs>
      <filter id="lbl-sh" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity="0.1" />
      </filter>
      {mk('arr-red',    '#dc2626')}
      {mk('arr-blue',   '#2563eb')}
      {mk('arr-green',  '#16a34a')}
      {mk('arr-orange', '#d97706')}
      {mk('arr-gray',   '#64748b')}
    </defs>
  );
}

// ══════════════════════════════════════════════════
// Base gantry structure (always rendered)
// ══════════════════════════════════════════════════
function GantryBase({ dim = false }: { dim?: boolean }) {
  const s  = '#334155';
  const ss = '#475569';
  const op = dim ? 0.22 : 1;

  return (
    <g opacity={op}>
      {/* Viga I — retângulo sólido (vista lateral); perfil I aparece na seção transversal) */}
      <rect x={BL} y={TFY} width={BR - BL} height={BB - TFY} rx={2} fill={s} />
      {/* Linhas internas discretas indicando a seção I (flange / alma) */}
      <line x1={BL + 3} y1={TFY + FH} x2={BR - 3} y2={TFY + FH}
        stroke="#29384a" strokeWidth={0.8} opacity={0.55} />
      <line x1={BL + 3} y1={BFY} x2={BR - 3} y2={BFY}
        stroke="#29384a" strokeWidth={0.8} opacity={0.55} />
      {/* Alma (área central do perfil I — tom levemente diferente) */}
      <rect x={BCX - WW / 2} y={TFY + FH} width={WW} height={WH}
        fill="rgba(0,0,0,0.10)" />

      {/* Left column */}
      <rect x={BL} y={CT} width={CW} height={CH} rx={2} fill={ss} />
      {/* Right column */}
      <rect x={RCL} y={CT} width={CW} height={CH} rx={2} fill={ss} />

      {/* Gussets */}
      <line x1={LGX1} y1={LGY1} x2={LGX2} y2={LGY2} stroke={ss} strokeWidth={7} strokeLinecap="round" />
      <line x1={RGX1} y1={RGY1} x2={RGX2} y2={RGY2} stroke={ss} strokeWidth={7} strokeLinecap="round" />

      {/* Bases */}
      <rect x={LBL} y={BAT} width={LBR - LBL} height={BAH} rx={2} fill={s} />
      <rect x={RBL} y={BAT} width={RBR - RBL} height={BAH} rx={2} fill={s} />

      {/* Casters */}
      {[LC1, LC2, RC1, RC2].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={CY} r={CR} fill="none" stroke={s} strokeWidth={2.5} />
          <circle cx={cx} cy={CY} r={4} fill={s} />
        </g>
      ))}

      {/* Floor line */}
      <line x1={30} y1={FLOOR_Y} x2={610} y2={FLOOR_Y} stroke="#94a3b8" strokeWidth={1.5} />

      {/* Chain */}
      <line x1={HX} y1={HTY} x2={HX} y2={HBY - 14}
        stroke={s} strokeWidth={2} strokeDasharray="4,3" />
      {/* Hook block */}
      <rect x={HX - 14} y={HBY - 14} width={28} height={20} rx={3} fill="#f59e0b" />
      {/* Hook curve */}
      <path
        d={`M${HX},${HBY + 6} Q${HX},${HBY + 20} ${HX - 12},${HBY + 20} Q${HX - 22},${HBY + 20} ${HX - 22},${HBY + 12}`}
        fill="none" stroke="#78350f" strokeWidth={2.5} strokeLinecap="round"
      />
      <circle cx={HX - 22} cy={HBY + 12} r={4} fill="none" stroke="#78350f" strokeWidth={2} />
    </g>
  );
}

// ══════════════════════════════════════════════════
// Mode: OVERVIEW
// ══════════════════════════════════════════════════
function OverviewMode({ inputs, results }: { inputs: GantryInputs; results: GantryResults }) {
  const { payloadKg } = inputs;
  const { selfWeightKg, totalLoadKg } = results.beam;

  return (
    <>
      {/* Center-of-gravity dashed vertical line */}
      <line x1={BCX} y1={TFY - 12} x2={BCX} y2={FLOOR_Y}
        stroke="#94a3b8" strokeWidth={1} strokeDasharray="6,4" />

      {/* Load arrow (downward from hook) */}
      <line x1={HX} y1={HBY + 32} x2={HX} y2={HBY + 65}
        stroke="#dc2626" strokeWidth={3} markerEnd="url(#arr-red)" />

      {/* Beam self-weight label */}
      <Box
        x={BCX - 95} y={TFY + 4}
        lines={[`Viga: ${f(selfWeightKg, 1)} kg`]}
        fs={10.5} bold tc="#7a5c10" bg="#fffbf0" bc="#f0dca0"
      />

      {/* Load label */}
      <Box
        x={HX + 62} y={HBY + 48}
        lines={[`Carga: ${f(payloadKg)} kg`]}
        fs={11} bold tc="#dc2626" bg="#fef2f2" bc="#fecaca"
      />

      {/* Total label near floor */}
      <Box
        x={BCX} y={FLOOR_Y + 20}
        lines={[`Total: ${f(totalLoadKg, 1)} kg`]}
        fs={10.5} tc="#334155"
      />

      {/* CG label */}
      <Box
        x={BCX + 16} y={BB + 22}
        lines={['CG']} fs={9} tc="#64748b" bg="#f1f5f9" bc="#e2e8f0"
      />

      {/* "Viga I" callout — identifica claramente o único perfil */}
      <Box
        x={BR + 14} y={TFY + (BB - TFY) / 2}
        lines={['← Viga I']}
        fs={9.5} tc="#475569" bg="#f1f5f9" bc="#cbd5e1"
        anchor="start"
      />

      {/* Cota do vão — linha fina de anotação técnica (não estrutural) */}
      <line x1={BL} y1={TFY - 32} x2={BR} y2={TFY - 32} stroke="#b0bec5" strokeWidth={0.75} />
      <line x1={BL} y1={TFY - 26} x2={BL} y2={TFY - 38} stroke="#b0bec5" strokeWidth={0.75} />
      <line x1={BR} y1={TFY - 26} x2={BR} y2={TFY - 38} stroke="#b0bec5" strokeWidth={0.75} />
      <Box
        x={BCX} y={TFY - 48}
        lines={[`vão: ${f(inputs.beamLengthM, 2)} m`]}
        fs={9} tc="#94a3b8" bg="#f8fafc" bc="#e2e8f0"
      />
    </>
  );
}

// ══════════════════════════════════════════════════
// Mode: CASTERS
// ══════════════════════════════════════════════════
function CastersMode({ inputs, results }: { inputs: GantryInputs; results: GantryResults }) {
  const { casterCapacityKg, casterCount, conservativeCasterCount } = inputs;
  const { nominalCapacityKg, conservativeCapacityKg } = results.caster;

  const allCxs = [LC1, LC2, RC1, RC2];
  const countedN = Math.min(conservativeCasterCount, allCxs.length);
  const counted    = allCxs.slice(0, countedN);
  const notCounted = allCxs.slice(countedN);

  return (
    <>
      {/* Counted casters — green */}
      {counted.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={CY} r={CR + 5} fill="#dcfce7" opacity={0.7} />
          <circle cx={cx} cy={CY} r={CR} fill="none" stroke="#16a34a" strokeWidth={2.5} />
          <circle cx={cx} cy={CY} r={4} fill="#16a34a" />
          <Box
            x={cx} y={BAT - 12}
            lines={[`${f(casterCapacityKg)} kg`]}
            fs={9.5} bold tc="#166534" bg="#f0fdf4" bc="#86efac"
          />
        </g>
      ))}

      {/* Not-counted casters — dim gray */}
      {notCounted.map((cx) => (
        <g key={cx} opacity={0.4}>
          <circle cx={cx} cy={CY} r={CR + 5} fill="#f1f5f9" />
          <circle cx={cx} cy={CY} r={CR} fill="none" stroke="#94a3b8" strokeWidth={2} />
          <circle cx={cx} cy={CY} r={4} fill="#94a3b8" />
          <Box
            x={cx} y={BAT - 12}
            lines={[`${f(casterCapacityKg)} kg`]}
            fs={9.5} tc="#64748b" bg="#f1f5f9" bc="#cbd5e1"
          />
        </g>
      ))}

      {/* "não contada" label under not-counted casters */}
      {notCounted.map((cx) => (
        <Box
          key={`nc-${cx}`}
          x={cx} y={FLOOR_Y + 18}
          lines={['não contada']}
          fs={9} tc="#94a3b8" bg="#f8fafc" bc="#e2e8f0"
        />
      ))}

      {/* Nominal capacity info */}
      <Box
        x={BCX} y={34}
        lines={[`Nominal: ${casterCount}×${f(casterCapacityKg)} = ${f(nominalCapacityKg)} kg`]}
        fs={11} bold tc="#334155"
      />

      {/* Conservative capacity info */}
      <Box
        x={BCX} y={62}
        lines={[
          `Conservador: ${conservativeCasterCount}×${f(casterCapacityKg)} = ${f(conservativeCapacityKg)} kg`,
        ]}
        fs={11} bold tc="#1e40af" bg="#eff6ff" bc="#bfdbfe"
      />

      {/* Note */}
      <Box
        x={BCX} y={FLOOR_Y + 36}
        lines={['Cap. dos rodízios não define', 'sozinha a carga de trabalho.']}
        fs={9.5} tc="#64748b" bg="#f8fafc" bc="#e2e8f0"
      />
    </>
  );
}

// ══════════════════════════════════════════════════
// Mode: COMPRESSION
// ══════════════════════════════════════════════════
function CompressionMode({ inputs, results }: { inputs: GantryInputs; results: GantryResults }) {
  const { reactionPerColumnKg } = results.column;
  const { totalLoadKg, selfWeightKg } = results.beam;

  // Total load arrow — big red, entering beam from above
  const arrTopY  = TFY - 50;
  const arrBotY  = TFY - 8;
  const arrMidY  = (arrTopY + arrBotY) / 2;

  // Column force arrows — going down through each column center
  const colArrTopY = CT + 15;
  const colArrBotY = BAB + 22;
  const colMidY    = (CT + BAT) / 2;

  return (
    <>
      {/* ── Total load arrow (downward into beam) ── */}
      <line
        x1={BCX} y1={arrTopY} x2={BCX} y2={arrBotY}
        stroke="#dc2626" strokeWidth={4} markerEnd="url(#arr-red)"
      />
      <Box
        x={BCX + 68} y={arrMidY}
        lines={[`Total: ${f(totalLoadKg, 1)} kg`]}
        fs={11} bold tc="#dc2626" bg="#fef2f2" bc="#fecaca"
      />

      {/* ── Info card ── */}
      <Box
        x={BCX - 95} y={arrMidY}
        lines={[`Útil: ${f(inputs.payloadKg)} kg`, `+ Viga: ${f(selfWeightKg, 1)} kg`]}
        fs={10} tc="#475569" bg="#f8fafc" bc="#e2e8f0"
      />

      {/* ── Left column force arrow ── */}
      <line
        x1={LCC} y1={colArrTopY} x2={LCC} y2={colArrBotY}
        stroke="#dc2626" strokeWidth={3} markerEnd="url(#arr-red)"
      />
      <Box
        x={LCC - 45} y={colMidY}
        lines={['Reação', `~${f(reactionPerColumnKg, 0)} kg`]}
        fs={10} bold tc="#dc2626" bg="#fef2f2" bc="#fecaca"
        anchor="end"
      />

      {/* ── Right column force arrow ── */}
      <line
        x1={RCC} y1={colArrTopY} x2={RCC} y2={colArrBotY}
        stroke="#dc2626" strokeWidth={3} markerEnd="url(#arr-red)"
      />
      <Box
        x={RCC + 45} y={colMidY}
        lines={['Reação', `~${f(reactionPerColumnKg, 0)} kg`]}
        fs={10} bold tc="#dc2626" bg="#fef2f2" bc="#fecaca"
        anchor="start"
      />

      {/* ── Ground reaction ticks (upward) ── */}
      {[LC1, LC2, RC1, RC2].map((cx) => (
        <line key={cx}
          x1={cx} y1={FLOOR_Y} x2={cx} y2={FLOOR_Y + 18}
          stroke="#64748b" strokeWidth={2} markerEnd="url(#arr-gray)"
        />
      ))}
      <Box
        x={BCX} y={FLOOR_Y + 34}
        lines={['Reações no piso']}
        fs={9.5} tc="#64748b" bg="#f8fafc" bc="#e2e8f0"
      />
    </>
  );
}

// ══════════════════════════════════════════════════
// Mode: BUCKLING
// ══════════════════════════════════════════════════
function BucklingMode({ inputs, results }: { inputs: GantryInputs; results: GantryResults }) {
  const { bucklingK, columnHeightM, elasticityGPa } = inputs;
  const { bucklingLoadKN } = results.column;
  const lef = bucklingK * columnHeightM;

  // Highlight left column in orange and show buckling curve alongside
  const MAX_DISP = 42;  // visual lateral displacement px (not to scale)

  // Cubic Bezier approximating fixed-free (cantilever) buckling mode shape
  // Fixed base: tangent vertical; free top: displaced laterally
  const bucklingPath = [
    `M ${LCC},${CB}`,                                          // fixed base
    `C ${LCC},${CB - CH * 0.45}`,                             // ctrl1 — tangent vertical
    `  ${LCC + MAX_DISP * 0.85},${CT + CH * 0.08}`,          // ctrl2
    `  ${LCC + MAX_DISP},${CT}`,                              // free top
  ].join(' ');

  // Straight reference line (undeformed column axis)
  const refLinePath = `M ${LCC},${CT} L ${LCC},${CB}`;

  // Formula card lines
  const cardLines = [
    'Fórmula de Euler',
    'Pcr = π²·E·I / (K·L)²',
    `K = ${f(bucklingK, 1)}   L = ${f(columnHeightM, 1)} m`,
    `Lef = K·L = ${f(lef, 1)} m`,
    `E = ${f(elasticityGPa)} GPa`,
    `Pcr ≈ ${f(bucklingLoadKN, 0)} kN`,
  ];

  return (
    <>
      {/* ── Highlighted left column (orange tint) ── */}
      <rect x={BL} y={CT} width={CW} height={CH} rx={2}
        fill="#fef3c7" stroke="#d97706" strokeWidth={2} />

      {/* ── Undeformed axis (dashed) ── */}
      <path d={refLinePath}
        stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="7,4" fill="none" />

      {/* ── Buckling mode shape curve ── */}
      <path d={bucklingPath}
        stroke="#d97706" strokeWidth={3} fill="none" strokeLinecap="round" />

      {/* ── Arrow at top tip of buckling curve ── */}
      <line
        x1={LCC + MAX_DISP - 18} y1={CT}
        x2={LCC + MAX_DISP - 2}  y2={CT}
        stroke="#d97706" strokeWidth={2} markerEnd="url(#arr-orange)"
      />

      {/* ── Legend labels ── */}
      <Box
        x={LCC - 12} y={(CT + CB) / 2}
        lines={['Eixo', 'original']}
        fs={9} tc="#94a3b8" bg="#f8fafc" bc="#e2e8f0"
        anchor="end"
      />
      <Box
        x={LCC + MAX_DISP + 8} y={CT + 22}
        lines={['Modo de', 'flambagem', '(conceitual)']}
        fs={9} tc="#d97706" bg="#fffbeb" bc="#fde68a"
        anchor="start"
      />

      {/* ── K and Lef annotation ── */}
      <line
        x1={BL - 20} y1={CT} x2={BL - 20} y2={CB}
        stroke="#64748b" strokeWidth={1} strokeDasharray="4,3"
      />
      <line x1={BL - 24} y1={CT} x2={BL - 16} y2={CT} stroke="#64748b" strokeWidth={1.5} />
      <line x1={BL - 24} y1={CB} x2={BL - 16} y2={CB} stroke="#64748b" strokeWidth={1.5} />
      <Box
        x={BL - 28} y={(CT + CB) / 2}
        lines={[`L=${f(columnHeightM, 1)}m`]}
        fs={9} tc="#64748b" bg="#f8fafc" bc="#e2e8f0"
        anchor="end"
      />

      {/* ── Lef = 2L annotation ── */}
      <Box
        x={BL - 28} y={CT - 18}
        lines={[`Lef=${f(lef, 1)}m (K=${bucklingK})`]}
        fs={9} tc="#d97706" bg="#fffbeb" bc="#fde68a"
        anchor="end"
      />

      {/* ── Formula card (bottom right) ── */}
      <Box
        x={490} y={376}
        lines={cardLines}
        fs={10.5} bold={false} tc="#334155"
        bg="white" bc="#cbd5e1"
        pad={8}
      />

      {/* ── Conceitual note ── */}
      <Box
        x={BCX} y={FLOOR_Y + 20}
        lines={['Representação conceitual — não em escala real']}
        fs={9} tc="#94a3b8" bg="#f8fafc" bc="#e2e8f0"
      />
    </>
  );
}

// ══════════════════════════════════════════════════
// Mode: DEFLECTION
// ══════════════════════════════════════════════════
function DeflectionMode({ inputs, results }: { inputs: GantryInputs; results: GantryResults }) {
  const deflMm = results.beam.deflectionMm;

  // Compute visual deflection (amplified to be perceptible)
  const spanPx     = BR - BL;
  const spanM      = inputs.beamLengthM;
  const realPx     = (deflMm / 1000) * (spanPx / spanM);
  const ampFactor  = Math.max(Math.ceil(15 / Math.max(realPx, 0.0001)), 1);
  const vd         = Math.min(Math.max(realPx * ampFactor, 10), 48);

  // Reference beam bottom y
  const refY   = BB;       // 132
  // Midpoint of quadratic Bezier (Q control = refY + 2*vd, actual midpoint = refY + vd)
  const midY   = refY + vd;

  // Bezier path for deflected beam bottom edge
  const deflPath = `M ${BL},${refY} Q ${BCX},${refY + 2 * vd} ${BR},${refY}`;

  // Delta dimension line position
  const dimX = BCX + 32;

  return (
    <>
      {/* Silhueta da viga na posição original (sem carga) — contorno tracejado */}
      <rect x={BL} y={TFY} width={BR - BL} height={BB - TFY} rx={2}
        fill="none" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="8,5" opacity={0.7} />
      <text x={BL + 8} y={TFY - 6} fontSize={9} fill="#94a3b8" fontStyle="italic">
        sem carga
      </text>

      {/* Curva da viga deflexionada — linha colorida no fundo da viga sob carga */}
      <path d={deflPath}
        fill="none" stroke="#d97706" strokeWidth={3} strokeLinecap="round" />

      {/* δ dimension line */}
      <line x1={dimX} y1={refY} x2={dimX} y2={midY}
        stroke="#dc2626" strokeWidth={1.5} />
      {/* Horizontal ticks */}
      <line x1={dimX - 6} y1={refY} x2={dimX + 6} y2={refY} stroke="#dc2626" strokeWidth={1.5} />
      <line x1={dimX - 6} y1={midY} x2={dimX + 6} y2={midY} stroke="#dc2626" strokeWidth={1.5} />

      {/* δ label */}
      <Box
        x={dimX + 62} y={(refY + midY) / 2}
        lines={[`δ ≈ ${f(deflMm, 2)} mm`]}
        fs={11.5} bold tc="#dc2626" bg="#fef2f2" bc="#fecaca"
      />

      {/* Load label */}
      <Box
        x={HX - 60} y={HBY + 8}
        lines={[`P = ${f(inputs.payloadKg)} kg`]}
        fs={11} bold tc="#334155"
      />

      {/* Amplification note */}
      <Box
        x={BCX} y={FLOOR_Y + 22}
        lines={[`Deformação ×${f(ampFactor)} — ampliada para visualização`]}
        fs={9.5} tc="#64748b" bg="#f8fafc" bc="#e2e8f0"
      />

      {/* Legendas: referência vs deflexão */}
      <Box
        x={BL - 10} y={refY - 8}
        lines={['sem carga']}
        fs={9} tc="#94a3b8" bg="#f8fafc" bc="#e2e8f0"
        anchor="end"
      />
      <Box
        x={BL - 10} y={midY + 14}
        lines={['com carga']}
        fs={9} tc="#d97706" bg="#fffbeb" bc="#fde68a"
        anchor="end"
      />
    </>
  );
}

// ══════════════════════════════════════════════════
// Mode selector tabs
// ══════════════════════════════════════════════════
function ModeSelector({ mode, onModeChange }: { mode: Mode; onModeChange: (m: Mode) => void }) {
  return (
    <div className="mode-selector" role="tablist" aria-label="Modos de visualização da ilustração">
      {MODES.map((m) => (
        <button
          key={m.id}
          className={`mode-btn${mode === m.id ? ' mode-btn--active' : ''}`}
          onClick={() => onModeChange(m.id)}
          role="tab"
          aria-selected={mode === m.id}
          type="button"
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════
// Main export
// ══════════════════════════════════════════════════
export interface GantryIllustrationProps {
  inputs: GantryInputs;
  results: GantryResults;
}

export function GantryIllustration({ inputs, results }: GantryIllustrationProps) {
  const [mode, setMode] = useState<Mode>('overview');

  const modeDescriptions: Record<Mode, string> = {
    overview:    'Visão geral com cargas e peso da viga',
    casters:     'Capacidade nominal e conservadora dos rodízios',
    compression: 'Fluxo de forças e reação nas colunas',
    buckling:    'Representação conceitual do modo de flambagem',
    deflection:  'Flecha da viga (deformação amplificada para visualização)',
  };

  return (
    <div className="gantry-interactive">
      <ModeSelector mode={mode} onModeChange={setMode} />

      <div className="gantry-svg-wrapper">
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          xmlns="http://www.w3.org/2000/svg"
          className="gantry-svg-interactive"
          role="img"
          aria-label={`Ilustração técnica do pórtico — ${modeDescriptions[mode]}`}
        >
          <Defs />

          {/* Background */}
          <rect x={0} y={0} width={VW} height={VH} fill="#f8fafc" rx={0} />

          {/* Mode label (top-right) */}
          <Box
            x={VW - 10} y={14}
            lines={[MODES.find((m) => m.id === mode)!.label]}
            fs={9.5} tc="#64748b" bg="#f1f5f9" bc="#e2e8f0"
            anchor="end"
          />

          {/* Base gantry (dimmed in casters and deflection modes) */}
          <GantryBase dim={mode === 'casters' || mode === 'deflection'} />

          {/* Mode-specific overlays */}
          {mode === 'overview'    && <OverviewMode    inputs={inputs} results={results} />}
          {mode === 'casters'     && <CastersMode     inputs={inputs} results={results} />}
          {mode === 'compression' && <CompressionMode inputs={inputs} results={results} />}
          {mode === 'buckling'    && <BucklingMode    inputs={inputs} results={results} />}
          {mode === 'deflection'  && <DeflectionMode  inputs={inputs} results={results} />}
        </svg>
      </div>

      {/* Card explicativo por modo */}
      <div className="mode-explanation">
        <span className="mode-explanation-label">💡 O que isso significa?</span>
        <p className="mode-explanation-text">{MODE_EXPLANATIONS[mode]}</p>
      </div>

      <p className="illustration-caption gantry-caption">
        Ilustração esquemática — representação educativa, não em escala real.
        {mode === 'deflection' && ' Deformação amplificada para ser perceptível.'}
        {mode === 'buckling'   && ' Modo de flambagem: representação conceitual.'}
      </p>
    </div>
  );
}
