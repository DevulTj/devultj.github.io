document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const track = gallery.querySelector('.gallery-track')
  const slides = gallery.querySelectorAll('.gallery-slide')
  const dots = gallery.querySelectorAll('.gallery-dot')
  const prev = gallery.querySelector('.gallery-btn--prev')
  const next = gallery.querySelector('.gallery-btn--next')
  let current = 0

  function go(n) {
    current = ((n % slides.length) + slides.length) % slides.length
    track.style.transform = `translateX(-${current * 100}%)`
    dots.forEach((d, i) => d.classList.toggle('active', i === current))
  }

  prev?.addEventListener('click', () => go(current - 1))
  next?.addEventListener('click', () => go(current + 1))
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)))

  // Keyboard when focused inside gallery
  gallery.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') go(current - 1)
    if (e.key === 'ArrowRight') go(current + 1)
  })

  // Touch swipe
  let startX = 0
  gallery.addEventListener('touchstart', e => { startX = e.touches[0].clientX }, { passive: true })
  gallery.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) go(current + (diff > 0 ? 1 : -1))
  })
})
