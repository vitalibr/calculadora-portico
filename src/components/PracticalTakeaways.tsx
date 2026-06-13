import type { GantryInputs, GantryResults } from '../engineering/types';

interface Props {
  inputs: GantryInputs;
  results: GantryResults;
}

export function PracticalTakeaways({ inputs, results }: Props) {
  const { payloadKg } = inputs;
  const { deflectionMm } = results.beam;
  const { bucklingLoadKN } = results.column;
  const { conservativeCapacityKg } = results.caster;

  const bucklingMarginOk = bucklingLoadKN > results.column.reactionPerColumnKg / 100 * 5;
  const deflOk           = deflectionMm < inputs.beamLengthM * 1000 / 250;
  const casterOk         = conservativeCapacityKg >= results.beam.totalLoadKg;

  return (
    <section id="resumo" className="section section--alt">
      <div className="container">
        <h2 className="section-title">
          <span className="section-title-icon">✅</span>
          Resumo prático
        </h2>

        <ul className="takeaways-list">
          <li>
            <span className="takeaway-check">{casterOk ? '✓' : '!'}</span>
            <span>
              {payloadKg <= 300
                ? `${Math.round(payloadKg)} kg é uma faixa de uso confortável para este projeto.`
                : `${Math.round(payloadKg)} kg — verifique se os rodízios e a estrutura comportam essa carga.`}
            </span>
          </li>
          <li>
            <span className="takeaway-check">{deflOk ? '✓' : '!'}</span>
            <span>
              Flecha calculada de <strong>{deflectionMm.toFixed(1)} mm</strong> —{' '}
              {deflOk
                ? 'dentro de limites razoáveis para uso prático.'
                : 'acima de L/250; avalie se isso impacta o uso.'}
            </span>
          </li>
          <li>
            <span className="takeaway-check">{bucklingMarginOk ? '✓' : '!'}</span>
            <span>
              Carga crítica de flambagem calculada em{' '}
              <strong>{bucklingLoadKN.toFixed(0)} kN</strong> — modelo simplificado de Euler.
            </span>
          </li>
          <li>
            <span className="takeaway-check takeaway-check--neutral">→</span>
            <span>
              Na prática, estabilidade lateral, qualidade de solda, rodízios, fixações e
              condição do piso continuam sendo fatores decisivos.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
