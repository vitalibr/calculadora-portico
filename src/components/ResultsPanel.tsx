import type { ReactNode } from 'react';
import type { GantryInputs, StatusLevel } from '../engineering/types';
import { beamSelfWeight, totalLoadKg, centerPointDeflectionMm } from '../engineering/beam';
import {
  reactionPerColumnKg,
  squareTubeAreaMm2,
  squareTubeInertiaMm4,
  compressiveStressMPa,
  eulerBucklingCriticalLoadKN,
} from '../engineering/column';
import { casterNominalCapacityKg, casterConservativeCapacityKg } from '../engineering/caster';
import { FormulaCard } from './FormulaCard';
import { ResultBadge } from './ResultBadge';

interface ResultsPanelProps {
  inputs: GantryInputs;
}

function fmt(val: number, decimals = 1): string {
  return val.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmt0(val: number): string {
  return val.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="result-row">
      <span className="result-row-label">{label}</span>
      <span className="result-row-value">{value}</span>
    </div>
  );
}

function Highlight({ children }: { children: ReactNode }) {
  return <span className="result-highlight">{children}</span>;
}

function Note({ children }: { children: ReactNode }) {
  return <p className="result-note">{children}</p>;
}

export function ResultsPanel({ inputs }: ResultsPanelProps) {
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

  // ── Cálculos ──────────────────────────────────────────────────
  const selfWeight = beamSelfWeight(beamLinearMassKgM, beamLengthM);
  const total = totalLoadKg(payloadKg, selfWeight);
  const deflectionMm = centerPointDeflectionMm(payloadKg, beamLengthM, elasticityGPa, beamInertiaMm4);

  const reactionKg = reactionPerColumnKg(total);
  const areaMm2 = squareTubeAreaMm2(columnOuterMm, columnThicknessMm);
  const columnInertiaMm4 = squareTubeInertiaMm4(columnOuterMm, columnThicknessMm);
  const stressMPa = compressiveStressMPa(reactionKg, areaMm2);
  const bucklingKN = eulerBucklingCriticalLoadKN(elasticityGPa, columnInertiaMm4, columnHeightM, bucklingK);

  const nominalCaster = casterNominalCapacityKg(casterCount, casterCapacityKg);
  const conservativeCaster = casterConservativeCapacityKg(conservativeCasterCount, casterCapacityKg);

  const innerMm = columnOuterMm - 2 * columnThicknessMm;
  const reactionKN = (reactionKg * 9.80665) / 1000;
  const bucklingMargin = bucklingKN / reactionKN;

  // ── Status dos indicadores ────────────────────────────────────
  const casterStatus: StatusLevel = payloadKg <= conservativeCaster ? 'ok' : 'danger';
  const stressStatus: StatusLevel = stressMPa < 10 ? 'ok' : stressMPa < 50 ? 'warning' : 'danger';
  const bucklingStatus: StatusLevel = bucklingMargin > 20 ? 'ok' : bucklingMargin > 5 ? 'warning' : 'danger';
  const deflectionStatus: StatusLevel = deflectionMm < 2 ? 'ok' : deflectionMm < 5 ? 'warning' : 'danger';

  const allGood =
    casterStatus === 'ok' &&
    stressStatus === 'ok' &&
    bucklingStatus === 'ok' &&
    deflectionStatus === 'ok';

  // ── Texto da conclusão ────────────────────────────────────────
  function conclusionText(): string {
    const parts: string[] = [];

    if (payloadKg <= conservativeCaster) {
      parts.push(
        `A carga de ${fmt0(payloadKg)} kg está dentro da capacidade conservadora dos rodízios (${fmt0(conservativeCaster)} kg).`,
      );
    } else {
      parts.push(
        `A carga de ${fmt0(payloadKg)} kg supera a capacidade conservadora dos rodízios (${fmt0(conservativeCaster)} kg). Isso merece atenção.`,
      );
    }

    if (stressMPa < 10) {
      parts.push(`A compressão nas colunas (${fmt(stressMPa, 1)} MPa) é baixa para esta faixa de carga.`);
    } else {
      parts.push(`A compressão nas colunas (${fmt(stressMPa, 1)} MPa) merece verificação detalhada.`);
    }

    if (bucklingMargin > 20) {
      parts.push(
        `A flambagem não aparece como ponto crítico — margem calculada de ${fmt(bucklingMargin, 0)}× sobre a carga por coluna.`,
      );
    } else if (bucklingMargin > 5) {
      parts.push(`A flambagem tem margem moderada (${fmt(bucklingMargin, 0)}×). Verifique com engenheiro.`);
    } else {
      parts.push(`A margem de flambagem (${fmt(bucklingMargin, 0)}×) é baixa. Recomenda-se revisão estrutural.`);
    }

    if (deflectionMm < 2) {
      parts.push(`A flecha calculada (${fmt(deflectionMm, 2)} mm) é pequena.`);
    } else {
      parts.push(`A flecha calculada (${fmt(deflectionMm, 2)} mm) é perceptível — verifique a rigidez necessária.`);
    }

    parts.push(
      allGood
        ? `Na prática, o limite real depende de estabilidade, dinâmica, soldas, parafusos, rodízios, piso e forma de uso. Esta ferramenta não certifica o equipamento.`
        : `Atenção: um ou mais parâmetros merecem revisão antes de uso. Esta ferramenta não certifica o equipamento.`,
    );

    return parts.join(' ');
  }

  return (
    <section id="resultados" className="section">
      <div className="container">
        <h2 className="section-title">
          <span className="section-title-icon">📊</span>
          Resultados — Estimativas Preliminares
        </h2>
        <p className="section-desc preliminary-notice">
          Todos os valores abaixo são <strong>estimativas preliminares</strong> baseadas em modelos
          simplificados. Não constituem certificação, laudo ou garantia de segurança.
        </p>

        <div className="results-grid">
          {/* Card A — Peso próprio */}
          <FormulaCard
            id="A"
            title="Peso Próprio da Viga"
            formula="peso = massa linear × comprimento"
            accent="gold"
          >
            <Row label="Massa linear" value={`${fmt(beamLinearMassKgM, 1)} kg/m`} />
            <Row label="Comprimento" value={`${fmt(beamLengthM, 2)} m`} />
            <div className="result-divider" />
            <Row
              label="Peso próprio"
              value={<Highlight>{fmt(selfWeight, 1)} kg</Highlight>}
            />
            <Row label="Carga total (útil + viga)" value={`${fmt(total, 1)} kg`} />
          </FormulaCard>

          {/* Card B — Rodízios */}
          <FormulaCard
            id="B"
            title="Capacidade dos Rodízios"
            formula="capacidade nominal = n × cap. por rodízio"
            accent={casterStatus === 'ok' ? 'green' : 'red'}
          >
            <Row label="Qtd. instalada" value={`${casterCount} rodízios`} />
            <Row label="Capacidade por rodízio" value={`${fmt0(casterCapacityKg)} kg`} />
            <Row
              label="Capacidade nominal"
              value={<Highlight>{fmt0(nominalCaster)} kg</Highlight>}
            />
            <div className="result-divider" />
            <Row label="Rodízios efetivos (conservador)" value={`${conservativeCasterCount} rodízios`} />
            <Row
              label="Capacidade conservadora"
              value={<Highlight>{fmt0(conservativeCaster)} kg</Highlight>}
            />
            <ResultBadge
              status={casterStatus}
              label={casterStatus === 'ok' ? 'Carga dentro do conservador' : 'Carga acima do conservador'}
            />
            <Note>
              A capacidade dos rodízios não define sozinha a carga de trabalho do pórtico.
            </Note>
          </FormulaCard>

          {/* Card C — Reação nas colunas */}
          <FormulaCard
            id="C"
            title="Reação nas Colunas"
            formula="R = (carga útil + peso da viga) / 2"
            accent="gold"
          >
            <Row label="Carga útil" value={`${fmt0(payloadKg)} kg`} />
            <Row label="Peso da viga" value={`${fmt(selfWeight, 1)} kg`} />
            <Row label="Carga total" value={`${fmt(total, 1)} kg`} />
            <div className="result-divider" />
            <Row
              label="Reação por coluna"
              value={<Highlight>{fmt(reactionKg, 1)} kg</Highlight>}
            />
            <Note>Modelo simplificado: pórtico simétrico com carga central.</Note>
          </FormulaCard>

          {/* Card D — Compressão */}
          <FormulaCard
            id="D"
            title="Compressão nas Colunas"
            formula="σ = F / A  (A = b² − bi²)"
            accent={stressStatus === 'ok' ? 'green' : stressStatus === 'warning' ? 'yellow' : 'red'}
          >
            <Row label="Lado externo (b)" value={`${columnOuterMm} mm`} />
            <Row label="Lado interno (bi = b − 2t)" value={`${innerMm} mm`} />
            <Row
              label="Área da seção"
              value={<Highlight>{fmt0(areaMm2)} mm²</Highlight>}
            />
            <div className="result-divider" />
            <Row label="Força axial" value={`${fmt(reactionKg, 1)} kgf`} />
            <Row
              label="Tensão de compressão"
              value={<Highlight>{fmt(stressMPa, 2)} MPa</Highlight>}
            />
            <ResultBadge
              status={stressStatus}
              label={
                stressMPa < 10
                  ? 'Compressão baixa para esta faixa'
                  : stressMPa < 50
                    ? 'Atenção à compressão'
                    : 'Compressão elevada — revisar'
              }
            />
          </FormulaCard>

          {/* Card E — Flambagem */}
          <FormulaCard
            id="E"
            title="Flambagem de Euler"
            formula="Pcr = π² · E · I / (K · L)²"
            accent={bucklingStatus === 'ok' ? 'green' : bucklingStatus === 'warning' ? 'yellow' : 'red'}
          >
            <Row label="E (módulo de elasticidade)" value={`${elasticityGPa} GPa`} />
            <Row label="I (momento de inércia da seção)" value={`${fmt0(columnInertiaMm4)} mm⁴`} />
            <Row label="L (altura da coluna)" value={`${fmt(columnHeightM, 2)} m`} />
            <Row label="K (fator de comprimento efetivo)" value={`${bucklingK}`} />
            <Row label="Lef = K × L" value={`${fmt(bucklingK * columnHeightM, 2)} m`} />
            <div className="result-divider" />
            <Row
              label="Carga crítica de Euler (Pcr)"
              value={<Highlight>{fmt(bucklingKN, 1)} kN</Highlight>}
            />
            <Row label="Carga por coluna" value={`${fmt(reactionKN, 2)} kN`} />
            <Row label="Margem de flambagem (Pcr / R)" value={`${fmt(bucklingMargin, 0)}×`} />
            <ResultBadge
              status={bucklingStatus}
              label={
                bucklingMargin > 20
                  ? 'Flambagem não é ponto crítico'
                  : bucklingMargin > 5
                    ? 'Margem moderada'
                    : 'Margem baixa — revisar'
              }
            />
            <Note>Isso não define a carga de trabalho do pórtico isoladamente.</Note>
          </FormulaCard>

          {/* Card F — Flecha */}
          <FormulaCard
            id="F"
            title="Flecha da Viga"
            formula="δ = P · L³ / (48 · E · I)"
            accent={deflectionStatus === 'ok' ? 'green' : deflectionStatus === 'warning' ? 'yellow' : 'red'}
          >
            <Row label="Carga (P)" value={`${fmt0(payloadKg)} kg`} />
            <Row label="Vão (L)" value={`${fmt(beamLengthM, 2)} m`} />
            <Row label="E" value={`${elasticityGPa} GPa`} />
            <Row label="Ix da viga" value={`${fmt0(beamInertiaMm4)} mm⁴`} />
            <div className="result-divider" />
            <Row
              label="Flecha calculada (δ)"
              value={<Highlight>{fmt(deflectionMm, 2)} mm</Highlight>}
            />
            <ResultBadge
              status={deflectionStatus}
              label={
                deflectionMm < 2
                  ? 'Flecha pequena'
                  : deflectionMm < 5
                    ? 'Flecha moderada'
                    : 'Flecha elevada — revisar'
              }
            />
            <Note>
              Modelo: carga concentrada no centro, viga simplesmente apoiada. O peso
              próprio da viga não está incluído neste cálculo de flecha.
            </Note>
          </FormulaCard>
        </div>

        {/* Card G — Conclusão */}
        <div className={`conclusion-card ${allGood ? 'conclusion-card--ok' : 'conclusion-card--attention'}`}>
          <div className="conclusion-header">
            <span className="conclusion-icon">{allGood ? '✅' : '⚠️'}</span>
            <h3 className="conclusion-title">G — Conclusão Prática</h3>
            <ResultBadge status="info" label="Estimativa preliminar" />
          </div>
          <p className="conclusion-text">{conclusionText()}</p>
          <p className="conclusion-disclaimer">
            Esta ferramenta não certifica o equipamento e não substitui projeto estrutural,
            inspeção profissional, ART ou ensaio de carga real.
          </p>
        </div>
      </div>
    </section>
  );
}
