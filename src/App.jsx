import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const SQ_BASE = import.meta.env.VITE_SQUARE_2AM_URL || '#'

// ── Products catalog — add more here as the brand grows ───────────────────────
const PRODUCTS = [
  {
    id:      'iphone-16-pro-night-black',
    name:    'iPhone 16 Pro Case',
    variant: 'Night Black',
    price:   '$49',
    status:  'LIVE',
    live:    true,
    specs: [
      ['Device',        'iPhone 16 Pro'],
      ['Material',      'CNC Polycarbonate'],
      ['Compatibility', 'MagSafe — Full Signal'],
      ['Protection',    'Drop Certified — 6ft'],
      ['Finish',        'Matte Night Black'],
      ['Weight',        '28g'],
      ['Shipping',      '3 Business Days'],
    ],
    body: 'CNC-precision cut for iPhone 16 Pro. MagSafe-compatible with zero signal loss. Drop-certified to 6ft. Matte Night Black finish engineered for the long session.',
    squareUrl: SQ_BASE,
  },
  {
    id:      'iphone-16-pro-max-night-black',
    name:    'iPhone 16 Pro Max Case',
    variant: 'Night Black',
    price:   '$49',
    status:  'COMING SOON',
    live:    false,
    specs: [
      ['Device',        'iPhone 16 Pro Max'],
      ['Material',      'CNC Polycarbonate'],
      ['Compatibility', 'MagSafe — Full Signal'],
      ['Protection',    'Drop Certified — 6ft'],
      ['Finish',        'Matte Night Black'],
    ],
    body: 'Same precision. Bigger canvas. Coming soon.',
    squareUrl: null,
  },
  {
    id:      'iphone-16-pro-raw',
    name:    'iPhone 16 Pro Case',
    variant: 'Raw Aluminum',
    price:   '$69',
    status:  'COMING SOON',
    live:    false,
    specs: [
      ['Device',        'iPhone 16 Pro'],
      ['Material',      'CNC 6061 Aluminum'],
      ['Compatibility', 'MagSafe — Full Signal'],
      ['Protection',    'Drop Certified — 4ft'],
      ['Finish',        'Brushed Raw'],
    ],
    body: 'Full aluminum. No paint. No apologies.',
    squareUrl: null,
  },
]

// ── Hash router ───────────────────────────────────────────────────────────────
function useRoute() {
  const [hash, setHash] = useState(window.location.hash || '#/')
  useEffect(() => {
    const fn = () => setHash(window.location.hash || '#/')
    window.addEventListener('hashchange', fn)
    return () => window.removeEventListener('hashchange', fn)
  }, [])
  return hash
}

function navigate(to) {
  window.location.hash = to
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Shared UI ─────────────────────────────────────────────────────────────────
function Noise() { return <div className="noise" aria-hidden /> }

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}>
      {children}
    </motion.div>
  )
}

function Btn({ children, href, onClick, variant = 'primary', className = '', disabled = false }) {
  const base = 'inline-flex items-center gap-2 font-mono text-[11px] tracking-[3px] uppercase px-7 py-4 border transition-all duration-300 select-none'
  const v = {
    primary: disabled
      ? 'bg-white/10 border-white/10 text-white/25 cursor-not-allowed'
      : 'bg-[#FF4D00] border-[#FF4D00] text-black hover:bg-[#e64400] cursor-pointer pulse',
    ghost:   'bg-transparent border-white/20 text-[#F5F5F5] hover:border-[#FF4D00]/50 hover:text-[#FF4D00] cursor-pointer',
    outline: 'bg-transparent border-[#FF4D00]/40 text-[#FF4D00] hover:bg-[#FF4D00]/05 cursor-pointer',
  }
  const cls = `${base} ${v[variant]} ${className}`
  if (href && !disabled)
    return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
  return <button onClick={onClick} disabled={disabled} className={cls}>{children}</button>
}

