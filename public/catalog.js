async function loadCatalog(){
  const q = qs("#q").value.trim();
  const sort = qs("#sort").value;

  const params = new URLSearchParams();
  if(q) params.set("q", q);
  if(sort && sort !== "newest") params.set("sort", sort);

  const data = await apiFetch(`${API}?${params.toString()}`);

  const catalog = qs("#catalog");
  catalog.innerHTML = "";

  // KPIs
  qs("#kCount").textContent = data.length;
  qs("#kStock").textContent = data.reduce((a,p)=>a + (Number(p.stock)||0), 0);
  const totalValue = data.reduce((a,p)=> a + (Number(p.price)||0) * (Number(p.stock)||0), 0);
  qs("#kValue").textContent = money(totalValue);

  qs("#empty").style.display = data.length ? "none" : "block";

  for(const p of data){
    const card = document.createElement("div");
    card.className = "card product";
    const img = (p.imageUrl || "").trim();
    card.innerHTML = `
      <div class="thumb">${img ? `<img alt="${escapeHtml(p.title)}" src="${escapeHtml(img)}">` : ""}</div>
      <div class="meta">
        <div>
          <p class="title">${escapeHtml(p.title)}</p>
          <p class="small">${escapeHtml(p.category)} • Stock: ${Number(p.stock||0)}</p>
        </div>
        <span class="badge">${escapeHtml(new Date(p.createdAt).toLocaleDateString())}</span>
      </div>
      <p class="price">${money(p.price)}</p>
      <p class="small">${escapeHtml((p.description||"").slice(0, 120))}${(p.description||"").length>120?"…":""}</p>
      <div class="footer-actions">
        <a class="btn secondary" href="edit.html?id=${encodeURIComponent(p._id)}">Edit</a>
        <button class="btn danger" data-del="${p._id}">Delete</button>
      </div>
    `;
    catalog.appendChild(card);
  }

  // delete handlers
  qsa("[data-del]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const id = btn.getAttribute("data-del");
      if(!confirm("Delete this product?")) return;
      await apiFetch(`${API}/${id}`, { method:"DELETE" });
      toast("Deleted ✅");
      loadCatalog();
    });
  });
}

function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

qs("#btnSearch").addEventListener("click", ()=>loadCatalog());
qs("#q").addEventListener("keydown", (e)=>{ if(e.key==="Enter"){ e.preventDefault(); loadCatalog(); } });

loadCatalog().catch(err=>{
  console.error(err);
  toast(err.message || "Failed to load catalog");
});
