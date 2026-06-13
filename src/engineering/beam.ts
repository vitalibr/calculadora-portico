import { kgfToNewton, GPaToPa, mm4ToM4, mToMm } from './units';

/**
 * Peso próprio da viga (kg)
 * peso = massa linear × comprimento
 */
export function beamSelfWeight(linearMassKgM: number, lengthM: number): number {
  return linearMassKgM * lengthM;
}

/**
 * Carga total considerada (kg)
 * carga total = carga útil + peso próprio da viga
 */
export function totalLoadKg(payloadKg: number, beamWeightKg: number): number {
  return payloadKg + beamWeightKg;
}

/**
 * Flecha máxima para carga concentrada no centro de viga simplesmente apoiada (mm)
 * δ = P·L³ / (48·E·I)
 *
 * @param loadKg   - carga em kg (convertida para N internamente)
 * @param spanM    - vão livre em metros
 * @param EGPa     - módulo de elasticidade em GPa (aço ≈ 200 GPa)
 * @param inertiaMm4 - momento de inércia da seção em mm⁴
 * @returns flecha em milímetros
 */
export function centerPointDeflectionMm(
  loadKg: number,
  spanM: number,
  EGPa: number,
  inertiaMm4: number,
): number {
  const P = kgfToNewton(loadKg);          // N
  const L = spanM;                          // m
  const E = GPaToPa(EGPa);               // Pa = N/m²
  const I = mm4ToM4(inertiaMm4);         // m⁴

  const deflectionM = (P * L ** 3) / (48 * E * I);
  return mToMm(deflectionM);              // mm
}
