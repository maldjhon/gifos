var getArray = localStorage.getItem("expandGif");
const getIndex = localStorage.getItem("indexExpandGif");
var containerSearchGifos = document.getElementById("contGif");
var frontGif = document.getElementById("frontGif");
var backGif = document.getElementById("backGif");
var download = document.getElementById("downloadButton");
var like = document.getElementById("likeButton");
var data = JSON.parse(getArray);
var clientXStart;

containerSearchGifos.addEventListener("touchstart",(e) => {initFingerTouch(e);});
containerSearchGifos.addEventListener("touchend",(e) => {finishFingerTouch(e);});
frontGif.addEventListener("click", () => {afterGif()});
backGif.addEventListener("click", () => {beforeGif()});
download.addEventListener("click",() => {downloadGif();});
like.addEventListener("click",() => {likeGif();});

addGif(data,getIndex);

function addGif(data, getIndex){
    let gif = document.getElementById("contGif");
    let userGif = document.getElementById("user");
    let titleGif = document.getElementById("title");
    let img = document.createElement("img");
    img.src = data[getIndex].original;
    img.alt = data[getIndex].title;
    img.className = "gif";
    img.id = data[getIndex].id;
    gif.appendChild(img);
    userGif.innerText = data[getIndex].user;
    titleGif.innerText = data[getIndex].title;
}

function initFingerTouch(e){ 
    clientXStart = e.touches[0].clientX;   
}

function finishFingerTouch(e){
    let clientXEnd = e.changedTouches[0].clientX;
    if (clientXStart > clientXEnd){
        afterGif();
    }else if(clientXStart < clientXEnd){
        beforeGif();
    }
}

function beforeGif (){
    const length = data.length;
    let gif = document.querySelector(".gif");
    let user = document.getElementById("user");
    let title = document.getElementById("title");
    let valueGif = gif.getAttribute("id");
    let id = indexOfArrayGif(data, valueGif);
    let index = (id == 0) && length - 1 || id - 1;
    gif.setAttribute("src",data[index].original);
    gif.setAttribute("id",data[index].id);
    gif.setAttribute("alt",data[index].title);
    user.innerText = data[index].user;
    title.innerText = data[index].title;
}

function afterGif(){
    let gif = document.querySelector(".gif");
    let user = document.getElementById("user");
    let title = document.getElementById("title");
    const length = data.length;
    let valueGif = gif.getAttribute("id");
    let id = indexOfArrayGif(data, valueGif);
    let index = (id + 1) % length;
    gif.setAttribute("src",data[index].original);
    gif.setAttribute("id",data[index].id);
    gif.setAttribute("alt",data[index].title);
    user.innerText = data[index].user;
    title.innerText = data[index].title;
}

function indexOfArrayGif(name, valueGif){
    for (let i = 0;i < name.length;i++){
        let urlGif = name[i].id;
        if (urlGif == valueGif){
            return i;
        }
    }
}

function likeGif(){
    let contGif = document.getElementById("contGif");
    let img = contGif.childNodes.item(0);
    let idImg = img.id;
    let index = indexOfArrayGif(data, idImg);
    let idGif = data[index].id;
    localStorage.setItem(idGif,JSON.stringify(data[index]));
}

function downloadGif(){
    let contGif = document.getElementById("contGif");
    let img = contGif.childNodes.item(0);
    let idImg = img.id;
    let url = img.src;
    fetch (url)
    .then(function(response){
        return  response.blob();
    })
    .then(function(myBlob){
        var objectURL = URL.createObjectURL(myBlob);
        let a = document.createElement("a");
        a.href = objectURL;
        a.download = `${idImg}.gif`;
        a.click();
    })
}