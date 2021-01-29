const apyKey = "kDcSPTWLzqz5YieHFpaMNSFKhAHJUuV4";
var frontGif = document.getElementById("frontGif");
var backGif = document.getElementById("backGif");
var containerGifsTreding = document.getElementById("containerGifsTreding");
var seeMore = document.getElementById("containerSearchGifos");
let title = document.getElementById("titleSearch").remove();
var containerSearchGifos = document.getElementById("containerSearchGifos");
var createGif = document.getElementById("create");
var arrayGifs = new Array();
var arrayAllGifs = new Array();
var arrayLikeGifs = new Array();
var arrayFavoriteGifs = new Array();
var offSet = 0;
var clientXStart; 

frontGif.addEventListener("click", () => {afterGif()});
backGif.addEventListener("click", () => {beforeGif()});
containerGifsTreding.addEventListener("touchstart",() => {initFingerTouch();});
let doc = document.addEventListener("click",()=>{finishFingerTouch();});
seeMore.addEventListener("click",(event) => {
    let idButton = event.target.id;
    if (idButton == "seeMore"){
        searchSeeMore ();
    }else{
        iconsGif(event);
    }
});
containerGifsTreding.addEventListener("click",(event)=>{iconsGif(event);})
createGif.addEventListener("click",()=>{goViewCreateGif();})

class informationGifs {
    constructor (id,title,user,url,original){
        this.id = id;
        this.title = title;
        this.user = user;
        this.url = url;
        this.original = original;
    }
}

function addInfoArray (name,id,title,user,url,original){
    let newInfoGif = new informationGifs(id,title,user,url,original);
    name.push(newInfoGif);
}

async function gifTreding(){
    let url = `https://api.giphy.com/v1/gifs/trending?api_key=${apyKey}&limit=25&rating=g`;
    const resp = await fetch (url);
    const data = await resp.json();
    return data;
}

let gifTredingHome = gifTreding();
gifTredingHome.then(data =>
    {infoTreding(data);
}).catch(err => 
    {console.error(err);
});

getSearchGifos();

let count = containerSearchGifos.childElementCount;
if (count == 1){
    let child = document.getElementById("searchGifos");
    let numberChild = child.childElementCount;
    if (numberChild == 0){
        let noSearch = document.querySelector(".noSearch");
        noSearch.style.display = "flex";
    }
}

function infoTreding(data){
    let dataGif = data.data;
    let i;
    let contador = 0;
    for (i in dataGif){
        let gifs = dataGif[i];
        let info = getData (gifs);
        let idGif = info[0];
        let titleGif = info[1];
        let usernameGif = info[2];
        let source = info[3];
        let original = info[4];
        addInfoArray (arrayGifs,idGif,titleGif,usernameGif,source,original); 
        addInfoArray (arrayAllGifs,idGif,titleGif,usernameGif,source,original); 
        addGifTreding (arrayGifs,contador); 
        contador = contador + 1;
    }
}

function getData (gifs){
    let info = new Array();
    let j;
    for (j in gifs){
        if (j == "id"){
            var idGif = gifs[j];
        }
        else if (j == "title"){
            var titleGif = gifs[j];
        }
        else if (j == "username"){
            var usernameGif = gifs[j];
        }
        else if (j == "images"){
            let k;
            let imagesGif = gifs.images;
            for (k in imagesGif){
                if (k == "original"){
                    let l;
                    let urlImageGif= imagesGif.original;
                    for (l in urlImageGif){
                        if (l =="url"){
                            var original = urlImageGif[l];
                        }
                    }
                }else if (k == "preview_gif"){
                    let l;
                    let urlImageGif= imagesGif.preview_gif;
                    for (l in urlImageGif){
                        if (l =="url"){
                            var source = urlImageGif[l];
                        }
                    }
                } 
            }
        }                 
    } 
    info.push(idGif);
    info.push(titleGif);
    info.push(usernameGif);
    info.push(source);
    info.push(original);
    return info;
}

