import React from 'react';
// Campos personalizados del catálogo. Las reglas por tipo se pueden editar aquí.
const measureIds = new Set(['banners','cuadro-madera','figuras-pvc']);
const occasionIds = new Set(['piniatas','centros-mesa','cajas-fiesta','flores-eternas','arreglo-dulces']);
const printingIds = new Set(['stickers','etiquetas','tarjetas','brochures','calendarios','lanyards','carnes','botones']);
const clothingIds = new Set(['camisa','gorra','bordado','mameluco','boxer','uniformes','mochila']);
const photoIds = new Set(['taza','jarra','termo','cojin','mousepad','llavero','rompecabezas','reloj-led']);

const paperIds = new Set(['tarjetas','brochures','calendarios','etiquetas']);
const finishingIds = new Set(['stickers','tarjetas','brochures','etiquetas']);
const giftIds = new Set(['flores-eternas','arreglo-dulces']);
const sizeIds = new Set(['stickers','etiquetas','tarjetas','brochures','botones','lanyards','carnes']);
function isMeasured(product){return measureIds.has(product.id);}
export function makeInitialDetails(product){return {
  designStatus:'Tengo el diseño listo',
  designNotes:'',
  width:'', height:'',
  printingSides:'Una cara',
  occasion:'',
  dueDate:'',
  extraNotes:'',
  material:'Por confirmar', finish:'Por confirmar', pieceSize:'',
  eventAge:'', eventName:'', eventQuantity:'',
  eventTheme:'', giftMessage:'', giftPalette:'',
  placement:'Al frente', sizeNotes:'',
};}

export function validateDetails(product,values){
  if(isMeasured(product)){
    const width=Number(values.width), height=Number(values.height);
    if(!values.width||!values.height||!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0){return 'Ingresa el ancho y alto en pulgadas, con valores mayores a cero.';}
    if(width>1000||height>1000){return 'Revisa las medidas. Si necesitas un formato especial, consúltanos por WhatsApp.';}
  }
  return '';
}

export function getProductDetails(product,values){
  const result=[];
  if(isMeasured(product)) result.push(['Ancho',`${values.width} pulgadas`],['Alto',`${values.height} pulgadas`]);
  if(printingIds.has(product.id)) result.push(['Impresión',values.printingSides]);
  if(paperIds.has(product.id)) result.push(['Material o papel',values.material]);
  if(finishingIds.has(product.id)) result.push(['Acabado',values.finish]);
  if(sizeIds.has(product.id) && values.pieceSize?.trim()) result.push(['Medida o formato',values.pieceSize.trim()]);
  if(clothingIds.has(product.id)) result.push(['Ubicación del diseño',values.placement]);
  if(clothingIds.has(product.id) && values.sizeNotes?.trim()) result.push(['Prenda o medidas especiales',values.sizeNotes.trim()]);
  if(occasionIds.has(product.id) && values.eventName?.trim()) result.push(['Nombre para decorar',values.eventName.trim()]);
  if(occasionIds.has(product.id) && values.eventAge?.trim()) result.push(['Edad o número',values.eventAge.trim()]);
  if(occasionIds.has(product.id) && values.eventQuantity?.trim()) result.push(['Cantidad de piezas del evento',values.eventQuantity.trim()]);
  if(occasionIds.has(product.id) && values.eventTheme?.trim()) result.push(['Colores de la temática',values.eventTheme.trim()]);
  if(giftIds.has(product.id) && values.giftMessage?.trim()) result.push(['Mensaje de regalo',values.giftMessage.trim()]);
  if(giftIds.has(product.id) && values.giftPalette?.trim()) result.push(['Colores preferidos',values.giftPalette.trim()]);
  if(occasionIds.has(product.id)&&values.occasion.trim()) result.push(['Ocasión o temática',values.occasion.trim()]);
  result.push(['Diseño',values.designStatus]);
  if(values.designNotes.trim()) result.push(['Detalles del diseño',values.designNotes.trim()]);
  if(values.dueDate) result.push(['Fecha deseada',values.dueDate]);
  if(values.extraNotes.trim()) result.push(['Observaciones',values.extraNotes.trim()]);
  return result;
}

