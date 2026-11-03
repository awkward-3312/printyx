import { useEffect, useMemo, useState, useRef } from 'react';
import { ArrowRight, Check, Instagram, Menu, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, Trash2, Truck, X, MessageCircle, Sparkles } from 'lucide-react';
import { products } from './products';
import { ProductCustomizationFields, makeInitialDetails, getProductDetails, validateDetails } from './ProductCustomizationFields.jsx';
import { WHATSAPP_NUMBER, INSTAGRAM_URL, DELIVERY_TEXT } from './config';

const money = (n) => new Intl.NumberFormat('es-HN', {style:'currency',currency:'HNL'}).format(n);
const getCart = () => {try {const c=JSON.parse(localStorage.getItem('printyx-cart')); return Array.isArray(c)?c:[]} catch{return []}};
const categories = ['Todos', ...new Set(products.map(p=>p.category))];

function ProductImage({product,large=false}) {
  return <div className={`product-visual ${large?'large':''}`}>{product.image ? <img src={product.image} alt={product.name} loading="lazy" /> : <span aria-hidden="true">{product.emoji}</span>}</div>;
}

function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [cart, setCart] = useState(getCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const detailsPanelRef = useRef(null);
  const [choices, setChoices] = useState({});
  const [details, setDetails] = useState({});
  const [referenceFiles, setReferenceFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [challengeVersion, setChallengeVersion] = useState(0);
  const [formError, setFormError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [menuOpen,setMenuOpen] = useState(false);
  const [notice,setNotice] = useState('');
  useEffect(()=>localStorage.setItem('printyx-cart',JSON.stringify(cart)),[cart]);
  useEffect(()=>{document.body.style.overflow=cartOpen||selected?'hidden':''; return ()=>{document.body.style.overflow=''}},[cartOpen,selected]);
  // Cada ficha empieza desde el encabezado, incluso si la anterior estaba desplazada.
  useEffect(()=>{if(selected && detailsPanelRef.current){detailsPanelRef.current.scrollTop=0;}},[selected?.id]);
  const filtered = useMemo(()=>products.filter(p=>(category==='Todos'||p.category===category) && `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(search.toLowerCase())),[category,search]);
  const totalQty = cart.reduce((n,item)=>n+item.quantity,0);
  const fixedTotal = cart.reduce((n,item)=>n+(typeof item.price==='number'?item.price*item.quantity:0),0);
  const hasQuotes = cart.some(i=>typeof i.price!=='number');
  function openProduct(p){setReferenceFiles([]);setTurnstileToken('');setSelected(p);setChoices(Object.fromEntries(Object.entries(p.options||{}).map(([k,v])=>[k,v[0]])));setDetails(makeInitialDetails(p));setFormError('');setQuantity(1)}
  async function addToCart(){
    if(!selected || uploading)return;
    const error=validateDetails(selected,details);
    if(error){setFormError(error);return;}
    if(referenceFiles.length && !turnstileToken){setFormError('Completa la verificación de seguridad para subir tus archivos.');return;}
    setFormError(''); setUploading(true);
    try {
      let uploaded=[];
      if(referenceFiles.length){
        const form=new FormData();
        for(const file of referenceFiles) form.append('files',file,file.name);
        form.append('turnstileToken',turnstileToken);
        const result=await fetch('/api/files',{method:'POST',body:form,cache:'no-store'});
        const data=await result.json().catch(()=>({}));
        if(!result.ok) throw new Error(data.error||'No pudimos subir los archivos. Inténtalo nuevamente.');
        uploaded=data.files||[];
        if(uploaded.length!==referenceFiles.length) throw new Error('No se confirmaron todos los archivos.');
      }
      const detailRows=[...Object.entries(choices),...getProductDetails(selected,details)];
      if(uploaded.length) for(const file of uploaded) detailRows.push([`Archivo: ${file.name}`,file.url]);
      const variant=detailRows.map(([k,v])=>`${k}: ${v}`).join('\n');
      const key=JSON.stringify([selected.id,detailRows]);
      setCart(prev=>{const existing=prev.find(i=>i.key===key); return existing?prev.map(i=>i.key===key?{...i,quantity:i.quantity+quantity}:i):[...prev,{key,id:selected.id,name:selected.name,price:selected.price,emoji:selected.emoji,image:selected.image,variant,quantity,uploadedAt:uploaded.length?Date.now():null}]});
      setSelected(null);setReferenceFiles([]);setTurnstileToken('');setFormError('');setNotice('Producto agregado al carrito');setTimeout(()=>setNotice(''),2600);
    }catch(e){setFormError(e.message||'Ocurrió un error al subir los archivos.');setTurnstileToken('');setChallengeVersion(v=>v+1)}
    finally{setUploading(false)}
  }
  function updateQuantity(key,delta){setCart(prev=>prev.map(i=>i.key===key?{...i,quantity:Math.max(1,i.quantity+delta)}:i))}
  function messageText(){
    const referencesInCart=cart.some(i=>i.uploadedAt);
    const lines=cart.map((i,index)=>`${index+1}. *${i.name}*\n${i.variant?i.variant+'\n':''}Cantidad: ${i.quantity}\n${typeof i.price==='number'?'Subtotal: '+money(i.price*i.quantity):'Precio: por cotizar'}`);
    return `¡Hola, Printyx! Quisiera cotizar este pedido:\n\n${lines.join('\n\n')}\n\n${fixedTotal>0?`Subtotal de productos con precio fijo: ${money(fixedTotal)}\n`:''}${hasQuotes?'*Algunos productos requieren cotización.*\n':''}${referencesInCart?'*Archivos:* Los enlaces son privados por posesión del enlace, funcionan hasta 30 días desde su carga. Descárguenlos antes de que venzan.\n':''}¿Me pueden confirmar disponibilidad, precio final y envío? ¡Gracias!`;
  }
  function sendWhatsApp(){if(!cart.length)return; const digits=WHATSAPP_NUMBER.replace(/\D/g,'');if(!/^504\d{8}$/.test(digits)){setNotice('Configura primero tu número en src/config.js (504 + 8 dígitos).');return}window.open(`https://wa.me/${digits}?text=${encodeURIComponent(messageText())}`,'_blank','noopener,noreferrer')}
  function goCatalog(){document.getElementById('catalogo')?.scrollIntoView({behavior:'smooth'});setMenuOpen(false)}
  return <>
    <div className="announcement"><Truck size={15}/>{DELIVERY_TEXT}<span className="announcement-separator">•</span> Hecho especialmente para ti</div>
    <header className="site-header"><div className="container header-inner"><a className="logo" href="#inicio" aria-label="Printyx, inicio"><img src="/printyx-logo.png" alt="Printyx" className="brand-logo" /></a><nav className={`nav ${menuOpen?'open':''}`} aria-label="Navegación principal"><a href="#inicio" onClick={()=>setMenuOpen(false)}>Inicio</a><a href="#catalogo" onClick={()=>setMenuOpen(false)}>Catálogo</a><a href="#como-comprar" onClick={()=>setMenuOpen(false)}>Cómo comprar</a><a href="#contacto" onClick={()=>setMenuOpen(false)}>Contacto</a></nav><div className="header-actions"><button className="cart-icon" aria-label={`Abrir carrito, ${totalQty} productos`} onClick={()=>setCartOpen(true)}><ShoppingBag size={21}/>{totalQty>0&&<span className="cart-count">{totalQty}</span>}</button><button className="mobile-menu" aria-label="Abrir menú" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button></div></div></header>
    <main>
      <section className="hero" id="inicio">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="eyebrow"><Sparkles size={15}/> CREATIVIDAD Y PERSONALIZACIÓN · HONDURAS</div>
            <h1>Lo imaginas.<br/><em>Lo hacemos realidad.</em></h1>
            <p>Regalos con intención, detalles para celebrar e ideas para hacer crecer tu marca. Hechos especialmente para ti.</p>
            <div className="hero-ctas"><button className="primary-button" onClick={goCatalog}>Explorar productos <ArrowRight size={18}/></button><a className="secondary-button" href="#como-comprar">Cómo hacer un pedido</a></div>
            <div className="hero-note"><Check size={16}/> Atención personalizada · Envíos a todo Honduras</div>
          </div>
          <div className="hero-art" aria-label="Productos que puedes personalizar en Printyx">
            <div className="hero-art-header"><span>PRINTYX / HECHO A TU MEDIDA</span><span>01 — 04</span></div>
            <div className="hero-editorial-card hero-card-shirt"><span className="hero-card-number">01 / ROPA</span><span className="hero-card-icon" aria-hidden="true">👕</span><strong>Hecho a tu estilo</strong></div>
            <div className="hero-editorial-card hero-card-mug"><span className="hero-card-number">02 / REGALOS</span><span className="hero-card-icon" aria-hidden="true">☕</span><strong>Ideas para regalar</strong></div>
            <div className="hero-editorial-accent">HECHO A TU MEDIDA <ArrowRight size={15}/></div>
          </div>
        </div>
      </section>
      <section className="category-showcase container" aria-label="Explora nuestras categorías">
        <div className="category-heading"><div><div className="eyebrow">NUESTROS PRODUCTOS</div><h2>Una idea para cada <em>ocasión.</em></h2></div><button className="category-all" onClick={goCatalog}>Ver catálogo completo <ArrowRight size={16}/></button></div>
        <div className="category-showcase-grid">
          {[{label:'Ropa y accesorios',category:'Ropa y accesorios',icon:'👕',style:'tone-one'},{label:'Tazas y termos',category:'Tazas y termos',icon:'☕',style:'tone-two'},{label:'Papelería e impresión',category:'Papelería e impresión',icon:'✦',style:'tone-three'},{label:'Regalos personalizados',category:'Regalos personalizados',icon:'🎁',style:'tone-four'}].map(item=><button key={item.category} className={`category-showcase-card ${item.style}`} onClick={()=>{setCategory(item.category);setSearch('');goCatalog()}}><span className="category-card-icon" aria-hidden="true">{item.icon}</span><span className="category-card-label">{item.label}</span><ArrowRight size={18}/></button>)}
        </div>
      </section>
      <section className="benefits"><div className="container benefits-grid"><div><Truck/><span>Envíos a todo Honduras</span></div><div><Sparkles/><span>Productos a tu estilo</span></div><div><MessageCircle/><span>Pedidos fáciles por WhatsApp</span></div></div></section>
      <section className="catalog-section container" id="catalogo"><div className="section-heading"><div><div className="eyebrow">DESCUBRE PRINTYX</div><h2>Encuentra algo <em>muy tuyo.</em></h2><p>Personalizamos regalos, productos para tu negocio y detalles para celebrar. Cotiza sin compromiso.</p></div><span className="product-total">{filtered.length} productos</span></div><div className="toolbar"><label className="search-box"><Search size={18}/><input aria-label="Buscar productos" placeholder="Buscar productos..." value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button aria-label="Borrar búsqueda" onClick={()=>setSearch('')}><X size={16}/></button>}</label><div className="filter-icon"><SlidersHorizontal size={17}/> Categorías</div></div><div className="categories" aria-label="Filtrar por categoría">{categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="product-grid">{filtered.map(p=><article key={p.id} className="product-card"><button className="product-photo" onClick={()=>openProduct(p)} aria-label={`Ver ${p.name}`}><ProductImage product={p}/>{p.featured&&<span className="featured-tag">Destacado</span>}</button><div className="product-body"><span className="product-category">{p.category}</span><h3>{p.name}</h3><p>{p.description}</p><div className="product-bottom"><span className="price">{typeof p.price==='number'?money(p.price):'Pide tu cotización'}</span><button className="mini-button" onClick={()=>openProduct(p)} aria-label={`Personalizar ${p.name}`}><Plus size={18}/></button></div></div></article>)}</div>{filtered.length===0&&<div className="empty-state">No encontramos productos con esa búsqueda. Prueba otra palabra o categoría.</div>}</section>
      <section className="how-section" id="como-comprar"><div className="container"><div className="section-heading"><div><div className="eyebrow">ASÍ DE SENCILLO</div><h2>De tu idea a <em>tus manos.</em></h2></div></div><div className="steps"><article><span>01</span><h3>Explora el catálogo</h3><p>Elige los productos que más te gusten y selecciona sus opciones.</p></article><article><span>02</span><h3>Arma tu carrito</h3><p>Agrega cantidades y revisa tu pedido, sin pagar en la web.</p></article><article><span>03</span><h3>Escríbenos por WhatsApp</h3><p>Envíanos tu carrito. Confirmaremos precios, diseño y entrega.</p></article></div></div></section>
      <section className="contact-section container" id="contacto"><div className="contact-box"><div><div className="eyebrow">ESTAMOS PARA AYUDARTE</div><h2>¿Tienes una idea <em>en mente?</em></h2><p>Cuéntanos qué imaginas. Te ayudamos a convertirlo en un producto hecho a tu medida.</p><a className="instagram-link" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><Instagram size={18}/> @printyxhn</a></div><button className="primary-button" onClick={()=>{setCartOpen(true)}}>Ver mi carrito <ShoppingBag size={18}/></button></div></section>
    </main>
    <footer><div className="container footer-inner"><div><div className="footer-logo-text">PRINTYX<span>.</span></div><p>Creatividad que se convierte en algo tuyo. · San Pedro Sula, Honduras.</p></div><div className="footer-links"><a href="#catalogo">Catálogo</a><a href="#como-comprar">Cómo comprar</a><a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Instagram</a></div><small>© {new Date().getFullYear()} Printyx. Todos los derechos reservados.</small></div></footer>
    {notice&&<div className="toast" role="status">{notice}</div>}
    {selected&&<div className="overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><div className="modal product-modal" role="dialog" aria-modal="true" aria-label={selected.name}><button className="close-button" onClick={()=>setSelected(null)} aria-label="Cerrar"><X/></button><div className="modal-product-grid"><div className="modal-media-panel"><ProductImage product={selected} large/></div><div className="modal-details" ref={detailsPanelRef} key={selected.id}><span className="product-category">{selected.category}</span><h2>{selected.name}</h2><p>{selected.description}</p><strong className="modal-price">{typeof selected.price==='number'?money(selected.price):'Precio a consultar'}</strong>{Object.entries(selected.options||{}).map(([label,values])=><label className="variant-field" key={label}><span>{label}</span><select value={choices[label]||values[0]} onChange={e=>setChoices({...choices,[label]:e.target.value})}>{values.map(v=><option key={v}>{v}</option>)}</select></label>)}<ProductCustomizationFields product={selected} details={details} onChange={setDetails} referenceFiles={referenceFiles} onReferenceFilesChange={setReferenceFiles} turnstileToken={turnstileToken} onTurnstileTokenChange={setTurnstileToken} challengeVersion={challengeVersion} />{formError&&<p className="field-error" role="alert">{formError}</p>}<div className="quantity-row"><span>Cantidad</span><div className="quantity-control"><button onClick={()=>setQuantity(q=>Math.max(1,q-1))} aria-label="Disminuir cantidad"><Minus size={16}/></button><span>{quantity}</span><button onClick={()=>setQuantity(q=>q+1)} aria-label="Aumentar cantidad"><Plus size={16}/></button></div></div><button className="primary-button full" onClick={addToCart} disabled={uploading}>{uploading?'Subiendo archivos…':'Agregar al carrito'} <ShoppingBag size={18}/></button></div></div></div></div>}
    {cartOpen&&<div className="overlay drawer-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)setCartOpen(false)}}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Mi carrito"><div className="drawer-heading"><div><span className="eyebrow">TU SELECCIÓN</span><h2>Mi carrito <span>({totalQty})</span></h2></div><button className="close-button" onClick={()=>setCartOpen(false)} aria-label="Cerrar carrito"><X/></button></div><div className="cart-items">{cart.length===0?<div className="empty-cart"><ShoppingBag size={48}/><h3>Tu carrito está vacío</h3><p>Explora el catálogo y agrega tus productos favoritos.</p><button className="secondary-button" onClick={()=>{setCartOpen(false);goCatalog()}}>Ver productos</button></div>:cart.map(i=><div className="cart-item" key={i.key}><div className="cart-thumb">{(i.image || products.find(p=>p.id===i.id)?.image) ? <img src={i.image || products.find(p=>p.id===i.id)?.image} alt="" loading="lazy" /> : i.emoji}</div><div className="cart-item-content"><strong>{i.name}</strong><small className="cart-variant">{i.variant||'Sin variantes'}</small><span className="cart-item-price">{typeof i.price==='number'?money(i.price*i.quantity):'Por cotizar'}</span><div className="quantity-control"><button aria-label="Quitar una unidad" onClick={()=>updateQuantity(i.key,-1)}><Minus size={14}/></button><span>{i.quantity}</span><button aria-label="Agregar una unidad" onClick={()=>updateQuantity(i.key,1)}><Plus size={14}/></button></div></div><button className="remove-button" aria-label={`Eliminar ${i.name}`} onClick={()=>setCart(prev=>prev.filter(item=>item.key!==i.key))}><Trash2 size={17}/></button></div>)}</div><div className="cart-footer">{cart.length>0&&<><div className="cart-subtotal"><span>Subtotal conocido</span><strong>{money(fixedTotal)}</strong></div>{hasQuotes&&<p>El precio final se confirma por WhatsApp. El subtotal no incluye productos por cotizar ni envío.</p>}</>}<button className="primary-button full" disabled={!cart.length} onClick={sendWhatsApp}><MessageCircle size={18}/> Enviar pedido por WhatsApp</button><p className="cart-disclaimer">No se realizan pagos en esta página. Los archivos de diseño cargados en el pedido se comparten por enlaces privados. Se eliminan al cumplir 30 días.</p></div></aside></div>}
  </>;
}
export default App;
