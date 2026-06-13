import type { GantryInputs } from '../engineering/types';

/**
 * Valores padrão baseados no projeto real:
 * - Viga: S6×12,5 (perfil I americano 6 pol., 18,6 kg/m)
 * - Colunas: tubo quadrado 80×80×3 mm
 * - Rodízios: PU 5 pol. com freio, 300 kg cada
 *
 * Momento de inércia da viga: S6×12,5 → Ix ≈ 22,1 in⁴ ≈ 9.200.000 mm⁴
 * Isso resulta em flecha de ≈ 0,35 mm com 300 kg e vão de 2,2 m.
 */
export const DEFAULT_INPUTS: GantryInputs = {
  payloadKg: 300,
  beamLengthM: 2.2,
  beamLinearMassKgM: 18.6,
  beamInertiaMm4: 9_200_000,
  elasticityGPa: 200,
  columnHeightM: 2.0,
  columnOuterMm: 80,
  columnThicknessMm: 3,
  bucklingK: 2,
  casterCount: 4,
  casterCapacityKg: 300,
  conservativeCasterCount: 3,
};

export const PROJECT_SPECS = {
  beam: 'Viga I 6 pol. (S6×12,5) — massa linear 18,6 kg/m',
  beamLength: '2,2 m',
  columns: 'Tubo quadrado 80×80×3 mm',
  columnHeight: '2,0 m',
  bases: 'Tubo retangular 60×90×4,75 mm',
  gussets: 'Tubo quadrado 30×30×1,5 mm a 45°, comprimento ≈ 670 mm',
  casters: 'Rodízios PU 5 pol. com freio — 300 kg cada, 4 unidades',
};