export function ProductCustomizationFields({product,details,onChange,referenceFiles=[],onReferenceFilesChange,turnstileToken,onTurnstileTokenChange,challengeVersion}){
  const [fileError,setFileError] = React.useState('');
  function chooseFiles(event){
    const files=Array.from(event.target.files||[]);
    event.target.value='';
    if(!files.length)return;
    const allowed=new Set(['image/jpeg','image/png','image/webp','application/pdf']);
    if(files.length>5){setFileError('Selecciona un máximo de 5 archivos.');return;}
    if(files.some(f=>!allowed.has(f.type))){setFileError('Utiliza JPG, PNG, WEBP o PDF. No se admite SVG por seguridad.');return;}
    if(files.some(f=>f.size>15*1024*1024||f.size===0)){setFileError('Cada archivo debe pesar entre 1 byte y 15 MB.');return;}
    setFileError(''); onReferenceFilesChange?.(files);
    onTurnstileTokenChange?.('');
  }
  const update=(key,value)=>onChange(prev=>({...prev,[key]:value}));
  const suggested=isMeasured(product)?'Ej. Quiero un banner para la inauguración, con fondo azul y mi logo.':clothingIds.has(product.id)?'Ej. Logo al frente, nombre en la espalda.':photoIds.has(product.id)?'Ej. Quiero agregar dos fotografías y una frase.':'Describe los colores, texto, logo, estilo o idea.';
  return <div className="custom-fields">
    <div className="custom-heading"><h3>Personaliza tu pedido</h3><p>Cuéntanos cómo lo quieres. Confirmaremos los detalles y el precio por WhatsApp.</p></div>
    {isMeasured(product)&&<div className="measure-fields">
      <label className="variant-field"><span>Ancho (pulgadas) *</span><input type="number" min="0.1" max="1000" step="any" value={details.width} onChange={e=>update('width',e.target.value)} placeholder="Ej. 36" inputMode="decimal" required /></label>
      <label className="variant-field"><span>Alto (pulgadas) *</span><input type="number" min="0.1" max="1000" step="any" value={details.height} onChange={e=>update('height',e.target.value)} placeholder="Ej. 24" inputMode="decimal" required /></label>
      <p className="field-hint">Indica el tamaño final del producto, no del archivo de diseño.</p>
    </div>}
    {printingIds.has(product.id)&&<label className="variant-field"><span>Impresión</span><select value={details.printingSides} onChange={e=>update('printingSides',e.target.value)}><option>Una cara</option><option>Ambas caras</option><option>Por confirmar</option></select></label>}
    {occasionIds.has(product.id)&&<label className="variant-field"><span>Ocasión o temática (opcional)</span><input type="text" maxLength="120" placeholder="Ej. Cumpleaños, graduación..." value={details.occasion} onChange={e=>update('occasion',e.target.value)}/></label>}
    {paperIds.has(product.id)&&<label className="variant-field"><span>Papel o material</span><select value={details.material} onChange={e=>update('material',e.target.value)}>{['Por confirmar','Papel bond','Couché','Cartulina','Adhesivo','Otro'].map(x=><option key={x}>{x}</option>)}</select></label>}
    {finishingIds.has(product.id)&&<label className="variant-field"><span>Acabado</span><select value={details.finish} onChange={e=>update('finish',e.target.value)}>{['Por confirmar','Mate','Brillante','Laminado','Troquelado','Otro'].map(x=><option key={x}>{x}</option>)}</select></label>}
    {sizeIds.has(product.id)&&<label className="variant-field"><span>Medida o formato (opcional)</span><input maxLength="100" value={details.pieceSize||''} onChange={e=>update('pieceSize',e.target.value)} placeholder="Ej. 9 × 5 cm; 3 pulgadas" /></label>}
    {clothingIds.has(product.id)&&<><label className="variant-field"><span>Ubicación del diseño</span><select value={details.placement} onChange={e=>update('placement',e.target.value)}>{['Al frente','En la espalda','Frente y espalda','Bordado en pecho','Otro / por confirmar'].map(x=><option key={x}>{x}</option>)}</select></label><label className="variant-field"><span>Prenda o medidas especiales (opcional)</span><input maxLength="120" value={details.sizeNotes||''} onChange={e=>update('sizeNotes',e.target.value)} placeholder="Ej. Polo blanco, bordado pequeño"/></label></>}
    {occasionIds.has(product.id)&&<><div className="event-fields"><label className="variant-field"><span>Nombre del festejado (opcional)</span><input maxLength="70" value={details.eventName||''} onChange={e=>update('eventName',e.target.value)}/></label><label className="variant-field"><span>Edad o número (opcional)</span><input maxLength="15" value={details.eventAge||''} onChange={e=>update('eventAge',e.target.value)} placeholder="Ej. 5"/></label></div><label className="variant-field"><span>Colores de la temática (opcional)</span><input maxLength="90" value={details.eventTheme||''} onChange={e=>update('eventTheme',e.target.value)} placeholder="Ej. Amarillo, blanco y negro"/></label><label className="variant-field"><span>Cantidad de piezas para el evento (opcional)</span><input type="number" min="1" max="10000" value={details.eventQuantity||''} onChange={e=>update('eventQuantity',e.target.value)}/></label></>}
    {giftIds.has(product.id)&&<><label className="variant-field"><span>Colores del arreglo (opcional)</span><input maxLength="90" value={details.giftPalette||''} onChange={e=>update('giftPalette',e.target.value)} placeholder="Ej. Rosa pastel y blanco"/></label><label className="variant-field"><span>Dedicatoria (opcional)</span><textarea rows="2" maxLength="180" value={details.giftMessage||''} onChange={e=>update('giftMessage',e.target.value)}/></label></>}

    <label className="variant-field"><span>¿Ya tienes el diseño?</span><select value={details.designStatus} onChange={e=>update('designStatus',e.target.value)}><option>Tengo el diseño listo</option><option>Quiero que Printyx me lo diseñe</option><option>Necesito asesoría para mi idea</option></select></label>
    <label className="variant-field"><span>{details.designStatus==='Tengo el diseño listo'?'¿Qué diseño deseas utilizar? (opcional)':'Describe tu idea (opcional)'}</span><textarea rows="3" maxLength="450" placeholder={suggested} value={details.designNotes} onChange={e=>update('designNotes',e.target.value)}/></label>
    {details.designStatus==='Tengo el diseño listo'&&<p className="field-hint">Puedes adjuntar el diseño más abajo para compartirlo mediante un enlace protegido.</p>}
    {details.designStatus==='Quiero que Printyx me lo diseñe'&&<p className="field-hint">La elaboración del diseño se cotiza según la complejidad. Confirmaremos el costo antes de realizarlo.</p>}
    <div className="reference-upload">
      <div className="reference-upload-title"><h4>Archivos de diseño (opcional)</h4><span>Hasta 5 archivos · 15 MB cada uno</span></div>
      <p>Los subirás una sola vez. Printyx recibirá enlaces de descarga en el pedido de WhatsApp. Se eliminarán después de 30 días.</p>
      <label className="reference-upload-button">Seleccionar fotos o archivos
        <input type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf" multiple onChange={chooseFiles} aria-label="Seleccionar archivos de referencia" />
      </label>
      {fileError&&<p className="field-error" role="alert">{fileError}</p>}
      {referenceFiles.length>0&&<div className="reference-file-list"><strong>Archivos para subir ({referenceFiles.length})</strong><ul>{referenceFiles.map((file,index)=><li key={index}>{file.name}</li>)}</ul><button type="button" onClick={()=>{onReferenceFilesChange?.([]);onTurnstileTokenChange?.('');setFileError('')}}>Quitar selección</button></div>}
      {referenceFiles.length>0&&<TurnstileChallenge key={challengeVersion} onToken={onTurnstileTokenChange} />}
      <p className="reference-alert"><strong>Privacidad:</strong> cualquier persona con el enlace de descarga podrá abrir el archivo hasta que venza. Evita documentos de identidad u otros datos sensibles. Los archivos se cargan al pulsar «Agregar al carrito».</p>
    </div>
    <label className="variant-field"><span>¿Para qué fecha lo necesitas? (opcional)</span><input type="date" value={details.dueDate} onChange={e=>update('dueDate',e.target.value)}/></label>
    <label className="variant-field"><span>Otras indicaciones (opcional)</span><textarea rows="2" maxLength="400" placeholder="Ej. Color especial, acabado, cantidad por diseño..." value={details.extraNotes} onChange={e=>update('extraNotes',e.target.value)}/></label>
  </div>;
}

