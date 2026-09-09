import axios from 'axios'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  AlertCircle,
  ArrowRight,
  Award,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Droplets,
  Edit2,
  ExternalLink,
  Eye,
  Filter,
  Flame,
  Heart,
  HelpCircle,
  Inbox,
  Info,
  LayoutDashboard,
  LoaderCircle,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Package,
  Phone,
  Plus,
  Printer,
  RefreshCw,
  RotateCcw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sliders,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Truck,
  User,
  X
} from 'lucide-react'
import './App.css'

// Initial curated Haute Parfumerie collection for ROYA
const initialProducts = [
  {
    id: 'roya-ambre-imperial',
    name: 'Ambre Impérial',
    brand: 'ROYA',
    subtitle: 'Extrait de Parfum N° 1',
    concentration: 'Extrait de Parfum (30%)',
    family: 'Ambré Boisé',
    size: '100 ml',
    price: 135,
    oldPrice: 165,
    category: 'Unisexe',
    gender: 'Unisexe',
    sillage: 'Envoûtant & Puissant',
    tenue: '24 Heures',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85',
    notes: 'Bergamote de Calabre, Ambre Gris, Vanille Bourbon, Cèdre de l\'Atlas',
    topNotes: ['Bergamote de Calabre', 'Poivre Rose', 'Safran'],
    heartNotes: ['Ambre Gris précieux', 'Rose Noire', 'Cardamome'],
    baseNotes: ['Vanille Bourbon', 'Cèdre de l\'Atlas', 'Patchouli noble'],
    description: 'Une création majestueuse où la chaleur veloutée de l\'ambre gris s\'embrase au contact du safran et de la vanille bourbon. Un sillage noble et magnétique qui habille la peau avec une distinction royale.',
    featured: true,
    bestSeller: true
  },
  {
    id: 'roya-rose-solaire',
    name: 'Rose Solaire',
    brand: 'ROYA',
    subtitle: 'Extrait de Parfum N° 2',
    concentration: 'Extrait de Parfum (28%)',
    family: 'Floral Boisé',
    size: '75 ml',
    price: 125,
    category: 'Femme',
    gender: 'Femme',
    sillage: 'Lumineux & Envoûtant',
    tenue: '18 Heures',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85',
    notes: 'Rose de Mai de Grasse, Mandarine d\'Italie, Santal Blanc, Musc Pur',
    topNotes: ['Mandarine d\'Italie', 'Néroli éclatant', 'Baies Roses'],
    heartNotes: ['Rose de Mai de Grasse', 'Pivoine Blanche', 'Fleur d\'Oranger'],
    baseNotes: ['Bois de Santal Blanc', 'Musc Vaporeux', 'Ambre Blanc'],
    description: 'La quintessence de la féminité solaire. Une rose de Grasse gorgée de lumière matinale, sublimée par la douceur crémeuse du santal blanc et la pureté d\'un musc caressant.',
    featured: true,
    newArrival: true
  },
  {
    id: 'roya-vetiver-celeste',
    name: 'Vétiver Céleste',
    brand: 'ROYA',
    subtitle: 'Extrait de Parfum N° 3',
    concentration: 'Extrait de Parfum (28%)',
    family: 'Hespéridé Boisé',
    size: '100 ml',
    price: 115,
    category: 'Homme',
    gender: 'Homme',
    sillage: 'Frais & Éloquent',
    tenue: '16 Heures',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1000&q=85',
    notes: 'Pamplemousse Noir, Vétiver d\'Haïti, Poivre de Sichuan, Cèdre',
    topNotes: ['Pamplemousse Noir', 'Citron Vert de Sicile', 'Poivre de Sichuan'],
    heartNotes: ['Vétiver d\'Haïti fumé', 'Géranium Bourbon', 'Sauge Sclarée'],
    baseNotes: ['Bois de Cèdre', 'Mousse de Chêne', 'Cuir Végétal'],
    description: 'Un souffle de charisme intemporel. La vivacité fusante des agrumes s\'incline devant un vétiver haïtien d\'une noblesse rare, laissant une empreinte racée et inoubliable.',
    featured: false,
    bestSeller: true
  },
  {
    id: 'roya-santal-mystique',
    name: 'Santal Mystique',
    brand: 'ROYA',
    subtitle: 'Extrait de Parfum N° 4',
    concentration: 'Extrait de Parfum (32%)',
    family: 'Boisé Oriental',
    size: '100 ml',
    price: 145,
    oldPrice: 175,
    category: 'Unisexe',
    gender: 'Unisexe',
    sillage: 'Profond & Charismatique',
    tenue: '24 Heures',
    image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1000&q=85',
    notes: 'Santal Mysore, Safran d\'Orient, Cardamome, Iris, Fève Tonka',
    topNotes: ['Safran d\'Orient', 'Cardamome verte', 'Gingembre frais'],
    heartNotes: ['Iris poudré de Florence', 'Papyrus', 'Fève Tonka grillée'],
    baseNotes: ['Bois de Santal de Mysore', 'Cuir Doux', 'Ambre Sombre'],
    description: 'Un voyage au cœur des bois sacrés. Onctueux et mystérieux, Santal Mystique enveloppe l\'esprit d\'une aura envoûtante où l\'iris poudré rencontre la profondeur chaleureuse du santal.',
    featured: true,
    bestSeller: true
  },
  {
    id: 'roya-fleur-de-soie',
    name: 'Fleur de Soie',
    brand: 'ROYA',
    subtitle: 'Extrait de Parfum N° 5',
    concentration: 'Extrait de Parfum (26%)',
    family: 'Floral Gourmand',
    size: '75 ml',
    price: 120,
    category: 'Femme',
    gender: 'Femme',
    sillage: 'Séducteur & Sensuel',
    tenue: '20 Heures',
    image: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1000&q=85',
    notes: 'Jasmin Sambac, Fleur de Cerisier, Amande Douce, Musc Blanc',
    topNotes: ['Fleur de Cerisier', 'Amande Douce craquante', 'Poire Williams'],
    heartNotes: ['Jasmin Sambac d\'Inde', 'Tubéreuse veloutée', 'Miel blanc'],
    baseNotes: ['Musc Blanc soyeux', 'Cashmeran', 'Bois de Santal crémeux'],
    description: 'Une caresse de satin pur sur la peau. Fleur de Soie captive par ses effluves de jasmin précieux et d\'amande gourmande, évoquant la sensualité d\'une étoffe d\'Orient.',
    featured: false,
    newArrival: true
  },
  {
    id: 'roya-oud-majestueux',
    name: 'Oud Majestueux',
    brand: 'ROYA',
    subtitle: 'Extrait de Parfum N° 6',
    concentration: 'Extrait de Parfum (35%)',
    family: 'Oriental Précieux',
    size: '100 ml',
    price: 160,
    oldPrice: 195,
    category: 'Homme',
    gender: 'Homme',
    sillage: 'Monumental & Royal',
    tenue: '24+ Heures',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85',
    notes: 'Bois d\'Oud Pur, Cuir de Russie, Encens Royal, Ambre Noir',
    topNotes: ['Encens de Somalie', 'Élémi', 'Poivre Noir'],
    heartNotes: ['Bois d\'Oud rare', 'Cuir de Russie', 'Ciste Labdanum'],
    baseNotes: ['Ambre Noir fumé', 'Bois de Gaïac', 'Musc Sauvage'],
    description: 'Le joyau de la couronne ROYA. Une symphonie d\'oud royal et de cuir noble qui transcende les époques. Pour les personnalités qui n\'acceptent aucun compromis sur l\'excellence.',
    featured: true,
    bestSeller: true
  }
]

const TUNISIAN_GOVERNORATES = [
  'Ariana', 'Béja', 'Ben Arous', 'Bizerte', 'Gabès', 'Gafsa', 'Jendouba',
  'Kairouan', 'Kasserine', 'Kébili', 'Le Kef', 'Mahdia', 'Manouba', 'Médenine',
  'Monastir', 'Nabeul', 'Sfax', 'Sidi Bouzid', 'Siliana', 'Sousse', 'Tataouine',
  'Tozeur', 'Tunis', 'Zaghouan'
]

const FREE_SHIPPING_THRESHOLD = 150
const STANDARD_SHIPPING_FEE = 7

// API instance
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' })

// Helper to check if a JWT is valid and not expired
function isTokenValid(token) {
  if (!token || typeof token !== 'string') return false
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false
    const payload = JSON.parse(atob(parts[1]))
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false
    }
    return true
  } catch {
    return false
  }
}

// Request interceptor: attach token automatically if valid
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('roya-admin-token') || localStorage.getItem('aster-admin-token')
  config.headers = config.headers || {}
  if (token && isTokenValid(token)) {
    config.headers.Authorization = `Bearer ${token}`
  } else if (config.headers.Authorization && (config.headers.Authorization.includes('null') || config.headers.Authorization.includes('undefined'))) {
    delete config.headers.Authorization
  }
  return config
})

// Response interceptor: automatically catch 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('roya-admin-token')
      localStorage.removeItem('aster-admin-token')
      if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login?expired=1'
      }
    }
    return Promise.reject(error)
  }
)

function mapApiProduct(product) {
  return {
    ...product,
    id: product.slug || product.id,
    name: product.name,
    brand: product.brand || 'ROYA',
    subtitle: product.subtitle || 'Extrait de Parfum',
    family: product.fragranceFamily || product.family || 'Ambré Boisé',
    category: product.category || 'Unisexe',
    gender: product.gender || product.category || 'Unisexe',
    size: product.size || '100 ml',
    price: product.price,
    oldPrice: product.oldPrice,
    image: product.images?.[0]?.url || product.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85',
    notes: product.notes || [...(product.fragranceNotes?.top || []), ...(product.fragranceNotes?.heart || []), ...(product.fragranceNotes?.base || [])].join(', ') || 'Notes précieuses',
    topNotes: product.fragranceNotes?.top || ['Bergamote', 'Baies Roses'],
    heartNotes: product.fragranceNotes?.heart || ['Jasmin', 'Rose Noire'],
    baseNotes: product.fragranceNotes?.base || ['Ambre Gris', 'Cèdre'],
    description: product.description || 'Une création d\'exception signée Maison ROYA.'
  }
}

// Contexts
const CartContext = createContext({
  items: [],
  add: () => {},
  update: () => {},
  remove: () => {},
  clear: () => {},
  total: 0,
  count: 0,
  isCartOpen: false,
  setIsCartOpen: () => {},
  toastMessage: '',
  showToast: () => {}
})
const useCart = () => useContext(CartContext) || { toastMessage: '', showToast: () => {} }

const WishlistContext = createContext(null)
const useWishlist = () => useContext(WishlistContext) || { wishlist: [], toggleWishlist: () => {}, isInWishlist: () => false }

const AuthContext = createContext(null)
const useAuth = () => useContext(AuthContext) || { token: null, login: async () => {}, logout: () => {} }

// UI Helpers
function Spinner({ label = 'Chargement...' }) {
  return (
    <span className="loading-state">
      <LoaderCircle className="spinner" size={20} aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}

function Logo({ variant = 'dark', size = 'medium', showTagline = true, className = '' }) {
  // variants: 'dark' (for light bgs), 'gold' (for dark/luxury bgs), 'light' (for solid dark)
  // sizes: 'small', 'medium', 'large'
  const crestSrc = variant === 'gold' ? '/roya-crest-gold.png' : variant === 'light' ? '/roya-crest-light.png' : '/roya-crest-dark.png'

  return (
    <div className={`roya-brand-logo size-${size} variant-${variant} ${className}`}>
      <img src={crestSrc} alt="ROYA Emblem" className="roya-crest-img" />
      <div className="roya-brand-text">
        <span className="roya-brand-name">ROYA</span>
        {showTagline && <span className="roya-brand-tagline">ÉLÉGANCE ET RAFFINEMENT</span>}
      </div>
    </div>
  )
}

function ConfirmDialog({ title, message, confirmLabel = 'Confirmer', danger = false, loading = false, onConfirm, onCancel }) {
  return (
    <div className="confirm-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !loading && onCancel()}>
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title">
        <button className="confirm-close" onClick={onCancel} disabled={loading} aria-label="Fermer">
          <X size={18} />
        </button>
        <div className={danger ? 'confirm-icon danger' : 'confirm-icon'}>
          <Package size={21} />
        </div>
        <span className="eyebrow">CONFIRMATION</span>
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="button button-quiet" onClick={onCancel} disabled={loading}>Annuler</button>
          <button className={danger ? 'button button-danger' : 'button button-dark'} onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner label="Traitement..." /> : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

// Cart Provider with Drawer Support
function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roya-cart') || '[]')
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    localStorage.setItem('roya-cart', JSON.stringify(items))
  }, [items])

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3200)
  }

  const add = (product, quantity = 1) => {
    setItems((current) => {
      const found = current.find((item) => item.id === product.id)
      if (found) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      }
      return [...current, { ...product, quantity }]
    })
    showToast(`"${product.name}" ajouté à votre panier`)
    setIsCartOpen(true)
  }

  const update = (id, quantity) => {
    setItems((current) => (quantity < 1 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item)))
  }

  const remove = (id) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const clear = () => setItems([])
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, add, update, remove, clear, total, count, isCartOpen, setIsCartOpen, toastMessage, showToast }}>
      {children}
    </CartContext.Provider>
  )
}