function addGifTreding(arrayGifs,contador){
    if (contador == 0){
        let gif = document.getElementById("contGifFirst");
        let user = document.getElementById("userInit");
        let title = document.getElementById("titleInit");
        let img = document.createElement("img");
        img.src = arrayGifs[contador].url;
        img.id = arrayGifs[contador].id;
        img.alt = arrayGifs[contador].title;
        img.className = "gifFirst";
        gif.appendChild(img);
        user.innerText = arrayGifs[contador].user;
        title.innerText = arrayGifs[contador].title;
    }else if (contador == 1){
        let gif = document.getElementById("contGifMiddle");
        let user = document.getElementById("userMiddle");
        let title = document.getElementById("titleMiddle");
        let img = document.createElement("img");
        img.src = arrayGifs[contador].url;
        img.id = arrayGifs[contador].id;
        img.alt = arrayGifs[contador].title;
        img.className = "gifMiddle";
        gif.appendChild(img);
        user.innerText = arrayGifs[contador].user;
        title.innerText = arrayGifs[contador].title;
    }else if (contador == 2){
        let gif = document.getElementById("contGifLast");
        let user = document.getElementById("userEnd");
        let title = document.getElementById("titleEnd");
        let img = document.createElement("img");
        img.src = arrayGifs[contador].url;
        img.id = arrayGifs[contador].id;
        img.alt = arrayGifs[contador].title;
        img.className = "gifLast";
        gif.appendChild(img);
        user.innerText = arrayGifs[contador].user;
        title.innerText = arrayGifs[contador].title;
    }
}

function getSearchGifos(){
    let i = 0;
    let count = localStorage.length;
    let container = document.getElementById("containerSearchGifos");
    let search = document.createElement("div");
    let button = document.createElement("button");
    search.id = "searchGifos";
    container.appendChild(search);
    for (i; i < count; i++){
        let key = localStorage.key(i);
        let subString = key.substring(0,6);
        if (key != "expandGif" && key != "indexExpandGif" && subString != "mygif_"){
            let get = localStorage.getItem(key);
            let data = JSON.parse(get);
            let idGif = data.id;
            let titleGif = data.title;
            let usernameGif = data.user;
            let source = data.url;
            let original = data.original;     
            addInfoArray (arrayFavoriteGifs,idGif,titleGif,usernameGif,source,original);      
            let child = document.getElementById("searchGifos");
            let numberChild = child.childElementCount;
            if (numberChild < 12){
                addGif (data, search);
            }else{
                button.id = "seeMore";
                button.className = "seeMore";
                button.innerText = "VER MÁS";
                container.appendChild(button);
            } 
        } 
    }
}

function addGif(data,search){
    let path = window.location.pathname.search("favoritesDarkMode");
    let idGif = data.id;
    let titleGif = data.title;
    let usernameGif = data.user;
    let source = data.url; 
    let original = data.original; 
    let div = document.createElement("div");
    div.id = `div_${idGif}`;
    div.classList.add("contaGif");
    if (path == -1){
        div.innerHTML = `<button class="buttonsGif disLikeButton" id="likeButton_${idGif}"><i class="fas fa-heart"></i></button>
        <button class="buttonsGif downloadButton" id="downloadButton_${idGif}"><i class="fas fa-download"></i></button>
        <a href="./originalGif.html" class="buttonsGif expandButton" id="expandButton_${idGif}"><i class="fas fa-expand-alt"></i></a>
        <div class="informationGif">
            <span class="user" id="user_${idGif}">${usernameGif}</span>
            <span class="title" id="title_${idGif}">${titleGif}</span>
        </div>
        <div class="containerImg">
            <img src=${source} alt=${titleGif} class="gif" id=${idGif}>
        </div>`;
    }else{
        div.innerHTML = `<button class="buttonsGif disLikeButton" id="likeButton_${idGif}"><i class="fas fa-heart"></i></button>
        <button class="buttonsGif downloadButton" id="downloadButton_${idGif}"><i class="fas fa-download"></i></button>
        <a href="./originalGifDarkMode.html" class="buttonsGif expandButton" id="expandButton_${idGif}"><i class="fas fa-expand-alt"></i></a>
        <div class="informationGif">
            <span class="user" id="user_${idGif}">${usernameGif}</span>
            <span class="title" id="title_${idGif}">${titleGif}</span>
        </div>
        <div class="containerImg">
            <img src=${source} alt=${titleGif} class="gif" id=${idGif}>
        </div>`;
    } 
    search.appendChild(div);
    offSet = offSet + 1;
    addInfoArray (arrayAllGifs,idGif,titleGif,usernameGif,source,original);
}

