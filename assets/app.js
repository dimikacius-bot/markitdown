/* Mitry Watch — repertoire horloger. Donnees: window.WATCHES (assets/data.js). */
(() => {
"use strict";

const CASE_LABELS = {
  steel:"Acier", "steel-pvd":"Acier PVD", "steel-gold":"Acier & or", titanium:"Titane",
  gold:"Or", ceramic:"Céramique", bioceramic:"Bioceramic", carbon:"Carbone",
  aluminium:"Aluminium", brass:"Laiton", resin:"Résine", composite:"Composite",
  breitlight:"Breitlight", stone:"Granit", wood:"Bois",
};
const TYPE_LABELS  = {auto:"Automatique", manuel:"Remontage manuel", quartz:"Quartz",
                      solaire:"Solaire", springdrive:"Spring Drive", kinetic:"Kinetic",
                      "connectée":"Connectée"};
const STYLE_LABELS = {dive:"Plongée", chrono:"Chronographe", dress:"Habillée",
                      pilot:"Aviation", sport:"Sport"};
const DISP_LABELS  = {aiguilles:"Aiguilles", digital:"Écran", hybride:"Écran + aiguilles"};
const GLASS_LABELS = {acr:"Acrylique", min:"Minéral", sap:"Saphir"};
const BAND_LABELS  = {bracelet:"Bracelet métal", integrated:"Bracelet intégré", nato:"NATO",
                      rubber:"Caoutchouc", "leather-brown":"Cuir brun",
                      "leather-black":"Cuir noir", leather:"Cuir"};
const STOPS = [0,100,200,300,400,500,750,1000,1500,2000,3000,5000,7500,10000,
               15000,25000,50000,100000,250000];
const LAST = STOPS.length - 1;
const METALS = {
  steel:["#f2f2f2","#8f8f8f","#d6d6d6"], "steel-pvd":["#4a4a4a","#161616","#333"],
  "steel-gold":["#f4e2b6","#9a7c3e","#e2cf9c"], silver:["#eee","#a0a0a0","#dcdcdc"],
  titanium:["#dedcd6","#8d8b85","#c4c2bb"], gold:["#f0d69a","#a8823f","#dcbb75"],
  ceramic:["#4a4744","#141210","#2e2b28"], bioceramic:["#e9e5dd","#a49c8d","#d3ccc0"],
  carbon:["#54545a","#131317","#33333a"], aluminium:["#eceff2","#98a0a8","#cfd6dc"],
  brass:["#efdcb0","#a4834a","#dcc48a"], composite:["#4c4a44","#191814","#333029"],
  breitlight:["#43423e","#141310","#2b2a26"], black:["#3d3d3d","#101010","#2a2a2a"],
  resin:["#3a3a36","#141412","#2b2b27"],
  stone:["#8d8f86","#4a4c46","#6e7068"], wood:["#c08a52","#6b4425","#9a6a3c"],
};

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const fmt = p => p.toLocaleString("fr-FR") + " €";
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")
                          .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const norm = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const slug = s => s.replace(/[^a-zA-Z0-9]/g,"");
// le titre annonce le nombre de maisons en toutes lettres : il doit suivre le
// repertoire sans qu'on y pense
const enLettres = n => {
  const u = ["zéro","une","deux","trois","quatre","cinq","six","sept","huit","neuf","dix",
             "onze","douze","treize","quatorze","quinze","seize","dix-sept","dix-huit","dix-neuf"];
  const d = {2:"vingt",3:"trente",4:"quarante",5:"cinquante",6:"soixante",8:"quatre-vingt"};
  if(n < 20) return u[n];
  if(n >= 100) return String(n);
  const base = n < 70 ? Math.floor(n/10) : n < 80 ? 6 : 8;
  const reste = n - base*10;
  if(!reste) return base === 8 ? "quatre-vingts" : d[base];
  const et = (reste === 1 && base < 8) || (reste === 11 && base === 6);
  return d[base] + (et ? " et " : "-") + u[reste];
};
const buyLink = w => "https://www.google.com/search?q=" +
  encodeURIComponent(w.ref ? `${w.brand} "${w.ref}"` : `${w.brand} ${w.model} montre`);

/* ---------------------------------------------------------------- rendu SVG */
function seedNum(s){let h=0;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))%100000;return h}
function isLight(hex){
  const c = String(hex||"#101010").replace("#","");
  if(c.length!==6) return false;
  const r=parseInt(c.slice(0,2),16), g=parseInt(c.slice(2,4),16), b=parseInt(c.slice(4,6),16);
  return (0.299*r+0.587*g+0.114*b)/255 > 0.6;
}
function watchSVG(w){
  const uid = slug(w.brand + w.model), h = seedNum(uid);
  const shape=w.shape||"round", band=w.band||"bracelet", idx=w.idx||"baton";
  const bezel=w.bezel||"none", dial=w.dial||"#101010";
  const met = METALS[w.metal] || METALS[w.case] || METALS.steel;
  const CX=80, CY=105, digital = w.disp==="digital";
  const light = isLight(dial), hand = light ? "#1a1a1a" : "#ece7da";
  const bandW = band==="integrated" ? 54 : 38, bx = CX - bandW/2;
  const time = "10:" + String(h%60).padStart(2,"0");
  let o = "";

  if(band==="bracelet" || band==="integrated"){
    for(let i=0;i<5;i++){
      o += `<rect x="${bx}" y="${8+i*11}" width="${bandW}" height="9" rx="2.5" fill="url(#${uid}-met)" stroke="#00000033" stroke-width="0.5"/>`;
      o += `<rect x="${bx}" y="${158+i*11}" width="${bandW}" height="9" rx="2.5" fill="url(#${uid}-met)" stroke="#00000033" stroke-width="0.5"/>`;
    }
  } else if(band==="nato"){
    o += `<rect x="${bx}" y="6" width="${bandW}" height="58" fill="#4a5240"/><rect x="${bx+13}" y="6" width="5" height="58" fill="#6c7458"/>`;
    o += `<rect x="${bx}" y="150" width="${bandW}" height="58" fill="#4a5240"/><rect x="${bx+13}" y="150" width="5" height="58" fill="#6c7458"/>`;
  } else if(band==="rubber"){
    o += `<path d="M${bx+3} 62 L${bx+bandW-3} 62 L${bx+bandW-6} 8 Q${CX} 2 ${bx+6} 8 Z" fill="#26261f"/>`;
    o += `<path d="M${bx+3} 148 L${bx+bandW-3} 148 L${bx+bandW-6} 202 Q${CX} 208 ${bx+6} 202 Z" fill="#26261f"/>`;
    [20,34,172,186].forEach(y => { o += `<rect x="${bx+6}" y="${y}" width="${bandW-12}" height="2.5" rx="1" fill="#15150f"/>`; });
  } else {
    const lea = band==="leather-brown" ? "#5c3a22" : "#1e1c18";
    const sti = band==="leather-brown" ? "#a8794c" : "#5a554a";
    o += `<path d="M${bx+2} 62 L${bx+bandW-2} 62 L${bx+bandW-7} 10 Q${CX} 4 ${bx+7} 10 Z" fill="${lea}"/>`;
    o += `<path d="M${bx+2} 148 L${bx+bandW-2} 148 L${bx+bandW-7} 200 Q${CX} 206 ${bx+7} 200 Z" fill="${lea}"/>`;
    o += `<line x1="${bx+7}" y1="58" x2="${bx+bandW-7}" y2="58" stroke="${sti}" stroke-width="1" stroke-dasharray="3 3"/>`;
    o += `<line x1="${bx+7}" y1="152" x2="${bx+bandW-7}" y2="152" stroke="${sti}" stroke-width="1" stroke-dasharray="3 3"/>`;
  }

  const shell = (r,f,s) => {
    if(shape==="cushion") return `<rect x="${CX-r}" y="${CY-r}" width="${r*2}" height="${r*2}" rx="${r*0.42}" fill="${f}" stroke="${s}" stroke-width="0.6"/>`;
    if(shape==="square")  return `<rect x="${CX-r}" y="${CY-r}" width="${r*2}" height="${r*2}" rx="${r*0.3}" fill="${f}" stroke="${s}" stroke-width="0.6"/>`;
    if(shape==="tonneau") return `<rect x="${CX-r}" y="${CY-r*0.95}" width="${r*2}" height="${r*1.9}" rx="${r*0.28}" fill="${f}" stroke="${s}" stroke-width="0.6"/>`;
    if(shape==="rect")    return `<rect x="${CX-r*0.82}" y="${CY-r}" width="${r*1.64}" height="${r*2}" rx="${r*0.42}" fill="${f}" stroke="${s}" stroke-width="0.6"/>`;
    return `<circle cx="${CX}" cy="${CY}" r="${r}" fill="${f}" stroke="${s}" stroke-width="0.6"/>`;
  };

  o += shape==="rect"
    ? `<rect x="${CX+42}" y="${CY-14}" width="6" height="14" rx="3" fill="url(#${uid}-met)"/>`
    : `<rect x="${CX+52}" y="${CY-6}" width="7" height="12" rx="2" fill="url(#${uid}-met)"/>`;
  o += shell(55, `url(#${uid}-met)`, "#00000055");

  if(digital){
    o += shell(46, `url(#${uid}-scr)`, "#000000");
    if(w.screen==="mono"){
      o += `<text x="${CX}" y="${CY-4}" text-anchor="middle" fill="#7df0cd" font-size="27" font-family="monospace">${time}</text>`;
      o += `<text x="${CX}" y="${CY+14}" text-anchor="middle" fill="#3d8f78" font-size="9" font-family="monospace">ALT 412 m</text>`;
      o += `<rect x="${CX-30}" y="${CY+24}" width="60" height="4" rx="2" fill="#12362c"/>`;
      o += `<rect x="${CX-30}" y="${CY+24}" width="${22+(h%34)}" height="4" rx="2" fill="#7df0cd"/>`;
    } else {
      o += `<text x="${CX}" y="${CY-2}" text-anchor="middle" fill="#f4f4f6" font-size="30" font-family="monospace">${time}</text>`;
      o += `<text x="${CX}" y="${CY+16}" text-anchor="middle" fill="#8a8fa0" font-size="9" font-family="monospace">ACTIVITE</text>`;
      o += `<circle cx="${CX}" cy="${CY+34}" r="10" fill="none" stroke="#2a2f3d" stroke-width="3"/>`;
      o += `<path d="M ${CX} ${CY+24} A 10 10 0 0 1 ${CX+9} ${CY+39}" fill="none" stroke="#4ade80" stroke-width="3" stroke-linecap="round"/>`;
    }
  } else {
    if(bezel==="dive"){
      o += `<circle cx="${CX}" cy="${CY}" r="55" fill="${w.bezelColor||"#111111"}"/><circle cx="${CX}" cy="${CY}" r="55" fill="none" stroke="#00000066" stroke-width="1"/>`;
      for(let i=0;i<12;i++){ const a=i*30*Math.PI/180;
        o += `<line x1="${CX+51*Math.sin(a)}" y1="${CY-51*Math.cos(a)}" x2="${CX+47*Math.sin(a)}" y2="${CY-47*Math.cos(a)}" stroke="#e7dcc0" stroke-width="1.6"/>`; }
      o += `<polygon points="${CX-4},${CY-52} ${CX+4},${CY-52} ${CX},${CY-44}" fill="#e7dcc0"/>`;
    }
    o += shell(bezel==="dive" ? 44 : 46, `url(#${uid}-dial)`, "#00000066");
    const ro = bezel==="inner" ? 33 : 39;
    if(bezel==="inner"){
      for(let i=0;i<12;i++){ const a=i*30*Math.PI/180;
        o += `<text x="${CX+39*Math.sin(a)}" y="${CY-39*Math.cos(a)+3}" text-anchor="middle" fill="#9c8a5a" font-size="6" font-family="monospace">${i*30}</text>`; }
    }
    if(w.chrono){
      o += `<circle cx="${CX}" cy="${CY-19}" r="12" fill="#00000033" stroke="#ffffff26" stroke-width="0.8"/>`;
      o += `<circle cx="${CX-19}" cy="${CY+8}" r="12" fill="#00000033" stroke="#ffffff26" stroke-width="0.8"/>`;
      o += `<circle cx="${CX+19}" cy="${CY+8}" r="12" fill="#00000033" stroke="#ffffff26" stroke-width="0.8"/>`;
    }
    if(w.disp==="hybride"){
      o += `<rect x="${CX-20}" y="${CY+18}" width="40" height="16" rx="3" fill="#0a1a14" stroke="#2c5c4c" stroke-width="0.8"/>`;
      o += `<text x="${CX}" y="${CY+30}" text-anchor="middle" fill="#7df0cd" font-size="10" font-family="monospace">${time}</text>`;
    }
    if(idx==="museum"){
      o += `<circle cx="${CX}" cy="${CY-32}" r="5" fill="#d8b56a"/>`;
    } else {
      for(let i=0;i<12;i++){
        const a=i*30*Math.PI/180, sx=CX+ro*Math.sin(a), sy=CY-ro*Math.cos(a);
        if(idx==="roman"||idx==="arabic"||idx==="field"){
          if(idx!=="field" && i%3!==0){
            o += `<line x1="${sx}" y1="${sy}" x2="${CX+(ro-4)*Math.sin(a)}" y2="${CY-(ro-4)*Math.cos(a)}" stroke="${hand}" stroke-width="1" opacity="0.7"/>`;
          } else {
            const lbl = idx==="roman" ? ["XII","I","II","III","IV","V","VI","VII","VIII","IX","X","XI"][i] : (i===0?12:i);
            o += `<text x="${sx}" y="${sy+3}" text-anchor="middle" fill="${hand}" font-size="${idx==="field"?7:8}" font-family="serif">${lbl}</text>`;
          }
        } else if(idx==="applied"){
          const px=CX+(ro-5)*Math.sin(a), py=CY-(ro-5)*Math.cos(a);
          o += `<rect x="${px-1.7}" y="${py-4}" width="3.4" height="8" rx="1" fill="${hand}" transform="rotate(${i*30} ${px} ${py})"/>`;
        } else {
          o += `<line x1="${sx}" y1="${sy}" x2="${CX+(ro-7)*Math.sin(a)}" y2="${CY-(ro-7)*Math.cos(a)}" stroke="${hand}" stroke-width="${i%3===0?2.2:1.2}"/>`;
        }
      }
    }
    if(w.date){
      o += `<rect x="${CX+22}" y="${CY-6}" width="16" height="12" rx="1.5" fill="${light?"#ffffff":"#eae5d8"}" stroke="#00000044" stroke-width="0.6"/>`;
      o += `<text x="${CX+30}" y="${CY+3}" text-anchor="middle" fill="#1a1a1a" font-size="8">${(h%28)+1}</text>`;
    }
    o += `<line x1="${CX}" y1="${CY}" x2="${CX+23*Math.sin(310*Math.PI/180)}" y2="${CY-23*Math.cos(310*Math.PI/180)}" stroke="${hand}" stroke-width="4" stroke-linecap="round"/>`;
    o += `<line x1="${CX}" y1="${CY}" x2="${CX+34*Math.sin(62*Math.PI/180)}" y2="${CY-34*Math.cos(62*Math.PI/180)}" stroke="${hand}" stroke-width="2.6" stroke-linecap="round"/>`;
    o += `<circle cx="${CX}" cy="${CY}" r="2.8" fill="${hand}"/>`;
  }
  o += shell(46, `url(#${uid}-gl)`, "none");

  return `<svg viewBox="0 0 160 208" role="img" aria-label="Illustration de la ${esc(w.brand)} ${esc(w.model)}">
    <defs>
      <linearGradient id="${uid}-met" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${met[0]}"/><stop offset="48%" stop-color="${met[1]}"/><stop offset="100%" stop-color="${met[2]}"/></linearGradient>
      <radialGradient id="${uid}-dial" cx="50%" cy="38%" r="72%"><stop offset="0%" stop-color="${dial}"/><stop offset="100%" stop-color="${w.dialGrad||dial}"/></radialGradient>
      <radialGradient id="${uid}-scr" cx="50%" cy="35%" r="75%"><stop offset="0%" stop-color="${w.screen==="mono"?"#12281f":"#141821"}"/><stop offset="100%" stop-color="#05070a"/></radialGradient>
      <linearGradient id="${uid}-gl" x1="0" y1="0" x2="0.7" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/><stop offset="45%" stop-color="#ffffff" stop-opacity="0.03"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
    </defs>${o}</svg>`;
}

