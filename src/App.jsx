import { useEffect, useMemo, useState, useRef } from 'react';
import {
  ArrowRight,
  Check,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Trash2,
  Truck,
  X,
  MessageCircle,
  Sparkles,
  Pencil,
  ZoomIn,
} from 'lucide-react';
import { products } from './products';
import {
  ProductCustomizationFields,
  makeInitialDetails,
  getProductDetails,
  validateDetails,
} from './ProductCustomizationFields.jsx';
import { WHATSAPP_NUMBER, DELIVERY_TEXT } from './config';
import galleryImages from './trabajos.generated.json';
import { SocialLinks } from './SocialLinks.jsx';

const money = (n) =>
  new Intl.NumberFormat('es-HN', { style: 'currency', currency: 'HNL' }).format(
    n
  );
const getCart = () => {
  try {
    const c = JSON.parse(localStorage.getItem('printyx-cart'));
    return Array.isArray(c) ? c : [];
  } catch {
    return [];
  }
};
const categories = ['Todos', ...new Set(products.map((p) => p.category))];
const occasions = [
  'Todas las ocasiones',
  'Cumpleaños',
  'Regalos',
  'Empresas',
  'Graduaciones',
  'Eventos',
  'Uso diario',
];
const occasionByCategory = {
  'Ropa y accesorios': [
    'Regalos',
    'Empresas',
    'Graduaciones',
    'Eventos',
    'Uso diario',
  ],
  'Tazas y termos': [
    'Cumpleaños',
    'Regalos',
    'Empresas',
    'Graduaciones',
    'Uso diario',
  ],
  'Regalos personalizados': ['Cumpleaños', 'Regalos', 'Graduaciones'],
  'Papelería e impresión': ['Empresas', 'Graduaciones', 'Eventos'],
  'Empresas y eventos': ['Empresas', 'Graduaciones', 'Eventos'],
  'Fiestas y decoración': ['Cumpleaños', 'Eventos'],
  'Detalles especiales': ['Cumpleaños', 'Regalos', 'Graduaciones', 'Eventos'],
};
const itemForCart = (p, choices, details, quantity, files, key) => {
  const rows = [...Object.entries(choices), ...getProductDetails(p, details)];
  for (const file of files) rows.push([`Archivo: ${file.name}`, file.url]);
  return {
    key: key || crypto.randomUUID(),
    id: p.id,
    name: p.name,
    price: p.price,
    emoji: p.emoji,
    image: p.image,
    choices: { ...choices },
    details: { ...details },
    files: [...files],
    variant: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
    quantity,
    uploadedAt: files.length ? Date.now() : null,
  };
};

function ProductImage({ product, large = false }) {
  return (
    <div className={`product-visual ${large ? 'large' : ''}`}>
      {product.image ? (
        <img src={product.image} alt={product.name} loading="lazy" />
      ) : (
        <span aria-hidden="true">{product.emoji}</span>
      )}
    </div>
  );
}

