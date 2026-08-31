// إعدادات المتجر
const STORE_NAME="رخيص";
// ضع رقم واتساب المتجر هنا بصيغة مصر الدولية بدون + أو مسافات.
// مثال: 2010XXXXXXXX
const WHATSAPP="2010XXXXXXXX";

const defaults=[
{id:1,n:"سلسلة إكسسوار",c:"إكسسوارات",p:75,i:"📿"},
{id:2,n:"خرز ملون",c:"خامات",p:50,i:"🟠"},
{id:3,n:"شريط تزيين",c:"خامات",p:35,i:"🎀"},
{id:4,n:"إكسسوار معدني",c:"إكسسوارات",p:90,i:"✨"},
{id:5,n:"منتج متنوع",c:"منتجات متنوعة",p:120,i:"🎁"},
{id:6,n:"قطعة زينة",c:"منتجات متنوعة",p:65,i:"⭐"}];

let products=JSON.parse(localStorage.getItem("ra5is_products")||"null")||defaults;
let cart=[], category="الكل";

const $=id=>document.getElementById(id);
function save(){localStorage.setItem("ra5is_products",JSON.stringify(products))}
function money(n){return Number(n).toLocaleString("ar-EG")+" جنيه"}

["الكل","إكسسوارات","خامات","منتجات متنوعة"].forEach(c=>{
 const b=document.createElement("button");b.textContent=c;if(c==="الكل")b.classList.add("on");
 b.onclick=()=>{category=c;document.querySelectorAll(".cats button").forEach(x=>x.classList.remove("on"));b.classList.add("on");render()};
 $("cats").appendChild(b);
});

function render(){
 const q=$("search").value.trim();
 const list=products.filter(p=>(category==="الكل"||p.c===category)&&p.n.includes(q));
 $("products").innerHTML=list.map(p=>`
 <article class="card"><div class="pic">${p.i}</div><div class="info">
 <div class="name">${p.n}</div><div class="price">${money(p.p)}</div>
 <button class="add" onclick="add(${p.id})">أضف للسلة</button></div></article>`).join("")||"<p>لا توجد منتجات مطابقة.</p>";
}
function add(id){cart.push(id);update();alert("تمت إضافة المنتج للسلة")}
function update(){
 $("count").textContent=cart.length;
 $("total").textContent=cart.reduce((s,id)=>s+products.find(p=>p.id===id).p,0).toLocaleString("ar-EG");
}
function openCart(){
 const map={};cart.forEach(id=>map[id]=(map[id]||0)+1);
 $("cartItems").innerHTML=Object.keys(map).length?Object.entries(map).map(([id,n])=>{
 const p=products.find(x=>x.id==id);
 return `<div class="item"><span>${p.i} ${p.n}<br>${money(p.p)} × ${n}</span><span class="qty"><button onclick="changeQty(${id},-1)">−</button> ${n} <button onclick="changeQty(${id},1)">+</button></span></div>`;
 }).join(""):"السلة فارغة.";
 $("cartModal").style.display="block";
}
function changeQty(id,d){
 if(d>0)cart.push(Number(id));else{const k=cart.indexOf(Number(id));if(k>=0)cart.splice(k,1)}
 update();openCart();
}
function closeModal(id){$(id).style.display="none"}
function sendOrder(){
 if(!cart.length)return alert("السلة فارغة");
 const name=$("customerName").value.trim(),phone=$("customerPhone").value.trim(),gov=$("customerGov").value,address=$("customerAddress").value.trim();
 if(!name||!phone||!gov||!address)return alert("من فضلك أكمل بيانات العميل");
 let map={};cart.forEach(id=>map[id]=(map[id]||0)+1);
 let lines=[],total=0;
 Object.entries(map).forEach(([id,n])=>{let p=products.find(x=>x.id==id);let sub=p.p*n;total+=sub;lines.push(`- ${p.n} × ${n} = ${sub} جنيه`)});
 let text=`طلب جديد من متجر ${STORE_NAME}%0A%0Aالاسم: ${encodeURIComponent(name)}%0Aالهاتف: ${encodeURIComponent(phone)}%0Aالمحافظة: ${encodeURIComponent(gov)}%0Aالعنوان: ${encodeURIComponent(address)}%0A%0Aالمنتجات:%0A${encodeURIComponent(lines.join("\n"))}%0A%0Aالإجمالي: ${total} جنيه%0Aالدفع: عند الاستلام`;
 if(WHATSAPP.includes("X"))return alert("ضع رقم واتساب المتجر داخل ملف app.js أولاً.");
 window.open(`https://wa.me/${WHATSAPP}?text=${text}`,"_blank");
 $("result").textContent="تم تجهيز الطلب. أكمل الإرسال من واتساب.";
}
function openAdmin(){
 $("adminModal").style.display="block";renderAdmin();
}
function renderAdmin(){
 $("adminProducts").innerHTML=products.map(p=>`<div class="item"><span>${p.i} ${p.n} — ${money(p.p)}</span><button onclick="delProduct(${p.id})">حذف</button></div>`).join("");
}
function addProduct(){
 const n=$("pn").value.trim(),p=Number($("pp").value),c=$("pc").value,i=$("pi").value.trim()||"📦";
 if(!n||!p)return alert("أدخل اسم المنتج والسعر");
 products.push({id:Date.now(),n,c,p,i});save();render();renderAdmin();
 $("pn").value="";$("pp").value="";$("pi").value="";
}
function delProduct(id){if(confirm("حذف المنتج؟")){products=products.filter(p=>p.id!==id);save();render();renderAdmin()}}
render();update();
