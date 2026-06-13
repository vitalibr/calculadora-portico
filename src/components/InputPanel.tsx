import type { GantryInputs } from '../engineering/types';

interface InputPanelProps {
  inputs: GantryInputs;
  onChange: (updated: GantryInputs) => void;
  onReset: () => void;
}

interface FieldDef {
  key: keyof GantryInputs;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  hint?: string;
}

const FIELDS: FieldDef[] = [
  {
    key: 'payloadKg',
    label: 'Carga desejada',
    unit: 'kg',
    min: 10,
    max: 5000,
    step: 10,
    hint: 'Carga útil suspensa na talha',
  },
  {
    key: 'beamLengthM',
    label: 'Vão da viga',
    unit: 'm',
    min: 0.5,
    max: 10,
    step: 0.1,
    hint: 'Comprimento entre apoios',
  },
  {
    key: 'beamLinearMassKgM',
    label: 'Massa linear da viga',
    unit: 'kg/m',
    min: 1,
    max: 200,
    step: 0.1,
    hint: 'Massa por metro linear do perfil',
  },
  {
    key: 'beamInertiaMm4',
    label: 'Momento de inércia da viga (Ix)',
    unit: 'mm⁴',
    min: 1000,
    max: 1_000_000_000,
    step: 10000,
    hint: 'Consulte a tabela do fabricante do perfil',
  },
  {
    key: 'elasticityGPa',
    label: 'Módulo de elasticidade (E)',
    unit: 'GPa',
    min: 50,
    max: 300,
    step: 1,
    hint: 'Aço estrutural: 200 GPa',
  },
  {
    key: 'columnHeightM',
    label: 'Altura da coluna',
    unit: 'm',
    min: 0.5,
    max: 10,
    step: 0.1,
    hint: 'Comprimento livre entre base e viga',
  },
  {
    key: 'columnOuterMm',
    label: 'Lado externo da coluna (tubo quadrado)',
    unit: 'mm',
    min: 20,
    max: 300,
    step: 5,
    hint: 'Dimensão externa do tubo quadrado',
  },
  {
    key: 'columnThicknessMm',
    label: 'Espessura da parede da coluna',
    unit: 'mm',
    min: 1,
    max: 30,
    step: 0.5,
    hint: 'Espessura da chapa do tubo',
  },
  {
    key: 'bucklingK',
    label: 'Fator K de flambagem',
    unit: '—',
    min: 0.5,
    max: 2.5,
    step: 0.1,
    hint: 'K=2,0 é conservador (engastado-livre). K=1,0 = biarticulado.',
  },
  {
    key: 'casterCount',
    label: 'Quantidade de rodízios instalados',
    unit: 'und',
    min: 2,
    max: 8,
    step: 1,
  },
  {
    key: 'casterCapacityKg',
    label: 'Capacidade por rodízio',
    unit: 'kg',
    min: 50,
    max: 2000,
    step: 50,
    hint: 'Carga nominal do fabricante do rodízio',
  },
  {
    key: 'conservativeCasterCount',
    label: 'Rodízios efetivos (caso conservador)',
    unit: 'und',
    min: 1,
    max: 8,
    step: 1,
    hint: 'Geralmente 3 de 4, considerando desequilíbrio e irregularidade do piso',
  },
];

function NumberInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div className="input-field">
      <label className="input-label" htmlFor={field.key}>
        {field.label}
        <span className="input-unit">{field.unit}</span>
      </label>
      {field.hint && <p className="input-hint">{field.hint}</p>}
      <div className="input-row">
        <input
          id={field.key}
          type="number"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={(e) => {
            const parsed = parseFloat(e.target.value);
            if (!isNaN(parsed)) onChange(parsed);
          }}
          className="input-number"
        />
        <input
          type="range"
          min={field.min}
          max={field.max}
          step={field.step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="input-slider"
          aria-label={`Controle deslizante para ${field.label}`}
        />
      </div>
    </div>
  );
}

export function InputPanel({ inputs, onChange, onReset }: InputPanelProps) {
  function handleChange(key: keyof GantryInputs, val: number) {
    onChange({ ...inputs, [key]: val });
  }

  return (
    <section id="calcule" className="section section--alt">
      <div className="container">
        <h2 className="section-title">
          <span className="section-title-icon">⚙️</span>
          Calcule o Seu
        </h2>
        <p className="section-desc">
          Altere os parâmetros abaixo para o seu projeto. Os resultados são atualizados
          automaticamente. Todos os valores são <strong>estimativas preliminares</strong>.
        </p>

        <div className="input-grid">
          {FIELDS.map((field) => (
            <NumberInput
              key={field.key}
              field={field}
              value={inputs[field.key]}
              onChange={(val) => handleChange(field.key, val)}
            />
          ))}
        </div>

        <div className="input-actions">
          <button className="btn btn--secondary" onClick={onReset} type="button">
            Restaurar valores do exemplo
          </button>
        </div>
      </div>
    </section>
  );
}
