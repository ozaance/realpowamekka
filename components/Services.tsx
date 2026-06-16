export default function Services() {
  return (
    <section className="svc wrap" id="services">
      <div className="sec-head">
        <h3 className="shead rv d1">Cinq disciplines, un système.</h3>
        <span className="idx rv d1">Services · 01—05</span>
      </div>

      <div className="v-svc pile">
        <div className="stack rv d1">
          <div className="layer">
            <span className="no">01</span>
            <h4>Audits Stratégiques</h4>
            <p>Comprendre vos opérations et nommer les leviers.</p>
            <div className="barwrap">
              <div className="bar" style={{ width: '38%' }} />
            </div>
          </div>
          <div className="layer">
            <span className="no">02</span>
            <h4>Systèmes Digitaux</h4>
            <p>Architecturer la base : outils, données, équipes reliés.</p>
            <div className="barwrap">
              <div className="bar" style={{ width: '55%' }} />
            </div>
          </div>
          <div className="layer">
            <span className="no">03</span>
            <h4>IA &amp; Automatisation</h4>
            <p>Automatiser le répétitif, augmenter les décisions.</p>
            <div className="barwrap">
              <div className="bar" style={{ width: '72%' }} />
            </div>
          </div>
          <div className="layer">
            <span className="no">04</span>
            <h4>Sites Premium</h4>
            <p>Donner au système une vitrine crédible et durable.</p>
            <div className="barwrap">
              <div className="bar" style={{ width: '86%' }} />
            </div>
          </div>
          <div className="layer">
            <span className="no">05</span>
            <h4>Formation &amp; Adoption</h4>
            <p>Ancrer la maîtrise durablement dans vos équipes.</p>
            <div className="barwrap">
              <div className="bar" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
        <div className="flowlabel">Audit → Système → Automatisation → Vitrine → Adoption</div>
      </div>
    </section>
  );
}
