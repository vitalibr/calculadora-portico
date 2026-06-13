import { useState, useCallback, useMemo } from 'react';
import { Header }             from './components/Header';
import { VideoSection }       from './components/VideoSection';
import { InputPanel }         from './components/InputPanel';
import { ResultsPanel }       from './components/ResultsPanel';
import { GantryIllustration } from './components/GantryIllustration';
import { PracticalTakeaways } from './components/PracticalTakeaways';
import { SafetyWarning }      from './components/SafetyWarning';
import { DEFAULT_INPUTS }     from './data/defaults';
import { computeResults }     from './engineering/compute';
import { YOUTUBE_CHANNEL_URL, INSTAGRAM_URL } from './data/siteConfig';
import type { GantryInputs }  from './engineering/types';

export default function App() {
  const [inputs, setInputs] = useState<GantryInputs>(DEFAULT_INPUTS);

  const results = useMemo(() => computeResults(inputs), [inputs]);

  const handleChange  = useCallback((updated: GantryInputs) => setInputs(updated),  []);
  const handleReset   = useCallback(() => setInputs(DEFAULT_INPUTS), []);

  return (
    <div className="app">
      <Header />

      <main>
        {/* ── 1. Vídeo ── */}
        <VideoSection />

        {/* ── 2. Calculadora ── */}
        <InputPanel inputs={inputs} onChange={handleChange} onReset={handleReset} />

        {/* ── 3. Resultados ── */}
        <ResultsPanel inputs={inputs} />

        {/* ── 4. Ilustração técnica interativa ── */}
        <section id="ilustracao" className="section illustration-section">
          <div className="container">
            <h2 className="section-title">
              <span className="section-title-icon">📐</span>
              Ilustração Técnica Interativa
            </h2>
            <p className="section-desc">
              Selecione um modo para visualizar diferentes aspectos estruturais do pórtico.
              Os valores atualizam conforme você altera os parâmetros na calculadora.
            </p>
            <GantryIllustration inputs={inputs} results={results} />
          </div>
        </section>

        {/* ── 5. Resumo prático ── */}
        <PracticalTakeaways inputs={inputs} results={results} />

        {/* ── 6. Aviso (único bloco de disclaimer) ── */}
        <SafetyWarning />
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-top-row">
              <div className="footer-brand-row">
                <img src="./logo.png" alt="Garage VM" className="footer-logo" />
                <div>
                  <div className="footer-brand-name">Garage VM</div>
                  <div className="footer-tagline">Projeto educacional</div>
                </div>
              </div>

              <div className="footer-social">
                <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                  <svg viewBox="0 0 24 24" className="footer-social-icon" aria-hidden="true">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" fill="currentColor"/>
                  </svg>
                  YouTube
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="footer-social-link">
                  <svg viewBox="0 0 24 24" className="footer-social-icon" aria-hidden="true">
                    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" fill="currentColor"/>
                  </svg>
                  Instagram
                </a>
              </div>
            </div>

            <p className="footer-disclaimer">
              Esta ferramenta é educativa e não substitui projeto estrutural profissional,
              inspeção por engenheiro habilitado ou ART. Os resultados são estimativas
              preliminares — nunca apresente como "seguro para içamento".
            </p>

            <p className="footer-copy">
              © Garage VM — conteúdo educacional para makers. Nenhuma responsabilidade civil é assumida.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