function initFingerTouch(){ 
    let container = document.getElementById("containerGifsTreding");
    let path = window.location.pathname.search("index");
    let i = 3; 
    if (path == -1){
        for (i; i < arrayGifs.length; i++){
            let id = arrayGifs[i].id;
            let user = arrayGifs[i].user;
            let title = arrayGifs[i].title;
            let url = arrayGifs[i].url;
            let div = document.createElement("div");
            div.id = `containerGifEnd_${id}`;
            div.className = "contaGif";
            div.innerHTML = `<button class="buttonsGif likeButton" id="likeButtonEnd_${id}"><i class="far fa-heart"></i></button>
            <button class="buttonsGif downloadButton" id="downloadButtonEnd_${id}"><i class="fas fa-download"></i></button>
            <a href="./originalGifDarkMode.html" class="buttonsGif expandButton" id="expandButtonEnd_${id}"><i class="fas fa-expand-alt"></i></a>
            <div class="informationGif">
                <span class="user" id="userEnd_${id}">${user}</span>
                <span class="title" id="titleEnd_${id}">${title}</span>
            </div>
            <div class="containerImg" id="contGifLast_${id}">
                <img src=${url} alt=${title} class="gifLast" id=${id}>
            </div>`;
            container.appendChild(div);
        }
    }else{
        for (i; i < arrayGifs.length; i++){
            let id = arrayGifs[i].id;
            let user = arrayGifs[i].user;
            let title = arrayGifs[i].title;
            let url = arrayGifs[i].url;
            let div = document.createElement("div");
            div.id = `containerGifEnd_${id}`;
            div.className = "contaGif";
            div.innerHTML = `<button class="buttonsGif likeButton" id="likeButtonEnd_${id}"><i class="far fa-heart"></i></button>
            <button class="buttonsGif downloadButton" id="downloadButtonEnd_${id}"><i class="fas fa-download"></i></button>
            <a href="./html/originalGif.html" class="buttonsGif expandButton" id="expandButtonEnd_${id}"><i class="fas fa-expand-alt"></i></a>
            <div class="informationGif">
                <span class="user" id="userEnd_${id}">${user}</span>
                <span class="title" id="titleEnd_${id}">${title}</span>
            </div>
            <div class="containerImg" id="contGifLast_${id}">
                <img src=${url} alt=${title} class="gifLast" id=${id}>
            </div>`;
            container.appendChild(div)
        }
    }   
}

function finishFingerTouch(){
    let container = document.getElementById("containerGifsTreding");
    let childs = container.childNodes;
    let width = seeMore.offsetWidth;
    if (width > 768){
        let i = 3;
        let ids = getIdsNodes (childs);        
        for (i; i < ids.length; i++){
            let value = ids[i];
            let node = document.getElementById(value);
            node.remove();
        }
    }
}

function getIdsNodes (childs){
    let i = 0;
    let arrayIds = new Array ();
    for (i; i < childs.length; i++){
        let value = childs[i];
        let id = value.id;
        if (id != "" && id != undefined && id != null){
            arrayIds.push(id);
        }
    }
    return arrayIds;
}

