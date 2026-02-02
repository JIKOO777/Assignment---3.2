function getId(){
  const p = new URLSearchParams(location.search);
  return p.get("id");
}

const id = getId();
if(!id){
  toast("Missing id");
  setTimeout(()=>location.href="index.html", 700);
}

async function load(){
  const p = await apiFetch(`${API}/${encodeURIComponent(id)}`);
  qs("#title").value = p.title || "";
  qs("#price").value = p.price ?? 0;
  qs("#category").value = p.category || "";
  qs("#stock").value = p.stock ?? 0;
  qs("#imageUrl").value = p.imageUrl || "";
  qs("#description").value = p.description || "";
}

qs("#form").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const body = {
    title: qs("#title").value.trim(),
    price: Number(qs("#price").value),
    category: qs("#category").value.trim(),
    stock: Number(qs("#stock").value),
    imageUrl: qs("#imageUrl").value.trim(),
    description: qs("#description").value.trim()
  };

  try{
    await apiFetch(`${API}/${encodeURIComponent(id)}`, { method:"PUT", body: JSON.stringify(body) });
    toast("Updated ✅");
    setTimeout(()=> location.href="index.html", 700);
  }catch(err){
    console.error(err);
    toast(err.message || "Update failed");
  }
});

qs("#btnDelete").addEventListener("click", async ()=>{
  if(!confirm("Delete this product?")) return;
  try{
    await apiFetch(`${API}/${encodeURIComponent(id)}`, { method:"DELETE" });
    toast("Deleted ✅");
    setTimeout(()=> location.href="index.html", 700);
  }catch(err){
    console.error(err);
    toast(err.message || "Delete failed");
  }
});

load().catch(err=>{
  console.error(err);
  toast(err.message || "Failed to load");
});
