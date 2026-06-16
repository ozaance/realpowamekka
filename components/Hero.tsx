export default function Hero() {
  return (
    <div className="wrap">
      <header className="v-hero field">
        <div className="lightbg" />
        <div className="inner wrap" style={{ paddingLeft: 0, paddingRight: 0 }}>
          <h1 className="display rv d2">
            Bâtir des entreprises
            <br />
            plus claires.
          </h1>
          <p className="lede rv d3">
            POWAMEKKA conçoit les systèmes et l&apos;IA qui mettent de l&apos;ordre dans la complexité.
          </p>
          <div className="hero-actions rv d4">
            <a className="btn" href="https://wa.me/33605715122?text=Bonjour%2C%20je%20souhaite%20demander%20un%20audit%20pour%20mon%20entreprise." target="_blank" rel="noopener noreferrer" style={{ borderRadius: 18 }}>Demander un audit <span className="ar">{"\u2192"}</span></a>
            <a className="btn ghost" href="#approche" style={{ borderRadius: 18 }}>Notre approche</a>
          </div>
          <div className="hero-proof rv d5">
            <div className="p">
              <div className="n">Visibilité</div>
              <div className="t">Une présence digitale qui inspire confiance.</div>
            </div>
            <div className="p">
              <div className="n">Efficacité</div>
              <div className="t">Des opérations fluides, automatisées, mesurées.</div>
            </div>
            <div className="p">
              <div className="n">Croissance</div>
              <div className="t">Des décisions plus rapides, mieux informées.</div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