/* ------------------------------------------------------------------- etat */
const ALL = window.WATCHES.map(w => ({
  ...w,
  _s: norm([w.brand, w.model, w.ref||"", w.note, CASE_LABELS[w.case]||"",
            TYPE_LABELS[w.type]||""].join(" ")),
}));
const IMGBASE = window.IMGBASE || {};
// deux definitions servies : vignette legere pour la grille et le ruban,
// pleine taille pour la vitrine et la fiche. La version un-seul-fichier
// n'en embarque qu'une, d'ou le repli sur IMGBASE.
const shotURL = (f, size = "full") => IMGBASE[f] || `img/${size}/${f}`;

const F = {q:"", brands:new Set(), types:new Set(), cases:new Set(), styles:new Set(),
           disp:new Set(), lo:0, hi:LAST, dmin:0, dmax:60, photo:false,
           sort:"brand", group:true};

const facet = (key, fn) => {
  const m = new Map();
  for(const w of ALL){ const v = fn(w); if(v!=null) m.set(v,(m.get(v)||0)+1); }
  return [...m.entries()];
};

function pass(w, skip){
  if(F.q && !w._s.includes(F.q)) return false;
  if(skip!=="brands" && F.brands.size && !F.brands.has(w.brand)) return false;
  if(skip!=="types"  && F.types.size  && !F.types.has(w.type)) return false;
  if(skip!=="cases"  && F.cases.size  && !F.cases.has(w.case)) return false;
  if(skip!=="styles" && F.styles.size && !F.styles.has(w.style)) return false;
  if(skip!=="disp"   && F.disp.size   && !F.disp.has(w.disp)) return false;
  if(w.price < STOPS[F.lo] || (F.hi<LAST && w.price > STOPS[F.hi])) return false;
  if(w.dia != null && (w.dia < F.dmin || w.dia > F.dmax)) return false;
  if(F.photo && !w.shots.length) return false;
  return true;
}
const selected = () => ALL.filter(w => pass(w));