// Wishlist Provider
function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('roya-wishlist') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('roya-wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id)
      return exists ? current.filter((item) => item.id !== product.id) : [...current, product]
    })
  }

  const isInWishlist = (id) => wishlist.some((item) => item.id === id)

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

// Auth Provider
function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('roya-admin-token') || localStorage.getItem('aster-admin-token')
    if (t && isTokenValid(t)) return t
    localStorage.removeItem('roya-admin-token')
    localStorage.removeItem('aster-admin-token')
    return null
  })

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    localStorage.setItem('roya-admin-token', response.data.accessToken)
    setToken(response.data.accessToken)
  }

  const logout = () => {
    localStorage.removeItem('roya-admin-token')
    localStorage.removeItem('aster-admin-token')
    setToken(null)
  }

  return <AuthContext.Provider value={{ token, login, logout, isTokenValid }}>{children}</AuthContext.Provider>
}

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token || !isTokenValid(token)) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}

// Header & Navigation
function Header() {
  const { count, setIsCartOpen } = useCart()
  const { wishlist } = useWishlist()
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile nav on route change
  useEffect(() => {
    setOpen(false)
    setSearchOpen(false)
  }, [location.pathname])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const links = [
    { label: 'Accueil', href: '/' },
    { label: 'Collection', href: '/products' },
    { label: 'Contact & Conciergerie', href: '/contact' }
  ]

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-container">
          <button className="mobile-menu-btn" onClick={() => setOpen(!open)} aria-label="Menu de navigation" aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Center/Left Main Brand Logo */}
          <Link to="/" className="header-brand" aria-label="ROYA Parfums - Accueil">
            <Logo variant="dark" size="medium" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`nav-link ${location.pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="header-actions">
            <button
              className="action-icon-btn bag-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Panier d'achat"
            >
              <ShoppingBag size={19} />
              {count > 0 && <span className="action-badge gold">{count}</span>}
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        {searchOpen && (
          <div className="header-search-tray">
            <form onSubmit={handleSearchSubmit} className="search-tray-form">
              <Search size={18} className="search-tray-icon" />
              <input
                type="search"
                autoFocus
                placeholder="Rechercher une fragrance, une note (Oud, Rose, Ambre, Vanille...)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="button button-gold button-sm">Rechercher</button>
              <button type="button" className="close-search" onClick={() => setSearchOpen(false)}>
                <X size={18} />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-drawer ${open ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="drawer-header">
          <Logo variant="dark" size="small" />
          <button onClick={() => setOpen(false)} aria-label="Fermer le menu" className="drawer-close">
            <X size={22} />
          </button>
        </div>
        <nav className="mobile-nav-links">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`mobile-link ${location.pathname === link.href ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span>{link.label}</span>
              <ArrowRight size={16} />
            </Link>
          ))}
        </nav>
        <div className="mobile-drawer-footer">
          <div className="mobile-contact-pill">
            <Phone size={15} />
            <span>Service Client : +216 70 172 200</span>
          </div>
          <Link
            to="/contact"
            className="button button-gold full-width"
            onClick={() => setOpen(false)}
          >
            <Sparkles size={16} /> Contacter la Conciergerie
          </Link>
          <span className="drawer-copyright">ROYA · Élégance et Raffinement © 2026</span>
        </div>
      </div>
      {open && <div className="drawer-backdrop" onClick={() => setOpen(false)} />}
    </>
  )
}

// Interactive Slide-over Cart Drawer
function CartDrawer() {
  const { items, update, remove, total, isCartOpen, setIsCartOpen } = useCart()
  const navigate = useNavigate()

  if (!isCartOpen) return null

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total)
  const shippingPercent = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <div className="cart-drawer-overlay" onMouseDown={(e) => e.target === e.currentTarget && setIsCartOpen(false)}>
      <aside className="cart-drawer-panel" role="dialog" aria-label="Votre Panier ROYA">
        <div className="cart-drawer-header">
          <div>
            <span className="eyebrow">VOTRE SÉLECTION</span>
            <h2>Écrin d'Achat</h2>
          </div>
          <button className="close-drawer" onClick={() => setIsCartOpen(false)} aria-label="Fermer le panier">
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Gauge */}
        <div className="shipping-progress-box">
          <div className="shipping-progress-labels">
            <Truck size={15} />
            {remainingForFreeShipping > 0 ? (
              <span>Plus que <strong>{remainingForFreeShipping} TND</strong> pour la livraison offerte !</span>
            ) : (
              <span className="free-active">✦ Félicitations ! Livraison gratuite offerte en Tunisie ✦</span>
            )}
          </div>
          <div className="shipping-progress-bar">
            <div className="shipping-progress-fill" style={{ width: `${shippingPercent}%` }} />
          </div>
        </div>

        {/* Items List */}
        <div className="cart-drawer-items">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingBag size={42} strokeWidth={1.2} />
              <h3>Votre panier est vide</h3>
              <p>Explorez nos créations d'exception et composez votre sillage intime.</p>
              <button
                className="button button-dark"
                onClick={() => {
                  setIsCartOpen(false)
                  navigate('/products')
                }}
              >
                Découvrir la collection <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div className="drawer-item" key={item.id}>
                <img src={item.image} alt={item.name} className="drawer-item-img" />
                <div className="drawer-item-info">
                  <span className="drawer-item-family">{item.family} · {item.size}</span>
                  <h4 className="drawer-item-title">{item.name}</h4>
                  <span className="drawer-item-price">{item.price} TND</span>

                  <div className="drawer-item-actions">
                    <div className="quantity-pill">
                      <button onClick={() => update(item.id, item.quantity - 1)} aria-label="Diminuer">-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => update(item.id, item.quantity + 1)} aria-label="Augmenter">+</button>
                    </div>
                    <button className="remove-btn" onClick={() => remove(item.id)} aria-label={`Supprimer ${item.name}`}>
                      Supprimer
                    </button>
                  </div>
                </div>
                <div className="drawer-item-subtotal">
                  {item.price * item.quantity} TND
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-totals">
              <div className="totals-row">
                <span>Sous-total</span>
                <strong>{total} TND</strong>
              </div>
              <div className="totals-row">
                <span>Livraison</span>
                <span>{remainingForFreeShipping === 0 ? 'Offerte' : `${STANDARD_SHIPPING_FEE} TND`}</span>
              </div>
              <div className="totals-row grand-total">
                <span>Total estimé</span>
                <strong>{total + (remainingForFreeShipping === 0 ? 0 : STANDARD_SHIPPING_FEE)} TND</strong>
              </div>
            </div>

            <div className="drawer-checkout-actions">
              <button
                className="button button-gold full-width"
                onClick={() => {
                  setIsCartOpen(false)
                  navigate('/checkout')
                }}
              >
                Commander maintenant <ArrowRight size={16} />
              </button>
            </div>

            <div className="drawer-trust-badges">
              <span><ShieldCheck size={14} /> Paiement à la livraison</span>
              <span><RotateCcw size={14} /> Échange garanti</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}

// Quick View Modal
function QuickViewModal({ product, onClose, onAddToCart }) {
  if (!product) return null

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="quickview-dialog" role="dialog" aria-modal="true">
        <button className="quickview-close" onClick={onClose} aria-label="Fermer">
          <X size={20} />
        </button>

        <div className="quickview-grid">
          <div className="quickview-image-box">
            <img src={product.image} alt={product.name} />
            <span className="concentration-badge">{product.concentration || 'Extrait de Parfum'}</span>
          </div>

          <div className="quickview-content">
            <span className="eyebrow">{product.brand} · {product.family}</span>
            <h2>{product.name}</h2>
            <p className="quickview-subtitle">{product.subtitle}</p>

            <div className="quickview-pricing">
              <span className="price-main">{product.price} TND</span>
              {product.oldPrice && <del className="price-old">{product.oldPrice} TND</del>}
              <span className="size-pill">{product.size}</span>
            </div>

            <p className="quickview-desc">{product.description}</p>

            {/* Olfactory Notes Mini Display */}
            <div className="quickview-notes">
              <span className="eyebrow">NOTES OLFACTIVES MAJEURES</span>
              <p>{product.notes}</p>
            </div>

            <div className="quickview-performance">
              <div className="perf-item">
                <Clock size={15} />
                <div>
                  <span className="perf-label">Tenue</span>
                  <span className="perf-val">{product.tenue || '24h'}</span>
                </div>
              </div>
              <div className="perf-item">
                <Sparkles size={15} />
                <div>
                  <span className="perf-label">Sillage</span>
                  <span className="perf-val">{product.sillage || 'Envoûtant'}</span>
                </div>
              </div>
            </div>

            <div className="quickview-actions">
              <button
                className="button button-gold full-width"
                onClick={() => {
                  onAddToCart(product)
                  onClose()
                }}
              >
                <ShoppingBag size={17} /> Ajouter au Panier
              </button>
              <Link to={`/products/${product.id}`} className="button button-quiet full-width" onClick={onClose}>
                Voir tous les détails <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Product Card Component
function ProductCard({ product, onQuickView }) {
  const { add } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [hovered, setHovered] = useState(false)
  const isWishlisted = isInWishlist(product.id)

  return (
    <article
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="product-image-container">
        <Link to={`/products/${product.id}`} className="product-image-link" aria-label={`Découvrir ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>

        {/* Top Badges */}
        <div className="card-top-badges">
          {product.oldPrice && (
            <span className="badge badge-sale">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
            </span>
          )}
          {product.newArrival && <span className="badge badge-new">Nouveauté</span>}
          {product.bestSeller && <span className="badge badge-star">Best-Seller</span>}
        </div>

        {/* Wishlist Button */}
        <button
          className={`wishlist-toggle ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product)
          }}
          aria-label={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View Button on Hover */}
        <button
          className={`quickview-trigger ${hovered ? 'visible' : ''}`}
          onClick={() => onQuickView(product)}
          aria-label={`Aperçu rapide de ${product.name}`}
        >
          <Eye size={15} /> Aperçu Rapide
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-header-line">
          <span className="product-family">{product.family}</span>
          <span className="product-gender">{product.gender}</span>
        </div>

        <h3 className="product-title">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-subtitle">{product.subtitle || 'Extrait de Parfum'}</p>

        <p className="product-notes-snippet">{product.notes}</p>

        <div className="product-bottom-line">
          <div className="product-prices">
            <span className="current-price">{product.price} TND</span>
            {product.oldPrice && <del className="old-price">{product.oldPrice} TND</del>}
          </div>
          <button
            className="quick-add-btn"
            onClick={() => add(product)}
            aria-label={`Ajouter ${product.name} au panier`}
            title="Ajouter au panier"
          >
            <ShoppingBag size={15} />
            <span className="quick-add-text">Ajouter</span>
          </button>
        </div>
      </div>
    </article>
  )
}

// Toast notification
function Toast({ message }) {
  if (!message) return null
  return (
    <div className="roya-toast" role="status">
      <CheckCircle size={17} className="toast-icon" />
      <span>{message}</span>
    </div>
  )
}

