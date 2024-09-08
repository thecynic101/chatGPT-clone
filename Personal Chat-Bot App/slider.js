let counter = 1;
setInterval (function(){
    document.getElementById("radio" + counter).checked = true;
    counter++;
    if (counter > 4){
        counter = 1;
    }
}, 5000);

document.getElementById("nextpageBtn").addEventListener("click", function(){
    // Redirect to index2.html
    window.location.href = "index2.html";
});
