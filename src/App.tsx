import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Menu, Plus, X } from 'lucide-react'

type Category = 'All' | 'Tops' | 'Layers' | 'Bottoms' | 'Footwear'
type Product = { id: string; name: string; category: Exclude<Category, 'All'>; price: number; image: string; index: string; note: string; details: string }

const products: Product[] = [
  { id: 'signal-tee', name: 'Signal Heavy Tee', category: 'Tops', price: 1899, image: './cyber_grunge_tee.webp', index: '01', note: 'The statement layer', details: 'A boxy, oversized silhouette with an unapologetic graphic. Made for the nights that become stories.' },
  { id: 'static-flannel', name: 'Static Flannel', category: 'Layers', price: 2499, image: './glitch_plaid_shirt.webp', index: '02', note: 'Wear it your way', details: 'A loose plaid layer with lived-in attitude. Throw it over a tee or make it the whole look.' },
  { id: 'strapped-cargo', name: 'Strapped Cargo', category: 'Bottoms', price: 3999, image: './neo_tokyo_cargo.webp', index: '03', note: 'Utility in motion', details: 'Room to move, pockets that work, and a shape that holds its own from street to stage.' },
  { id: 'chrome-runner', name: 'Chrome Runner', category: 'Footwear', price: 4999, image: './cyber_sneakers.webp', index: '04', note: 'Ground the fit', details: 'A loud finish with a sculptural sole and flashes of orange. Built to make the last step count.' },
]
const moods = [
  { label: 'After dark', title: 'Make an entrance.', copy: 'Lead with the Signal Tee. Let the graphic do the talking.', productId: 'signal-tee', color: '#b8f34b' },
  { label: 'Off duty', title: 'Easy, never ordinary.', copy: 'The Static Flannel gives an everyday fit its edge.', productId: 'static-flannel', color: '#f08277' },
  { label: 'On the move', title: 'Built for everywhere.', copy: 'Start with Strapped Cargo and take the long way home.', productId: 'strapped-cargo', color: '#baadf7' },
]
const categories: Category[] = ['All', 'Tops', 'Layers', 'Bottoms', 'Footwear']

function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) {
  const cardRef = useRef<HTMLElement>(null)
  const move = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    cardRef.current?.style.setProperty('--tilt-x', String(-y * 5) + 'deg')
    cardRef.current?.style.setProperty('--tilt-y', String(x * 5) + 'deg')
    cardRef.current?.style.setProperty('--glow-x', String((x + 0.5) * 100) + '%')
    cardRef.current?.style.setProperty('--glow-y', String((y + 0.5) * 100) + '%')
  }
  const reset = () => {
    cardRef.current?.style.setProperty('--tilt-x', '0deg')
    cardRef.current?.style.setProperty('--tilt-y', '0deg')
  }
  return <article className="product-card reveal" ref={cardRef} onPointerMove={move} onPointerLeave={reset}>
    <button className="product-image-button" onClick={() => onOpen(product)} aria-label={'View ' + product.name}>
      <span className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" width="1024" height="1024" />
        <span className="product-image-glow" aria-hidden="true" />
        <span className="product-index">DV—{product.index}</span>
        <span className="product-open"><Plus size={20} strokeWidth={1.6} /></span>
      </span>
    </button>
    <div className="product-meta"><span>{product.category} / {product.note}</span><span>₹{product.price.toLocaleString('en-IN')}</span></div>
    <button className="product-name" onClick={() => onOpen(product)}>{product.name}<ArrowUpRight size={19} /></button>
  </article>
}

