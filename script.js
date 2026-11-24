const PRODUCTS={
 "petit-jura":{name:"Le Petit Jura",price:3.20},
 "choco-mont":{name:"Le Choco-Mont",price:3.80},
 "miel-sapins":{name:"Le Miel des Sapins",price:3.50},
 "croquants":{name:"Les P'tits Croquants",price:2.90},
 "eclats-cacao":{name:"Les Éclats Cacao",price:3.90},
 "sables-comtois":{name:"Les Sablés Comtois",price:3.40}
};
let cart={};try{cart=JSON.parse(localStorage.getItem("delipack-cart")||"{}")}catch(e){cart={}}
const money=n=>n.toLocaleString("fr-FR",{style:"currency",currency:"EUR"});
function saveCart(){localStorage.setItem("delipack-cart",JSON.stringify(cart));renderCart()}
function toast(message){const el=document.querySelector(".toast");if(!el)return;el.textContent=message;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2300)}
function renderCart(){
 const count=Object.values(cart).reduce((a,b)=>a+b,0);
 document.querySelectorAll(".cart-count").forEach(el=>el.textContent=count);
 document.querySelectorAll(".cart-items").forEach(container=>{
  container.innerHTML="";
  Object.entries(cart).forEach(([id,qty])=>{const p=PRODUCTS[id];if(!p)return;const row=document.createElement("div");row.className="cart-row";row.innerHTML=`<div><strong>${p.name}</strong><small>${money(p.price)} · ${money(p.price*qty)}</small></div><div class="qty-controls"><button data-cart-action="minus" data-id="${id}">−</button><b>${qty}</b><button data-cart-action="plus" data-id="${id}">+</button></div>`;container.appendChild(row)});
  if(!count)container.innerHTML='<p class="small-note">Ton panier est encore vide. C’est le moment de choisir tes biscuits ! 🍪</p>';
 });
 const total=Object.entries(cart).reduce((sum,[id,qty])=>sum+(PRODUCTS[id]?.price||0)*qty,0);
 document.querySelectorAll(".cart-total b").forEach(el=>el.textContent=money(total));
}
function openCart(){document.body.classList.add("cart-visible")}
function closeCart(){document.body.classList.remove("cart-visible")}
document.querySelectorAll(".menu-toggle").forEach(btn=>btn.addEventListener("click",()=>document.querySelector(".nav")?.classList.toggle("open")));
document.querySelectorAll(".cart-open").forEach(btn=>btn.addEventListener("click",openCart));
document.querySelectorAll(".cart-close,.cart-backdrop").forEach(el=>el.addEventListener("click",closeCart));
document.addEventListener("click",e=>{
 const add=e.target.closest(".add-to-cart");if(add){const id=add.dataset.id;if(PRODUCTS[id]){cart[id]=(cart[id]||0)+1;saveCart();toast(`${PRODUCTS[id].name} ajouté au panier !`)}}
 const control=e.target.closest("[data-cart-action]");if(control){const id=control.dataset.id;cart[id]=(cart[id]||0)+(control.dataset.cartAction==="plus"?1:-1);if(cart[id]<=0)delete cart[id];saveCart()}
});
document.querySelectorAll(".checkout-demo").forEach(btn=>btn.addEventListener("click",()=>toast("Ceci est une démonstration : aucune commande réelle n'est passée. 😄")));
document.querySelectorAll(".newsletter-form").forEach(form=>form.addEventListener("submit",e=>{e.preventDefault();form.querySelector(".form-feedback").textContent="Merci ! Tu es inscrit·e à la gazette imaginaire des gourmands 🍪";form.reset()}));
document.querySelectorAll(".contact-form").forEach(form=>form.addEventListener("submit",e=>{e.preventDefault();form.querySelector(".form-feedback").textContent="Message reçu… dans notre boîte aux lettres de démonstration !";form.reset()}));
const filters=document.querySelectorAll(".filter");let activeFilter="all";
function filterProducts(){const query=(document.querySelector("#product-search")?.value||"").toLowerCase();let shown=0;document.querySelectorAll(".catalog-grid .product-card").forEach(card=>{const ok=(activeFilter==="all"||card.dataset.category===activeFilter)&&card.dataset.name.includes(query);card.hidden=!ok;if(ok)shown++});const no=document.querySelector(".no-results");if(no)no.hidden=shown!==0}
filters.forEach(btn=>btn.addEventListener("click",()=>{filters.forEach(b=>b.classList.remove("active"));btn.classList.add("active");activeFilter=btn.dataset.filter;filterProducts()}));
document.querySelector("#product-search")?.addEventListener("input",filterProducts);
renderCart();