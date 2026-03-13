import React from 'react'

export default function Gallery({ images = [] }) {
  if (!images.length) return null

  const normalized = images.map(img =>
    typeof img === 'string' ? { src: img, alt: '' } : img
  )

  return (
    <div className="gallery" data-gallery>
      <div className="gallery-track">
        {normalized.map((img, i) => (
          <div key={i} className="gallery-slide">
            <img src={img.src} alt={img.alt ?? ''} loading="lazy" />
            {img.caption && <p className="gallery-caption">{img.caption}</p>}
          </div>
        ))}
      </div>

      {normalized.length > 1 && (
        <>
          <button className="gallery-btn gallery-btn--prev" aria-label="Previous">
            <span className="material-symbols-rounded">chevron_left</span>
          </button>
          <button className="gallery-btn gallery-btn--next" aria-label="Next">
            <span className="material-symbols-rounded">chevron_right</span>
          </button>
          <div className="gallery-dots">
            {normalized.map((_, i) => (
              <button key={i} className={`gallery-dot${i === 0 ? ' active' : ''}`} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
