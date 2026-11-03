import React from 'react';
// Campos personalizados del catálogo. Las reglas por tipo se pueden editar aquí.
const measureIds = new Set(['banners','cuadro-madera','figuras-pvc']);
const occasionIds = new Set(['piniatas','centros-mesa','cajas-fiesta','flores-eternas','arreglo-dulces']);
const printingIds = new Set(['stickers','etiquetas','tarjetas','brochures','calendarios','lanyards','carnes','botones']);
const clothingIds = new Set(['camisa','gorra','bordado','mameluco','boxer','uniformes','mochila']);
const photoIds = new Set(['taza','jarra','termo','cojin','mousepad','llavero','rompecabezas','reloj-led']);

function isMeasured(product){return measureIds.has(product.id);}
export function makeInitialDetails(product){return {
  designStatus:'Tengo el diseño listo',
  designNotes:'',
  width:'', height:'',
  printingSides:'Una cara',
  occasion:'',
  dueDate:'',
  extraNotes:'',
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
  if(occasionIds.has(product.id)&&values.occasion.trim()) result.push(['Ocasión o temática',values.occasion.trim()]);
  result.push(['Diseño',values.designStatus]);
  if(values.designNotes.trim()) result.push(['Detalles del diseño',values.designNotes.trim()]);
  if(values.dueDate) result.push(['Fecha deseada',values.dueDate]);
  if(values.extraNotes.trim()) result.push(['Observaciones',values.extraNotes.trim()]);
  return result;
}

export function ProductCustomizationFields({product,details,onChange,referenceNames=[],onReferenceNamesChange}){
  const [fileError,setFileError] = React.useState('');
  function chooseFiles(event){
    const files=Array.from(event.target.files||[]);
    event.target.value='';
    if(!files.length)return;
    const allowed=new Set(['image/jpeg','image/png','image/webp','image/svg+xml','application/pdf']);
    if(files.length>5){setFileError('Selecciona un máximo de 5 archivos.');return;}
    if(files.some(f=>!allowed.has(f.type))){setFileError('Utiliza imágenes JPG, PNG, WEBP, SVG o archivos PDF.');return;}
    if(files.some(f=>f.size>15*1024*1024)){setFileError('Cada archivo debe pesar 15 MB o menos.');return;}
    setFileError('');
    onReferenceNamesChange?.(files.map(f=>f.name));
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
    <label className="variant-field"><span>¿Ya tienes el diseño?</span><select value={details.designStatus} onChange={e=>update('designStatus',e.target.value)}><option>Tengo el diseño listo</option><option>Quiero que Printyx me lo diseñe</option><option>Necesito asesoría para mi idea</option></select></label>
    <label className="variant-field"><span>{details.designStatus==='Tengo el diseño listo'?'¿Qué diseño deseas utilizar? (opcional)':'Describe tu idea (opcional)'}</span><textarea rows="3" maxLength="450" placeholder={suggested} value={details.designNotes} onChange={e=>update('designNotes',e.target.value)}/></label>
    {details.designStatus==='Tengo el diseño listo'&&<p className="field-hint">Podrás enviarnos el archivo o la fotografía por WhatsApp después de abrir la conversación.</p>}
    {details.designStatus==='Quiero que Printyx me lo diseñe'&&<p className="field-hint">La elaboración del diseño se cotiza según la complejidad. Confirmaremos el costo antes de realizarlo.</p>}
    <div className="reference-upload">
      <div className="reference-upload-title"><h4>Archivos o fotos de referencia (opcional)</h4><span>Hasta 5 archivos</span></div>
      <p>Selecciona cuáles usarás en tu pedido. Los nombres se añadirán a tu carrito para recordarte qué enviar.</p>
      <label className="reference-upload-button">Seleccionar fotos o archivos
        <input type="file" accept=".jpg,.jpeg,.png,.webp,.svg,.pdf,image/jpeg,image/png,image/webp,image/svg+xml,application/pdf" multiple onChange={chooseFiles} aria-label="Seleccionar archivos de referencia" />
      </label>
      {fileError&&<p className="field-error" role="alert">{fileError}</p>}
      {referenceNames.length>0&&<div className="reference-file-list"><strong>Archivos seleccionados ({referenceNames.length})</strong><ul>{referenceNames.map((name,index)=><li key={index}>{name}</li>)}</ul><button type="button" onClick={()=>{onReferenceNamesChange?.([]);setFileError('')}}>Quitar selección</button></div>}
      <p className="reference-alert"><strong>Importante:</strong> estos archivos no se suben ni se adjuntan automáticamente. Al abrir WhatsApp, tendrás que enviarlos tú misma/o en la conversación. La web solo guarda sus nombres para el pedido.</p>
    </div>
    <label className="variant-field"><span>¿Para qué fecha lo necesitas? (opcional)</span><input type="date" value={details.dueDate} onChange={e=>update('dueDate',e.target.value)}/></label>
    <label className="variant-field"><span>Otras indicaciones (opcional)</span><textarea rows="2" maxLength="400" placeholder="Ej. Color especial, acabado, cantidad por diseño..." value={details.extraNotes} onChange={e=>update('extraNotes',e.target.value)}/></label>
  </div>;
}