/* ------------------------------------------------------------------ rendu */
function shotHTML(w, lazy=true){
  const s = w.shots[0];
  if(!s) return `<div class="shot">${watchSVG(w)}<span class="tag">Illustration</span></div>`;
  const label = s.tier === "famille" ? "Photo · variante" : "Photo";
  return `<div class="shot"><img src="${esc(shotURL(s.file, "thumb"))}" alt="${esc(w.brand+" "+w.model)}"
    ${lazy?'loading="lazy" decoding="async"':""}>
    <span class="tag photo">${label}</span></div>`;
}

function cardHTML(w){
  const bits = [TYPE_LABELS[w.type]||w.type, w.size, CASE_LABELS[w.case]||""];
  return `<button class="card" data-id="${esc(w.id)}">
    ${shotHTML(w)}
    <div class="cbody">
      <div class="cbrand">${esc(w.brand)}</div>
      <div class="cmodel">${esc(w.model)}</div>
      <div class="cprice">${w.ok?"":"≈ "}${fmt(w.price)} ${w.ok?'<small>✓ relevé</small>':""}</div>
      <div class="cmeta">${bits.filter(Boolean).map(b=>`<span class="pill">${esc(b)}</span>`).join("")}</div>
    </div></button>`;
}

function render(){
  const list = selected();
  // dans chaque maison, les pieces photographiees ouvrent la serie : arriver sur
  // une rangee de dessins donne l'impression d'un catalogue inachevé
  const cmp = {
    brand:(a,b)=> a.brand.localeCompare(b.brand,"fr")
      || (b.shots.length ? 1 : 0) - (a.shots.length ? 1 : 0)
      || a.price-b.price,
    priceUp:(a,b)=> a.price-b.price,
    priceDown:(a,b)=> b.price-a.price,
    dia:(a,b)=> (a.dia||0)-(b.dia||0),
    name:(a,b)=> a.model.localeCompare(b.model,"fr"),
  }[F.sort];
  list.sort(cmp);

  const out = $("#out");
  if(!list.length){
    out.innerHTML = `<div class="empty"><b>Aucune montre</b>
      Aucune pièce ne correspond à ces critères. Élargissez la sélection.</div>`;
  } else if(F.group && F.sort==="brand"){
    const by = new Map();
    for(const w of list) (by.get(w.brand) || by.set(w.brand,[]).get(w.brand)).push(w);
    out.innerHTML = [...by.entries()].map(([b,ws]) => {
      const lo = Math.min(...ws.map(w=>w.price)), hi = Math.max(...ws.map(w=>w.price));
      return `<section><div class="brandhead" id="b-${esc(slug(b))}">
          <h2>${esc(b)}</h2><span>${ws.length} pièce${ws.length>1?"s":""}</span>
          <em>${fmt(lo)}${lo!==hi?" – "+fmt(hi):""}</em></div>
        <div class="grid">${ws.map(cardHTML).join("")}</div></section>`;
    }).join("");
  } else {
    out.innerHTML = `<div class="grid">${list.map(cardHTML).join("")}</div>`;
  }

  reveler();
  fondu(out);
  const brands = new Set(list.map(w=>w.brand)).size;
  const cpt = $("#count");
  cpt.innerHTML = `<b>${list.length}</b> montre${list.length>1?"s":""}
    · <b>${brands}</b> maison${brands>1?"s":""}`;
  // le decompte change a chaque frappe : un bref voile le signale sans clignoter
  cpt.classList.remove("maj"); void cpt.offsetWidth; cpt.classList.add("maj");
  // un filtre actif ne doit jamais passer inapercu : sans ce rappel, un
  // catalogue restreint se confond avec un catalogue incomplet
  const actifs = F.brands.size + F.types.size + F.cases.size + F.styles.size + F.disp.size
    + (F.q ? 1 : 0) + (F.photo ? 1 : 0) + (F.lo > 0 || F.hi < LAST ? 1 : 0)
    + (F.dmin > 0 || F.dmax < 60 ? 1 : 0);
  $("#actifs").hidden = actifs === 0;
  $("#actifs-n").textContent = actifs;
  refreshCounts();
}

