import { beamSelfWeight, totalLoadKg as calcTotal, centerPointDeflectionMm } from './beam';
import {
  reactionPerColumnKg,
  squareTubeAreaMm2,
  squareTubeInertiaMm4,
  compressiveStressMPa,
  eulerBucklingCriticalLoadKN,
} from './column';
import { casterNominalCapacityKg, casterConservativeCapacityKg } from './caster';
import type { GantryInputs, GantryResults } from './types';

/**
 * Computa todos os resultados estruturais do pórtico a partir dos inputs.
 * Função pura — sem efeitos colaterais.
 */
export function computeResults(inputs: GantryInputs): GantryResults {
  const {
    payloadKg,
    beamLengthM,
    beamLinearMassKgM,
    beamInertiaMm4,
    elasticityGPa,
    columnHeightM,
    columnOuterMm,
    columnThicknessMm,
    bucklingK,
    casterCount,
    casterCapacityKg,
    conservativeCasterCount,
  } = inputs;

  const selfWeightKg = beamSelfWeight(beamLinearMassKgM, beamLengthM);
  const totalKg = calcTotal(payloadKg, selfWeightKg);
  const deflectionMm = centerPointDeflectionMm(payloadKg, beamLengthM, elasticityGPa, beamInertiaMm4);

  const reactionKg = reactionPerColumnKg(totalKg);
  const areaMm2 = squareTubeAreaMm2(columnOuterMm, columnThicknessMm);
  const inertiaMm4 = squareTubeInertiaMm4(columnOuterMm, columnThicknessMm);
  const stressMPa = compressiveStressMPa(reactionKg, areaMm2);
  const bucklingKN = eulerBucklingCriticalLoadKN(
    elasticityGPa,
    inertiaMm4,
    columnHeightM,
    bucklingK,
  );

  return {
    beam: { selfWeightKg, totalLoadKg: totalKg, deflectionMm },
    column: {
      reactionPerColumnKg: reactionKg,
      areaMm2,
      compressiveStressMPa: stressMPa,
      inertiaMm4,
      bucklingLoadKN: bucklingKN,
    },
    caster: {
      nominalCapacityKg: casterNominalCapacityKg(casterCount, casterCapacityKg),
      conservativeCapacityKg: casterConservativeCapacityKg(conservativeCasterCount, casterCapacityKg),
    },
  };
}