function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [occasion, setOccasion] = useState('Todas las ocasiones');
  const [cart, setCart] = useState(getCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [gallerySelected, setGallerySelected] = useState(null);
  const [selected, setSelected] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [existingFiles, setExistingFiles] = useState([]);
  const [imageZoom, setImageZoom] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [statusNotice, setStatusNotice] = useState('');
  const modalRef = useRef(null);
  const drawerRef = useRef(null);
  const lightboxRef = useRef(null);
  const galleryLightboxRef = useRef(null);
  const previousFocusRef = useRef(null);
  const detailsPanelRef = useRef(null);
  const cartItemsRef = useRef(null);
  const [choices, setChoices] = useState({});
  const [details, setDetails] = useState({});
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [challengeVersion, setChallengeVersion] = useState(0);
  const [formError, setFormError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    try {
      localStorage.setItem('printyx-cart', JSON.stringify(cart));
    } catch {
      setNotice(
        'El navegador no pudo guardar el carrito; evita cerrar esta pestaña.'
      );
    }
  }, [cart]);
  useEffect(() => {
    if (!cartOpen && !selected && !gallerySelected) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (gallerySelected) setGallerySelected(null);
        else if (imageZoom) setImageZoom(false);
        else if (selected) closeProduct();
        else if (reviewOpen) setReviewOpen(false);
        else setCartOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [cartOpen, selected, imageZoom, reviewOpen, gallerySelected]);
  useEffect(() => {
    document.body.style.overflow =
      cartOpen || selected || gallerySelected ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen, selected, gallerySelected]);
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3600);
    return () => clearTimeout(t);
  }, [notice]);
  useEffect(() => {
    if (!statusNotice) return;
    const t = setTimeout(() => setStatusNotice(''), 2800);
    return () => clearTimeout(t);
  }, [statusNotice]);
  // El foco permanece dentro de la ventana activa y regresa al control que la abrió.
  useEffect(() => {
    const target = gallerySelected
      ? galleryLightboxRef.current
      : imageZoom
        ? lightboxRef.current
        : selected
          ? modalRef.current
          : cartOpen
            ? drawerRef.current
            : null;
    if (!target) return;
    if (!previousFocusRef.current)
      previousFocusRef.current = document.activeElement;
    const first = target.querySelector(
      'button:not(:disabled),[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled)'
    );
    (first || target).focus({ preventScroll: true });
    const onTab = (e) => {
      if (e.key !== 'Tab') return;
      const items = [
        ...target.querySelectorAll(
          'button:not(:disabled),[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]'
        ),
      ].filter(
        (x) =>
          x.getClientRects().length > 0 &&
          getComputedStyle(x).visibility !== 'hidden'
      );
      if (!items.length) {
        e.preventDefault();
        target.focus();
        return;
      }
      const i = items.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        items.at(-1).focus();
      } else if (!e.shiftKey && (i === items.length - 1 || i === -1)) {
        e.preventDefault();
        items[0].focus();
      }
    };
    target.addEventListener('keydown', onTab);
    return () => {
      target.removeEventListener('keydown', onTab);
      if (!selected && !cartOpen && !gallerySelected && !imageZoom) {
        previousFocusRef.current?.focus?.({ preventScroll: true });
        previousFocusRef.current = null;
      }
    };
  }, [selected, cartOpen, imageZoom, gallerySelected]);
  useEffect(() => {
    if (cartItemsRef.current) cartItemsRef.current.scrollTop = 0;
  }, [reviewOpen]);
  useEffect(() => {
    if (
      !selected &&
      !cartOpen &&
      !gallerySelected &&
      !imageZoom &&
      previousFocusRef.current
    ) {
      previousFocusRef.current.focus?.({ preventScroll: true });
      previousFocusRef.current = null;
    }
  }, [selected, cartOpen, gallerySelected, imageZoom]);
  useEffect(() => {
    if (formError && selected) {
      const panel = detailsPanelRef.current;
      const el = panel?.querySelector('[role="alert"]');
      if (el) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [formError, selected]);
  // Cada ficha empieza desde el encabezado, incluso si la anterior estaba desplazada.
  useEffect(() => {
    if (selected && detailsPanelRef.current) {
      detailsPanelRef.current.scrollTop = 0;
    }
  }, [selected?.id]);
  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === 'Todos' || p.category === category) &&
          (occasion === 'Todas las ocasiones' ||
            occasionByCategory[p.category]?.includes(occasion)) &&
          `${p.name} ${p.description} ${p.category}`
            .toLowerCase()
            .includes(search.trim().toLowerCase())
      ),
    [category, occasion, search]
  );
  const selectedPhotos = selected
    ? [
        {
          src: selected.image,
          title: `Mockup de ${selected.name}`,
          isMockup: true,
        },
        ...galleryImages.filter((x) => x.productId === selected.id),
      ]
    : [];
  const currentPhoto =
    selectedPhotos[Math.min(activePhotoIndex, selectedPhotos.length - 1)] ||
    null;
  const totalQty = cart.reduce((n, item) => n + item.quantity, 0);
  const fixedTotal = cart.reduce(
    (n, item) =>
      n + (typeof item.price === 'number' ? item.price * item.quantity : 0),
    0
  );
  const hasQuotes = cart.some((i) => typeof i.price !== 'number');
  function openCart() {
    setReviewOpen(false);
    setCartOpen(true);
  }
  function openProduct(p) {
    setEditingKey(null);
    setExistingFiles([]);
    setReferenceFiles([]);
    setTurnstileToken('');
    setImageZoom(false);
    setSelected(p);
    setActivePhotoIndex(0);
    setChoices(
      Object.fromEntries(
        Object.entries(p.options || {}).map(([k, v]) => [k, v[0]])
      )
    );
    setDetails(makeInitialDetails(p));
    setFormError('');
    setQuantity(1);
  }
  function closeProduct() {
    setSelected(null);
    setEditingKey(null);
    setReferenceFiles([]);
    setExistingFiles([]);
    setFormError('');
    setImageZoom(false);
  }
  function editItem(item) {
    const p = products.find((p) => p.id === item.id);
    if (!p) {
      setNotice('Este producto ya no está en el catálogo.');
      return;
    }
    const legacyRows = String(item.variant || '')
      .split('\n')
      .map((line) => {
        const n = line.indexOf(': ');
        return n < 0 ? null : [line.slice(0, n), line.slice(n + 2)];
      })
      .filter(Boolean);
    const legacyMap = Object.fromEntries(legacyRows);
    const fallbackChoices = Object.fromEntries(
      Object.entries(p.options || {}).map(([k, v]) => [k, legacyMap[k] || v[0]])
    );
    const fallbackDetails = {
      ...makeInitialDetails(p),
      designStatus: legacyMap['Diseño'] || 'Tengo el diseño listo',
      designNotes: legacyMap['Detalles del diseño'] || '',
      extraNotes: legacyMap['Observaciones'] || '',
    };
    const files =
      item.files ||
      legacyRows
        .filter(([k]) => k.startsWith('Archivo: '))
        .map(([k, url]) => ({ name: k.slice(9), url }));
    setCartOpen(false);
    setReviewOpen(false);
    setEditingKey(item.key);
    setExistingFiles(files);
    setSelected(p);
    setActivePhotoIndex(0);
    setActivePhotoIndex(0);
    setChoices({ ...fallbackChoices, ...(item.choices || {}) });
    setDetails({ ...fallbackDetails, ...(item.details || {}) });
    setReferenceFiles([]);
    setTurnstileToken('');
    setChallengeVersion((v) => v + 1);
    setQuantity(item.quantity);
    setFormError('');
    setImageZoom(false);
  }
  async function addToCart() {
    if (!selected || uploading) return;
    const error = validateDetails(selected, details);
    if (error) {
      setFormError(error);
      return;
    }
    if (existingFiles.length + referenceFiles.length > 5) {
      setFormError(
        'Puedes conservar y subir hasta 5 archivos por producto. Quita alguno antes de continuar.'
      );
      return;
    }
    if (referenceFiles.length && !turnstileToken) {
      setFormError(
        'Completa la verificación de seguridad para subir tus archivos.'
      );
      return;
    }
    setFormError('');
    setUploading(true);
    setStatusNotice(
      referenceFiles.length
        ? 'Subiendo tus archivos de diseño…'
        : 'Guardando tu producto…'
    );
    try {
      let files = [...existingFiles];
      if (referenceFiles.length) {
        const form = new FormData();
        for (const file of referenceFiles)
          form.append('files', file, file.name);
        form.append('turnstileToken', turnstileToken);
        const response = await fetch('/api/files', {
          method: 'POST',
          body: form,
          cache: 'no-store',
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok)
          throw new Error(data.error || 'No pudimos subir los archivos.');
        if (
          !Array.isArray(data.files) ||
          data.files.length !== referenceFiles.length
        )
          throw new Error('No se confirmaron todos los archivos.');
        files = [...files, ...data.files];
      }
      if (files.length > 5)
        throw new Error('Puedes tener hasta 5 archivos por artículo.');
      const item = itemForCart(
        selected,
        choices,
        details,
        quantity,
        files,
        editingKey
      );
      // Conservar fecha de subida inicial en artículos editados cuando hay adjuntos existentes.
      const old = cart.find((x) => x.key === editingKey);
      if (old && !referenceFiles.length && files.length)
        item.uploadedAt = old.uploadedAt;
      setCart((prev) =>
        editingKey
          ? prev.map((x) => (x.key === editingKey ? item : x))
          : [...prev, item]
      );
      const wasEditing = Boolean(editingKey);
      closeProduct();
      if (wasEditing) openCart();
      setNotice(
        wasEditing
          ? 'Cambios guardados en el carrito'
          : 'Producto agregado al carrito'
      );
      setStatusNotice(
        wasEditing
          ? 'Personalización actualizada correctamente.'
          : 'Producto añadido correctamente.'
      );
    } catch (e) {
      setStatusNotice(
        'No se pudo guardar. Revisa las indicaciones del formulario.'
      );
      setFormError(e.message || 'Ocurrió un error.');
      setTurnstileToken('');
      setChallengeVersion((v) => v + 1);
    } finally {
      setUploading(false);
    }
  }
  function updateQuantity(key, delta) {
    setCart((prev) =>
      prev.map((i) =>
        i.key === key ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
    setStatusNotice('Cantidad actualizada');
  }
  function messageText() {
    const referencesInCart = cart.some((i) => i.uploadedAt);
    const lines = cart.map(
      (i, index) =>
        `${index + 1}. *${i.name}*\n${i.variant ? i.variant + '\n' : ''}Cantidad: ${i.quantity}\n${typeof i.price === 'number' ? 'Subtotal: ' + money(i.price * i.quantity) : 'Precio: por cotizar'}`
    );
    return `¡Hola, Printyx! Quisiera cotizar este pedido:\n\n${lines.join('\n\n')}\n\n${fixedTotal > 0 ? `Subtotal de productos con precio fijo: ${money(fixedTotal)}\n` : ''}${hasQuotes ? '*Algunos productos requieren cotización.*\n' : ''}${referencesInCart ? '*Archivos:* Los enlaces son privados por posesión del enlace, funcionan hasta 30 días desde su carga. Descárguenlos antes de que venzan.\n' : ''}¿Me pueden confirmar disponibilidad, precio final y envío? ¡Gracias!`;
  }
  function sendWhatsApp() {
    if (!cart.length) return;
    const digits = WHATSAPP_NUMBER.replace(/\D/g, '');
    if (!/^504\d{8}$/.test(digits)) {
      setNotice(
        'Configura primero tu número en src/config.js (504 + 8 dígitos).'
      );
      return;
    }
    window.open(
      `https://wa.me/${digits}?text=${encodeURIComponent(messageText())}`,
      '_blank',
      'noopener,noreferrer'
    );
  }
  function goCatalog() {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  }
  return (
    <>
      <div className="announcement">
        <Truck size={15} />
        {DELIVERY_TEXT}
        <span className="announcement-separator">•</span> Hecho especialmente
        para ti
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <a className="logo" href="#inicio" aria-label="Printyx, inicio">
            <img src="/printyx-logo.png" alt="Printyx" className="brand-logo" />
          </a>
          <nav
            className={`nav ${menuOpen ? 'open' : ''}`}
            aria-label="Navegación principal"
          >
            <a href="#inicio" onClick={() => setMenuOpen(false)}>
              Inicio
            </a>
            <a href="#catalogo" onClick={() => setMenuOpen(false)}>
              Catálogo
            </a>
            <a href="#como-comprar" onClick={() => setMenuOpen(false)}>
              Cómo comprar
            </a>
            {galleryImages.length > 0 && (
              <a href="#trabajos" onClick={() => setMenuOpen(false)}>
                Trabajos reales
              </a>
            )}
            <a href="#contacto" onClick={() => setMenuOpen(false)}>
              Contacto
            </a>
          </nav>
          <div className="header-actions">
            <button
              className="cart-icon"
              aria-label={`Abrir carrito, ${totalQty} productos`}
              onClick={openCart}
            >
              <ShoppingBag size={21} />
              {totalQty > 0 && <span className="cart-count">{totalQty}</span>}
            </button>
            <button
              className="mobile-menu"
              aria-label="Abrir menú"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="hero" id="inicio">
          <div className="container hero-grid">
            <div className="hero-content">
              <div className="eyebrow">
                <Sparkles size={15} /> CREATIVIDAD Y PERSONALIZACIÓN · HONDURAS
              </div>
              <h1>
                Lo imaginas
                <br />
                <em>Lo hacemos realidad</em>
              </h1>
              <p>
                Regalos con intención, detalles para celebrar e ideas para hacer
                crecer tu marca. Hechos especialmente para ti.
              </p>
              <div className="hero-ctas">
                <button className="primary-button" onClick={goCatalog}>
                  Explorar productos <ArrowRight size={18} />
                </button>
                <a className="secondary-button" href="#como-comprar">
                  Cómo hacer un pedido
                </a>
              </div>
              <div className="hero-note">
                <Check size={16} /> Atención personalizada · Envíos a todo
                Honduras
              </div>
            </div>
            <div
              className="hero-art"
              aria-label="Productos que puedes personalizar en Printyx"
            >
              <div className="hero-art-header">
                <span>PRINTYX / HECHO A TU MEDIDA</span>
                <span>01 — 04</span>
              </div>
              <div className="hero-editorial-card hero-card-shirt">
                <span className="hero-card-number">01 / ROPA</span>
                <span className="hero-card-icon" aria-hidden="true">
                  👕
                </span>
                <strong>Hecho a tu estilo</strong>
              </div>
              <div className="hero-editorial-card hero-card-mug">
                <span className="hero-card-number">02 / REGALOS</span>
                <span className="hero-card-icon" aria-hidden="true">
                  ☕
                </span>
                <strong>Ideas para regalar</strong>
              </div>
              <div className="hero-editorial-accent">
                HECHO A TU MEDIDA <ArrowRight size={15} />
              </div>
            </div>
          </div>
        </section>
        <section
          className="category-showcase container"
          aria-label="Explora nuestras categorías"
        >
          <div className="category-heading">
            <div>
              <div className="eyebrow">NUESTROS PRODUCTOS</div>
              <h2>
                Una idea para cada <em>ocasión</em>
              </h2>
            </div>
            <button className="category-all" onClick={goCatalog}>
              Ver catálogo completo <ArrowRight size={16} />
            </button>
          </div>
          <div className="category-showcase-grid">
            {[
              {
                label: 'Ropa y accesorios',
                category: 'Ropa y accesorios',
                icon: '👕',
                style: 'tone-one',
              },
              {
                label: 'Tazas y termos',
                category: 'Tazas y termos',
                icon: '☕',
                style: 'tone-two',
              },
              {
                label: 'Papelería e impresión',
                category: 'Papelería e impresión',
                icon: '✦',
                style: 'tone-three',
              },
              {
                label: 'Regalos personalizados',
                category: 'Regalos personalizados',
                icon: '🎁',
                style: 'tone-four',
              },
            ].map((item) => (
              <button
                key={item.category}
                className={`category-showcase-card ${item.style}`}
                onClick={() => {
                  setCategory(item.category);
                  setOccasion('Todas las ocasiones');
                  setSearch('');
                  goCatalog();
                }}
              >
                <span className="category-card-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="category-card-label">{item.label}</span>
                <ArrowRight size={18} />
              </button>
            ))}
          </div>
        </section>
        <section className="benefits">
          <div className="container benefits-grid">
            <div>
              <Truck />
              <span>Envíos a todo Honduras</span>
            </div>
            <div>
              <Sparkles />
              <span>Productos a tu estilo</span>
            </div>
            <div>
              <MessageCircle />
              <span>Pedidos fáciles por WhatsApp</span>
            </div>
          </div>
        </section>
        <section className="catalog-section container" id="catalogo">
          <div className="section-heading">
            <div>
              <div className="eyebrow">DESCUBRE PRINTYX</div>
              <h2>
                Encuentra algo <em>muy tuyo</em>
              </h2>
              <p>
                Personalizamos regalos, productos para tu negocio y detalles
                para celebrar. Cotiza sin compromiso.
              </p>
            </div>
            <span className="product-total">{filtered.length} productos</span>
          </div>
          <div className="toolbar">
            <label className="search-box">
              <Search size={18} />
              <input
                aria-label="Buscar productos"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  aria-label="Borrar búsqueda"
                  onClick={() => setSearch('')}
                >
                  <X size={16} />
                </button>
              )}
            </label>
            <div className="filter-icon">
              <SlidersHorizontal size={17} /> Categorías
            </div>
          </div>
          <div className="occasion-filter">
            <label htmlFor="occasion-select">¿Para qué lo necesitas?</label>
            <select
              id="occasion-select"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
            >
              {occasions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setOccasion('Todas las ocasiones');
                setCategory('Todos');
                setSearch('');
              }}
            >
              Limpiar filtros
            </button>
          </div>
          <div className="categories" aria-label="Filtrar por categoría">
            {categories.map((c) => (
              <button
                key={c}
                className={category === c ? 'active' : ''}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="product-grid">
            {filtered.map((p) => (
              <article key={p.id} className="product-card">
                <button
                  className="product-photo"
                  onClick={() => openProduct(p)}
                  aria-label={`Ver ${p.name}`}
                >
                  <ProductImage product={p} />
                  {p.featured && (
                    <span className="featured-tag">Destacado</span>
                  )}
                </button>
                <div className="product-body">
                  <span className="product-category">{p.category}</span>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="product-bottom">
                    <span className="price">
                      {typeof p.price === 'number'
                        ? money(p.price)
                        : 'Pide tu cotización'}
                    </span>
                    <button
                      className="mini-button"
                      onClick={() => openProduct(p)}
                      aria-label={`Personalizar ${p.name}`}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state">
              No encontramos productos para esos filtros. Prueba otra ocasión o
              categoría.
            </div>
          )}
        </section>
        {galleryImages.length > 0 && (
          <section
            className="gallery-section container"
            id="trabajos"
            aria-labelledby="gallery-heading"
          >
            <div className="section-heading">
              <div>
                <div className="eyebrow">HECHO POR PRINTYX</div>
                <h2 id="gallery-heading">
                  Trabajos <em>reales.</em>
                </h2>
                <p>
                  Una muestra de nuestros productos personalizados. Cada
                  proyecto tiene su propia historia.
                </p>
              </div>
            </div>
            <div className="gallery-grid">
              {galleryImages.map((photo) => (
                <button
                  type="button"
                  className="gallery-tile"
                  key={photo.src}
                  onClick={() => setGallerySelected(photo)}
                  aria-label={`Ampliar fotografía: ${photo.title}`}
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    decoding="async"
                  />
                  <span>{photo.title}</span>
                </button>
              ))}
            </div>
            <p className="gallery-note">
              Fotografías de trabajos realizados. Los resultados pueden variar
              según el diseño, material y medidas solicitados.
            </p>
          </section>
        )}
        <section className="how-section" id="como-comprar">
          <div className="container">
            <div className="section-heading">
              <div>
                <div className="eyebrow">ASÍ DE SENCILLO</div>
                <h2>
                  De tu idea a <em>tus manos</em>
                </h2>
              </div>
            </div>
            <div className="steps">
              <article>
                <span>01</span>
                <h3>Explora el catálogo</h3>
                <p>
                  Elige los productos que más te gusten y selecciona sus
                  opciones.
                </p>
              </article>
              <article>
                <span>02</span>
                <h3>Arma tu carrito</h3>
                <p>
                  Agrega cantidades y revisa tu pedido, sin pagar en la web.
                </p>
              </article>
              <article>
                <span>03</span>
                <h3>Escríbenos por WhatsApp</h3>
                <p>
                  Envíanos tu carrito. Confirmaremos precios, diseño y entrega.
                </p>
              </article>
            </div>
          </div>
        </section>
        <section className="policies-section container" id="politicas">
          <div className="section-heading">
            <div>
              <div className="eyebrow">ANTES DE COTIZAR</div>
              <h2>
                Información de tu <em>pedido</em>
              </h2>
            </div>
          </div>
          <div className="policies-grid">
            <article>
              <h3>Anticipo del 50 %</h3>
              <p>
                Se solicita al confirmar la cotización; el saldo restante se
                coordina antes de la entrega.
              </p>
            </article>
            <article>
              <h3>Tiempo de elaboración</h3>
              <p>
                Referencia general: 3 días hábiles, sujetos al tipo de producto,
                volumen y aprobación del diseño.
              </p>
            </article>
            <article>
              <h3>Aprobación de diseños</h3>
              <p>
                Te mostramos el diseño para aprobación antes de producir. Revisa
                nombres, tallas y medidas cuidadosamente.
              </p>
            </article>
            <article>
              <h3>Envíos y cambios</h3>
              <p>
                Enviamos a Honduras. El envío se cotiza por separado. Los
                productos personalizados no tienen devolución, salvo derechos
                legales aplicables por defectos o incumplimiento.
              </p>
            </article>
          </div>
          <p className="policies-note">
            Los precios, disponibilidad y fechas definitivas se confirman
            personalmente por WhatsApp.
          </p>
        </section>
        <section className="contact-section container" id="contacto">
          <div className="contact-box">
            <div>
              <div className="eyebrow">ESTAMOS PARA AYUDARTE</div>
              <h2>
                ¿Tienes una idea <em>en mente?</em>
              </h2>
              <p>
                Cuéntanos qué imaginas. Te ayudamos a convertirlo en un producto
                hecho a tu medida.
              </p>
              <SocialLinks />
            </div>
            <button className="primary-button" onClick={openCart}>
              Ver mi carrito <ShoppingBag size={18} />
            </button>
          </div>
        </section>
      </main>
      <footer>
        <div className="container footer-inner">
          <div>
            <div className="footer-logo-text">
              PRINTYX<span>.</span>
            </div>
            <p>
              Creatividad que se convierte en algo tuyo. · San Pedro Sula,
              Honduras.
            </p>
          </div>
          <div className="footer-navigation">
            <div className="footer-links">
              <a href="#catalogo">Catálogo</a>
              <a href="#como-comprar">Cómo comprar</a>
              <a href="#politicas">Políticas</a>
            </div>
            <SocialLinks variant="footer" />
          </div>
          <small>
            © {new Date().getFullYear()} Printyx. Todos los derechos
            reservados.
          </small>
        </div>
      </footer>
      {(notice || statusNotice) && (
        <div className="toast" role="status" aria-live="polite">
          <Check size={17} aria-hidden="true" />
          {notice || statusNotice}
        </div>
      )}
      {selected && (
        <div
          className="overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeProduct();
          }}
        >
          <div
            className="modal product-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            ref={modalRef}
            tabIndex={-1}
          >
            <button
              className="close-button"
              onClick={closeProduct}
              aria-label="Cerrar"
            >
              <X />
            </button>
            <div className="modal-product-grid">
              <div className="modal-media-panel">
                <button
                  type="button"
                  className="zoom-trigger"
                  onClick={() => setImageZoom(true)}
                  aria-label={`Ampliar ${activePhotoIndex === 0 ? 'mockup' : 'trabajo real'} de ${selected.name}`}
                >
                  <div className="product-visual large">
                    {currentPhoto?.src ? (
                      <img
                        src={currentPhoto.src}
                        alt={currentPhoto.title}
                        loading="eager"
                      />
                    ) : (
                      <span>{selected.emoji}</span>
                    )}
                  </div>
                  <span>
                    <ZoomIn size={15} /> Ampliar imagen
                  </span>
                </button>
                {selectedPhotos.length > 1 && (
                  <div
                    className="product-photo-thumbs"
                    role="group"
                    aria-label="Fotografías del producto"
                  >
                    {selectedPhotos.map((photo, index) => (
                      <button
                        key={`${photo.src}-${index}`}
                        type="button"
                        className={index === activePhotoIndex ? 'active' : ''}
                        aria-pressed={index === activePhotoIndex}
                        aria-label={
                          index === 0
                            ? 'Ver mockup del producto'
                            : `Ver trabajo real ${index}`
                        }
                        onClick={() => setActivePhotoIndex(index)}
                      >
                        <img src={photo.src} alt="" loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
                {selectedPhotos.length > 1 && (
                  <p className="product-gallery-hint">
                    Mockup y {selectedPhotos.length - 1}{' '}
                    {selectedPhotos.length === 2
                      ? 'trabajo real'
                      : 'trabajos reales'}{' '}
                    de Printyx
                  </p>
                )}
              </div>
              <div
                className="modal-details"
                ref={detailsPanelRef}
                key={selected.id}
              >
                <span className="product-category">
                  {editingKey ? 'EDITANDO TU CARRITO' : selected.category}
                </span>
                <h2 id="product-modal-title">{selected.name}</h2>
                <p>{selected.description}</p>
                <strong className="modal-price">
                  {typeof selected.price === 'number'
                    ? money(selected.price)
                    : 'Precio a consultar'}
                </strong>
                {Object.entries(selected.options || {}).map(
                  ([label, values]) => (
                    <label className="variant-field" key={label}>
                      <span>{label}</span>
                      <select
                        value={choices[label] || values[0]}
                        onChange={(e) =>
                          setChoices({ ...choices, [label]: e.target.value })
                        }
                      >
                        {values.map((v) => (
                          <option key={v}>{v}</option>
                        ))}
                      </select>
                    </label>
                  )
                )}
                <ProductCustomizationFields
                  product={selected}
                  details={details}
                  onChange={setDetails}
                  referenceFiles={referenceFiles}
                  onReferenceFilesChange={setReferenceFiles}
                  turnstileToken={turnstileToken}
                  onTurnstileTokenChange={setTurnstileToken}
                  challengeVersion={challengeVersion}
                />
                {existingFiles.length > 0 && (
                  <div className="retained-files">
                    <strong>
                      Archivos ya guardados ({existingFiles.length})
                    </strong>
                    {existingFiles.map((f, i) => (
                      <div key={i}>
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {f.name}
                        </a>
                        <button
                          onClick={() =>
                            setExistingFiles((files) =>
                              files.filter((_, index) => index !== i)
                            )
                          }
                          aria-label={`Quitar ${f.name}`}
                        >
                          Quitar del pedido
                        </button>
                      </div>
                    ))}
                    <p>No necesitas subir estos archivos otra vez.</p>
                  </div>
                )}
                {formError && (
                  <p className="field-error" role="alert">
                    {formError}
                  </p>
                )}
                <div className="quantity-row">
                  <span>Cantidad</span>
                  <div className="quantity-control">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <button
                  className="primary-button full desktop-add-to-cart"
                  onClick={addToCart}
                  disabled={uploading}
                >
                  {uploading
                    ? 'Guardando…'
                    : editingKey
                      ? 'Guardar cambios'
                      : 'Agregar al carrito'}{' '}
                  <ShoppingBag size={18} />
                </button>
                {editingKey && (
                  <button
                    className="secondary-button full cancel-edit"
                    onClick={() => {
                      closeProduct();
                      setCartOpen(true);
                    }}
                  >
                    Cancelar edición
                  </button>
                )}
              </div>
            </div>
            <div className="mobile-product-cta">
              <button
                type="button"
                className="primary-button full"
                disabled={uploading}
                onClick={addToCart}
              >
                {uploading
                  ? 'Guardando…'
                  : editingKey
                    ? 'Guardar cambios'
                    : 'Agregar al carrito'}{' '}
                <ShoppingBag size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
      {imageZoom && selected && (
        <div
          className="image-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Imagen ampliada"
          tabIndex={-1}
          ref={lightboxRef}
          onClick={() => setImageZoom(false)}
        >
          <button
            className="close-button"
            aria-label="Cerrar imagen ampliada"
            onClick={() => setImageZoom(false)}
          >
            <X />
          </button>
          {currentPhoto?.src ? (
            <img src={currentPhoto.src} alt={currentPhoto.title} />
          ) : (
            <span>{selected.emoji}</span>
          )}
        </div>
      )}
      {gallerySelected && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          ref={galleryLightboxRef}
          aria-label={`Foto ampliada: ${gallerySelected.title}`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setGallerySelected(null);
          }}
        >
          <button
            className="close-button gallery-close"
            onClick={() => setGallerySelected(null)}
            aria-label="Cerrar fotografía"
          >
            <X />
          </button>
          <img src={gallerySelected.src} alt={gallerySelected.title} />
          <p>{gallerySelected.title}</p>
        </div>
      )}
      {cartOpen && (
        <div
          className="overlay drawer-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setCartOpen(false);
              setReviewOpen(false);
            }
          }}
        >
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mi carrito"
            ref={drawerRef}
            tabIndex={-1}
          >
            <div className="drawer-heading">
              <div>
                <span className="eyebrow">TU SELECCIÓN</span>
                <h2>
                  {reviewOpen ? 'Revisar cotización' : 'Mi carrito'}{' '}
                  <span>({totalQty})</span>
                </h2>
              </div>
              <button
                className="close-button"
                onClick={() => {
                  setCartOpen(false);
                  setReviewOpen(false);
                }}
                aria-label="Cerrar carrito"
              >
                <X />
              </button>
            </div>
            <div className="cart-items" ref={cartItemsRef}>
              {reviewOpen ? (
                <div className="review-content">
                  <span className="eyebrow">ANTES DE ENVIAR</span>
                  <h3>Revisa tu cotización</h3>
                  <p>
                    Confirma productos, cantidades y archivos. Todavía no hemos
                    recibido tu solicitud.
                  </p>
                  {cart.map((item, index) => (
                    <article className="review-item" key={item.key}>
                      <div className="review-item-heading">
                        <strong>
                          {index + 1}. {item.name}
                        </strong>
                        <button
                          type="button"
                          onClick={() => {
                            setReviewOpen(false);
                            editItem(item);
                          }}
                        >
                          <Pencil size={14} /> Editar
                        </button>
                      </div>
                      <p className="review-variant">
                        {item.variant || 'Sin especificaciones adicionales'}
                      </p>
                      <strong>Cantidad: {item.quantity}</strong>
                      <p>
                        {typeof item.price === 'number'
                          ? money(item.price * item.quantity)
                          : 'Precio por cotizar'}
                      </p>
                    </article>
                  ))}
                  <div className="review-explainer">
                    <MessageCircle size={19} />
                    <p>
                      Al continuar se abrirá WhatsApp con tu mensaje preparado.{' '}
                      <strong>Debes presionar Enviar dentro de WhatsApp</strong>{' '}
                      para que Printyx reciba la cotización. No pagarás desde
                      esta página.
                    </p>
                  </div>
                </div>
              ) : cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag size={48} />
                  <h3>Tu carrito está vacío</h3>
                  <p>Explora el catálogo y agrega tus productos favoritos.</p>
                  <button
                    className="secondary-button"
                    onClick={() => {
                      setCartOpen(false);
                      goCatalog();
                    }}
                  >
                    Ver productos
                  </button>
                </div>
              ) : (
                cart.map((i) => (
                  <div className="cart-item" key={i.key}>
                    <div className="cart-thumb">
                      {i.image || products.find((p) => p.id === i.id)?.image ? (
                        <img
                          src={
                            i.image ||
                            products.find((p) => p.id === i.id)?.image
                          }
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        i.emoji
                      )}
                    </div>
                    <div className="cart-item-content">
                      <strong>{i.name}</strong>
                      <small className="cart-variant">
                        {i.variant || 'Sin variantes'}
                      </small>
                      <span className="cart-item-price">
                        {typeof i.price === 'number'
                          ? money(i.price * i.quantity)
                          : 'Por cotizar'}
                      </span>
                      <div className="cart-actions">
                        <button
                          className="edit-cart-item"
                          aria-label={`Editar ${i.name}`}
                          onClick={() => editItem(i)}
                        >
                          <Pencil size={14} /> Editar
                        </button>
                        <div className="quantity-control">
                          <button
                            aria-label="Quitar una unidad"
                            onClick={() => updateQuantity(i.key, -1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span>{i.quantity}</span>
                          <button
                            aria-label="Agregar una unidad"
                            onClick={() => updateQuantity(i.key, 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      className="remove-button"
                      aria-label={`Eliminar ${i.name}`}
                      onClick={() => {
                        setCart((prev) =>
                          prev.filter((item) => item.key !== i.key)
                        );
                        setStatusNotice('Producto eliminado del carrito');
                      }}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="cart-footer">
              {cart.length > 0 && (
                <>
                  <div className="cart-subtotal">
                    <span>
                      {hasQuotes ? 'Total por cotizar' : 'Total de productos'}
                    </span>
                    <strong>
                      {fixedTotal > 0 ? money(fixedTotal) : 'Por confirmar'}
                    </strong>
                  </div>
                  {hasQuotes && (
                    <p>
                      {fixedTotal > 0
                        ? 'El total mostrado solo incluye los productos con precio fijo. '
                        : ''}
                      El precio final y el envío se confirman por WhatsApp.
                    </p>
                  )}
                </>
              )}
              {reviewOpen ? (
                <div className="review-buttons">
                  <button
                    type="button"
                    className="secondary-button full"
                    onClick={() => setReviewOpen(false)}
                  >
                    Volver al carrito
                  </button>
                  <button
                    type="button"
                    className="primary-button full"
                    disabled={!cart.length}
                    onClick={sendWhatsApp}
                  >
                    <MessageCircle size={18} /> Abrir WhatsApp para enviar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="primary-button full"
                  disabled={!cart.length}
                  onClick={() => setReviewOpen(true)}
                >
                  <Check size={18} /> Revisar cotización
                </button>
              )}
              <p className="cart-disclaimer">
                No se realizan pagos en esta página. Los archivos de diseño
                cargados en el pedido se comparten por enlaces accesibles para
                quien los tenga. Se eliminan al cumplir 30 días.
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
export default App;
