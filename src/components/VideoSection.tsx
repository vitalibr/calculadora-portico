import { YOUTUBE_VIDEO_ID, YOUTUBE_CHANNEL_URL } from '../data/siteConfig';

export function VideoSection() {
  return (
    <section id="video" className="section section--video">
      <div className="container">
        <h2 className="section-title">
          <span className="section-title-icon">▶</span>
          Assista à construção do pórtico
        </h2>
        <p className="section-desc">
          Veja o processo completo de construção deste pórtico móvel caseiro no canal Garage VM.
        </p>

        {YOUTUBE_VIDEO_ID ? (
          <div className="video-embed-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?rel=0&modestbranding=1`}
              title="Vídeo da construção do pórtico móvel DIY — Garage VM"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="video-placeholder">
            <div className="video-placeholder-icon" aria-hidden="true">▶</div>
            <p className="video-placeholder-text">
              Em breve: vídeo completo da construção no YouTube.
            </p>
            <a
              href={YOUTUBE_CHANNEL_URL}
              className="btn btn--gold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Acessar o canal Garage VM
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