function App() {
  const [category, setCategory] = useState<Category>('All')
  const [activeMood, setActiveMood] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const mood = moods[activeMood]
  const moodProduct = products.find((product) => product.id === mood.productId)!
  const visibleProducts = category === 'All' ? products : products.filter((product) => product.category === category)

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(scrollable > 0 ? window.scrollY / scrollable : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) } })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal:not(.is-visible)').forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [category])
  useEffect(() => {
    if (!selectedProduct) return
    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setSelectedProduct(null) }
      if (event.key === 'Tab') {
        const controls = modalRef.current?.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]')
        if (!controls?.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    modalRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    document.addEventListener('keydown', close)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', close)
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [selectedProduct])
  const closeMenu = () => setMenuOpen(false)

  return <div className="site-shell">
    <a className="skip-link" href="#collection">Skip to collection</a>
    <div className="scroll-progress" style={{ transform: 'scaleX(' + scrollProgress + ')' }} aria-hidden="true" />
    <div className="announcement"><span>DRIPVAULT / DROP 001</span><span>MADE TO STAND OUT. BUILT TO LIVE IN.</span><span>EST. 2026 ↗</span></div>
    <header className="site-header">
      <a className="wordmark" href="#top" onClick={closeMenu} aria-label="Dripvault home">DRIP<span>VAULT</span><i aria-hidden="true">✳</i></a>
      <nav className={'nav-links ' + (menuOpen ? 'nav-open' : '')} aria-label="Main navigation">
        <a href="#collection" onClick={closeMenu}>The drop</a><a href="#story" onClick={closeMenu}>Our world</a><a href="#fit-lab" onClick={closeMenu}>Fit lab</a>
      </nav>
      <a className="header-cta" href="#collection">Explore collection <ArrowUpRight size={16} /></a>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X size={23} /> : <Menu size={23} />}</button>
    </header>
    <main id="top">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR RULES. YOUR UNIFORM.</div>
          <h1 id="hero-title">DRESS LIKE<br /><em>YOU MEAN</em><br />IT<span className="hero-period">.</span></h1>
          <p>Streetwear for the ones who take up space. Sharp silhouettes, loud details, zero permission needed.</p>
          <div className="hero-actions"><a className="button button-lime" href="#collection">Explore the drop <ArrowUpRight size={20} /></a><a className="text-link" href="#story">Get to know us <ArrowDown size={17} /></a></div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-frame"><img src="./cyber_grunge_tee.webp" alt="Model wearing the Dripvault graphic streetwear tee" fetchPriority="high" width="1024" height="1024" /><span className="hero-image-tint" aria-hidden="true" /></div>
          <div className="hero-ring" aria-hidden="true">DRIPVAULT · OWN YOUR SPACE · DRIPVAULT · OWN YOUR SPACE ·</div>
          <div className="hero-sticker">NO DRESS<br />CODE<span>↗</span></div>
          <div className="hero-image-caption"><span>FIG. 01 / THE SIGNAL TEE</span><span>NEW FREQUENCY UNLOCKED</span></div>
        </div>
        <div className="hero-side-note">SCROLL TO ENTER THE VAULT <ArrowDown size={14} /></div>
      </section>
      <div className="ticker" aria-hidden="true"><div className="ticker-track" aria-hidden="true">WEAR THE DIFFERENCE <span>✳</span> NO QUIET ENTRANCES <span>✳</span> WEAR THE DIFFERENCE <span>✳</span> NO QUIET ENTRANCES <span>✳</span></div></div>
      <section className="collection section-pad" id="collection" aria-labelledby="collection-title">
        <div className="section-kicker reveal"><span>01 / THE DROP</span><span>CURATED FOR THE UNCONVENTIONAL</span></div>
        <div className="collection-heading reveal"><h2 id="collection-title">THE PIECES.<br /><em>THE POINT OF VIEW.</em></h2><p>Four signatures. Infinite ways to wear them. Find the piece that feels like you.</p></div>
        <div className="filters" role="group" aria-label="Filter products">{categories.map((item) => <button key={item} className={category === item ? 'filter-active' : ''} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}<span>{item === 'All' ? '04' : '01'}</span></button>)}</div>
        <div className={'product-grid ' + (visibleProducts.length === 1 ? 'product-grid-single' : '')}>{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={setSelectedProduct} />)}</div>
        <div className="collection-footer"><span>EXPLORE / EXPERIMENT / REPEAT</span><span>END OF DROP 001</span></div>
      </section>
      <section className="manifesto" id="story" aria-labelledby="story-title">
        <div className="manifesto-image"><img src="./glitch_plaid_shirt.webp" alt="Dripvault model in a red plaid streetwear layer" loading="lazy" width="1024" height="1024" /><span>NO. 001 / THE ORIGIN</span></div>
        <div className="manifesto-copy"><div className="section-kicker reveal"><span>02 / OUR WORLD</span><span>THE STORY BEHIND THE FIT</span></div><h2 id="story-title" className="reveal">WE NEVER<br />LEARNED TO<br /><em>BLEND IN.</em></h2><p className="reveal">Dripvault is a home for self-expression in motion. We make pieces with presence: the kind you reach for when you want your outside to feel as fearless as your inside.</p><p className="reveal">No fixed formula. No one way to wear it. Just a wardrobe that gives you room to be more of yourself.</p><a className="story-link" href="#fit-lab">Find your frequency <ArrowUpRight size={19} /></a><div className="manifesto-foot">INDIVIDUALITY IS THE DRESS CODE. / DV 2026</div></div>
      </section>
      <section className="fit-lab section-pad" id="fit-lab" aria-labelledby="fit-title">
        <div className="section-kicker reveal"><span>03 / FIT LAB</span><span>AN INTERACTIVE STYLE EXPERIMENT</span></div>
        <div className="fit-intro reveal"><h2 id="fit-title">WHAT'S YOUR<br /><em>FREQUENCY?</em></h2><p>Pick your mood. We'll point you toward the piece that speaks your language.</p></div>
        <div className="fit-panel reveal" style={{ '--mood-color': mood.color } as CSSProperties}>
          <div className="fit-controls"><span className="fit-step">01 — SELECT YOUR MOOD</span><div className="mood-options" role="group" aria-label="Choose your style mood">{moods.map((option, index) => <button key={option.label} className={activeMood === index ? 'mood-active' : ''} onClick={() => setActiveMood(index)} aria-pressed={activeMood === index}><span>0{index + 1}</span>{option.label}<ArrowUpRight size={19} /></button>)}</div><div className="mood-result" aria-live="polite"><span className="fit-step">YOUR SIGNAL / 0{activeMood + 1}</span><h3>{mood.title}</h3><p>{mood.copy}</p><button onClick={() => setSelectedProduct(moodProduct)}>Meet the piece <ArrowUpRight size={18} /></button></div></div>
          <div className="fit-preview" key={mood.productId}><img src={moodProduct.image} alt={mood.label + ' recommendation: ' + moodProduct.name} loading="lazy" width="1024" height="1024" /><span className="fit-preview-tag"><Check size={14} /> YOUR MATCH</span><span className="fit-preview-name">{moodProduct.name}</span></div>
        </div>
        <div className="fit-panel-footer"><span>NO ALGORITHM. JUST ATTITUDE.</span><div><button aria-label="Previous mood" onClick={() => setActiveMood((activeMood + moods.length - 1) % moods.length)}><ChevronLeft size={20} /></button><button aria-label="Next mood" onClick={() => setActiveMood((activeMood + 1) % moods.length)}><ChevronRight size={20} /></button></div></div>
      </section>
      <section className="closing" aria-labelledby="closing-title"><div className="closing-star" aria-hidden="true">✳</div><span className="closing-kicker">YOUR NEXT CHAPTER STARTS HERE</span><h2 id="closing-title">THE STREET IS<br /><em>YOUR RUNWAY.</em></h2><a className="button button-dark" href="#collection">Find your piece <ArrowUpRight size={20} /></a><div className="closing-bottom"><span>DRIPVAULT / DROP 001</span><span>MADE FOR THE MOMENT</span></div></section>
    </main>
    <footer className="footer"><a className="wordmark" href="#top" aria-label="Dripvault back to top">DRIP<span>VAULT</span><i aria-hidden="true">✳</i></a><p>Wear the difference.</p><a href="#top">Back to top ↑</a><span>© {new Date().getFullYear()} DRIPVAULT. CONCEPT SHOWCASE.</span></footer>
    {selectedProduct && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null) }}><div className="product-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description"><button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close product details"><X size={23} /></button><img src={selectedProduct.image} alt={selectedProduct.name} width="1024" height="1024" /><div className="modal-copy"><span>DRIPVAULT / DROP 001 / {selectedProduct.index}</span><h2 id="modal-title">{selectedProduct.name}</h2><p id="modal-description">{selectedProduct.details}</p><div className="modal-price">₹{selectedProduct.price.toLocaleString('en-IN')} <span>CONCEPT COLLECTION</span></div><button onClick={() => { setSelectedProduct(null); document.getElementById('fit-lab')?.scrollIntoView({ behavior: 'smooth' }) }}>Explore the fit lab <ArrowRight size={18} /></button></div></div></div>}
  </div>
}
export default App
