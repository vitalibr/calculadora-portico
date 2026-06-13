/** Constante de conversão: 1 kgf = 9,80665 N */
export const G = 9.80665;

/** Converte kgf para Newton */
export function kgfToNewton(kgf: number): number {
  return kgf * G;
}

/** Converte GPa para Pa */
export function GPaToPa(gpa: number): number {
  return gpa * 1e9;
}

/** Converte mm² para m² */
export function mm2ToM2(mm2: number): number {
  return mm2 * 1e-6;
}

/** Converte mm⁴ para m⁴ */
export function mm4ToM4(mm4: number): number {
  return mm4 * 1e-12;
}

/** Converte Pa para MPa */
export function PaToMPa(pa: number): number {
  return pa * 1e-6;
}

/** Converte N para kN */
export function NToKN(n: number): number {
  return n * 1e-3;
}

/** Converte m para mm */
export function mToMm(m: number): number {
  return m * 1000;
}