function beforeGif (){
    const length = arrayGifs.length;
    let gif = document.querySelector(".gifFirst");
    let user = document.getElementById("userInit");
    let title = document.getElementById("titleInit");
    let valueGif = gif.getAttribute("id");
    let id = indexOfArrayGif(arrayGifs, valueGif);
    let index = (id == 0) && length - 1 || id - 1;
    gif.setAttribute("src",arrayGifs[index].url);
    gif.setAttribute("id",arrayGifs[index].id);
    gif.setAttribute("alt",arrayGifs[index].title);
    user.innerText = arrayGifs[index].user;
    title.innerText = arrayGifs[index].title;
    gif = document.querySelector(".gifMiddle");
    user = document.getElementById("userMiddle");
    title = document.getElementById("titleMiddle");
    valueGif = gif.getAttribute("id");
    id = indexOfArrayGif(arrayGifs, valueGif);
    index = (id == 0) && length - 1 || id - 1;
    gif.setAttribute("src",arrayGifs[index].url);
    gif.setAttribute("id",arrayGifs[index].id);
    gif.setAttribute("alt",arrayGifs[index].title);
    user.innerText = arrayGifs[index].user;
    title.innerText = arrayGifs[index].title;
    gif = document.querySelector(".gifLast");
    user = document.getElementById("userEnd");
    title = document.getElementById("titleEnd");
    valueGif = gif.getAttribute("id");
    id = indexOfArrayGif(arrayGifs, valueGif);
    index = (id == 0) && length - 1 || id - 1;
    gif.setAttribute("src",arrayGifs[index].url);
    gif.setAttribute("id",arrayGifs[index].id);
    gif.setAttribute("alt",arrayGifs[index].title);
    user.innerText = arrayGifs[index].user;
    title.innerText = arrayGifs[index].title;
}

function afterGif(){
    let gif = document.querySelector(".gifFirst");
    let user = document.getElementById("userInit");
    let title = document.getElementById("titleInit");
    const length = arrayGifs.length;
    let valueGif = gif.getAttribute("id");
    let id = indexOfArrayGif(arrayGifs, valueGif);
    let index = (id + 1) % length;
    gif.setAttribute("src",arrayGifs[index].url);
    gif.setAttribute("id",arrayGifs[index].id);
    gif.setAttribute("alt",arrayGifs[index].title);
    user.innerText = arrayGifs[index].user;
    title.innerText = arrayGifs[index].title;
    gif = document.querySelector(".gifMiddle");
    user = document.getElementById("userMiddle");
    title = document.getElementById("titleMiddle");
    valueGif = gif.getAttribute("id");
    id = indexOfArrayGif(arrayGifs, valueGif);
    index = (id + 1) % length;
    gif.setAttribute("src",arrayGifs[index].url);
    gif.setAttribute("id",arrayGifs[index].id);
    gif.setAttribute("alt",arrayGifs[index].title);
    user.innerText = arrayGifs[index].user;
    title.innerText = arrayGifs[index].title;
    gif = document.querySelector(".gifLast");
    user = document.getElementById("userEnd");
    title = document.getElementById("titleEnd");
    valueGif = gif.getAttribute("id");
    id = indexOfArrayGif(arrayGifs, valueGif);
    index = (id + 1) % length;
    gif.setAttribute("src",arrayGifs[index].url);
    gif.setAttribute("id",arrayGifs[index].id);
    gif.setAttribute("alt",arrayGifs[index].title);
    user.innerText = arrayGifs[index].user;
    title.innerText = arrayGifs[index].title;
}

function indexOfArrayGif(name, valueGif){
    for (let i = 0;i < name.length;i++){
        let urlGif = name[i].id;
        if (urlGif == valueGif){
            return i;
        }
    }
}

function iconsGif (event){
    let data = event.path;
    let icon = eventIcon (data);
    switch (icon){
        case "expand":
            expandIcon (data);
        break;
        case "like":
            likeGif(data);
        break;
        case "download":
            downloadGif(data);
        break;
        case "card":
            showGifMobile(data);
        break;
        case "disLike":
            disLike(data);
        break;
        default:
        break;
    }
}

function eventIcon (data){
    let name;
    let i = 0;
    let nameClassButton = data[i].className;
    if (nameClassButton == "buttonsGif expandButton" || nameClassButton == "fas fa-expand-alt"){
        name = "expand";
        return name;
    }else if (nameClassButton == "buttonsGif likeButton" || nameClassButton == "far fa-heart"){
        name = "like";
        return name;
    }else if (nameClassButton == "buttonsGif downloadButton" || nameClassButton == "fas fa-download"){
        name = "download";
        return name;
    }else if (nameClassButton == "buttonsGif disLikeButton" || nameClassButton == "fas fa-heart"){
        name = "disLike";
        return name;
    }else{
        name = "card";
        return name;
    }
}

