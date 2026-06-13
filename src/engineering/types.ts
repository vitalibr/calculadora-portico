export interface GantryInputs {
  payloadKg: number;
  beamLengthM: number;
  beamLinearMassKgM: number;
  beamInertiaMm4: number;
  elasticityGPa: number;
  columnHeightM: number;
  columnOuterMm: number;
  columnThicknessMm: number;
  bucklingK: number;
  casterCount: number;
  casterCapacityKg: number;
  conservativeCasterCount: number;
}

export interface BeamResults {
  selfWeightKg: number;
  totalLoadKg: number;
  deflectionMm: number;
}

export interface ColumnResults {
  reactionPerColumnKg: number;
  areaMm2: number;
  compressiveStressMPa: number;
  inertiaMm4: number;
  bucklingLoadKN: number;
}

export interface CasterResults {
  nominalCapacityKg: number;
  conservativeCapacityKg: number;
}

export interface GantryResults {
  beam: BeamResults;
  column: ColumnResults;
  caster: CasterResults;
}

export type StatusLevel = 'ok' | 'warning' | 'danger' | 'info';
