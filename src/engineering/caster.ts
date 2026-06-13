/**
 * Capacidade nominal total dos rodízios (kg)
 * Soma da capacidade de todos os rodízios instalados
 */
export function casterNominalCapacityKg(
  wheelCount: number,
  capacityPerWheelKg: number,
): number {
  return wheelCount * capacityPerWheelKg;
}

/**
 * Capacidade conservadora dos rodízios (kg)
 * Usa apenas N rodízios efetivos para compensar desequilíbrio de carga,
 * piso irregular e variações reais de distribuição de carga
 */
export function casterConservativeCapacityKg(
  effectiveWheelCount: number,
  capacityPerWheelKg: number,
): number {
  return effectiveWheelCount * capacityPerWheelKg;
}
