import Image from 'next/image'
import Link from 'next/link'

/* Assets */
import error404Graphic from '../../../../imports/notfound-hero-error404.svg'
import arrowUpLeft from '../../../../imports/notfound-hero-arrow-up-left.svg'

function Hero() {
  return (
    <section className="notfound-hero">
      <div className="content-container notfound-hero__inner">
        {/* Decorative Error 404 heading */}
        <div className="notfound-hero__error-image" aria-hidden="true">
          <Image src={error404Graphic} alt="" width={276} height={54} />
        </div>

        {/* Back to homepage button */}
        <Link href="/" className="notfound-hero__btn">
          <span className="notfound-hero__btn-icon">
            <Image src={arrowUpLeft} alt="" width={18} height={18} />
          </span>
          <span className="notfound-hero__btn-text">Back to homepage</span>
        </Link>

        {/* Text block */}
        <div className="notfound-hero__text-block">
          <h1 className="notfound-hero__heading">Oh No! Error 404</h1>
          <p className="notfound-hero__description">
            We are sorry but the page you are looking for could not be found.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero
