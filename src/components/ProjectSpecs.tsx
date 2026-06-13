import { PROJECT_SPECS } from '../data/defaults';

interface SpecRowProps {
  label: string;
  value: string;
}

function SpecRow({ label, value }: SpecRowProps) {
  return (
    <div className="spec-row">
      <span className="spec-label">{label}</span>
      <span className="spec-value">{value}</span>
    </div>
  );
}

export function ProjectSpecs() {
  return (
    <section id="meu-portico" className="section section--alt">
      <div className="container">
        <h2 className="section-title">
          <span className="section-title-icon">🏗️</span>
          Meu Pórtico — O Projeto Real
        </h2>
        <p className="section-desc">
          Especificações do pórtico móvel construído no vídeo. Estes valores são os padrões da
          calculadora. Você pode alterá-los na seção "Calcule o Seu".
        </p>

        <div className="specs-card">
          <SpecRow label="Viga principal" value={PROJECT_SPECS.beam} />
          <SpecRow label="Comprimento da viga" value={PROJECT_SPECS.beamLength} />
          <SpecRow label="Colunas" value={PROJECT_SPECS.columns} />
          <SpecRow label="Altura das colunas" value={PROJECT_SPECS.columnHeight} />
          <SpecRow label="Bases" value={PROJECT_SPECS.bases} />
          <SpecRow label="Mãos francesas" value={PROJECT_SPECS.gussets} />
          <SpecRow label="Rodízios" value={PROJECT_SPECS.casters} />
          <SpecRow label="Carga analisada (padrão)" value="300 kg" />
        </div>

        <div className="specs-note">
          <p>
            <strong>Nota técnica:</strong> O perfil S6×12,5 (viga I de 6 pol., 18,6 kg/m) possui
            momento de inércia Ix ≈ 9.200.000 mm⁴ — valor usado por padrão no cálculo de flecha.
          </p>
        </div>
      </div>
    </section>
  );
}
