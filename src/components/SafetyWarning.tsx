export function SafetyWarning() {
  return (
    <section id="aviso" className="section section--alt">
      <div className="container">
        <div className="disclaimer-card">
          <div className="disclaimer-card-header">
            <span className="disclaimer-card-icon" aria-hidden="true">⚠️</span>
            <h2 className="disclaimer-card-title">Aviso importante</h2>
          </div>

          <p className="disclaimer-card-body">
            Esta ferramenta fornece estimativas preliminares com base em modelos simplificados.
            Ela não substitui projeto estrutural, ensaio real de carga ou avaliação por
            engenheiro habilitado. Use os resultados apenas como referência inicial e adote
            práticas seguras no uso do equipamento.
          </p>

          <p className="disclaimer-card-body disclaimer-card-body--muted">
            Antes de qualquer uso real, faça testes progressivos e respeite as limitações dos
            materiais, soldas, fixações, rodízios e condições do piso.
          </p>
        </div>
      </div>
    </section>
  );
}
