import Image from 'next/image';

export default function Conviction() {
  return (
    <section className="philo wrap">
      <div className="v-philo complexite">
        <div className="ct-illustration rv d2">
          <Image src="/conviction-illustration.png" alt="Transformation de la complexité en maîtrise" width={1693} height={929} style={{ width: '100%', height: 'auto' }} />
        </div>
        <p className="cap sub rv d3">
          Un système clair, c&apos;est un système où chaque élément a une raison d&apos;être et où vous gardez le contrôle.
        </p>
      </div>
    </section>
  );
}