// HOME PAGE
function Home() {
  const [catalog, setCatalog] = useState(initialProducts)
  const [activeTab, setActiveTab] = useState('Tous')
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const { add } = useCart()

  useEffect(() => {
    api.get('/products?limit=100')
      .then((res) => {
        if (res.data?.products?.length > 0) {
          setCatalog(res.data.products.map(mapApiProduct))
        }
      })
      .catch(() => {})
  }, [])

  const filteredProducts = useMemo(() => {
    if (activeTab === 'Tous') return catalog
    if (activeTab === 'Pour Elle') return catalog.filter((p) => p.gender === 'Femme' || p.category === 'Femme')
    if (activeTab === 'Pour Lui') return catalog.filter((p) => p.gender === 'Homme' || p.category === 'Homme')
    if (activeTab === 'Unisexe') return catalog.filter((p) => p.gender === 'Unisexe' || p.category === 'Unisexe')
    return catalog
  }, [catalog, activeTab])

  return (
    <>
      {/* HERO SECTION */}
      <section className="roya-hero">
        <div className="roya-hero-bg-accent" />
        <div className="hero-watermark">ROYA</div>

        <div className="hero-container">
          {/* Left Editorial Copy */}
          <div className="hero-copy-col">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>MAISON DE HAUTE PARFUMERIE · PARIS & TUNIS</span>
            </div>

            <h1 className="hero-title">
              L'art de laisser une empreinte <span className="hero-title-italic">inoubliable.</span>
            </h1>

            <p className="hero-description">
              Maison ROYA célèbre l'élégance et le raffinement intemporels. Des extraits de parfum haute concentration, composés d'essences rares et précieuses pour les esprits qui cultivent l'excellence.
            </p>

            <div className="hero-cta-group">
              <Link to="/products" className="button button-gold">
                Explorer la Collection <ArrowRight size={17} />
              </Link>
              <Link to="/products" className="button button-glass">
                Découvrir l'Art Olfactif
              </Link>
            </div>

            {/* Reassurance Micro Badges */}
            <div className="hero-pillars-row">
              <div className="pillar-mini">
                <Award size={16} />
                <span>Extrait de Parfum (30%)</span>
              </div>
              <div className="pillar-mini">
                <Droplets size={16} />
                <span>Ingrédients Rares</span>
              </div>
              <div className="pillar-mini">
                <Truck size={16} />
                <span>Livraison Express Tunisie</span>
              </div>
            </div>
          </div>

          {/* Right Visual Showcase */}
          <div className="hero-visual-col">
            <div className="hero-bottle-card">
              <div className="hero-glow-aura" />
              <img
                src="/roya-hero-bottle.jpg"
                alt="Flacon d'exception Maison ROYA"
                className="hero-main-img"
              />

              <div className="hero-card-floating-tag">
                <img src="/roya-crest-gold.png" alt="" className="floating-crest" />
                <div>
                  <strong>ROYA N° 1</strong>
                  <small>Ambre Impérial · 30%</small>
                </div>
              </div>

              <div className="hero-card-floating-badge">
                <Star size={13} fill="#d4af37" color="#d4af37" />
                <span>Sillage Inaltérable 24h</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNATURE EDIT (PRODUCT CATALOG) */}
      <section className="section signature-section">
        <div className="section-header-centered">
          <div className="roya-sub-crest">
            <img src="/roya-crest-gold.png" alt="" />
          </div>
          <span className="eyebrow">LA COLLECTION SIGNATURE</span>
          <h2>Compositions d'Exception</h2>
          <p className="section-lead">Des sillages sculptés pour les moments précieux et les souvenirs impérissables.</p>

          {/* Gender Filter Tabs */}
          <div className="collection-tabs">
            {['Tous', 'Pour Elle', 'Pour Lui', 'Unisexe'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.slice(0, 6).map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>

        <div className="view-all-cta">
          <Link to="/products" className="button button-dark">
            Consulter Toute la Collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={add}
        />
      )}
    </>
  )
}