// Turnstile requiere una clave pública en src/config.js y su clave secreta en Cloudflare.
function TurnstileChallenge({onToken}){
  const ref=React.useRef(null);
  const [issue,setIssue]=React.useState('');
  React.useEffect(()=>{
    let active=true, widget;
    const { siteKey } = window.PRINTYX_TURNSTILE || {};
    if(!siteKey){setIssue('Falta configurar la clave pública de Turnstile en src/config.js.');return;}
    const render=()=>{
      if(!active || !ref.current || !window.turnstile)return;
      widget=window.turnstile.render(ref.current,{
        sitekey:siteKey,
        callback:(token)=>active&&onToken?.(token),
        'expired-callback':()=>active&&onToken?.(''),
        'error-callback':()=>{if(active){onToken?.('');setIssue('No se pudo completar la verificación. Recarga la página.')}}
      });
    };
    if(window.turnstile){render();}
    else {
      let script=document.querySelector('script[data-printyx-turnstile]');
      if(!script){script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.defer=true;script.dataset.printyxTurnstile='1';document.head.appendChild(script)}
      script.addEventListener('load',render);
      return ()=>{active=false;script.removeEventListener('load',render);if(widget!==undefined && window.turnstile)try{window.turnstile.remove(widget)}catch{}};
    }
    return ()=>{active=false;if(widget!==undefined && window.turnstile)try{window.turnstile.remove(widget)}catch{}};
  },[onToken]);
  return <div><div ref={ref} aria-label="Verificación de seguridad para subir archivos" />{issue&&<p className="field-error">{issue}</p>}</div>;
}
