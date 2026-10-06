
(function(){
  const C = window.RMC_CONFIG || {};
  const P = window.RMC_PRODUCTS || [];
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  let cart = JSON.parse(localStorage.getItem("rmcCart") || "[]");

  function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
  function save(){localStorage.setItem("rmcCart",JSON.stringify(cart)); updateCartCount();}
  function money(n){return n?C.currency+Number(n).toLocaleString("en-NG"):"Contact for current price";}
  function updateCartCount(){$$(".cart-count").forEach(x=>x.textContent=cart.length);}
  function toast(t){const x=$("#toast");if(!x)return;x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2500);}
  function wa(text){window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`,"_blank");}

  function header(){
    const el=$("#site-header"); if(!el)return;
    el.innerHTML=`<div class="topbar"><div class="container"><span>Digital Growth • Websites • SEO • Social Media • AI Solutions</span><span>Lagos, Nigeria • Remote Worldwide</span></div></div>
    <header><div class="container"><nav class="nav">
      <a class="brand" href="index.html"><img src="${C.logo}" alt="${esc(C.agencyName)} logo"><span>${esc(C.agencyName)}</span></a>
      <button class="menu" id="menuBtn" aria-label="Open menu">☰</button>
      <div class="navlinks" id="navLinks">
        <a href="index.html">Home</a><a href="services.html">Services</a><a href="shop.html">Shop</a><a href="blog.html">Insights</a><a href="about.html">About</a><a href="contact.html">Contact</a>
      </div>
      <div class="nav-actions"><a class="btn btn-primary" href="contact.html">Get Started</a></div>
    </nav></div></header>`;
    $("#menuBtn").onclick=()=>$("#navLinks").classList.toggle("open");
    $$("#navLinks a").forEach(a=>a.onclick=()=>$("#navLinks").classList.remove("open"));
    const current=location.pathname.split("/").pop()||"index.html";
    $$("#navLinks a").forEach(a=>{if(a.getAttribute("href")===current)a.classList.add("active")});
  }
  function footer(){
    const el=$("#site-footer");if(!el)return;
    el.innerHTML=`<footer><div class="container"><div class="footer-grid">
      <div><img class="footer-logo" src="${C.logo}" alt="${esc(C.agencyName)} logo"><p style="margin-top:14px">Digital growth, smart commerce and practical technology solutions for modern businesses.</p></div>
      <div><h4>Services</h4><a href="services.html"</><a>Social Media Marketing</a><a href="services.html">SEO</a><a href="services.html">Web Design</a><a href="services.html">Web Management</a><a href="services.html">AI Solutions</a></div>
      <div><h4>Explore</h4><a href="shop.html">Shop</a><a href="blog.html">Insights</a><a href="portfolio.html">Portfolio</a><a href="about.html">About</a><a href="contact.html">Contact</a></div>
      <div><h4>Contact</h4><a href="mailto:${C.email}">${C.email}</a><a href="https://wa.me/${C.whatsapp}" target="_blank">WhatsApp</a><a href="${C.portfolio}" target="_blank">Professional Portfolio</a><a href="${C.instagram}" target="_blank">Instagram @royalmultibrainconcepts</a><a href="${C.facebook}" target="_blank">Facebook @royalmultibrainconcepts</a><a href="tel:${C.whatsapp}">${C.phoneDisplay}</a></div>
    </div><div class="copyright"><span>© ${new Date().getFullYear()} ${esc(C.agencyName)}. All rights reserved.</span><span>Static, GitHub Pages-ready website.</span></div></div></footer>`;
  }
  function cartButton(){
    if(!document.body.classList.contains("no-cart")) {
      const b=document.createElement("button");b.className="cart-float";b.innerHTML='🛒<span class="cart-count">0</span>';b.title="Open enquiry cart";
      b.onclick=()=>location.href="cart.html";document.body.appendChild(b);
    }
  }
  function renderProducts(target, filter=""){
    const box=$(target);if(!box)return;
    const list=P.filter(p=>!filter || p.category===filter || p.name.toLowerCase().includes(filter.toLowerCase()));
    box.innerHTML=list.map(p=>`<article class="card product-card">
      <a href="product.html?id=${encodeURIComponent(p.id)}"><div class="product-thumb"><img src="${p.image}" alt="${esc(p.name)}"></div></a>
      <div class="product-meta"><span class="tag">${esc(p.category)}</span><span class="stock">${esc(p.stock)}</span></div>
      <h3 style="margin-top:9px">${esc(p.name)}</h3><p>${esc(p.short)}</p><div class="price">${esc(p.priceLabel)}</div>
      <div class="actions"><a class="btn btn-outline btn-small" href="product.html?id=${encodeURIComponent(p.id)}">View</a><button class="btn btn-primary btn-small" onclick="RMC.add('${p.id}')">Add to Enquiry</button></div>
    </article>`).join("") || `<p>No products found.</p>`;
  }
  window.RMC={
    add(id){const p=P.find(x=>x.id===id);if(!p)return;cart.push({id:p.id});save();toast(p.name+" added to enquiry cart.");},
    remove(i){cart.splice(i,1);save();renderCart();},
    clear(){cart=[];save();renderCart();},
    sendCart(){
      if(!cart.length){toast("Your enquiry cart is empty.");return}
      const lines=cart.map((x,i)=>{const p=P.find(p=>p.id===x.id);return `${i+1}. ${p?.name||x.id} — ${p?.priceLabel||""}`}).join("\n");
      wa(`Hello ${C.agencyName},\n\nI am interested in:\n${lines}\n\nPlease send me the next steps.`);
    },
    addCurrent(){const id=new URLSearchParams(location.search).get("id");if(id)this.add(id);}
  };
  function renderCart(){
    const list=$("#cartList"),sum=$("#cartSummary");if(!list)return;
    if(!cart.length){list.innerHTML='<p style="color:#64748b">Your enquiry cart is empty.</p>';if(sum)sum.innerHTML='<h3>No items yet</h3><p style="color:#64748b;margin-top:8px">Add a product or service from the shop.</p>';return}
    list.innerHTML=cart.map((x,i)=>{const p=P.find(p=>p.id===x.id);return `<div class="cart-item"><img src="${p?.image}" alt=""><div><strong>${esc(p?.name||x.id)}</strong><div style="color:#64748b;font-size:.82rem">${esc(p?.priceLabel||"")}</div></div><button class="btn btn-outline btn-small" onclick="RMC.remove(${i})">Remove</button></div>`}).join("");
    if(sum)sum.innerHTML=`<h3>Enquiry Summary</h3><div class="summary-row"><span>Items</span><strong>${cart.length}</strong></div><p style="color:#64748b;font-size:.84rem">This is an enquiry cart, not a payment cart. Confirm current pricing, availability and delivery with Royal Multibrain Concept.</p><button class="btn btn-green" style="width:100%;margin-top:15px" onclick="RMC.sendCart()">Send via WhatsApp</button><button class="btn btn-outline" style="width:100%;margin-top:9px" onclick="RMC.clear()">Clear Cart</button>`;
  }

  header();footer();cartButton();updateCartCount();

  $$(".faq-q").forEach(q=>q.onclick=()=>q.parentElement.classList.toggle("open"));

  if($("#featuredProducts")) renderProducts("#featuredProducts");
  if($("#shopProducts")){
    renderProducts("#shopProducts");
    const search=$("#productSearch"),cat=$("#categoryFilter");
    function refresh(){const term=search?.value||"",c=cat?.value||"";const box=$("#shopProducts");const list=P.filter(p=>(!term||p.name.toLowerCase().includes(term.toLowerCase())||p.short.toLowerCase().includes(term.toLowerCase()))&&(!c||p.category===c));box.innerHTML=list.map(p=>`<article class="card product-card"><a href="product.html?id=${encodeURIComponent(p.id)}"><div class="product-thumb"><img src="${p.image}" alt="${esc(p.name)}"></div></a><div class="product-meta"><span class="tag">${esc(p.category)}</span><span class="stock">${esc(p.stock)}</span></div><h3 style="margin-top:9px">${esc(p.name)}</h3><p>${esc(p.short)}</p><div class="price">${esc(p.priceLabel)}</div><div class="actions"><a class="btn btn-outline btn-small" href="product.html?id=${encodeURIComponent(p.id)}">View</a><button class="btn btn-primary btn-small" onclick="RMC.add('${p.id}')">Add to Enquiry</button></div></article>`).join("")||"<p>No products found.</p>"} 
    search?.addEventListener("input",refresh);cat?.addEventListener("change",refresh);
  }
  if($("#cartList"))renderCart();
  if($("#productDetail")){
    const id=new URLSearchParams(location.search).get("id")||P[0]?.id,p=P.find(x=>x.id===id);
    if(p)$("#productDetail").innerHTML=`<div class="split"><div class="product-feature"><img class="product-img" src="${p.image}" alt="${esc(p.name)}"></div><div><span class="tag">${esc(p.category)}</span><h1 style="font-size:clamp(2.2rem,5vw,4rem);margin:10px 0">${esc(p.name)}</h1><p class="lead">${esc(p.description)}</p><div class="price">${esc(p.priceLabel)}</div>${p.bulkMin ? `<div class="bulk-box"><strong>Bulk price:</strong> ${C.currency}${Number(p.bulkPrice).toLocaleString("en-NG")} each when you order ${p.bulkMin}+ bottles.</div>` : ""}<p style="color:#16a34a;font-weight:800">${esc(p.stock)}</p><div class="actions"><button class="btn btn-primary" onclick="RMC.add('${p.id}')">Add to Enquiry Cart</button><button class="btn btn-green" onclick="RMC.sendCart();RMC.add('${p.id}')">Ask on WhatsApp</button></div><div class="notice" style="margin-top:20px"><strong>Product information:</strong> Confirm current supplier-approved description, instructions, pack size, pricing and regulatory status before publishing specific claims.</div></div></div>`;
  }
  if($("#contactForm")){
    $("#contactForm").addEventListener("submit",e=>{e.preventDefault();const f=new FormData(e.target);const subject=`Website Enquiry — ${f.get("service")}`;const body=`Name: ${f.get("name")}\nEmail: ${f.get("email")}\nPhone/WhatsApp: ${f.get("phone")}\nService: ${f.get("service")}\nBudget: ${f.get("budget")}\n\nProject details:\n${f.get("message")}`;location.href=`mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
  }
  const year=$("#year");if(year)year.textContent=new Date().getFullYear();
})();
