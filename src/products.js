// Catálogo de DEMOSTRACIÓN. Cambia nombres, descripciones, fotos y precios por datos reales.
// price: null = precio por cotizar. price: 250 = precio fijo en lempiras.
// image: '/productos/camisa.webp' si guardas fotos en public/productos.
export const products = [
  {id:'camisa',name:'Camisas personalizadas',category:'Ropa',description:'Personaliza el diseño, color y talla.',price:null,emoji:'👕',image:'',options:{Talla:['XS','S','M','L','XL','XXL','XXXL'],Color:['Blanco','Negro','Azul navy','Otro']},featured:true},
  {id:'taza',name:'Tazas personalizadas',category:'Tazas y termos',description:'Diseños, fotografías y frases a tu gusto.',price:null,emoji:'☕',image:'',options:{Estilo:['Clásica','Mágica','Otro']},featured:true},
  {id:'termo',name:'Termos personalizados',category:'Tazas y termos',description:'Distintos estilos y capacidades.',price:null,emoji:'🥤',image:'',options:{Tipo:['Travel mug','Tumbler','Con pajilla','Tipo lata','Otro']},featured:true},
  {id:'stickers',name:'Stickers personalizados',category:'Papelería',description:'Vinil, transparentes, etiquetas y logos.',price:null,emoji:'✨',image:'',options:{Material:['Vinil','Transparente','Otro']},featured:true},
  {id:'gorra',name:'Gorras personalizadas',category:'Ropa',description:'Para negocios, eventos o regalos.',price:null,emoji:'🧢',image:'',options:{Color:['Negro','Blanco','Azul navy','Otro']}},
  {id:'calendario',name:'Calendarios personalizados',category:'Papelería',description:'Para escritorio, regalar o promocionar tu marca.',price:null,emoji:'📅',image:'',options:{}},
  {id:'rompecabezas',name:'Rompecabezas personalizados',category:'Regalos',description:'Con tu fotografía o ilustración favorita.',price:null,emoji:'🧩',image:'',options:{Forma:['Rectangular','Corazón']}},
  {id:'llavero',name:'Llaveros personalizados',category:'Regalos',description:'Un detalle con identidad propia.',price:null,emoji:'🔑',image:'',options:{}},
  {id:'lanyard',name:'Lanyards personalizados',category:'Empresas y eventos',description:'Para equipos, empresas y eventos.',price:null,emoji:'🏷️',image:'',options:{}},
  {id:'banner',name:'Banners personalizados',category:'Empresas y eventos',description:'Impresión para promociones y celebraciones.',price:null,emoji:'🖼️',image:'',options:{Formato:['Vertical','Horizontal','Otro']}},
];
