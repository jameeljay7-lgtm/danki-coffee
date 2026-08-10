const products=[
{name:'Medium Roast',size:'Beans · 1kg',price:30000,form:'beans',roast:'medium'},
{name:'Medium Roast',size:'Beans · 500g',price:15500,form:'beans',roast:'medium'},
{name:'Medium Roast',size:'Ground · 1kg',price:32000,form:'ground',roast:'medium'},
{name:'Medium to Dark Roast',size:'Beans · 1kg',price:30000,form:'beans',roast:'medium-dark'},
{name:'Medium to Dark Roast',size:'Beans · 500g',price:15500,form:'beans',roast:'medium-dark'},
{name:'Medium to Dark Roast',size:'Beans · 250g',price:10000,form:'beans',roast:'medium-dark'},
{name:'Medium to Dark Roast',size:'Ground · 1kg',price:32000,form:'ground',roast:'medium-dark'},
{name:'Medium to Dark Roast',size:'Ground · 500g',price:17000,form:'ground',roast:'medium-dark'},
{name:'Medium to Dark Roast',size:'Ground · 250g',price:11000,form:'ground',roast:'medium-dark'},
{name:'Dark Roast',size:'Beans · 1kg',price:30000,form:'beans',roast:'dark'},
{name:'Dark Roast',size:'Beans · 500g',price:15500,form:'beans',roast:'dark'},
{name:'Dark Roast',size:'Ground · 1kg',price:32000,form:'ground',roast:'dark'}
];
let cart=JSON.parse(localStorage.getItem('danki-cart')||'[]');
const money=n=>n.toLocaleString('en-US')+' TZS';
function matches(p,filter){if(filter==='all')return true;if(filter==='beans'||filter==='ground')return p.form===filter;return p.roast===filter||((filter==='dark')&&p.roast==='medium-dark');}
function renderProducts(filter='all'){
 const el=document.getElementById('products');if(!el)return;
 el.innerHTML=products.filter(p=>matches(p,filter)).map((p,i)=>`<article class="product"><div class="product-image"><span class="tag">${p.size.split(' · ')[0].toUpperCase()}</span><img src="assets/bag.svg" alt="${p.name} ${p.size}"></div><div class="product-body"><h3>${p.name}</h3><p>${p.size}</p><div class="price">${money(p.price)}</div><button class="btn primary" onclick="add(${i})">Add to bag +</button></div></article>`).join('');
}
function filterProducts(filter,button){document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));button.classList.add('active');renderProducts(filter)}
function add(i){const p=products[i],existing=cart.find(x=>x.name===p.name&&x.size===p.size);if(existing)existing.qty++;else cart.push({...p,qty:1,img:'assets/bag.svg'});save();openCart()}
function save(){localStorage.setItem('danki-cart',JSON.stringify(cart));updateCart()}
function updateCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0),countEl=document.getElementById('count'),mobileCount=document.getElementById('mobile-count');
 if(countEl)countEl.textContent=count;if(mobileCount)mobileCount.textContent=count;
 const el=document.getElementById('cartItems');if(!el)return;
 el.innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-item"><img src="${p.img||'assets/bag.svg'}" alt=""><div><h4>${p.name}</h4><p>${p.size}</p><b>${money(p.price*p.qty)}</b><div class="qty"><button onclick="change(${i},-1)">−</button> ${p.qty} <button onclick="change(${i},1)">+</button></div></div><button onclick="removeItem(${i})" style="border:0;background:none">×</button></div>`).join(''):'<p style="padding:25px;color:var(--muted)">Your bag is waiting for something beautiful.</p>';
 const total=cart.reduce((s,x)=>s+x.price*x.qty,0),totalEl=document.getElementById('total');if(totalEl)totalEl.textContent=money(total);
}
function change(i,n){if(!cart[i])return;cart[i].qty+=n;if(cart[i].qty<=0)cart.splice(i,1);save()}
function removeItem(i){cart.splice(i,1);save()}
function openCart(){const d=document.getElementById('drawer'),b=document.getElementById('backdrop');if(d)d.classList.add('open');if(b)b.classList.add('open');updateCart()}
function closeCart(){const d=document.getElementById('drawer'),b=document.getElementById('backdrop');if(d)d.classList.remove('open');if(b)b.classList.remove('open')}
function checkout(){if(!cart.length)return;const total=cart.reduce((s,x)=>s+x.price*x.qty,0);const lines=cart.map(x=>`☕ ${x.name} — ${x.size} × ${x.qty}`).join('%0A');const msg=`Hello Danki Coffee! I'd like to place an order:%0A%0A${lines}%0A%0ATotal: ${money(total)}%0A%0APlease confirm availability and delivery.`;window.open('https://wa.me/255744600042?text='+msg,'_blank')}

document.addEventListener('DOMContentLoaded',()=>{renderProducts();updateCart();document.querySelectorAll('.desktop-nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('nav-open')))});
