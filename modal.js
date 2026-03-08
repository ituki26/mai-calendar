const eventCreate = document.getElementById("createEvent");
const closeBtn = document.getElementById("close");
const popupWindow = document.getElementById("modalWrapper")

eventCreate.addEventListener("click", ()=>{
	popupWindow.style.display = "block";
});

closeBtn.addEventListener("click", ()=>{
    popupWindow.style.display = "none";
});
