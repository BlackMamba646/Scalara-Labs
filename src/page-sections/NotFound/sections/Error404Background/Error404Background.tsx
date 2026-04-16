import Image from 'next/image'
/* Breakpoint-specific "Error 404" decorative SVGs */
import error404Desktop from '../../../../imports/notfound-error404background-desktop.svg'
import error404Tablet from '../../../../imports/notfound-error404background-tablet.svg'
import error404Mobile from '../../../../imports/notfound-error404background-mobile.svg'

function Error404Background() {
  return (
    <section className="notfound-error404background" aria-hidden="true">
      <div className="notfound-error404background__inner">
        {/* Desktop */}
        <div className="notfound-error404background__image notfound-error404background__image--desktop">
          <Image
            src={error404Desktop}
            alt=""
            width={1440}
            height={281}
            priority
          />
        </div>

        {/* Tablet */}
        <div className="notfound-error404background__image notfound-error404background__image--tablet">
          <Image
            src={error404Tablet}
            alt=""
            width={700}
            height={137}
          />
        </div>

        {/* Mobile */}
        <div className="notfound-error404background__image notfound-error404background__image--mobile">
          <Image
            src={error404Mobile}
            alt=""
            width={400}
            height={78}
          />
        </div>
      </div>
    </section>
  )
}

export default Error404Background