/* ------------------------------------------------ apparition au defilement */
/* Fondu a l'arrivee des photos. Seules les images pas encore peintes reçoivent
   la classe, et l'echec de chargement la leve comme la reussite : une image
   absente ne peut donc pas laisser une case blanche. */
function fondu(racine){
  for(const img of $$("img", racine)){
    if(img.complete || img.classList.contains("fondu")) continue;
    img.classList.add("fondu");
    const vue = () => img.classList.add("vue");
    img.addEventListener("load", vue, {once: true});
    img.addEventListener("error", vue, {once: true});
  }
}

let veilleur = null;
function reveler(){
  if(!("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("reveal");
  veilleur = veilleur || new IntersectionObserver(entrees => {
    for(const e of entrees){
      if(!e.isIntersecting) continue;
      // léger décalage d'une carte à l'autre : la rangée se dévoile de gauche
      // à droite au lieu d'apparaître d'un bloc
      const i = [...e.target.parentElement.children].indexOf(e.target);
      e.target.style.transitionDelay = Math.min(i % 8, 7) * 45 + "ms";
      e.target.classList.remove("hidden");
      veilleur.unobserve(e.target);
    }
  }, {rootMargin: "260px 0px", threshold: 0.02});
  for(const el of $$(".card:not(.vu), .brandhead:not(.vu)")){
    el.classList.add("hidden", "vu");
    veilleur.observe(el);
  }
}

/* ---- facettes : le compteur montre ce qui resterait si on coche l'entree ---- */
function refreshCounts(){
  const map = {brands:w=>w.brand, types:w=>w.type, cases:w=>w.case,
               styles:w=>w.style, disp:w=>w.disp};
  for(const [group, get] of Object.entries(map)){
    const pool = ALL.filter(w => pass(w, group));
    const n = new Map();
    for(const w of pool) n.set(get(w), (n.get(get(w))||0)+1);
    for(const el of $$(`.chip[data-g="${group}"]`)){
      const c = n.get(el.dataset.v) || 0;
      el.querySelector("i").textContent = c;
      el.classList.toggle("on", F[group].has(el.dataset.v));
      el.disabled = c===0 && !F[group].has(el.dataset.v);
      el.style.opacity = el.disabled ? .38 : 1;
    }
  }
}

function chipRow(group, entries, labels, sortByCount=true){
  entries.sort(sortByCount ? (a,b)=> b[1]-a[1] || String(a[0]).localeCompare(String(b[0]),"fr")
                           : (a,b)=> String(a[0]).localeCompare(String(b[0]),"fr"));
  return entries.map(([v,c]) =>
    `<button class="chip" data-g="${group}" data-v="${esc(v)}">
       ${esc(labels[v]||v)} <i>${c}</i></button>`).join("");
}

function buildPanel(){
  $("#f-brands").innerHTML = chipRow("brands", facet("brand", w=>w.brand), {}, false);
  $("#f-types").innerHTML  = chipRow("types",  facet("type",  w=>w.type),  TYPE_LABELS);
  $("#f-cases").innerHTML  = chipRow("cases",  facet("case",  w=>w.case),  CASE_LABELS);
  $("#f-styles").innerHTML = chipRow("styles", facet("style", w=>w.style), STYLE_LABELS);
  $("#f-disp").innerHTML   = chipRow("disp",   facet("disp",  w=>w.disp),  DISP_LABELS);

  $("#panel").addEventListener("click", e => {
    const chip = e.target.closest(".chip"); if(!chip) return;
    const set = F[chip.dataset.g];
    set.has(chip.dataset.v) ? set.delete(chip.dataset.v) : set.add(chip.dataset.v);
    render(); saveState();
  });
}

function priceLabel(){
  $("#priceval").innerHTML = `<b>${fmt(STOPS[F.lo])}</b> – <b>${
    F.hi>=LAST ? "sans limite" : fmt(STOPS[F.hi])}</b>`;
}
function diaLabel(){
  $("#diaval").innerHTML = `<b>${F.dmin} mm</b> – <b>${F.dmax>=60?"sans limite":F.dmax+" mm"}</b>`;
}

/* ------------------------------------------------------------------ fiche */
function specRows(w){
  const yes = v => v ? "Oui" : "Non";
  const rows = [
    ["Prix", (w.ok?"":"≈ ") + fmt(w.price) + (w.ok?" · relevé":" · estimation")],
    w.market ? ["Cote marché", fmt(w.market)] : null,
    ["Mouvement", TYPE_LABELS[w.type]||w.type],
    ["Boîtier", CASE_LABELS[w.case]||w.case],
    ["Taille", w.size],
    ["Affichage", DISP_LABELS[w.disp]||w.disp],
    ["Style", STYLE_LABELS[w.style]||w.style],
    w.glass ? ["Verre", GLASS_LABELS[w.glass]] : null,
    w.wr ? ["Étanchéité", w.wr + " m"] : null,
    w.band ? ["Bracelet", BAND_LABELS[w.band]||w.band] : null,
    ["Date", yes(w.date)],
    w.chrono ? ["Chronographe", "Oui"] : null,
    w.ref ? ["Référence", w.ref] : null,
  ].filter(Boolean);
  return rows.map(([k,v]) =>
    `<div class="spec"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
}

function creditHTML(w){
  const s = w.shots[0];
  if(!s) return `<p class="credit">Visuel : rendu vectoriel généré à partir des
    caractéristiques de la pièce — ce n'est pas une photographie du garde-temps.</p>`;
  if(s.src !== "commons") return "";
  const who = s.artist ? esc(s.artist) : "auteur non précisé";
  const warn = s.tier === "famille"
    ? `<br><strong>Variante :</strong> cette photo illustre la collection, pas nécessairement la référence exacte.`
    : "";
  return `<p class="credit">Photo : <a href="${esc(s.page)}" target="_blank" rel="noopener">${esc(s.title)}</a>
    — ${who}, ${esc(s.license||"voir la page")} via Wikimedia Commons.${warn}</p>`;
}

function openSheet(id){
  const w = ALL.find(x => x.id === id); if(!w) return;
  const shots = w.shots;
  const big = i => shots[i]
    ? `<img src="${esc(shotURL(shots[i].file))}" alt="${esc(w.brand+" "+w.model)}">`
    : watchSVG(w);
  $("#sheet-in").innerHTML = `
    <button class="close" id="sheet-close" aria-label="Fermer">×</button>
    <div class="sheet-grid">
      <div class="sheet-shot" id="sheet-shot">${big(0)}
        ${shots.length>1 ? `<div class="thumbs">${shots.map((s,i)=>
          `<button data-i="${i}" class="${i?"":"on"}"><img src="${esc(shotURL(s.file, "thumb"))}" alt=""></button>`
        ).join("")}</div>` : ""}</div>
      <div class="sheet-body">
        <div class="cbrand">${esc(w.brand)}</div>
        <h2>${esc(w.model)}</h2>
        <div class="sheet-price">${w.ok?"":"≈ "}${fmt(w.price)}</div>
        <p class="sheet-note">${esc(w.note)}</p>
        <dl class="specs">${specRows(w)}</dl>
        ${creditHTML(w)}
        <div class="sheet-actions">
          <a class="btn primary" href="${esc(w.marketUrl || buyLink(w))}"
             target="_blank" rel="noopener">Cote du marché</a>
          <a class="btn" href="${esc(w.searchUrl || buyLink(w))}"
             target="_blank" rel="noopener">Trouver un vendeur</a>
          <a class="btn" href="${esc(w.officialUrl || buyLink(w))}"
             target="_blank" rel="noopener">Site ${esc(w.brand)}</a>
          <button class="btn" id="sheet-close2">Fermer</button>
        </div>
        <p class="credit">${w.ok
            ? "Prix relevé en août 2026 sur le marché français."
            : "Prix estimé, non relevé : les liens ci-dessus donnent le tarif réel du jour."}
          Ils interrogent ${esc(w.ref ? "la référence " + w.ref : w.brand + " " + w.model)}
          et affichent les annonces correspondantes.</p>
      </div>
    </div>`;
  const dlg = $("#sheet");
  $("#sheet-close").onclick = $("#sheet-close2").onclick = fermeSheet;
  $$("#sheet .thumbs button").forEach(b => b.onclick = () => {
    $$("#sheet .thumbs button").forEach(x => x.classList.remove("on"));
    b.classList.add("on");
    const shot = $("#sheet-shot");
    shot.firstElementChild.outerHTML = big(+b.dataset.i);
    fondu(shot);
  });
  if(!dlg.open) dlg.showModal();
  fondu(dlg);
}

/* La fiche redescend au lieu de disparaitre. Le repli ferme sans attendre :
   une fiche qui resterait ouverte serait pire qu'une fermeture seche. */
function fermeSheet(){
  const dlg = $("#sheet");
  if(!dlg.open || dlg.classList.contains("ferme")) return;
  if(matchMedia("(prefers-reduced-motion: reduce)").matches){ dlg.close(); return; }
  dlg.classList.add("ferme");
  setTimeout(() => { dlg.classList.remove("ferme"); dlg.close(); }, 230);
}

/* ---------------------------------------------------- vitrine d'accueil */
/* Pieces mises en avant : uniquement des photographies, une par maison, et
   reparties sur toute l'echelle de prix pour montrer l'etendue du repertoire. */
const FEATURED_FIRST = ["breitling-navitimer-b01", "cartier-santos-medium",
  "omega-seamaster-diver-300m-chronographe", "tudor-black-bay-58",
  "iwc-ingenieur-automatic-40", "rolex-datejust-41", "tissot-prx-powermatic-80",
  "seiko-alpinist-spb121", "rolex-submariner-date"];

function featured(n = 40){
  const byId = new Map(ALL.map(w => [w.id, w]));
  const pick = [], brands = new Set();
  const take = w => {
    if(!w || !w.shots.length || brands.has(w.brand)) return;
    brands.add(w.brand); pick.push(w);
  };
  FEATURED_FIRST.forEach(id => take(byId.get(id)));
  // une maison n'apparait qu'une fois, et on descend l'echelle de prix pour
  // que le ruban traverse tout le repertoire, du grand complication au quartz
  ALL.filter(w => w.shots[0]?.tier === "exact")
     .sort((a,b) => b.price - a.price)
     .forEach(w => { if(pick.length < n) take(w); });
  ALL.filter(w => w.shots.length)
     .sort((a,b) => b.price - a.price)
     .forEach(w => { if(pick.length < n) take(w); });
  return pick.slice(0, n);
}

let showList = [], showAt = 0, showTimer = 0, showPinned = false;

function paintShow(){
  const w = showList[showAt]; if(!w) return;
  const s = w.shots[0];
  $("#stage").innerHTML =
    `<span class="stage-tag">${s.tier === "famille" ? "Photo · variante" : "Photo"}</span>
     <img src="${esc(shotURL(s.file))}" alt="${esc(w.brand + " " + w.model)}">
     <div class="stage-nav">
       <button type="button" data-d="-1" aria-label="Montre précédente">‹</button>
       <button type="button" data-d="1" aria-label="Montre suivante">›</button>
     </div>`;
  $("#show-count").textContent = `${showAt + 1} / ${showList.length}`;
  $("#show-brand").textContent = w.brand;
  $("#show-model").textContent = w.model;
  $("#show-price").innerHTML = `${w.ok ? "" : "≈ "}${fmt(w.price)}
    <small>${w.ok ? "tarif relevé" : "estimation"}</small>`;
  $("#show-note").textContent = w.note;
  $("#show-meta").innerHTML = [TYPE_LABELS[w.type] || w.type, w.size,
    CASE_LABELS[w.case] || "", w.wr ? w.wr + " m" : ""]
    .filter(Boolean).map(b => `<span class="pill">${esc(b)}</span>`).join("");
  $("#show-site").href = w.officialUrl || "#";
  $("#show-site").textContent = "Site " + w.brand;
  $$("#ribbon-track .ribbon-item").forEach(b => {
    b.classList.toggle("on", +b.dataset.i === showAt);
  });
  // relance l'apparition du texte : retirer puis remettre la classe ne suffit
  // pas sans forcer un recalcul de style entre les deux
  const copy = $(".show-copy");
  copy.classList.remove("maj");
  void copy.offsetWidth;
  copy.classList.add("maj");
}

function goShow(i, manual){
  showAt = (i + showList.length) % showList.length;
  paintShow();
  if(manual){ showPinned = true; clearInterval(showTimer); showTimer = 0; }
}

function ribbonItem(w, i, clone){
  return `<button type="button" class="ribbon-item" data-i="${i}"
    ${clone ? 'tabindex="-1" aria-hidden="true"' : ""}
    title="${esc(w.brand + " " + w.model + " — " + fmt(w.price))}">
    <img src="${esc(shotURL(w.shots[0].file, "thumb"))}" alt="${clone ? "" : esc(w.brand + " " + w.model)}"
      loading="lazy" decoding="async">
    <span class="ribbon-cap">${esc(w.brand)}</span></button>`;
}

function buildShow(){
  showList = featured();
  if(!showList.length){ $(".showcase").remove(); return; }
  // la piste contient deux fois la serie : l'animation s'arrete a -50 %,
  // exactement sur le debut du second exemplaire, d'ou une boucle sans couture
  const track = $("#ribbon-track");
  track.innerHTML = showList.map((w, i) => ribbonItem(w, i, false)).join("")
                  + showList.map((w, i) => ribbonItem(w, i, true)).join("");
  // vitesse constante quel que soit le nombre de pieces : environ 45 px/s
  track.style.setProperty("--ribbon-duree", Math.round(showList.length * 2.4) + "s");
  track.onclick = e => {
    const b = e.target.closest(".ribbon-item"); if(b) goShow(+b.dataset.i, true);
  };
  $("#stage").onclick = e => {
    const nav = e.target.closest(".stage-nav button");
    if(nav){ goShow(showAt + (+nav.dataset.d), true); return; }
    openSheet(showList[showAt].id);
  };
  $("#stage").onkeydown = e => {
    if(e.key === "Enter" || e.key === " "){ e.preventDefault(); openSheet(showList[showAt].id); }
    if(e.key === "ArrowRight") goShow(showAt + 1, true);
    if(e.key === "ArrowLeft") goShow(showAt - 1, true);
  };
  $("#show-open").onclick = () => openSheet(showList[showAt].id);
  paintShow();
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
    const start = () => { showTimer = showTimer || setInterval(
      () => { if(!document.hidden) goShow(showAt + 1); }, 9000); };
    const stop = () => { clearInterval(showTimer); showTimer = 0; };
    start();
    // le survol suspend le defile ; on repart des que le pointeur s'eloigne,
    // sauf si la personne a choisi une piece elle-meme
    const box = $(".showcase");
    box.addEventListener("pointerenter", stop);
    box.addEventListener("pointerleave", () => { if(!showPinned) start(); });
    document.addEventListener("visibilitychange", () => document.hidden ? stop()
      : (showPinned ? null : start()));
  }
}

/* ------------------------------------------------- menu de tri sur mesure */
function buildPick(){
  const btn = $("#sort-btn"), menu = $("#sort-menu"), items = $$("#sort-menu li");
  const peint = () => {
    items.forEach(li => li.setAttribute("aria-selected", li.dataset.v === F.sort));
    $("#sort-val").textContent = items.find(li => li.dataset.v === F.sort).textContent;
  };
  const ouvre = o => {
    menu.hidden = !o;
    btn.setAttribute("aria-expanded", o);
    if(o) (items.find(li => li.dataset.v === F.sort) || items[0]).focus();
  };
  const choisit = v => { F.sort = v; peint(); render(); saveState(); ouvre(false); btn.focus(); };

  btn.onclick = () => ouvre(menu.hidden);
  menu.onclick = e => { const li = e.target.closest("li"); if(li) choisit(li.dataset.v); };
  menu.onkeydown = e => {
    const i = items.indexOf(document.activeElement);
    if(e.key === "ArrowDown"){ e.preventDefault(); items[(i + 1) % items.length].focus(); }
    if(e.key === "ArrowUp"){ e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    if(e.key === "Enter" || e.key === " "){ e.preventDefault(); choisit(items[i].dataset.v); }
    if(e.key === "Escape"){ ouvre(false); btn.focus(); }
  };
  // un clic ailleurs referme : sans cela le menu resterait ouvert en arriere-plan
  document.addEventListener("pointerdown", e => {
    if(!menu.hidden && !$("#sort-pick").contains(e.target)) ouvre(false);
  });
  peint();
}

/* Amene les resultats sous la barre collante : sans cette compensation, les
   premieres montres se retrouvent cachees derriere l'en-tete et les filtres. */
function versResultats(){
  const cible = $("#out").getBoundingClientRect().top + scrollY;
  const barres = $("header.top").offsetHeight + $(".toolbar").offsetHeight;
  scrollTo({top: Math.max(0, cible - barres - 8), behavior: "smooth"});
}

/* ------------------------------------------------------- etat persistant */
/* Safari refuse localStorage sur les pages ouvertes en file:// et leve une
   exception : tout acces passe par ce garde, sinon le rendu s'interrompt. */
const store = {
  get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
  set(k, v){ try{ localStorage.setItem(k, v); }catch(e){} },
};
/* Les filtres ne survivent pas a la fermeture du navigateur : reappliquer en
   silence une selection oubliee donne un catalogue qui parait vide. Le theme,
   lui, reste un reglage durable. */
const sessionStore = {
  get(k){ try{ return sessionStorage.getItem(k); }catch(e){ return null; } },
  set(k, v){ try{ sessionStorage.setItem(k, v); }catch(e){} },
};

const KEY = "mitry-watch-filters";
function saveState(){
  sessionStore.set(KEY, JSON.stringify({
    ...F, brands:[...F.brands], types:[...F.types], cases:[...F.cases],
    styles:[...F.styles], disp:[...F.disp],
  }));
}
function loadState(){
  try{
    const s = JSON.parse(sessionStore.get(KEY) || "null"); if(!s) return;
    for(const k of ["brands","types","cases","styles","disp"])
      if(Array.isArray(s[k])) F[k] = new Set(s[k]);
    for(const k of ["q","lo","hi","dmin","dmax","photo","sort","group"])
      if(s[k] !== undefined) F[k] = s[k];
  }catch(e){/* ignore */}
}

function reset(){
  F.q=""; F.brands.clear(); F.types.clear(); F.cases.clear(); F.styles.clear(); F.disp.clear();
  F.lo=0; F.hi=LAST; F.dmin=0; F.dmax=60; F.photo=false;
  $("#q").value=""; $("#lo").value=0; $("#hi").value=LAST;
  $("#dmin").value=0; $("#dmax").value=60;
  priceLabel(); diaLabel(); render(); saveState();
}

/* -------------------------------------------------------------- demarrage */
function init(){
  loadState();
  buildPanel();
  $("#q").value = F.q;
  $("#lo").value = F.lo; $("#hi").value = F.hi;
  $("#dmin").value = F.dmin; $("#dmax").value = F.dmax;
  buildPick();
  $("#group").classList.toggle("on", F.group);
  priceLabel(); diaLabel();

  $("#q").addEventListener("input", e => { F.q = norm(e.target.value.trim()); render(); saveState(); });
  $("#q").addEventListener("keydown", e => {
    if(e.key !== "Enter") return;
    e.preventDefault();
    versResultats();
    // on rend le clavier a l'ecran sur mobile, sinon il masque la moitie des resultats
    if(matchMedia("(max-width: 760px)").matches) e.target.blur();
  });
  $("#filters").onclick = () => {
    const open = $("#panel").classList.toggle("open");
    $("#filters").classList.toggle("on", open);
    $("#filters").setAttribute("aria-expanded", open);
  };
  $("#lo").oninput = e => { F.lo = Math.min(+e.target.value, F.hi); e.target.value=F.lo; priceLabel(); render(); saveState(); };
  $("#hi").oninput = e => { F.hi = Math.max(+e.target.value, F.lo); e.target.value=F.hi; priceLabel(); render(); saveState(); };
  $("#dmin").oninput = e => { F.dmin = Math.min(+e.target.value, F.dmax); e.target.value=F.dmin; diaLabel(); render(); saveState(); };
  $("#dmax").oninput = e => { F.dmax = Math.max(+e.target.value, F.dmin); e.target.value=F.dmax; diaLabel(); render(); saveState(); };
  $("#group").onclick = e => { F.group = !F.group; e.currentTarget.classList.toggle("on", F.group); render(); saveState(); };
  $("#reset").onclick = reset;
  $("#actifs").onclick = reset;

  $("#out").addEventListener("click", e => {
    const c = e.target.closest(".card"); if(c) openSheet(c.dataset.id);
  });
  $("#sheet").addEventListener("click", e => { if(e.target.id === "sheet") fermeSheet(); });
  // Echap passe par l'annulation native : on la reprend pour animer la sortie
  $("#sheet").addEventListener("cancel", e => { e.preventDefault(); fermeSheet(); });

  // le catalogue s'affiche d'abord : rien d'accessoire ne doit pouvoir le bloquer
  buildShow();
  const maisons = new Set(ALL.map(w => w.brand)).size;
  $("#n-watches").textContent = ALL.length;
  $("#n-brands").textContent = maisons;
  $("#n-photos").textContent = ALL.filter(w => w.shots.length).length;
  $("#h-brands").textContent = enLettres(maisons);
  render();

  const theme = store.get("mitry-theme");
  if(theme) document.documentElement.dataset.theme = theme;
  $("#theme").onclick = () => {
    const root = document.documentElement;
    const cur = root.dataset.theme
      || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    const applique = () => { root.dataset.theme = next; store.set("mitry-theme", next); };
    const sobre = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(sobre){ applique(); return; }
    // le navigateur photographie la page, applique le theme, puis fond les deux
    // images l'une dans l'autre : une seule couche animee au lieu de centaines
    if(document.startViewTransition){ document.startViewTransition(applique); return; }
    const voile = document.createElement("div");
    voile.className = "voile";
    voile.style.background = getComputedStyle(root)
      .getPropertyValue("--paper-" + next).trim() || "#000";
    document.body.appendChild(voile);
    requestAnimationFrame(() => {
      voile.classList.add("pose");
      setTimeout(() => {
        applique();
        requestAnimationFrame(() => {
          voile.classList.remove("pose");
          setTimeout(() => voile.remove(), 520);
        });
      }, 460);
    });
  };

  const top = $("#totop");
  addEventListener("scroll", () => top.classList.toggle("on", scrollY > 700), {passive:true});
  top.onclick = () => scrollTo({top:0, behavior:"smooth"});
}
document.readyState === "loading"
  ? addEventListener("DOMContentLoaded", init) : init();
})();
