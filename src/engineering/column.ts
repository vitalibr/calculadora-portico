import { kgfToNewton, GPaToPa, mm4ToM4, PaToMPa, NToKN } from './units';

/**
 * Reação por coluna (kg)
 * Modelo simplificado de dois apoios: R = carga total / 2
 */
export function reactionPerColumnKg(totalLoad: number): number {
  return totalLoad / 2;
}

/**
 * Área da seção transversal de tubo quadrado (mm²)
 * A = b² − bi²  onde bi = b − 2t
 */
export function squareTubeAreaMm2(outerMm: number, thicknessMm: number): number {
  const inner = outerMm - 2 * thicknessMm;
  return outerMm ** 2 - inner ** 2;
}

/**
 * Momento de inércia de tubo quadrado (mm⁴)
 * I = (b⁴ − bi⁴) / 12
 */
export function squareTubeInertiaMm4(outerMm: number, thicknessMm: number): number {
  const inner = outerMm - 2 * thicknessMm;
  return (outerMm ** 4 - inner ** 4) / 12;
}

/**
 * Tensão de compressão axial (MPa)
 * σ = F / A
 *
 * @param forceKg  - força axial em kgf
 * @param areaMm2  - área da seção em mm²
 * @returns tensão em MPa
 */
export function compressiveStressMPa(forceKg: number, areaMm2: number): number {
  const forceN = kgfToNewton(forceKg);          // N
  const areaM2 = areaMm2 * 1e-6;               // m²
  return PaToMPa(forceN / areaM2);             // MPa
}

/**
 * Carga crítica de flambagem de Euler (kN)
 * Pcr = π² · E · I / (K · L)²
 *
 * @param EGPa         - módulo de elasticidade em GPa
 * @param inertiaMm4   - momento de inércia da seção em mm⁴
 * @param columnHeightM - comprimento da coluna em metros
 * @param K            - fator de comprimento efetivo (1.0 biarticulado, 2.0 engastado-livre)
 * @returns carga crítica em kN
 */
export function eulerBucklingCriticalLoadKN(
  EGPa: number,
  inertiaMm4: number,
  columnHeightM: number,
  K: number,
): number {
  const E = GPaToPa(EGPa);                     // Pa
  const I = mm4ToM4(inertiaMm4);              // m⁴
  const Lef = K * columnHeightM;              // comprimento efetivo em m

  const Pcr = (Math.PI ** 2 * E * I) / (Lef ** 2);  // N
  return NToKN(Pcr);                          // kN
}
