export default function Conviction() {
  return (
    <section className="philo wrap">
      <div className="v-philo complexite">
        <div className="head">
          <h3 className="shead rv d1">Nous transformons la complexité en maîtrise.</h3>
        </div>
        <div className="ct rv d3">
          <div className="cbox before">
            <svg viewBox="0 0 300 220" preserveAspectRatio="none" aria-hidden="true">
              <g className="tangle">
                <path d="M20 40 C90 10 130 180 210 90 S260 30 285 120" />
                <path d="M30 180 C110 120 90 30 200 70 S250 200 280 60" />
                <path d="M15 110 C80 200 160 20 230 160 S270 90 290 170" />
                <path d="M40 20 C60 120 200 140 150 200 S40 150 20 90" />
                <path d="M25 150 C120 80 170 200 250 40" />
                <path d="M60 200 C140 160 120 60 260 110" />
              </g>
            </svg>
            <span className="tag">Avant — complexité</span>
          </div>
          <span className="arrow">→</span>
          <div className="cbox after">
            <svg viewBox="0 0 300 220" preserveAspectRatio="none" aria-hidden="true">
              <g className="order">
                <polyline className="ln" points="150,28 150,192" />
                <polyline className="ln" points="150,70 70,70 70,150" />
                <polyline className="ln" points="150,110 230,110 230,150" />
                <polyline className="ln" points="150,150 110,150" />
                <rect className="mod" x="116" y="14" width="68" height="28" rx="2" />
                <rect className="mod" x="40" y="150" width="60" height="26" rx="2" />
                <rect className="mod" x="200" y="150" width="60" height="26" rx="2" />
                <rect className="mod" x="80" y="150" width="60" height="26" rx="2" />
                <circle className="nd" cx="150" cy="70" r="4" />
                <circle className="nd" cx="150" cy="110" r="4" />
                <circle className="nd" cx="150" cy="150" r="4" />
              </g>
            </svg>
            <span className="tag">Après — maîtrise</span>
          </div>
        </div>
        <p className="cap sub rv d3">
          Un système clair n&apos;est pas un système pauvre. C&apos;est un système où chaque
          élément a une raison d&apos;être et où vous gardez le contrôle.
        </p>
      </div>
    </section>
  );
}