function Ticker() {
  const items = ['2AM CASES', 'NIGHT BLACK', 'MAGSAFE', 'DROP CERTIFIED',
                 'CNC POLYCARBONATE', 'SHIPS IN 3 DAYS', 'NIGHT.INC', 'DARK BY DEFAULT']
  const doubled = [...items, ...items]
  return (
    <div className="border-t border-b py-2.5 overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="ticker-track flex gap-12 whitespace-nowrap w-max">
        {doubled.map((t, i) => (
          <span key={i} className="font-mono text-[9px] tracking-[4px] text-white/20 uppercase">
            {t} <span className="text-[#FF4D00]/35 mx-3">◈</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Nav ────────────────────────────────────────────────────────────────────────
function Nav({ route }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 h-14 transition-all duration-300"
      style={{
        background:     scrolled ? 'rgba(8,8,8,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom:   scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}>
      <button onClick={() => navigate('#/')}
        className="font-mono text-[13px] font-bold tracking-[5px] text-white/90 hover:text-white transition-colors">
        2AM
      </button>
      <nav className="flex items-center gap-6">
        <button onClick={() => navigate('#/cases')}
          className={`font-mono text-[9px] tracking-[3px] uppercase transition-colors ${route.startsWith('#/cases') || route.startsWith('#/product') ? 'text-[#FF4D00]' : 'text-white/40 hover:text-white/80'}`}>
          Cases
        </button>
        <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          className="font-mono text-[9px] tracking-[3px] uppercase text-white/40 hover:text-white/80 transition-colors">
          About
        </button>
        <a href="https://night.inc" target="_blank" rel="noopener noreferrer"
          className="font-mono text-[9px] tracking-[3px] uppercase text-white/25 hover:text-white/60 transition-colors">
          Night.inc ↗
        </a>
      </nav>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  HOME
// ═══════════════════════════════════════════════════════════════════════════════
function HomePage() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { setTimeout(() => setLoaded(true), 80) }, [])

  const fade = (d) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: loaded ? 1 : 0, y: loaded ? 0 : 18 },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  })

  const liveProduct = PRODUCTS.find(p => p.live)

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col justify-between px-6 md:px-12 pt-24 pb-0"
        style={{ background: '#080808' }}>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div style={{
            position: 'absolute', top: '15%', right: '5%', width: 600, height: 500,
            background: 'radial-gradient(ellipse, rgba(255,77,0,0.06) 0%, transparent 65%)',
            filter: 'blur(60px)',
          }} />
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.div {...fade(0.04)} className="font-mono text-[9px] tracking-[6px] text-white/25 mb-6 uppercase">
            // Night.inc — Mobile Division
          </motion.div>
          <motion.h1 {...fade(0.12)}
            className="font-mono font-bold leading-[0.88] tracking-tighter mb-4"
            style={{ fontSize: 'clamp(72px, 16vw, 200px)', color: '#F5F5F5' }}>
            2AM
          </motion.h1>
          <motion.p {...fade(0.22)}
            className="font-mono text-[12px] md:text-[15px] tracking-[5px] text-white/40 uppercase mb-3 max-w-sm">
            Cases for people<br />who work late.
          </motion.p>
          <motion.div {...fade(0.3)} className="font-mono text-[9px] tracking-[3px] text-white/20 uppercase mb-10">
            iPhone 16 Pro · MagSafe · Drop Certified · CNC
          </motion.div>
          <motion.div {...fade(0.38)} className="flex flex-wrap gap-4">
            <Btn variant="primary" onClick={() => navigate('#/cases')}>
              Shop Cases ▶
            </Btn>
            {liveProduct && (
              <Btn variant="ghost" href={liveProduct.squareUrl}>
                Buy Now — {liveProduct.price}
              </Btn>
            )}
          </motion.div>
        </div>

        <motion.div {...fade(0.5)} className="relative z-10 pt-16">
          <Ticker />
        </motion.div>
      </section>

      {/* ── Featured product ── */}
      <section className="px-6 md:px-12 py-20" style={{ background: '#080808' }}>
        <Reveal>
          <div className="flex items-center gap-4 mb-12">
            <span className="font-mono text-[9px] tracking-[5px] text-[#FF4D00]/60 uppercase">// Now Available</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>
        </Reveal>
        {liveProduct && (
          <Reveal delay={0.05}>
            <FeaturedCard product={liveProduct} />
          </Reveal>
        )}
      </section>

      {/* ── About ── */}
      <section id="about" className="px-6 md:px-12 py-20 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl">
          <Reveal>
            <div>
              <div className="font-mono text-[9px] tracking-[5px] text-[#FF4D00]/50 uppercase mb-6">// The Brand</div>
              <p className="font-mono text-[13px] leading-8 text-white/45 mb-4">
                2AM is a Night.inc brand. We make cases for iPhone — built for
                founders, operators, and builders who are still working when
                everyone else has gone to bed.
              </p>
              <p className="font-mono text-[12px] leading-7 text-white/25">
                No lifestyle branding. No drops. Just precision hardware,
                shipped fast, designed to last.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-0 border" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0d0d0d' }}>
              {[
                ['Founded',     'Night.inc — 2026'],
                ['Category',   'Mobile Protective Cases'],
                ['Material',   'CNC Polycarbonate'],
                ['Fulfillment','Night.inc × Printify'],
                ['Checkout',   'Square — Encrypted'],
              ].map(([k, v]) => (
                <div key={k} className="px-6 py-4 flex items-center justify-between border-b last:border-b-0"
                  style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <span className="font-mono text-[9px] tracking-[1px] text-white/28">{k}</span>
                  <span className="font-mono text-[9px] font-semibold text-white/60">{v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function FeaturedCard({ product }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative border overflow-hidden cursor-pointer"
      animate={{ borderColor: hovered ? 'rgba(255,77,0,0.3)' : 'rgba(255,255,255,0.06)' }}
      transition={{ duration: 0.22 }}
      style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0d0d0d' }}
      onClick={() => navigate(`#/product/${product.id}`)}
    >
      <motion.div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0.3 }}
        style={{ background: 'linear-gradient(90deg, #FF4D00, transparent 50%)' }} />
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.4 }}
        style={{ background: 'radial-gradient(ellipse 60% 60% at 15% 30%, rgba(255,77,0,0.07), transparent)' }} />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2">
        {/* Image zone */}
        <div className="h-64 md:h-80 flex items-center justify-center relative overflow-hidden"
          style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="font-mono font-bold select-none"
            style={{ fontSize: 'clamp(48px,10vw,100px)', color: 'rgba(255,255,255,0.04)' }}>
            2AM
          </div>
          <div className="absolute bottom-4 left-6 font-mono text-[7px] tracking-[3px] text-white/15">— IMAGE COMING —</div>
        </div>

        {/* Info */}
        <div className="p-8 md:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="font-mono text-[8px] tracking-[4px] text-white/30 mb-1">{product.variant}</div>
                <div className="font-mono text-xl font-bold tracking-tight" style={{ color: '#F5F5F5' }}>{product.name}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-2xl font-bold" style={{ color: '#FF4D00' }}>{product.price}</div>
                <div className="flex items-center gap-1.5 justify-end mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className="font-mono text-[7px] tracking-[1px] text-white/30">{product.status}</span>
                </div>
              </div>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-white/35 mb-8">{product.body}</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-8">
              {product.specs.slice(0, 4).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#FF4D00] opacity-50 flex-shrink-0" />
                  <span className="font-mono text-[9px] text-white/35">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Btn href={product.squareUrl} variant="primary">Buy with Square ▶</Btn>
            <Btn variant="ghost" onClick={(e) => { e.stopPropagation(); navigate(`#/product/${product.id}`) }}>
              Details →
            </Btn>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CASES CATALOG
// ═══════════════════════════════════════════════════════════════════════════════
function CasesPage() {
  return (
    <div className="px-6 md:px-12 py-24" style={{ background: '#080808', minHeight: '100vh' }}>
      <Reveal>
        <div className="font-mono text-[9px] tracking-[6px] text-white/25 mb-3 uppercase">// 2AM Cases</div>
        <h1 className="font-mono text-3xl md:text-5xl font-bold tracking-tighter mb-12" style={{ color: '#F5F5F5' }}>
          All Cases
        </h1>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
        style={{ background: 'rgba(255,255,255,0.04)' }}>
        {PRODUCTS.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.07}>
            <CatalogCard product={p} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

function CatalogCard({ product }) {
  const [hovered, setHovered] = useState(false)
  const { id, name, variant, price, status, live, body } = product
  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => live && navigate(`#/product/${id}`)}
      className="relative flex flex-col border overflow-hidden"
      animate={{ borderColor: hovered && live ? 'rgba(255,77,0,0.28)' : 'rgba(255,255,255,0.0)' }}
      style={{ borderColor: 'rgba(255,255,255,0)', background: '#0d0d0d', cursor: live ? 'pointer' : 'default' }}
    >
      <motion.div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        animate={{ opacity: hovered && live ? 1 : 0.2 }}
        style={{ background: 'linear-gradient(90deg, #FF4D00, transparent 55%)' }} />

      {/* Image zone */}
      <div className="h-48 flex items-center justify-center relative overflow-hidden"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {!live && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(8,8,8,0.6)', backdropFilter: 'blur(2px)', zIndex: 10 }}>
            <span className="font-mono text-[8px] tracking-[4px] text-white/30 uppercase">Coming Soon</span>
          </div>
        )}
        <div className="font-mono font-bold select-none"
          style={{ fontSize: '56px', color: 'rgba(255,255,255,0.04)' }}>
          2AM
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-mono text-[8px] tracking-[3px] text-white/25 mb-1">{variant}</div>
            <div className="font-mono text-[13px] font-semibold" style={{ color: '#F5F5F5' }}>{name}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[15px] font-bold" style={{ color: live ? '#FF4D00' : 'rgba(255,255,255,0.2)' }}>{price}</div>
            <div className="flex items-center gap-1 justify-end mt-1">
              <span className="w-1 h-1 rounded-full" style={{ background: live ? '#22C55E' : 'rgba(255,255,255,0.2)' }} />
              <span className="font-mono text-[7px] tracking-[1px] text-white/25">{status}</span>
            </div>
          </div>
        </div>
        <p className="font-mono text-[10px] leading-relaxed text-white/28 flex-1">{body}</p>
        <div className="pt-1">
          {live
            ? <Btn variant="primary" onClick={() => navigate(`#/product/${id}`)}>View Case →</Btn>
            : <Btn variant="ghost" disabled>Notify Me</Btn>
          }
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PRODUCT DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
function ProductPage({ productId }) {
  const product = PRODUCTS.find(p => p.id === productId)
  if (!product) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="font-mono text-[9px] tracking-[4px] text-white/30">404 — NOT FOUND</div>
        <Btn variant="ghost" onClick={() => navigate('#/cases')}>← Back to Cases</Btn>
      </div>
    </div>
  )

  const { name, variant, price, status, live, body, specs, squareUrl } = product

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-14 min-h-[52vh] flex items-end overflow-hidden"
        style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 20% 40%, rgba(255,77,0,0.06), transparent)' }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div className="font-mono font-bold tracking-tighter"
            style={{ fontSize: 'clamp(80px,20vw,260px)', color: 'rgba(255,255,255,0.025)', lineHeight: 1 }}>
            2AM
          </div>
        </div>
        <div className="relative z-10 w-full px-6 md:px-12 pb-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <button onClick={() => navigate('#/cases')}
              className="font-mono text-[8px] tracking-[3px] text-white/30 hover:text-white/60 uppercase mb-4 flex items-center gap-2 transition-colors">
              ← Cases
            </button>
            <div className="font-mono text-[8px] tracking-[4px] text-white/30 mb-1 uppercase">{variant}</div>
            <h1 className="font-mono text-3xl md:text-4xl font-bold tracking-tight" style={{ color: '#F5F5F5' }}>{name}</h1>
          </div>
          <div className="text-right">
            <div className="font-mono text-3xl font-bold mb-1" style={{ color: live ? '#FF4D00' : 'rgba(255,255,255,0.3)' }}>{price}</div>
            <div className="flex items-center gap-2 justify-end">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: live ? '#22C55E' : 'rgba(255,255,255,0.25)' }} />
              <span className="font-mono text-[8px] tracking-[2px] text-white/35">{status}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Detail */}
      <section className="px-6 md:px-12 py-16" style={{ background: '#080808' }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 max-w-6xl">
          <div className="lg:col-span-3 space-y-6">
            <Reveal>
              <p className="font-mono text-[13px] leading-8 text-white/55">{body}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="flex flex-wrap gap-4 pt-4">
                <Btn href={squareUrl} variant="primary" disabled={!live}>
                  {live ? 'Buy with Square ▶' : 'Coming Soon'}
                </Btn>
                {live && (
                  <div className="self-center font-mono text-[8px] tracking-[2px] text-white/20 uppercase">
                    Secure checkout via Square
                  </div>
                )}
              </div>
            </Reveal>
            {live && (
              <Reveal delay={0.1}>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {['■ Powered by Square', '⚡ SSL Encrypted', '↩ No Hidden Fees'].map(t => (
                    <div key={t} className="border px-3 py-1.5 font-mono text-[7px] tracking-[2px] text-white/22 uppercase"
                      style={{ borderColor: 'rgba(255,255,255,0.07)' }}>{t}</div>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Specs */}
          <div className="lg:col-span-2">
            <Reveal delay={0.08}>
              <div className="border sticky top-20" style={{ borderColor: 'rgba(255,255,255,0.07)', background: '#0d0d0d' }}>
                <div className="px-6 py-4 border-b flex items-center justify-between"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <span className="font-mono text-[8px] tracking-[4px] text-white/28">SPECIFICATIONS</span>
                  <span className="font-mono text-[8px] tracking-[2px] text-[#FF4D00]/60">REV 1.0</span>
                </div>
                {specs.map(([k, v]) => (
                  <div key={k} className="px-6 py-3.5 flex items-center justify-between border-b last:border-b-0"
                    style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <span className="font-mono text-[9px] text-white/28">{k}</span>
                    <span className="font-mono text-[9px] font-semibold text-white/62 text-right max-w-[55%]">{v}</span>
                  </div>
                ))}
                <div className="px-6 py-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <Btn href={squareUrl} variant="primary" disabled={!live} className="w-full justify-center">
                    {live ? `Buy Now — ${price} ▶` : 'Coming Soon'}
                  </Btn>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Other cases */}
      <section className="px-6 md:px-12 py-16 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="font-mono text-[9px] tracking-[5px] text-[#FF4D00]/60 uppercase">// More Cases</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          {PRODUCTS.filter(p => p.id !== productId).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.07}>
              <CatalogCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  FOOTER
// ═══════════════════════════════════════════════════════════════════════════════
function Footer() {
  return (
    <footer className="border-t px-6 md:px-12 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#080808' }}>
      <div className="font-mono text-[8px] tracking-[4px] text-white/18">
        © {new Date().getFullYear()} NIGHT INCORPORATED — 2AM CASES
      </div>
      <div className="flex items-center gap-5">
        <button onClick={() => navigate('#/cases')}
          className="font-mono text-[8px] tracking-[2px] text-white/18 hover:text-white/50 transition-colors uppercase">
          Cases
        </button>
        <a href="https://night.inc" target="_blank" rel="noopener noreferrer"
          className="font-mono text-[8px] tracking-[2px] text-white/18 hover:text-[#FF4D00]/60 transition-colors uppercase">
          Night.inc ↗
        </a>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const route = useRoute()
  const productMatch = route.match(/^#\/product\/(.+)$/)
  const productId    = productMatch ? productMatch[1] : null
  const isCases      = route === '#/cases'

  return (
    <div style={{ background: '#080808', minHeight: '100vh' }}>
      <Noise />
      <Nav route={route} />
      <AnimatePresence mode="wait">
        <motion.main key={route}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
          {productId  ? <ProductPage productId={productId} /> :
           isCases    ? <CasesPage /> :
                        <HomePage />}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  )
}