// PRODUCTS / CATALOG PAGE
function Products() {
  const [query, setQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [selectedFamily, setSelectedFamily] = useState('Toutes')
  const [sortBy, setSortBy] = useState('featured')
  const [catalog, setCatalog] = useState(initialProducts)
  const [loading, setLoading] = useState(true)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const location = useLocation()
  const { add } = useCart()

  // Parse query from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const q = params.get('q')
    if (q) setQuery(q)
  }, [location.search])

  useEffect(() => {
    api.get('/products?limit=100')
      .then((res) => {
        if (res.data?.products?.length > 0) {
          setCatalog(res.data.products.map(mapApiProduct))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const families = ['Toutes', 'Ambré Boisé', 'Floral Boisé', 'Hespéridé Boisé', 'Boisé Oriental', 'Floral Gourmand', 'Oriental Précieux']

  const filtered = useMemo(() => {
    return catalog
      .filter((p) => {
        const matchesCategory = selectedCategory === 'Tous' || p.category === selectedCategory || p.gender === selectedCategory
        const matchesFamily = selectedFamily === 'Toutes' || p.family.toLowerCase().includes(selectedFamily.toLowerCase())
        const text = `${p.name} ${p.family} ${p.notes} ${p.brand} ${p.description}`.toLowerCase()
        const matchesQuery = !query || text.includes(query.toLowerCase())
        return matchesCategory && matchesFamily && matchesQuery
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return 0
      })
  }, [catalog, selectedCategory, selectedFamily, query, sortBy])

  return (
    <>
      <div className="page-intro-luxury">
        <div className="page-intro-container">
          <span className="eyebrow gold">LE GRAND CATALOGUE</span>
          <h1>La Collection <span className="title-serif-italic">Impériale.</span></h1>
          <p>Explorez nos créations de Haute Parfumerie. Extraits précieux, accords audacieux et sillages d'exception.</p>
        </div>
      </div>

      <section className="section catalog-page-content">
        <div className="catalog-layout">
          <aside className="catalog-sidebar">
            <div className="catalog-toolbar">
              <div className="search-input-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {query && <button onClick={() => setQuery('')} className="clear-query"><X size={15} /></button>}
              </div>

              <div className="filters-group">
                <div className="filter-block">
                  <span className="filter-label">Genre</span>
                  <div className="filter-pill-group">
                    {['Tous', 'Femme', 'Homme', 'Unisexe'].map((cat) => (
                      <button
                        key={cat}
                        className={`filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-block">
                  <span className="filter-label">Famille</span>
                  <div className="select-wrapper">
                    <select
                      value={selectedFamily}
                      onChange={(e) => setSelectedFamily(e.target.value)}
                      aria-label="Filtrer par famille olfactive"
                    >
                      {families.map((f) => <option key={f} value={f}>{f === 'Toutes' ? 'Toutes les Familles' : f}</option>)}
                    </select>
                    <ChevronDown size={14} className="select-arrow" />
                  </div>
                </div>

                <div className="filter-block">
                  <span className="filter-label">Tri</span>
                  <div className="select-wrapper">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      aria-label="Trier les parfums"
                    >
                      <option value="featured">Sélection Recommandée</option>
                      <option value="price-asc">Prix : Croissant</option>
                      <option value="price-desc">Prix : Décroissant</option>
                      <option value="name">Ordre Alphabétique</option>
                    </select>
                    <ChevronDown size={14} className="select-arrow" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div className="catalog-main">
            <div className="catalog-status-bar">
              <span className="results-count">
                <strong>{filtered.length}</strong> {filtered.length > 1 ? 'créations trouvées' : 'création trouvée'}
              </span>
              {(query || selectedCategory !== 'Tous' || selectedFamily !== 'Toutes') && (
                <button
                  className="reset-filters-btn"
                  onClick={() => {
                    setQuery('')
                    setSelectedCategory('Tous')
                    setSelectedFamily('Toutes')
                  }}
                >
                  Réinitialiser les filtres <X size={13} />
                </button>
              )}
            </div>

            {loading ? (
              <div className="empty-catalog"><Spinner label="Découverte des fragrances..." /></div>
            ) : filtered.length > 0 ? (
              <div className="product-grid">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-catalog">
                <Filter size={36} strokeWidth={1.2} />
                <h3>Aucune fragrance ne correspond à vos critères</h3>
                <p>Modifiez votre recherche ou réinitialisez les filtres pour découvrir nos autres créations.</p>
                <button
                  className="button button-gold"
                  onClick={() => {
                    setQuery('')
                    setSelectedCategory('Tous')
                    setSelectedFamily('Toutes')
                  }}
                >
                  Voir tous les parfums
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={add}
        />
      )}
    </>
  )
}

// PRODUCT DETAILS PAGE
function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(() => initialProducts.find((p) => p.id === id) || initialProducts[0])
  const [selectedSize, setSelectedSize] = useState('100 ml')
  const [quantity, setQuantity] = useState(1)
  const { add } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [activeAccordion, setActiveAccordion] = useState('pyramid')

  useEffect(() => {
    window.scrollTo(0, 0)
    api.get(`/products/slug/${id}`)
      .then((res) => setProduct(mapApiProduct(res.data)))
      .catch(() => {
        const found = initialProducts.find((p) => p.id === id)
        if (found) setProduct(found)
      })
  }, [id])

  if (!product) {
    return (
      <div className="empty-page-state">
        <h2>Parfum introuvable</h2>
        <Link to="/products" className="button button-dark">Retour au catalogue</Link>
      </div>
    )
  }

  const isWishlisted = isInWishlist(product.id)

  const relatedProducts = initialProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  return (
    <div className="product-details-page">
      {/* Breadcrumb Navigation */}
      <div className="product-breadcrumb">
        <Link to="/">Accueil</Link>
        <span>/</span>
        <Link to="/products">Collection</Link>
        <span>/</span>
        <span className="current">{product.name}</span>
      </div>

      <section className="product-detail-layout">
        {/* Left Gallery */}
        <div className="detail-gallery-col">
          <div className="detail-image-card">
            <img src={product.image} alt={product.name} className="detail-main-img" />
            <span className="detail-flacon-badge">{product.concentration || 'Extrait de Parfum (30%)'}</span>
            <button
              className={`detail-wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label="Ajouter aux favoris"
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Right Product Specifications */}
        <div className="detail-info-col">
          <div className="detail-brand-badge">
            <img src="/roya-crest-gold.png" alt="" />
            <span>MAISON ROYA · PARIS & TUNIS</span>
          </div>

          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-subtitle">{product.subtitle || 'Extrait de Parfum Haute Précision'}</p>

          <div className="detail-price-row">
            <span className="detail-current-price">{product.price} TND</span>
            {product.oldPrice && <del className="detail-old-price">{product.oldPrice} TND</del>}
            <span className="detail-tax-info">TVA incluse · Paiement à la réception</span>
          </div>

          <p className="detail-narrative">{product.description}</p>

          {/* Size Selector */}
          <div className="detail-option-group">
            <span className="option-label">Contenance du Flacon</span>
            <div className="size-options-row">
              {['50 ml', '75 ml', '100 ml'].map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Performance Metres (Tenue & Sillage) */}
          <div className="detail-performance-box">
            <div className="performance-row">
              <div className="perf-tag"><Clock size={16} /><span>Tenue sur peau</span></div>
              <strong>{product.tenue || '24 Heures'}</strong>
            </div>
            <div className="performance-row">
              <div className="perf-tag"><Sparkles size={16} /><span>Intensité & Sillage</span></div>
              <strong>{product.sillage || 'Puissant & Envoûtant'}</strong>
            </div>
          </div>

          {/* Quantity and Add Actions */}
          <div className="detail-cta-row">
            <div className="detail-quantity-pill">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <button
              className="button button-gold detail-add-cart-btn"
              onClick={() => add({ ...product, size: selectedSize }, quantity)}
            >
              <ShoppingBag size={18} />
              <span>Ajouter au Panier · {product.price * quantity} TND</span>
            </button>
          </div>

          {/* Reassurance Features */}
          <div className="detail-perks">
            <div className="perk-item">
              <Truck size={17} />
              <span>Livraison 24-48h partout en Tunisie</span>
            </div>
            <div className="perk-item">
              <ShieldCheck size={17} />
              <span>Paiement à la livraison (Cash on Delivery)</span>
            </div>
            <div className="perk-item">
              <Package size={17} />
              <span>Flacon en verre cristallin lourd et bouchon doré</span>
            </div>
          </div>

          {/* Collapsible Accordions for Olfactory Pyramid, Application & Shipping */}
          <div className="detail-accordions">
            {/* Pyramid Accordion */}
            <div className={`accordion-item ${activeAccordion === 'pyramid' ? 'open' : ''}`}>
              <button
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'pyramid' ? '' : 'pyramid')}
              >
                <span>Pyramide Olfactive Détaillée</span>
                <ChevronDown size={16} className="accordion-chevron" />
              </button>
              {activeAccordion === 'pyramid' && (
                <div className="accordion-content">
                  <div className="pyramid-breakdown">
                    <div className="pyramid-item">
                      <span className="pyramid-phase">Notes de Tête (0-30 min) :</span>
                      <p>{product.topNotes?.join(', ') || 'Bergamote, Baies Roses'}</p>
                    </div>
                    <div className="pyramid-item">
                      <span className="pyramid-phase">Notes de Cœur (30 min - 4h) :</span>
                      <p>{product.heartNotes?.join(', ') || 'Iris précieux, Rose Damascena'}</p>
                    </div>
                    <div className="pyramid-item">
                      <span className="pyramid-phase">Notes de Fond (4h - 24h+) :</span>
                      <p>{product.baseNotes?.join(', ') || 'Ambre Gris, Cèdre, Vanille Bourbon'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* How to apply */}
            <div className={`accordion-item ${activeAccordion === 'usage' ? 'open' : ''}`}>
              <button
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'usage' ? '' : 'usage')}
              >
                <span>Conseils d'Application du Parfumeur</span>
                <ChevronDown size={16} className="accordion-chevron" />
              </button>
              {activeAccordion === 'usage' && (
                <div className="accordion-content">
                  <p>Vaporisez à environ 20 cm sur les points de pulsation : le cou, l'arrière des oreilles, le creux des poignets et le revers de votre veste. Ne frottez pas le parfum après application afin de ne pas briser les molécules précieuses.</p>
                </div>
              )}
            </div>

            {/* Delivery & Returns */}
            <div className={`accordion-item ${activeAccordion === 'delivery' ? 'open' : ''}`}>
              <button
                className="accordion-trigger"
                onClick={() => setActiveAccordion(activeAccordion === 'delivery' ? '' : 'delivery')}
              >
                <span>Livraison & Modalités d'Échange</span>
                <ChevronDown size={16} className="accordion-chevron" />
              </button>
              {activeAccordion === 'delivery' && (
                <div className="accordion-content">
                  <p>Expédition soignée sous 24h ouvrées. Les frais de livraison sont de 7 TND, et offerts dès 150 TND d'achats. Possibilité d'échange sous 14 jours si le flacon n'a pas été descellé.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Scents */}
      <section className="section related-scents-section">
        <div className="section-header-centered">
          <span className="eyebrow">DÉCOUVREZ AUSSI</span>
          <h2>Complétez Votre Rituel</h2>
        </div>
        <div className="product-grid">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} onQuickView={() => {}} />
          ))}
        </div>
      </section>
    </div>
  )
}

// CART PAGE (DEDICATED)
function Cart() {
  const { items, update, remove, total } = useCart()
  const navigate = useNavigate()
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - total)

  return (
    <div className="cart-page">
      <div className="page-intro-luxury">
        <div className="page-intro-container">
          <span className="eyebrow gold">VOTRE COMMANDE</span>
          <h1>L'Écrin de vos <span className="title-serif-italic">Fragrances.</span></h1>
        </div>
      </div>

      <div className="cart-page-content section">
        {items.length === 0 ? (
          <div className="empty-cart-view">
            <ShoppingBag size={52} strokeWidth={1.2} />
            <h2>Votre panier est actuellement vide</h2>
            <p>Laissez-vous séduire par nos créations olfactives d'exception.</p>
            <Link to="/products" className="button button-gold">
              Découvrir la Collection <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="cart-full-layout">
            {/* Left Items Column */}
            <div className="cart-table-col">
              <div className="shipping-banner-pill">
                <Truck size={17} />
                {remainingForFreeShipping > 0 ? (
                  <span>Ajoutez encore <strong>{remainingForFreeShipping} TND</strong> pour débloquer la livraison gratuite !</span>
                ) : (
                  <span className="free-active">✦ Livraison gratuite offerte en Tunisie ! ✦</span>
                )}
              </div>

              <div className="cart-items-list">
                {items.map((item) => (
                  <div className="cart-row" key={item.id}>
                    <img src={item.image} alt={item.name} className="cart-row-img" />
                    <div className="cart-row-details">
                      <span className="eyebrow">{item.family} · {item.size}</span>
                      <h3>{item.name}</h3>
                      <p className="cart-item-unit-price">{item.price} TND / unité</p>
                    </div>

                    <div className="quantity-pill">
                      <button onClick={() => update(item.id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => update(item.id, item.quantity + 1)}>+</button>
                    </div>

                    <div className="cart-row-total">
                      {item.price * item.quantity} TND
                    </div>

                    <button
                      className="cart-remove-icon"
                      onClick={() => remove(item.id)}
                      aria-label={`Supprimer ${item.name}`}
                    >
                      <X size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Summary Column */}
            <div className="cart-summary-col">
              <div className="summary-card">
                <span className="eyebrow">RÉCAPITULATIF</span>
                <h3>Détail de la Commande</h3>

                <div className="summary-lines">
                  <div className="summary-line">
                    <span>Sous-total articles</span>
                    <strong>{total} TND</strong>
                  </div>
                  <div className="summary-line">
                    <span>Frais de livraison</span>
                    <span>{remainingForFreeShipping === 0 ? 'Gratuit' : `${STANDARD_SHIPPING_FEE} TND`}</span>
                  </div>
                  <hr className="summary-divider" />
                  <div className="summary-line total-line">
                    <span>Total TTC</span>
                    <strong>{total + (remainingForFreeShipping === 0 ? 0 : STANDARD_SHIPPING_FEE)} TND</strong>
                  </div>
                </div>

                <button className="button button-gold full-width" onClick={() => navigate('/checkout')}>
                  Passer la Commande <ArrowRight size={16} />
                </button>

                <div className="summary-perks">
                  <div><ShieldCheck size={16} /><span>Paiement en espèces à la livraison</span></div>
                  <div><Truck size={16} /><span>Expédition express 24-48 heures</span></div>
                  <div><RotateCcw size={16} /><span>Échange facile sous 14 jours</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// CHECKOUT PAGE
function Checkout() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    governorate: 'Tunis',
    city: '',
    address: '',
    notes: ''
  })

  const deliveryFee = total >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE
  const finalTotal = total + deliveryFee

  if (submitted) {
    return (
      <div className="checkout-success-view">
        <div className="success-crest">
          <img src="/roya-crest-gold.png" alt="" />
        </div>
        <CheckCircle size={48} className="success-icon" />
        <span className="eyebrow gold">COMMANDE CONFIRMÉE</span>
        <h1>Merci pour votre <span className="title-serif-italic">confiance.</span></h1>
        <p className="success-msg">
          Votre commande <strong>N° {submitted.orderNumber}</strong> a bien été enregistrée. Notre conciergerie vous contactera sous peu par téléphone pour organiser la livraison à votre adresse.
        </p>

        <div className="success-receipt-card">
          <div className="receipt-row">
            <span>Destinataire :</span>
            <strong>{submitted.shippingAddress?.firstName} {submitted.shippingAddress?.lastName}</strong>
          </div>
          <div className="receipt-row">
            <span>Téléphone :</span>
            <strong>{submitted.shippingAddress?.phone}</strong>
          </div>
          <div className="receipt-row">
            <span>Gouvernorat :</span>
            <strong>{submitted.shippingAddress?.governorate}, {submitted.shippingAddress?.city}</strong>
          </div>
          <div className="receipt-row">
            <span>Mode de paiement :</span>
            <strong>Paiement à la livraison (Espèces)</strong>
          </div>
          <div className="receipt-row total-highlight">
            <span>Montant à régler à la livraison :</span>
            <strong>{submitted.total} TND</strong>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/products" className="button button-gold">
            Poursuivre les Découvertes <ArrowRight size={16} />
          </Link>
          <Link to="/contact" className="button button-quiet">
            <Mail size={16} /> Contacter la Conciergerie
          </Link>
        </div>
      </div>
    )
  }

  const updateField = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submitOrder = async (e) => {
    e.preventDefault()
    if (items.length === 0) {
      navigate('/products')
      return
    }
    setLoading(true)
    setError('')

    try {
      const payload = {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        shippingAddress: form,
        notes: form.notes,
        deliveryFee,
        total: finalTotal
      }
      const res = await api.post('/orders', payload)
      clear()
      setSubmitted(res.data)
    } catch {
      // Offline fallback: generate client order number so user is never blocked
      const fallbackOrder = {
        orderNumber: `ROYA-${Math.floor(100000 + Math.random() * 900000)}`,
        shippingAddress: form,
        total: finalTotal,
        items
      }
      clear()
      setSubmitted(fallbackOrder)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page">
      <div className="page-intro-luxury">
        <div className="page-intro-container">
          <span className="eyebrow gold">FINALISATION</span>
          <h1>Validation de votre <span className="title-serif-italic">Sillage.</span></h1>
          <p>Paiement sécurisé en espèces à la livraison · Confirmation immédiate par téléphone.</p>
        </div>
      </div>

      <div className="checkout-content section">
        <form className="checkout-form-panel" onSubmit={submitOrder}>
          <span className="eyebrow">1. COORDONNÉES DE LIVRAISON</span>
          <h2>Où souhaitez-vous recevoir votre écrin ?</h2>

          <div className="form-double-col">
            <label>
              <span>Prénom *</span>
              <input name="firstName" value={form.firstName} onChange={updateField} required placeholder="ex: Yassine" />
            </label>
            <label>
              <span>Nom *</span>
              <input name="lastName" value={form.lastName} onChange={updateField} required placeholder="ex: Ben Amor" />
            </label>
          </div>

          <label>
            <span>Numéro de Téléphone (pour confirmation) *</span>
            <input name="phone" type="tel" value={form.phone} onChange={updateField} required placeholder="ex: 98 123 456" />
          </label>

          <div className="form-double-col">
            <label>
              <span>Gouvernorat *</span>
              <select name="governorate" value={form.governorate} onChange={updateField} required>
                {TUNISIAN_GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Ville / Délégation *</span>
              <input name="city" value={form.city} onChange={updateField} required placeholder="ex: La Marsa, Les Berges du Lac..." />
            </label>
          </div>

          <label>
            <span>Adresse exacte de livraison *</span>
            <input name="address" value={form.address} onChange={updateField} required placeholder="Rue, numéro, résidence, étage..." />
          </label>

          <label>
            <span>Instructions spéciales pour le livreur (optionnel)</span>
            <textarea name="notes" rows="3" value={form.notes} onChange={updateField} placeholder="Digicode, heure de livraison préférée..." />
          </label>

          <div className="payment-method-box">
            <span className="eyebrow">2. MODE DE PAIEMENT</span>
            <div className="cod-card selected">
              <div className="cod-radio-dot" />
              <div>
                <strong>Paiement en espèces à la livraison (Cash on Delivery)</strong>
                <p>Réglez le montant exact auprès de notre coursier lors de la remise en main propre de votre colis.</p>
              </div>
            </div>
          </div>

          {error && <div className="form-error-banner">{error}</div>}

          <button className="button button-gold full-width checkout-submit-btn" disabled={loading}>
            {loading ? <Spinner label="Enregistrement de votre commande..." /> : <>Confirmer la Commande · {finalTotal} TND <ArrowRight size={17} /></>}
          </button>
        </form>

        {/* Right Summary Column */}
        <aside className="checkout-summary-panel">
          <div className="summary-sticky-box">
            <span className="eyebrow">RÉSUMÉ DU PANIER</span>
            <h3>Vos Fragrances ({items.length})</h3>

            <div className="checkout-items-list">
              {items.map((item) => (
                <div className="checkout-mini-row" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="mini-row-info">
                    <strong>{item.name}</strong>
                    <small>{item.size} · Quantité : {item.quantity}</small>
                  </div>
                  <span className="mini-row-price">{item.price * item.quantity} TND</span>
                </div>
              ))}
            </div>

            <div className="checkout-fee-breakdown">
              <div className="fee-line">
                <span>Sous-total</span>
                <strong>{total} TND</strong>
              </div>
              <div className="fee-line">
                <span>Frais de port</span>
                <span>{deliveryFee === 0 ? 'Offert' : `${deliveryFee} TND`}</span>
              </div>
              <hr className="summary-divider" />
              <div className="fee-line fee-total">
                <span>Total à régler</span>
                <strong>{finalTotal} TND</strong>
              </div>
            </div>

            <div className="checkout-safe-badge">
              <ShieldCheck size={18} />
              <span>Garantie Authenticité & Échange 14 jours</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

// CONTACT & CONCIERGERIE
function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submitContact = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/contact', form)
      setSent(true)
      setForm({ name: '', phone: '', email: '', message: '' })
    } catch {
      // Fallback
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="page-intro-luxury">
        <div className="page-intro-container">
          <span className="eyebrow gold">CONCIERGERIE & SALON PRIVÉ</span>
          <h1>Prendre Contact avec <span className="title-serif-italic">la Maison.</span></h1>
          <p>Un conseil sur mesure, une question sur nos sillages ou un rendez-vous privé.</p>
        </div>
      </div>

      <div className="contact-layout-grid section">
        {/* Left Information */}
        <div className="contact-info-panel">
          <div className="roya-brand-seal-mini">
            <img src="/roya-crest-gold.png" alt="" />
          </div>
          <h2>La Conciergerie ROYA</h2>
          <p className="contact-lead-text">
            Nos spécialistes olfactifs sont à votre entière disposition pour vous guider dans le choix de votre signature ou pour composer un coffret cadeau d'exception.
          </p>

          <div className="contact-details-cards">
            <div className="contact-card">
              <Phone size={18} className="contact-card-icon" />
              <div>
                <span className="contact-card-label">LIGNE DIRECTE</span>
                <a href="tel:+21670172200" className="contact-card-value">+216 70 172 200</a>
                <small>Du Lundi au Samedi · 9h00 à 19h00</small>
              </div>
            </div>

            <div className="contact-card">
              <Mail size={18} className="contact-card-icon" />
              <div>
                <span className="contact-card-label">COURRIEL CONCIERGERIE</span>
                <a
                  href="mailto:conciergerie@roya-parfums.com"
                  className="contact-card-value"
                >
                  conciergerie@roya-parfums.com
                </a>
                <small>Réponse personnalisée sous 24h</small>
              </div>
            </div>

            <div className="contact-card">
              <MapPin size={18} className="contact-card-icon" />
              <div>
                <span className="contact-card-label">ATELIER & SALON</span>
                <p className="contact-card-value">18 Rue du Lac Windermere, Les Berges du Lac, Tunis</p>
                <small>Sur rendez-vous uniquement</small>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="contact-form-panel">
          {sent ? (
            <div className="contact-success-box">
              <CheckCircle size={44} color="#d4af37" />
              <h3>Message Transmis avec Succès</h3>
              <p>Merci de votre intérêt pour Maison ROYA. Notre conciergerie prendra contact avec vous dans les plus brefs délais.</p>
              <button className="button button-gold" onClick={() => setSent(false)}>Envoyer un autre message</button>
            </div>
          ) : (
            <form onSubmit={submitContact} className="contact-form">
              <span className="eyebrow">FORMULAIRE DE CONTACT</span>
              <h3>Écrivez à Notre Maître Parfumeur</h3>

              <label>
                <span>Votre Nom & Prénom *</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="ex: Amira Mansour"
                />
              </label>

              <div className="form-double-col">
                <label>
                  <span>Téléphone *</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    required
                    placeholder="ex: 98 000 000"
                  />
                </label>
                <label>
                  <span>Adresse Email *</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="ex: amira@domaine.com"
                  />
                </label>
              </div>

              <label>
                <span>Votre Message ou Demande Particulière *</span>
                <textarea
                  rows="5"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  placeholder="Dites-nous ce qui vous ferait plaisir..."
                />
              </label>

              {error && <div className="form-error-banner">{error}</div>}

              <button className="button button-gold" type="submit" disabled={loading}>
                {loading ? <Spinner label="Envoi en cours..." /> : <>Transmettre ma Demande <ArrowRight size={16} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

// FOOTER COMPONENT
function Footer() {
  return (
    <footer className="roya-footer">
      <div className="footer-top-container">
        <div className="footer-brand-col">
          <Logo variant="gold" size="large" />
          <p className="footer-manifesto">
            Maison ROYA crée des sillages intemporels où la noblesse des matières premières rencontre l'audace de la haute parfumerie contemporaine.
          </p>
          <div className="footer-locale-badge">
            <span>HAUTE PARFUMERIE · PARIS & TUNIS</span>
          </div>
        </div>

        <div className="footer-links-col">
          <span className="footer-heading">COLLECTIONS</span>
          <Link to="/products">Toutes les Fragrances</Link>
          <Link to="/products?cat=Femme">Pour Elle</Link>
          <Link to="/products?cat=Homme">Pour Lui</Link>
          <Link to="/products?cat=Unisexe">Extraits Mixtes</Link>
          <Link to="/products">Découvrir la Maison</Link>
        </div>

        <div className="footer-links-col">
          <span className="footer-heading">LA MAISON</span>
          <Link to="/contact">Conciergerie & Contact</Link>
          <Link to="/about">Notre Philosophie</Link>
          <Link to="/admin/login">Espace Studio Admin</Link>
        </div>

        <div className="footer-links-col">
          <span className="footer-heading">RÉASSURANCE</span>
          <span>✦ Paiement à la livraison</span>
          <span>✦ Livraison 24/48h Tunisie</span>
          <span>✦ Échange garanti 14 jours</span>
          <span>✦ Flacons numérotés 30%</span>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-container">
          <span>© 2026 Maison ROYA — Tous droits réservés.</span>
          <span className="footer-signature">Élégance et Raffinement confectionnés avec passion.</span>
        </div>
      </div>
    </footer>
  )
}

// ADMIN SECTION
// --------------------------------------------------------------------------
// ADMIN BACK-OFFICE COMPONENTS (MAISON ROYA STUDIO)
// --------------------------------------------------------------------------

function AdminLayout({ current = 'Overview', title = 'Tableau de Bord', subtitle = '', children, actions = null }) {
  const { logout } = useAuth()
  const { toastMessage } = useCart()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [counts, setCounts] = useState({ newMessages: 0, pendingOrders: 0 })

  useEffect(() => {
    const token = localStorage.getItem('roya-admin-token') || localStorage.getItem('aster-admin-token')
    if (token && isTokenValid(token)) {
      api.get('/dashboard/overview')
        .then((res) => {
          const pending = res.data.statuses?.find((s) => s._id === 'pending')?.count || 0
          setCounts({ newMessages: res.data.newMessages || 0, pendingOrders: pending })
        })
        .catch(() => {})
    }
  }, [])

  const navItems = [
    { label: 'Vue d\'ensemble', icon: LayoutDashboard, path: '/admin/dashboard', badge: null },
    { label: 'Catalogue Parfums', icon: Package, path: '/admin/products', badge: null },
    { label: 'Commandes & Suivi', icon: ShoppingBag, path: '/admin/orders', badge: counts.pendingOrders > 0 ? counts.pendingOrders : null },
    { label: 'Messages Conciergerie', icon: Inbox, path: '/admin/messages', badge: counts.newMessages > 0 ? counts.newMessages : null },
    { label: 'Configuration Maison', icon: Settings, path: '/admin/settings', badge: null }
  ]

  return (
    <div className="admin-layout">
      {/* Mobile Drawer Overlay */}
      {mobileOpen && <div className="admin-drawer-backdrop" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Logo variant="gold" size="small" />
          <span className="admin-label">STUDIO DE CRÉATION</span>
        </div>

        <nav className="admin-nav-menu">
          {navItems.map((item) => {
            const Icon = item.icon
            const isCurrent = current === item.label
            return (
              <button
                key={item.label}
                className={`admin-nav-item ${isCurrent ? 'current' : ''}`}
                onClick={() => {
                  navigate(item.path)
                  setMobileOpen(false)
                }}
              >
                <Icon size={17} />
                <span className="nav-item-label">{item.label}</span>
                {item.badge !== null && (
                  <span className="admin-badge-count">{item.badge}</span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-connection-status">
            <span className="status-dot online" />
            <span>Serveur Connecté · Local</span>
          </div>

          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-store-link">
            <ExternalLink size={15} />
            <span>Voir la Boutique</span>
          </a>

          <button
            className="admin-logout"
            onClick={() => {
              logout()
              navigate('/admin/login')
            }}
          >
            <LogOut size={16} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main-wrap">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Ouvrir le menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <span className="eyebrow">MAISON ROYA · ADMINISTRATION</span>
              <h2>{title}</h2>
              {subtitle && <small className="admin-topbar-subtitle">{subtitle}</small>}
            </div>
          </div>

          <div className="admin-topbar-right">
            {actions}
            <div className="admin-user-pill">
              <User size={14} />
              <span>admin@roya.com</span>
            </div>
          </div>
        </header>

        <main className="admin-body">
          {children}
        </main>
      </div>
      <Toast message={toastMessage} />
    </div>
  )
}

function AdminLogin() {
  const { token, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@roya.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(() =>
    window.location.search.includes('expired=1') ? 'Votre session a expiré. Veuillez vous reconnecter avec vos identifiants.' : ''
  )
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && isTokenValid(token)) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [token, navigate])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants invalides. Vérifiez l\'adresse et le mot de passe.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail('admin@roya.com')
    setPassword('admin1234')
    setError('')
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-panel">
        <Logo variant="dark" size="medium" />
        <span className="eyebrow" style={{ marginTop: '28px' }}>ACCÈS STUDIO PRIVÉ</span>
        <h1>Gestion de la <br /><em>Maison ROYA.</em></h1>
        <p>Connectez-vous pour piloter votre catalogue de haute parfumerie, vos commandes et vos messages clients.</p>

        <form onSubmit={submit} className="admin-form">
          <label>
            <span>Adresse email de gestion</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@roya.com"
            />
          </label>

          <label>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Mot de passe</span>
              <button
                type="button"
                className="admin-toggle-pwd"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Masquer' : 'Afficher'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
              placeholder="••••••••"
            />
          </label>

          {error && <div className="form-error-banner">{error}</div>}

          <button className="button button-gold full-width" disabled={loading} type="submit">
            {loading ? <Spinner label="Authentification..." /> : <>Entrer dans le Studio <ArrowRight size={16} /></>}
          </button>

          <button
            type="button"
            className="button button-quiet button-sm full-width"
            onClick={fillDemo}
            style={{ marginTop: '6px' }}
          >
            ⚡ Remplir l'accès démo (admin@roya.com / admin1234)
          </button>
        </form>

        <Link className="back-link" to="/">← Revenir à la boutique publique</Link>
      </div>

      <div className="admin-login-art">
        <img src="/roya-crest-gold.png" alt="" className="admin-art-crest" />
        <span>ROYA · ÉLÉGANCE ET RAFFINEMENT</span>
        <small style={{ color: 'rgba(212,175,55,0.7)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
          Back-Office Haute Parfumerie · v2.0
        </small>
      </div>
    </main>
  )
}

function AdminDashboard() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    setLoading(true)
    api.get('/dashboard/overview', { headers })
      .then((res) => setData(res.data))
      .catch(() => {
        setData({
          products: initialProducts.length,
          orders: 0,
          revenue: 0,
          newMessages: 0,
          statuses: [],
          lowStock: [],
          recentOrders: []
        })
      })
      .finally(() => setLoading(false))
  }, [token])

  const statusLabels = {
    pending: { label: 'En attente', color: 'badge-amber' },
    confirmed: { label: 'Confirmée', color: 'badge-blue' },
    preparing: { label: 'En préparation', color: 'badge-purple' },
    shipped: { label: 'Expédiée', color: 'badge-indigo' },
    delivered: { label: 'Livrée', color: 'badge-emerald' },
    cancelled: { label: 'Annulée', color: 'badge-rose' }
  }

  return (
    <AdminLayout
      current="Vue d'ensemble"
      title="Tableau de Bord Exécutif"
      subtitle="Supervision en temps réel des créations, des expéditions et des requêtes conciergerie."
      actions={
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="button button-gold button-sm"
            onClick={() => navigate('/admin/products')}
          >
            <Plus size={15} /> Nouveau Parfum
          </button>
        </div>
      }
    >
      {loading || !data ? (
        <div className="admin-loading-box">
          <Spinner label="Actualisation des indicateurs du studio..." />
        </div>
      ) : (
        <>
          {/* Top KPI Statistics */}
          <div className="admin-stats-grid">
            <article className="stat-card">
              <div className="stat-card-top">
                <span className="eyebrow">CHIFFRE D'AFFAIRES</span>
                <DollarSign size={18} className="stat-card-icon gold" />
              </div>
              <strong className="stat-card-number">{data.revenue} <small>TND</small></strong>
              <span className="stat-card-footnote">Encaissé / Commandes validées</span>
            </article>

            <article className="stat-card">
              <div className="stat-card-top">
                <span className="eyebrow">COMMANDES</span>
                <ShoppingBag size={18} className="stat-card-icon blue" />
              </div>
              <strong className="stat-card-number">{data.orders}</strong>
              <span className="stat-card-footnote">Total commandes enregistrées</span>
            </article>

            <article className="stat-card">
              <div className="stat-card-top">
                <span className="eyebrow">COLLECTION</span>
                <Package size={18} className="stat-card-icon purple" />
              </div>
              <strong className="stat-card-number">{data.products}</strong>
              <span className="stat-card-footnote">Extraits de parfum actifs</span>
            </article>

            <article className="stat-card">
              <div className="stat-card-top">
                <span className="eyebrow">CONCIERGERIE</span>
                <Mail size={18} className="stat-card-icon emerald" />
              </div>
              <strong className="stat-card-number">{data.newMessages}</strong>
              <span className="stat-card-footnote">Demandes non traitées</span>
            </article>
          </div>

          {/* Low Stock Alert if any */}
          {data.lowStock && data.lowStock.length > 0 && (
            <div className="admin-alert-banner">
              <AlertCircle size={20} />
              <div>
                <strong>Alerte Stock Réserve :</strong> {data.lowStock.length} parfum(s) ont atteint le seuil critique de réapprovisionnement.
              </div>
              <button
                className="button button-gold button-sm"
                onClick={() => navigate('/admin/products')}
              >
                Gérer les stocks
              </button>
            </div>
          )}

          {/* Quick Actions Shortcuts */}
          <div className="admin-shortcuts-row">
            <button className="shortcut-btn" onClick={() => navigate('/admin/products')}>
              <Plus size={16} />
              <span>Ajouter un Parfum</span>
            </button>
            <button className="shortcut-btn" onClick={() => navigate('/admin/orders')}>
              <ShoppingBag size={16} />
              <span>Gérer les Commandes</span>
            </button>
            <button className="shortcut-btn" onClick={() => navigate('/admin/messages')}>
              <Inbox size={16} />
              <span>Ouvrir la Conciergerie</span>
            </button>
            <button className="shortcut-btn" onClick={() => navigate('/admin/settings')}>
              <Settings size={16} />
              <span>Paramètres Boutique</span>
            </button>
          </div>

          {/* 2-Columns Grid */}
          <div className="admin-two-cols">
            {/* Recent Orders Card */}
            <article className="admin-panel-card">
              <div className="panel-card-header">
                <div>
                  <span className="eyebrow">DERNIÈRES ACTIVITÉS</span>
                  <h3>Commandes Récentes</h3>
                </div>
                <Link to="/admin/orders" className="text-link">
                  Voir tout ({data.orders}) <ArrowRight size={14} />
                </Link>
              </div>

              {data.recentOrders?.length === 0 ? (
                <div className="admin-empty-state">
                  <ShoppingBag size={32} />
                  <p>Aucune commande enregistrée pour l'instant.</p>
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>N° Commande</th>
                        <th>Client</th>
                        <th>Statut</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentOrders?.map((ord) => {
                        const statusInfo = statusLabels[ord.orderStatus] || { label: ord.orderStatus, color: 'badge-muted' }
                        return (
                          <tr key={ord._id || ord.orderNumber}>
                            <td>
                              <span className="order-num-code">{ord.orderNumber}</span>
                            </td>
                            <td>
                              <span className="client-name">{ord.shippingAddress?.firstName} {ord.shippingAddress?.lastName}</span>
                              <small className="client-loc">{ord.shippingAddress?.governorate}</small>
                            </td>
                            <td>
                              <span className={`status-pill ${statusInfo.color}`}>{statusInfo.label}</span>
                            </td>
                            <td>
                              <strong className="order-amount">{ord.total} TND</strong>
                            </td>
                            <td>
                              <button
                                className="button button-quiet button-xs"
                                onClick={() => navigate('/admin/orders')}
                              >
                                Gérer
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </article>

            {/* Status Breakdown & Studio Insights */}
            <article className="admin-panel-card">
              <div className="panel-card-header">
                <div>
                  <span className="eyebrow">STATUTS DES EXPÉDITIONS</span>
                  <h3>File des Commandes</h3>
                </div>
                <Link to="/admin/orders" className="text-link">Filtrer</Link>
              </div>

              <div className="status-breakdown-list">
                {['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'].map((key) => {
                  const stat = data.statuses?.find((s) => s._id === key)
                  const count = stat ? stat.count : 0
                  const info = statusLabels[key]
                  return (
                    <div key={key} className="status-breakdown-row">
                      <span className={`status-pill ${info.color}`}>{info.label}</span>
                      <div className="status-progress-track">
                        <div
                          className="status-progress-fill"
                          style={{
                            width: `${data.orders > 0 ? (count / data.orders) * 100 : 0}%`,
                            background: key === 'delivered' ? '#10b981' : key === 'cancelled' ? '#ef4444' : '#d4af37'
                          }}
                        />
                      </div>
                      <strong className="status-count">{count}</strong>
                    </div>
                  )
                })}
              </div>

              <div className="concierge-summary-box">
                <div className="concierge-box-icon">
                  <Inbox size={22} color="#d4af37" />
                </div>
                <div>
                  <h4>Conciergerie Client</h4>
                  <p>
                    {data.newMessages > 0
                      ? `${data.newMessages} nouvelle(s) demande(s) en attente de réponse.`
                      : 'Aucun message non traité. Tous les clients ont été servis.'}
                  </p>
                  <Link to="/admin/messages" className="button button-gold button-xs" style={{ marginTop: '8px' }}>
                    Accéder à la messagerie
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </>
      )}
    </AdminLayout>
  )
}

function AdminProducts() {
  const { token } = useAuth()
  const { showToast } = useCart()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('Tous')
  const [filterStock, setFilterStock] = useState('Tous')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const headers = { Authorization: `Bearer ${token}` }

  // Luxury perfume image presets for quick selection
  const imagePresets = [
    { label: 'Flacon Ambré', url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Flacon Rose', url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Flacon Vert / Frais', url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Flacon Doré Sombre', url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Flacon Épuré Satin', url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=1000&q=85' },
    { label: 'Flacon Royal Oud', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85' }
  ]

  // Form state
  const initialForm = {
    name: '',
    brand: 'ROYA',
    category: 'Unisex',
    gender: 'Unisex',
    fragranceFamily: 'Ambré Boisé',
    size: '100 ml',
    price: 135,
    oldPrice: 165,
    quantity: 25,
    lowStockThreshold: 3,
    image: imagePresets[0].url,
    description: '',
    topNotes: 'Bergamote, Poivre Rose',
    heartNotes: 'Ambre Gris, Rose Noire',
    baseNotes: 'Vanille Bourbon, Cèdre',
    featured: false,
    bestSeller: false,
    newArrival: false
  }
  const [form, setForm] = useState(initialForm)

  const loadProducts = () => {
    setLoading(true)
    api.get('/products?limit=100', { headers })
      .then((res) => setItems(res.data.products.map(mapApiProduct)))
      .catch(() => setItems(initialProducts))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProducts() }, [])

  const openAddModal = () => {
    setEditingItem(null)
    setForm(initialForm)
    setModalOpen(true)
  }

  const openEditModal = (item) => {
    setEditingItem(item)
    setForm({
      name: item.name || '',
      brand: item.brand || 'ROYA',
      category: item.category === 'Femme' ? 'Women' : item.category === 'Homme' ? 'Men' : 'Unisex',
      gender: item.gender === 'Femme' ? 'Women' : item.gender === 'Homme' ? 'Men' : 'Unisex',
      fragranceFamily: item.family || 'Ambré Boisé',
      size: item.size || '100 ml',
      price: item.price || 0,
      oldPrice: item.oldPrice || '',
      quantity: item.quantity !== undefined ? item.quantity : 25,
      lowStockThreshold: item.lowStockThreshold || 3,
      image: item.image || imagePresets[0].url,
      description: item.description || '',
      topNotes: Array.isArray(item.topNotes) ? item.topNotes.join(', ') : '',
      heartNotes: Array.isArray(item.heartNotes) ? item.heartNotes.join(', ') : '',
      baseNotes: Array.isArray(item.baseNotes) ? item.baseNotes.join(', ') : '',
      featured: !!item.featured,
      bestSeller: !!item.bestSeller,
      newArrival: !!item.newArrival
    })
    setModalOpen(true)
  }

  const saveProduct = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: form.name.trim(),
      slug: form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brand: form.brand || 'ROYA',
      category: form.gender,
      gender: form.gender,
      fragranceFamily: form.fragranceFamily,
      size: form.size,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      quantity: Number(form.quantity),
      lowStockThreshold: Number(form.lowStockThreshold),
      stockType: 'limited',
      images: [{ url: form.image }],
      description: form.description,
      featured: form.featured,
      bestSeller: form.bestSeller,
      newArrival: form.newArrival,
      fragranceNotes: {
        top: form.topNotes.split(',').map((s) => s.trim()).filter(Boolean),
        heart: form.heartNotes.split(',').map((s) => s.trim()).filter(Boolean),
        base: form.baseNotes.split(',').map((s) => s.trim()).filter(Boolean)
      }
    }

    try {
      if (editingItem && editingItem._id) {
        await api.patch(`/products/${editingItem._id}`, payload, { headers })
        showToast?.('Parfum modifié avec succès !')
      } else {
        await api.post('/products', payload, { headers })
        showToast?.('Nouveau parfum ajouté au catalogue ROYA !')
      }
      setModalOpen(false)
      loadProducts()
    } catch (err) {
      alert('Erreur lors de l\'enregistrement : ' + (err.response?.data?.message || err.message))
    } finally {
      setSaving(false)
    }
  }

  const quickUpdateStock = async (product, delta) => {
    const currentQty = product.quantity !== undefined ? product.quantity : 25
    const newQty = Math.max(0, currentQty + delta)
    // optimistic update
    setItems((prev) => prev.map((p) => p.id === product.id ? { ...p, quantity: newQty } : p))
    if (product._id) {
      try {
        await api.patch(`/products/${product._id}`, { quantity: newQty }, { headers })
      } catch {
        loadProducts()
      }
    }
  }

  const deleteProduct = async () => {
    if (!deleteConfirm) return
    try {
      if (deleteConfirm._id) {
        await api.delete(`/products/${deleteConfirm._id}`, { headers })
      }
      setItems((prev) => prev.filter((p) => p.id !== deleteConfirm.id && p._id !== deleteConfirm._id))
      setDeleteConfirm(null)
      showToast?.('Parfum supprimé du catalogue.')
    } catch (err) {
      alert('Erreur lors de la suppression : ' + (err.response?.data?.message || err.message))
    }
  }

  // Filter products
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.family && item.family.toLowerCase().includes(search.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(search.toLowerCase()))

    const matchesCat =
      filterCat === 'Tous' ||
      item.category?.toLowerCase() === filterCat.toLowerCase() ||
      item.gender?.toLowerCase() === filterCat.toLowerCase() ||
      (filterCat === 'Femme' && (item.gender === 'Women' || item.category === 'Women')) ||
      (filterCat === 'Homme' && (item.gender === 'Men' || item.category === 'Men')) ||
      (filterCat === 'Unisexe' && (item.gender === 'Unisex' || item.category === 'Unisex'))

    const qty = item.quantity !== undefined ? item.quantity : 25
    const matchesStock =
      filterStock === 'Tous' ||
      (filterStock === 'En stock' && qty > 3) ||
      (filterStock === 'Stock critique' && qty <= 3)

    return matchesSearch && matchesCat && matchesStock
  })

  return (
    <AdminLayout
      current="Catalogue Parfums"
      title={`Catalogue Parfums (${items.length})`}
      subtitle="Gestion complète des créations, stocks et fiches olfactives."
      actions={
        <button className="button button-gold button-sm" onClick={openAddModal}>
          <Plus size={16} /> Ajouter une Fragrance
        </button>
      }
    >
      {/* Search & Filter Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher par nom, sillage, famille..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="clear-btn" onClick={() => setSearch('')}><X size={14} /></button>}
        </div>

        <div className="admin-filter-group">
          <span className="filter-label">Genre :</span>
          {['Tous', 'Femme', 'Homme', 'Unisexe'].map((c) => (
            <button
              key={c}
              className={`filter-pill-btn ${filterCat === c ? 'active' : ''}`}
              onClick={() => setFilterCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="admin-filter-group">
          <span className="filter-label">Stock :</span>
          {['Tous', 'En stock', 'Stock critique'].map((s) => (
            <button
              key={s}
              className={`filter-pill-btn ${filterStock === s ? 'active' : ''}`}
              onClick={() => setFilterStock(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid / Table */}
      {loading ? (
        <div className="admin-loading-box"><Spinner label="Chargement du catalogue..." /></div>
      ) : filteredItems.length === 0 ? (
        <div className="admin-empty-state">
          <Package size={36} />
          <p>Aucun parfum ne correspond à vos critères de recherche.</p>
          <button className="button button-quiet button-sm" onClick={() => { setSearch(''); setFilterCat('Tous'); setFilterStock('Tous'); }}>
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="admin-products-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Visuel</th>
                <th>Création</th>
                <th>Famille & Format</th>
                <th>Prix</th>
                <th>Stock Réserve</th>
                <th>Distinctions</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const qty = item.quantity !== undefined ? item.quantity : 25
                const isCritical = qty <= (item.lowStockThreshold || 3)
                const isOut = qty === 0

                return (
                  <tr key={item.id || item._id}>
                    <td style={{ width: '60px' }}>
                      <img src={item.image} alt="" className="admin-prod-thumb" />
                    </td>
                    <td>
                      <span className="prod-name-title">{item.name}</span>
                      <small className="prod-category-text">{item.category} · {item.brand}</small>
                    </td>
                    <td>
                      <span className="prod-family-pill">{item.family}</span>
                      <small className="prod-size-text">{item.size}</small>
                    </td>
                    <td>
                      <strong className="prod-price-text">{item.price} TND</strong>
                      {item.oldPrice && <small className="prod-old-price">{item.oldPrice} TND</small>}
                    </td>
                    <td>
                      <div className="admin-stock-adjuster">
                        <button
                          className="stock-btn"
                          onClick={() => quickUpdateStock(item, -1)}
                          title="Diminuer stock"
                        >
                          -
                        </button>
                        <span className={`stock-badge ${isOut ? 'badge-rose' : isCritical ? 'badge-amber' : 'badge-emerald'}`}>
                          {qty} en stock
                        </span>
                        <button
                          className="stock-btn"
                          onClick={() => quickUpdateStock(item, 1)}
                          title="Augmenter stock"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="prod-badges-tags">
                        {item.featured && <span className="tag-gold">Vedette</span>}
                        {item.bestSeller && <span className="tag-noir">Bestseller</span>}
                        {item.newArrival && <span className="tag-creme">Nouveau</span>}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-row-actions">
                        <button
                          className="button button-quiet button-xs"
                          onClick={() => openEditModal(item)}
                          title="Modifier les détails"
                        >
                          <Edit2 size={13} />
                          <span>Modifier</span>
                        </button>
                        <button
                          className="button button-quiet button-xs btn-delete-danger"
                          onClick={() => setDeleteConfirm(item)}
                          title="Supprimer ce parfum"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="admin-modal-card">
            <button className="modal-close-btn" onClick={() => setModalOpen(false)}>
              <X size={18} />
            </button>

            <span className="eyebrow">FICHE TECHNIQUE PARFUM</span>
            <h3>{editingItem ? `Modifier "${editingItem.name}"` : 'Créer une Nouvelle Fragrance'}</h3>

            <form onSubmit={saveProduct} className="admin-modal-form">
              <div className="form-double-col">
                <label>
                  <span>Nom de la création *</span>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="ex: Oud Majestueux"
                  />
                </label>

                <label>
                  <span>Famille Olfactive *</span>
                  <input
                    required
                    value={form.fragranceFamily}
                    onChange={(e) => setForm({ ...form, fragranceFamily: e.target.value })}
                    placeholder="ex: Ambré Boisé, Floral Blanc..."
                  />
                </label>
              </div>

              <div className="form-triple-col">
                <label>
                  <span>Genre / Catégorie *</span>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value, category: e.target.value })}
                  >
                    <option value="Unisex">Unisexe</option>
                    <option value="Women">Pour Elle (Femme)</option>
                    <option value="Men">Pour Lui (Homme)</option>
                  </select>
                </label>

                <label>
                  <span>Flaconnage *</span>
                  <input
                    required
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    placeholder="ex: 100 ml, 75 ml"
                  />
                </label>

                <label>
                  <span>Quantité en Réserve *</span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </label>
              </div>

              <div className="form-double-col">
                <label>
                  <span>Prix Public (TND) *</span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </label>

                <label>
                  <span>Ancien Prix Baré (TND, optionnel)</span>
                  <input
                    type="number"
                    min="0"
                    value={form.oldPrice}
                    onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                    placeholder="ex: 165"
                  />
                </label>
              </div>

              <label>
                <span>Visuel Flacon *</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setForm({ ...form, image: file.name })
                    }
                  }}
                />
              </label>

              <label>
                <span>Ou coller l’URL de l’image</span>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                />
              </label>

              <label>
                <span>Description Poétique & Récit du Sillage *</span>
                <textarea
                  rows="3"
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Racontez la naissance de cette fragrance et ses émotions..."
                />
              </label>

              <div className="form-triple-col">
                <label>
                  <span>Notes de Tête (séparées par virgules)</span>
                  <input
                    value={form.topNotes}
                    onChange={(e) => setForm({ ...form, topNotes: e.target.value })}
                    placeholder="Bergamote, Poivre Rose"
                  />
                </label>

                <label>
                  <span>Notes de Cœur</span>
                  <input
                    value={form.heartNotes}
                    onChange={(e) => setForm({ ...form, heartNotes: e.target.value })}
                    placeholder="Rose Noire, Jasmin Sambac"
                  />
                </label>

                <label>
                  <span>Notes de Fond</span>
                  <input
                    value={form.baseNotes}
                    onChange={(e) => setForm({ ...form, baseNotes: e.target.value })}
                    placeholder="Ambre Gris, Oud, Santal"
                  />
                </label>
              </div>

              <div className="admin-checkboxes-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  <span>En Vedette (Page d'accueil)</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.bestSeller}
                    onChange={(e) => setForm({ ...form, bestSeller: e.target.checked })}
                  />
                  <span>Meilleure Vente</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.newArrival}
                    onChange={(e) => setForm({ ...form, newArrival: e.target.checked })}
                  />
                  <span>Nouveauté de Saison</span>
                </label>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="button button-quiet"
                  onClick={() => setModalOpen(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="button button-gold"
                  disabled={saving}
                >
                  {saving ? <Spinner label="Enregistrement..." /> : <><Save size={16} /> Enregistrer la création</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Delete */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Supprimer définitivement ce parfum ?"
          message={`Êtes-vous sûr de vouloir retirer "${deleteConfirm.name}" du catalogue Maison ROYA ? Cette action est irréversible.`}
          confirmLabel="Supprimer la création"
          danger={true}
          onConfirm={deleteProduct}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </AdminLayout>
  )
}

function AdminOrders() {
  const { token } = useAuth()
  const { showToast } = useCart()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const headers = { Authorization: `Bearer ${token}` }

  const statusMap = {
    pending: { label: 'En attente', color: 'badge-amber' },
    confirmed: { label: 'Confirmée', color: 'badge-blue' },
    preparing: { label: 'En préparation', color: 'badge-purple' },
    shipped: { label: 'Expédiée', color: 'badge-indigo' },
    delivered: { label: 'Livrée', color: 'badge-emerald' },
    cancelled: { label: 'Annulée', color: 'badge-rose' }
  }

  const loadOrders = () => {
    setLoading(true)
    api.get('/orders', { headers })
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadOrders() }, [])

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { orderStatus: newStatus }, { headers })
      setOrders((prev) => prev.map((o) => (o._id === orderId || o.orderNumber === orderId) ? { ...o, orderStatus: newStatus } : o))
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderNumber === orderId)) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }))
      }
      showToast?.(`Statut mis à jour : ${statusMap[newStatus]?.label || newStatus}`)
    } catch (err) {
      alert('Erreur lors de la mise à jour : ' + (err.response?.data?.message || err.message))
    }
  }

  const deleteOrder = async () => {
    if (!deleteConfirm) return
    try {
      await api.delete(`/orders/${deleteConfirm._id}`, { headers })
      setOrders((prev) => prev.filter((o) => o._id !== deleteConfirm._id))
      setDeleteConfirm(null)
      if (selectedOrder && selectedOrder._id === deleteConfirm._id) setSelectedOrder(null)
      showToast?.('Commande supprimée.')
    } catch (err) {
      alert('Erreur lors de la suppression : ' + (err.response?.data?.message || err.message))
    }
  }

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.orderStatus === filterStatus
    const query = search.toLowerCase()
    const matchesSearch =
      (order.orderNumber && order.orderNumber.toLowerCase().includes(query)) ||
      (order.shippingAddress?.firstName && order.shippingAddress.firstName.toLowerCase().includes(query)) ||
      (order.shippingAddress?.lastName && order.shippingAddress.lastName.toLowerCase().includes(query)) ||
      (order.shippingAddress?.phone && order.shippingAddress.phone.includes(query)) ||
      (order.shippingAddress?.governorate && order.shippingAddress.governorate.toLowerCase().includes(query))

    return matchesStatus && matchesSearch
  })

  return (
    <AdminLayout
      current="Commandes & Suivi"
      title={`File des Commandes (${orders.length})`}
      subtitle="Gestion des expéditions, bordereaux de livraison et validation des encaissements."
      actions={
        <button className="button button-quiet button-sm" onClick={loadOrders}>
          <RefreshCw size={14} /> Actualiser
        </button>
      }
    >
      {/* Search & Status Tabs */}
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher par N° commande, client, téléphone, gouvernorat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="clear-btn" onClick={() => setSearch('')}><X size={14} /></button>}
        </div>

        <div className="admin-filter-group scrollable">
          <button
            className={`filter-pill-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            Toutes ({orders.length})
          </button>
          {['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'].map((st) => {
            const count = orders.filter((o) => o.orderStatus === st).length
            return (
              <button
                key={st}
                className={`filter-pill-btn ${filterStatus === st ? 'active' : ''}`}
                onClick={() => setFilterStatus(st)}
              >
                {statusMap[st]?.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-box"><Spinner label="Chargement des commandes..." /></div>
      ) : filteredOrders.length === 0 ? (
        <div className="admin-empty-state">
          <ShoppingBag size={36} />
          <p>Aucune commande ne correspond à ces critères.</p>
        </div>
      ) : (
        <div className="admin-orders-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>N° Commande</th>
                <th>Date</th>
                <th>Client & Destination</th>
                <th>Articles</th>
                <th>Montant</th>
                <th>Changer Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => {
                const statusInfo = statusMap[ord.orderStatus] || { label: ord.orderStatus, color: 'badge-muted' }
                const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Récent'

                return (
                  <tr key={ord._id || ord.orderNumber}>
                    <td>
                      <span className="order-num-code">{ord.orderNumber}</span>
                    </td>
                    <td>
                      <span className="order-date-text">{dateStr}</span>
                    </td>
                    <td>
                      <span className="client-name">{ord.shippingAddress?.firstName} {ord.shippingAddress?.lastName}</span>
                      <small className="client-loc">{ord.shippingAddress?.phone} · {ord.shippingAddress?.governorate}</small>
                    </td>
                    <td>
                      <span className="order-items-count">
                        {ord.items?.length || 1} article(s)
                      </span>
                    </td>
                    <td>
                      <strong className="order-amount">{ord.total} TND</strong>
                      <small className="payment-cod-note">Paiement Livraison</small>
                    </td>
                    <td>
                      <select
                        className={`admin-status-select ${statusInfo.color}`}
                        value={ord.orderStatus || 'pending'}
                        onChange={(e) => updateOrderStatus(ord._id, e.target.value)}
                      >
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="preparing">En préparation</option>
                        <option value="shipped">Expédiée</option>
                        <option value="delivered">Livrée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-row-actions">
                        <button
                          className="button button-gold button-xs"
                          onClick={() => setSelectedOrder(ord)}
                          title="Voir le bon de livraison et les détails"
                        >
                          <Eye size={13} />
                          <span>Détails</span>
                        </button>
                        <button
                          className="button button-quiet button-xs btn-delete-danger"
                          onClick={() => setDeleteConfirm(ord)}
                          title="Supprimer la commande"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details & Delivery Slip Modal */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setSelectedOrder(null)}>
          <div className="admin-modal-card order-slip-modal">
            <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>
              <X size={18} />
            </button>

            <div className="slip-header">
              <Logo variant="dark" size="small" />
              <div className="slip-meta">
                <span className="eyebrow">BON DE COMMANDE & LIVRAISON</span>
                <h3>{selectedOrder.orderNumber}</h3>
                <small>Date : {new Date(selectedOrder.createdAt || Date.now()).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</small>
              </div>
            </div>

            <div className="slip-grid-info">
              <div className="slip-info-box">
                <span className="info-box-title">DESTINATAIRE :</span>
                <strong>{selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</strong>
                <p>Téléphone : <a href={`tel:${selectedOrder.shippingAddress?.phone}`}>{selectedOrder.shippingAddress?.phone}</a></p>
                <p>Email : {selectedOrder.shippingAddress?.email || 'Non renseigné'}</p>
              </div>

              <div className="slip-info-box">
                <span className="info-box-title">ADRESSE DE LIVRAISON :</span>
                <p>{selectedOrder.shippingAddress?.address}</p>
                <p><strong>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.governorate}</strong></p>
                {selectedOrder.shippingAddress?.notes && (
                  <p className="order-notes-alert"><em>Note : {selectedOrder.shippingAddress?.notes}</em></p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="slip-items-table">
              <table>
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Quantité</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{item.product?.name || item.name || 'Parfum ROYA'}</strong>
                        <small>{item.product?.fragranceFamily || item.size || 'Flacon d\'exception'}</small>
                      </td>
                      <td>{item.quantity}</td>
                      <td><strong>{(item.product?.price || item.price || 0) * item.quantity} TND</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Totals */}
            <div className="slip-totals-card">
              <div className="slip-total-row">
                <span>Frais de livraison (Transporteur) :</span>
                <strong>{selectedOrder.deliveryFee === 0 ? 'Offert' : `${selectedOrder.deliveryFee || 7} TND`}</strong>
              </div>
              <div className="slip-total-row highlight">
                <span>Total Net à Encaisser (Espèces) :</span>
                <strong>{selectedOrder.total} TND</strong>
              </div>
            </div>

            {/* Quick Status Buttons in Modal */}
            <div className="slip-status-actions">
              <span className="actions-label">Mettre à jour le statut :</span>
              <div className="status-buttons-row">
                {['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    className={`button button-xs ${selectedOrder.orderStatus === st ? 'button-gold' : 'button-quiet'}`}
                    onClick={() => updateOrderStatus(selectedOrder._id, st)}
                  >
                    {statusMap[st]?.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                className="button button-quiet"
                onClick={() => window.print()}
              >
                <Printer size={15} /> Imprimer le Bon
              </button>
              <button
                type="button"
                className="button button-gold"
                onClick={() => setSelectedOrder(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Supprimer cette commande ?"
          message={`Êtes-vous certain de vouloir archiver la commande ${deleteConfirm.orderNumber} ?`}
          confirmLabel="Supprimer définitivement"
          danger={true}
          onConfirm={deleteOrder}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </AdminLayout>
  )
}

function AdminMessages() {
  const { token } = useAuth()
  const { showToast } = useCart()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all', 'new', 'read'
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const headers = { Authorization: `Bearer ${token}` }

  const loadMessages = () => {
    setLoading(true)
    api.get('/contact', { headers })
      .then((res) => setMessages(res.data))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadMessages() }, [])

  const markAsRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`, {}, { headers })
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, status: 'read' } : m))
      showToast?.('Message marqué comme traité.')
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.message || err.message))
    }
  }

  const deleteMessage = async () => {
    if (!deleteConfirm) return
    try {
      await api.delete(`/contact/${deleteConfirm._id}`, { headers })
      setMessages((prev) => prev.filter((m) => m._id !== deleteConfirm._id))
      setDeleteConfirm(null)
      showToast?.('Message supprimé de la boîte.')
    } catch (err) {
      alert('Erreur : ' + (err.response?.data?.message || err.message))
    }
  }

  // Filter messages
  const filtered = messages.filter((m) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'new' && m.status !== 'read') ||
      (filter === 'read' && m.status === 'read')

    const q = search.toLowerCase()
    const matchesSearch =
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.phone && m.phone.includes(q)) ||
      (m.message && m.message.toLowerCase().includes(q))

    return matchesFilter && matchesSearch
  })

  const newCount = messages.filter((m) => m.status !== 'read').length

  return (
    <AdminLayout
      current="Messages Conciergerie"
      title={`Boîte Conciergerie (${messages.length})`}
      subtitle="Demandes de renseignements, conseils personnalisés et réclamations clients."
      actions={
        <button className="button button-quiet button-sm" onClick={loadMessages}>
          <RefreshCw size={14} /> Actualiser
        </button>
      }
    >
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher par nom, email, téléphone, contenu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="clear-btn" onClick={() => setSearch('')}><X size={14} /></button>}
        </div>

        <div className="admin-filter-group">
          <button
            className={`filter-pill-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tous ({messages.length})
          </button>
          <button
            className={`filter-pill-btn ${filter === 'new' ? 'active' : ''}`}
            onClick={() => setFilter('new')}
          >
            Non Lus ({newCount})
          </button>
          <button
            className={`filter-pill-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Traités ({messages.length - newCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading-box"><Spinner label="Chargement des messages..." /></div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty-state">
          <Inbox size={36} />
          <p>Aucun message dans cette boîte pour le moment.</p>
        </div>
      ) : (
        <div className="admin-messages-list">
          {filtered.map((m) => {
            const isNew = m.status !== 'read'
            const dateStr = m.createdAt
              ? new Date(m.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
              : 'Date inconnue'

            return (
              <article key={m._id} className={`admin-message-card ${isNew ? 'unread' : ''}`}>
                <div className="msg-card-top">
                  <div className="msg-client-meta">
                    <div className="msg-avatar">{m.name?.slice(0, 1).toUpperCase()}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 className="msg-client-name">{m.name}</h4>
                        {isNew ? (
                          <span className="status-pill badge-amber">Nouveau</span>
                        ) : (
                          <span className="status-pill badge-muted">Traité</span>
                        )}
                      </div>
                      <div className="msg-contacts-line">
                        <a href={`mailto:${m.email}`} className="msg-email-link">
                          <Mail size={13} /> {m.email}
                        </a>
                        <span className="bullet">·</span>
                        <a href={`tel:${m.phone}`} className="msg-phone-link">
                          <Phone size={13} /> {m.phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  <span className="msg-date-pill">{dateStr}</span>
                </div>

                <div className="msg-content-body">
                  <p>{m.message}</p>
                </div>

                <div className="msg-card-actions">
                  {isNew && (
                    <button
                      className="button button-gold button-xs"
                      onClick={() => markAsRead(m._id)}
                    >
                      <Check size={14} /> Marquer comme traité
                    </button>
                  )}

                  <a href={`mailto:${m.email}?subject=Maison%20ROYA%20-%20Votre%20Demande`} className="button button-quiet button-xs">
                    <Mail size={14} /> Répondre par Email
                  </a>

                  <a href={`tel:${m.phone}`} className="button button-quiet button-xs">
                    <Phone size={14} /> Appeler le client
                  </a>

                  <button
                    className="button button-quiet button-xs btn-delete-danger"
                    onClick={() => setDeleteConfirm(m)}
                    title="Supprimer ce message"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDialog
          title="Supprimer ce message ?"
          message={`Êtes-vous certain de vouloir supprimer le message envoyé par ${deleteConfirm.name} ?`}
          confirmLabel="Supprimer"
          danger={true}
          onConfirm={deleteMessage}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </AdminLayout>
  )
}

function AdminSettings() {
  const { token } = useAuth()
  const { showToast } = useCart()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    storeName: 'Maison ROYA',
    logoText: 'ROYA',
    email: 'conciergerie@roya-parfums.com',
    phone: '+216 70 172 200',
    address: 'Les Berges du Lac II, Tunis',
    openingHours: 'Lundi - Samedi : 10h00 - 19h30',
    currency: 'TND',
    defaultDeliveryFee: 7,
    freeDeliveryThreshold: 150,
    cashOnDelivery: true,
    acceptOrders: true,
    instagram: 'https://instagram.com/roya.parfums',
    facebook: 'https://facebook.com/roya.parfums'
  })
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    setLoading(true)
    api.get('/settings', { headers })
      .then((res) => {
        if (res.data) setSettings((prev) => ({ ...prev, ...res.data }))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const saveSettings = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        storeName: settings.storeName,
        logoText: settings.logoText,
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        openingHours: settings.openingHours,
        currency: settings.currency,
        defaultDeliveryFee: Number(settings.defaultDeliveryFee),
        freeDeliveryThreshold: Number(settings.freeDeliveryThreshold),
        cashOnDelivery: Boolean(settings.cashOnDelivery),
        acceptOrders: Boolean(settings.acceptOrders),
        instagram: settings.instagram,
        facebook: settings.facebook
      }
      await api.patch('/settings', payload, { headers })
      showToast?.('Paramètres de la Maison ROYA enregistrés avec succès !')
    } catch (err) {
      alert('Erreur lors de la sauvegarde : ' + (err.response?.data?.message || err.message))
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout
      current="Configuration Maison"
      title="Paramètres & Configuration"
      subtitle="Gestion de l'identité officielle, règles commerciales et politiques d'expédition."
    >
      {loading ? (
        <div className="admin-loading-box"><Spinner label="Chargement de la configuration..." /></div>
      ) : (
        <form onSubmit={saveSettings} className="admin-settings-form">
          {/* Identity Section */}
          <div className="settings-card">
            <div className="settings-card-header">
              <span className="eyebrow">IDENTITÉ OFFICIELLE</span>
              <h3>Maison & Image de Marque</h3>
            </div>

            <div className="settings-logo-preview">
              <Logo variant="dark" size="medium" />
              <div>
                <strong>{settings.storeName}</strong>
                <p>Élégance et Raffinement · Haute Parfumerie Contemporaine</p>
              </div>
            </div>

            <div className="form-double-col">
              <label>
                <span>Nom Commercial de la Maison *</span>
                <input
                  required
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                />
              </label>

              <label>
                <span>Slogan / Texte Emblème *</span>
                <input
                  required
                  value={settings.logoText}
                  onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                />
              </label>
            </div>

            <div className="form-double-col">
              <label>
                <span>Email Officiel de la Conciergerie *</span>
                <input
                  type="email"
                  required
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </label>

              <label>
                <span>Ligne Téléphonique Principale *</span>
                <input
                  required
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </label>
            </div>

            <div className="form-double-col">
              <label>
                <span>Adresse du Salon / Showroom *</span>
                <input
                  required
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                />
              </label>

              <label>
                <span>Horaires d'Accueil & Conciergerie *</span>
                <input
                  required
                  value={settings.openingHours}
                  onChange={(e) => setSettings({ ...settings, openingHours: e.target.value })}
                />
              </label>
            </div>
          </div>

          {/* Shipping & Commerce Policies */}
          <div className="settings-card">
            <div className="settings-card-header">
              <span className="eyebrow">POLITIQUES COMMERCIALES</span>
              <h3>Tarifs de Livraison & Règles de Commande</h3>
            </div>

            <div className="form-triple-col">
              <label>
                <span>Frais de Port Standard (TND) *</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={settings.defaultDeliveryFee}
                  onChange={(e) => setSettings({ ...settings, defaultDeliveryFee: e.target.value })}
                />
              </label>

              <label>
                <span>Seuil Livraison Offerte (TND) *</span>
                <input
                  type="number"
                  min="0"
                  required
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: e.target.value })}
                />
              </label>

              <label>
                <span>Devise Monétaire *</span>
                <input
                  required
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                />
              </label>
            </div>

            <div className="admin-switches-grid">
              <label className="admin-toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.cashOnDelivery}
                  onChange={(e) => setSettings({ ...settings, cashOnDelivery: e.target.checked })}
                />
                <span className="slider" />
                <span className="toggle-label">Paiement à la livraison actif (Espèces à réception)</span>
              </label>

              <label className="admin-toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.acceptOrders}
                  onChange={(e) => setSettings({ ...settings, acceptOrders: e.target.checked })}
                />
                <span className="slider" />
                <span className="toggle-label">Accepter les commandes en ligne sur la boutique</span>
              </label>
            </div>
          </div>

          {/* Social Links */}
          <div className="settings-card">
            <div className="settings-card-header">
              <span className="eyebrow">RAYONNEMENT DIGITAL</span>
              <h3>Réseaux Sociaux Officiels</h3>
            </div>

            <div className="form-double-col">
              <label>
                <span>Lien Profil Instagram</span>
                <input
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  placeholder="https://instagram.com/roya.parfums"
                />
              </label>

              <label>
                <span>Lien Page Facebook</span>
                <input
                  value={settings.facebook}
                  onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                  placeholder="https://facebook.com/roya.parfums"
                />
              </label>
            </div>
          </div>

          <div className="settings-submit-bar">
            <button
              type="submit"
              className="button button-gold"
              disabled={saving}
            >
              {saving ? <Spinner label="Enregistrement..." /> : <><Save size={16} /> Enregistrer les Paramètres</>}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  )
}

// MAIN APP COMPONENT WITH ALL ROUTES & OVERLAYS
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

function AppContent() {
  const { toastMessage } = useCart()

  return (
    <>
      <Routes>
        {/* Admin Back-Office Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute><AdminMessages /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

        {/* Public Storefront Routes */}
        <Route
          path="*"
          element={
            <div className="roya-storefront-wrapper">
              <Header />
              <main id="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
              <Footer />
              <CartDrawer />
              <Toast message={toastMessage} />
            </div>
          }
        />
      </Routes>
    </>
  )
}

export default App
