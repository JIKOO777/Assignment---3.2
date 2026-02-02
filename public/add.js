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
    await apiFetch(API, { method:"POST", body: JSON.stringify(body) });
    toast("Created ✅");
    setTimeout(()=> location.href = "index.html", 700);
  }catch(err){
    console.error(err);
    toast(err.message || "Create failed");
  }
});
