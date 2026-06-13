import { YOUTUBE_CHANNEL_URL, INSTAGRAM_URL } from '../data/siteConfig';

export function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <div className="header-top">
          <div className="header-brand">
            <img
              src="./logo.png"
              alt="Logo Garage VM"
              className="header-logo"
            />
            <div className="header-brand-text">
              <span className="header-brand-name">Garage VM</span>
              <h1 className="site-title">Calculadora de Pórtico Móvel DIY</h1>
              <p className="site-subtitle">
                Faça estimativas preliminares de carga, compressão, flambagem e flecha
                para um pórtico móvel caseiro.
              </p>
            </div>
          </div>

          <div className="header-social">
            <span className="header-social-label">Acompanhe o projeto</span>
            <div className="header-social-links">
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link social-link--yt"
                aria-label="Canal Garage VM no YouTube"
              >
                <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z" fill="currentColor"/>
                </svg>
                YouTube
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link social-link--ig"
                aria-label="Garage VM no Instagram"
              >
                <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z" fill="currentColor"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>

        <nav className="header-nav" aria-label="Navegação principal">
          <a href="#video"      className="nav-link">Vídeo</a>
          <a href="#calcule"    className="nav-link">Calculadora</a>
          <a href="#resultados" className="nav-link">Resultados</a>
          <a href="#ilustracao" className="nav-link">Ilustração</a>
          <a href="#resumo"     className="nav-link">Resumo</a>
        </nav>
      </div>
    </header>
  );
}
