(function () {
  var sections = ['home', 'projects', 'blog', 'cv']
  var navLinks = {}
  sections.forEach(function (id) {
    var el = document.querySelector('[data-section="' + id + '"]')
    if (el) navLinks[id] = el
  })

  var current = 'home'

  function setActive(id) {
    if (id === current) return
    current = id
    sections.forEach(function (s) {
      if (navLinks[s]) navLinks[s].classList.toggle('active', s === id)
    })
  }

  var observer = new IntersectionObserver(function (entries) {
    // Pick the topmost visible section
    var visible = entries
      .filter(function (e) { return e.isIntersecting })
      .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top })
    if (visible.length > 0) setActive(visible[0].target.id)
  }, { threshold: 0.2 })

  sections.forEach(function (id) {
    var el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  // Home is active by default
  if (navLinks['home']) navLinks['home'].classList.add('active')
})()
