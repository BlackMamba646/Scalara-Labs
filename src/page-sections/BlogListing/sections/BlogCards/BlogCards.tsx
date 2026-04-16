'use client'

import { useState, useRef } from 'react'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'
import { ScrollReveal, StaggerReveal } from '@/app/components/scroll-reveal'
import type { BlogPostCms } from '@/lib/types/blog'

import imgBlog01 from '../../../../assets/images/bloglisting-blog-cards-image-01.webp'
import imgBlog02 from '../../../../assets/images/bloglisting-blog-cards-image-02.webp'
import imgBlog03 from '../../../../assets/images/bloglisting-blog-cards-image-03.webp'
import imgBlog04 from '../../../../assets/images/bloglisting-blog-cards-image-04.webp'
import imgBlog05 from '../../../../assets/images/bloglisting-blog-cards-image-05.webp'
import imgBlog06 from '../../../../assets/images/bloglisting-blog-cards-image-06.webp'
import imgBlog07 from '../../../../assets/images/bloglisting-blog-cards-image-07.webp'
import imgBlog08 from '../../../../assets/images/bloglisting-blog-cards-image-08.webp'
import imgBlog09 from '../../../../assets/images/bloglisting-blog-cards-image-09.webp'

import arrowUpRight from '../../../../imports/bloglisting-blog-cards-arrow-up-right.svg'
import caretLeft from '../../../../imports/bloglisting-blog-cards-caret-left.svg'
import caretRight from '../../../../imports/bloglisting-blog-cards-caret-right.svg'
import caretDown from '../../../../imports/bloglisting-blog-cards-caret-down.svg'

interface BlogCardData {
  image: StaticImageData | string
  alt: string
  date: string
  title: string
  description: string
  slug: string
}

interface BlogCardsProps {
  posts?: BlogPostCms[]
}

const PLACEHOLDER_IMAGES: StaticImageData[] = [
  imgBlog01, imgBlog02, imgBlog03, imgBlog04, imgBlog05,
  imgBlog06, imgBlog07, imgBlog08, imgBlog09,
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const ITEMS_PER_PAGE = 9

function BlogCard({ card }: { card: BlogCardData }) {
  return (
    <Link href={`/blog/${card.slug}`} className="bloglisting-blog-cards__card-link">
      <article className="bloglisting-blog-cards__card">
        {/* Image */}
        <div className="bloglisting-blog-cards__card-image-wrapper">
          <Image
            className="bloglisting-blog-cards__card-image"
            src={card.image}
            alt={card.alt}
            fill
            {...(typeof card.image !== 'string' && { placeholder: "blur" })}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          />
        </div>

        {/* Heading area */}
        <div className="bloglisting-blog-cards__card-heading">
          <p className="bloglisting-blog-cards__card-date">{card.date}</p>
          <h3 className="bloglisting-blog-cards__card-title">{card.title}</h3>
          <p className="bloglisting-blog-cards__card-description">{card.description}</p>
        </div>

        {/* Action button */}
        <div className="bloglisting-blog-cards__card-button">
          <span className="bloglisting-blog-cards__card-button-text">Explore further</span>
          <img
            className="bloglisting-blog-cards__card-button-icon"
            src={arrowUpRight.src}
            alt=""
            width={20}
            height={20}
          />
        </div>
      </article>
    </Link>
  )
}

function BlogCards({ posts }: BlogCardsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)

  const cards: BlogCardData[] = (posts ?? []).map((post, i) => ({
    image: post.heroImageUrl || PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length],
    alt: post.title,
    date: post.date ? formatDate(post.date) : '',
    title: post.title,
    description: post.excerpt ?? '',
    slug: post.slug,
  }))

  const totalPages = Math.max(1, Math.ceil(cards.length / ITEMS_PER_PAGE))
  const pageNumbers = Array.from({ length: totalPages }, (_, i) =>
    String(i + 1).padStart(2, '0')
  )
  const paginatedCards = cards.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  function goToPage(page: number) {
    setCurrentPage(page)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="bloglisting-blog-cards" ref={sectionRef}>
      <div className="content-container bloglisting-blog-cards__inner">
        {/* Cards grid */}
        <div className="bloglisting-blog-cards__grid">
          {cards.length === 0 ? (
            <p className="bloglisting-blog-cards__empty">No blog posts yet.</p>
          ) : (
            paginatedCards.map((card, index) => {
              const row = Math.floor(index / 3)
              const colIndex = index % 3
              return (
                <StaggerReveal
                  key={card.title}
                  index={colIndex}
                  direction="up"
                  distance={30}
                  staggerDelay={0.12}
                  baseDelay={row * 0.15}
                  className="bloglisting-blog-cards__card-stagger"
                >
                  <BlogCard card={card} />
                </StaggerReveal>
              )
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <ScrollReveal direction="up" distance={20} delay={0.3}>
          <nav className="bloglisting-blog-cards__pagination" aria-label="Blog pagination">
            {/* Page dropdown */}
            <button type="button" className="bloglisting-blog-cards__dropdown">
              <span className="bloglisting-blog-cards__dropdown-text">
                Page {String(currentPage).padStart(2, '0')}
              </span>
              <img
                className="bloglisting-blog-cards__dropdown-icon"
                src={caretDown.src}
                alt=""
                width={12}
                height={12}
              />
            </button>

            {/* Page number controls */}
            <div className="bloglisting-blog-cards__pagination-controls">
              <button
                type="button"
                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="bloglisting-blog-cards__pagination-arrow-btn"
                aria-label="Previous page"
              >
                <img
                  src={caretLeft.src}
                  alt=""
                  width={20}
                  height={20}
                />
              </button>

              <div className="bloglisting-blog-cards__pagination-numbers">
                {pageNumbers.map((num, index) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => goToPage(index + 1)}
                    className={`bloglisting-blog-cards__pagination-item${currentPage === index + 1 ? ' bloglisting-blog-cards__pagination-item--active' : ''}`}
                  >
                    <span className="bloglisting-blog-cards__pagination-item-text">{num}</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="bloglisting-blog-cards__pagination-arrow-btn"
                aria-label="Next page"
              >
                <img
                  src={caretRight.src}
                  alt=""
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </nav>
          </ScrollReveal>
        )}
      </div>
    </section>
  )
}

export default BlogCards