function expandIcon (data){
    let i = 0;
    let idImg;
    for (i; i < data.length;i++){
        let nameClass = data[i].className;
        if (nameClass == "contaGif contaGifInit" || nameClass == "contaGif contaGifMiddle" || nameClass == "contaGif contaGifEnd" || nameClass == "contaGif"){
            idImg = data[i].lastElementChild.firstElementChild.id;
        }
    }
    let index = indexOfArrayGif(arrayAllGifs, idImg);   
    localStorage.setItem("expandGif", JSON.stringify(arrayAllGifs));
    localStorage.setItem("indexExpandGif",index);
}

function showGifMobile(data){
    let width = seeMore.offsetWidth;
    let path = window.location.pathname.search("favoritesDarkMode");
    if (width < 768){
        let i = 0;
        let idImg;
        for (i; i < data.length;i++){
            let nameClass = data[i].className;
            if (nameClass == "contaGif contaGifInit" || nameClass == "contaGif contaGifMiddle" || nameClass == "contaGif contaGifEnd" || nameClass == "contaGif"){
                idImg = data[i].lastElementChild.firstElementChild.id;
            }
        }
        let index = indexOfArrayGif(arrayAllGifs, idImg);    
        localStorage.setItem("expandGif", JSON.stringify(arrayAllGifs));
        localStorage.setItem("indexExpandGif",index);
        let a = document.createElement("a");
        if (path == -1){
            a.href = "./originalGif.html";
        }else{
            a.href = "./originalGifDarkMode.html";
        }
        a.click(); 
    }
}

function likeGif(data){
    let i = 0;
    let idImg;
    for (i; i < data.length;i++){
        let nameClass = data[i].className;
        if (nameClass == "contaGif contaGifInit" || nameClass == "contaGif contaGifMiddle" || nameClass == "contaGif contaGifEnd" || nameClass == "contaGif"){
            idImg = data[i].lastElementChild.firstElementChild.id;
        }
    }
    let index = indexOfArrayGif(arrayAllGifs, idImg);
    let idGif = arrayAllGifs[index].id;
    localStorage.setItem(idGif,JSON.stringify(arrayAllGifs[index]));
    location.reload();
}

function downloadGif(data){
    let i = 0;
    let idImg;
    for (i; i < data.length;i++){
        let nameClass = data[i].className;
        if (nameClass == "contaGif contaGifInit" || nameClass == "contaGif contaGifMiddle" || nameClass == "contaGif contaGifEnd" || nameClass == "contaGif"){
            idImg = data[i].lastElementChild.firstElementChild.id;
        }
    }
    let index = indexOfArrayGif(arrayAllGifs, idImg);
    let url = arrayAllGifs[index].original;
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

function disLike(data){
    let i = 0;
    let idImg;
    for (i; i < data.length;i++){
        let nameClass = data[i].className;
        if (nameClass == "contaGif contaGifInit" || nameClass == "contaGif contaGifMiddle" || nameClass == "contaGif contaGifEnd" || nameClass == "contaGif"){
            idImg = data[i].lastElementChild.firstElementChild.id;
        }
    }
    let index = indexOfArrayGif(arrayAllGifs, idImg);
    let indexFavorite = indexOfArrayGif(arrayFavoriteGifs, idImg);
    let idGif = arrayAllGifs[index].id;
    arrayFavoriteGifs.splice(indexFavorite,1);
    localStorage.removeItem(idGif);
    location.reload();
}

function searchSeeMore (){
    let search = document.getElementById("searchGifos");
    let total = arrayFavoriteGifs.length;
    let index = offSet;
    let count = total - index;
    let i = 0;
    for (i; i < count; i++){
        let data = arrayFavoriteGifs[index];
        if (i < 12){
            addGif(data,search)
            index = index + 1;
        }
    }
    index = offSet;
    count = total - index;
    if (count == 0){
        let seeMore = document.getElementById("seeMore");
        seeMore.style.display = "none";
    }
}

function goViewCreateGif(){
    let path = window.location.pathname.search("favoritesDarkMode");
    let a = document.createElement("a");
    if (path == -1){
        a.href = "./createGif.html";
    }else{
        a.href = "./createGifDarkMode.html";
    }
    a.click();
}