const API = "/api/products";

function qs(sel){ return document.querySelector(sel); }
function qsa(sel){ return Array.from(document.querySelectorAll(sel)); }

function money(n){
  const v = Number(n);
  if (Number.isNaN(v)) return "$0";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(v);
}

function toast(msg){
  const el = qs("#toast");
  if(!el) return alert(msg);
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(window.__t);
  window.__t = setTimeout(()=>el.classList.remove("show"), 2400);
}

async function apiFetch(url, opts = {}){
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts
  });
  if(!res.ok){
    let detail = "";
    try{ detail = (await res.json()).message || ""; } catch(e){}
    throw new Error(detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

function setActiveNav(){
  const p = location.pathname.split("/").pop() || "index.html";
  qsa(".pill").forEach(a=>{
    const href = (a.getAttribute("href") || "").split("/").pop();
    if(href === p) a.classList.add("active");
  });
}
setActiveNav();
