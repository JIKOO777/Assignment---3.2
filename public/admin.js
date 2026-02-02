async function loadAdmin(){
  const q = qs("#q").value.trim();
  const sort = qs("#sort").value;

  const params = new URLSearchParams();
  if(q) params.set("q", q);
  if(sort && sort !== "newest") params.set("sort", sort);

  const data = await apiFetch(`${API}?${params.toString()}`);
  const rows = qs("#rows");
  rows.innerHTML = "";

  qs("#empty").style.display = data.length ? "none" : "block";

  for(const p of data){
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <div style="font-weight:850">${escapeHtml(p.title)}</div>
        <div class="mini">${escapeHtml((p.description||"").slice(0,90))}${(p.description||"").length>90?"…":""}</div>
      </td>
      <td>${escapeHtml(p.category)}</td>
      <td>${money(p.price)}</td>
      <td>
        <div class="inline">
          <input class="input tiny w120" type="number" min="0" step="1" value="${Number(p.stock||0)}" data-stock="${p._id}">
          <button class="btn tiny secondary" data-save="${p._id}">Save</button>
        </div>
      </td>
      <td>
        <div class="inline">
          <a class="btn tiny secondary" href="edit.html?id=${encodeURIComponent(p._id)}">Edit</a>
          <button class="btn tiny danger" data-del="${p._id}">Delete</button>
        </div>
      </td>
    `;
    rows.appendChild(tr);
  }

  // delete
  qsa("[data-del]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const id = btn.getAttribute("data-del");
      if(!confirm("Delete this product?")) return;
      await apiFetch(`${API}/${id}`, { method:"DELETE" });
      toast("Deleted ✅");
      loadAdmin();
    });
  });

  // save stock
  qsa("[data-save]").forEach(btn=>{
    btn.addEventListener("click", async ()=>{
      const id = btn.getAttribute("data-save");
      const input = qs(`[data-stock="${CSS.escape(id)}"]`);
      const stock = Number(input.value);
      try{
        await apiFetch(`${API}/${id}`, { method:"PUT", body: JSON.stringify({ stock }) });
        toast("Saved ✅");
      }catch(err){
        console.error(err);
        toast(err.message || "Save failed");
      }
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

qs("#btnSearch").addEventListener("click", ()=>loadAdmin());
qs("#q").addEventListener("keydown", (e)=>{ if(e.key==="Enter"){ e.preventDefault(); loadAdmin(); } });

loadAdmin().catch(err=>{
  console.error(err);
  toast(err.message || "Failed to load");
});
