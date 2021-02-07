const apyKey = "kDcSPTWLzqz5YieHFpaMNSFKhAHJUuV4";
var searchButton = document.getElementById("search");
var queryInput = document.getElementById("queryGifos");
var resetButton = document.getElementById("closed");
var checkQuery = document.getElementById("checkQuery");
var frontGif = document.getElementById("frontGif");
var backGif = document.getElementById("backGif");
var containerGifsTreding = document.getElementById("containerGifsTreding");
var optionFirst = document.getElementById("suggestionFirst");
var optionSecond = document.getElementById("suggestionSecond");
var optionThird = document.getElementById("suggestionThird");
var optionFourth = document.getElementById("suggestionFourth");
var seeMore = document.getElementById("containerSearchGifos");
var createGif = document.getElementById("create");
var searchTermsGifs = document.getElementById("searTermTrendings");
var arrayGifs = new Array();
var arrayAllGifs = new Array();
var offSet = 0;
var clientXStart; 

searchButton.addEventListener("click", sendSearch);
resetButton.addEventListener("click", resetSearch);
frontGif.addEventListener("click", () => {afterGif()});
backGif.addEventListener("click", () => {beforeGif()});
containerGifsTreding.addEventListener("touchstart",() => {initFingerTouch();});
let doc = document.addEventListener("click",()=>{finishFingerTouch();});
queryInput.addEventListener("keyup", (event) => {
    if (!(event.keyCode == "9" || event.keyCode == "13" ||	event.keyCode == "16" ||	event.keyCode == "17" ||	event.keyCode == "18" ||	event.keyCode == "20" ||	event.keyCode == "27" || event.keyCode == "33" ||	event.keyCode == "34" ||	event.keyCode == "35" ||	event.keyCode == "36" ||	event.keyCode == "37" ||	event.keyCode == "38" ||	event.keyCode == "39" ||	event.keyCode == "40" ||	event.keyCode == "44" ||	event.keyCode == "46" ||	event.keyCode == "106" ||	event.keyCode == "107" ||	event.keyCode == "109" ||	event.keyCode == "111" ||	event.keyCode == "144" ||	event.keyCode == "186" ||	event.keyCode == "187" ||	event.keyCode == "188" ||	event.keyCode == "189" ||	event.keyCode == "190" ||	event.keyCode == "191" ||	event.keyCode == "222" ||	event.keyCode == "226" ||	event.keyCode == "255")){
        searchInput();
    }else if (event.keyCode == "13"){
        checkQuery.removeAttribute("checked");
        let value = queryInput.value;
        deletesNodes();
        search (value);
    }
});
optionFirst.addEventListener("click",(event) =>{setQueryGifos(event)});
optionSecond.addEventListener("click",(event) =>{setQueryGifos(event)});
optionThird.addEventListener("click",(event) =>{setQueryGifos(event)});
optionFourth.addEventListener("click",(event) =>{setQueryGifos(event)});
seeMore.addEventListener("click",(event) => {
    let idButton = event.target.id;
    if (idButton == "seeMore"){
        let value = event.path[1].firstElementChild.innerText;
        searchSeeMore (value);
    }else{
        iconsGif(event);
    }
});
containerGifsTreding.addEventListener("click",(event)=>{iconsGif(event);})
createGif.addEventListener("click",()=>{goViewCreateGif();});
searchTermsGifs.addEventListener("click",(event)=>{querySuggestion(event);})

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

async function gifSearchTermTreding(){
    let url = `https://api.giphy.com/v1/trending/searches?api_key=${apyKey}`;
    const resp = await fetch (url);
    const data = await resp.json();
    return data;
}

async function gifTermTreding(value){
    let url = `api.giphy.com/v1/tags/related?api_key=${apyKey}&term=${value}`;
    const resp = await fetch (url);
    const data = await resp.json();
    return data;
}

async function queryAutocomplete(valueInput){
    let url = `https://api.giphy.com/v1/gifs/search/tags?api_key=${apyKey}&q=${valueInput}&limit=4&offset=0&rating=g`;
    const resp = await fetch (url);
    const data = await resp.json();
    return data;
}

async function searchGifos(value){
    let url = `https://api.giphy.com/v1/gifs/search?api_key=${apyKey}&q=${value}&limit=12&offset=${offSet}&rating=g&lang=es`;
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

let gifTredingTermsHome = gifSearchTermTreding();
gifTredingTermsHome.then(data =>
    {gifTredingTerms(data);
}).catch(err => 
    {console.error(err);
});

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

function gifTredingTerms(data){
    let searchTerm = document.getElementById("searTermTrendings");
    let dataTerms = data.data;
    let conc = "";
    let count = 0;
    let html;
    let i;
    for (i in dataTerms){
        let term = dataTerms[i];
        count = count + 1;
        html = `<span class="linkTerm" id="term_${count}">${term}</span>`;
        if (count != dataTerms.length){
            html = html+", ";
        }else{
            html = html;
        }
        conc = conc + html;
    }
    searchTerm.innerHTML = conc;    
}

function sendSearch(){
    let value = queryInput.value;
    deletesNodes();
    search (value);
}

function resetSearch(){
    checkQuery.removeAttribute("checked");
    document.getElementById("queryGifos").value = "";
    deletesNodes();
    let noSearch = document.querySelector(".noSearch")
    noSearch.style.display = "none";
}

function searchInput(){
    let valueInput = queryInput.value;
    if(valueInput == ""){
        checkQuery.removeAttribute("checked");
        let option = document.getElementById("optionFirst");
        option.innerText = "";
        option = document.getElementById("optionSecond");
        option.innerText = "";
        option = document.getElementById("optionThird");
        option.innerText = "";
        option = document.getElementById("optionFourth");
        option.innerText = "";
        deletesNodes();
        let noSearch = document.querySelector(".noSearch")
        noSearch.style.display = "none";
    }else{
        checkQuery.setAttribute("checked",true);
        getNameAutocomplete(valueInput);
    }
}

function deletesNodes(){
    let container = document.getElementById("containerSearchGifos");
    let childs = container.childNodes;
    let hasChilds = childs.length;
    if (hasChilds > 0){
        let i = 0;
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

function getNameAutocomplete(valueInput){
    let query = queryAutocomplete(valueInput);
    query.then(data =>
    {getDataName(data)
    }).catch(err => 
        {console.error(err);
    });
}

function getDataName(data){
    let dataAutocomplete = data.data;
    let i;
    var count = 0;
    for (i in dataAutocomplete){
        let nameAutocomplete = dataAutocomplete[i].name;
        if (count == 0){
            let option = document.getElementById("optionFirst");
            option.innerText = nameAutocomplete;
        }else if (count == 1){
            let option = document.getElementById("optionSecond");
            option.innerText = nameAutocomplete;
        }else if (count == 2){
            let option = document.getElementById("optionThird");
            option.innerText = nameAutocomplete;
        }else if (count == 3){
            let option = document.getElementById("optionFourth");
            option.innerText = nameAutocomplete;
        }
        count = count + 1;
    }
}

function setQueryGifos(event){
    let className = event.target.className;
    if (className == "options"){
        let value = event.target.childNodes[3].outerText;
        document.getElementById("queryGifos").value = value;
        checkQuery.removeAttribute("checked");
        deletesNodes();
        search (value);
    }   
}

function search (value){
    let search = searchGifos(value);
    search.then(data =>
        {getSearchGifos(data, value);
        }).catch(err => 
            {console.error(err);
        });
}

function getSearchGifos(data, value){
    let dataGif = data.data;
    let hasData = dataGif.length;
    let container = document.getElementById("containerSearchGifos");
    let search = document.createElement("div");
    let h3 = document.createElement("h3");
    let button = document.createElement("button");
    h3.id = `titleSearch${value}`;
    h3.innerText = value;
    h3.style.display = "block";
    container.appendChild(h3);
    if (hasData > 0){
        search.id = "searchGifos";
        container.appendChild(search);
        insertGifos (dataGif, search);
        button.id = "seeMore";
        button.className = "seeMore";
        button.innerText = "VER MÁS";
        container.appendChild(button);
    } 
    else{
        let noSearch = document.querySelector(".noSearch");
        noSearch.style.display = "flex";
    }  
}

function insertGifos (dataGif, search){
    let i;
    let path = window.location.pathname.search("index");
    for (i in dataGif){
        let gifs = dataGif[i];
        let info = getData (gifs);
        let idGif = info[0];
        let titleGif = info[1];
        let usernameGif = info[2];
        let source = info[3];  
        let original = info[4];
        let div = document.createElement("div");
        div.id = `div_${idGif}`;
        div.classList.add("contaGif");
        if (path == -1){
            div.innerHTML = `<button class="buttonsGif likeButton" id="likeButton_${idGif}"><i class="far fa-heart"></i></button>
            <button class="buttonsGif downloadButton" id="downloadButton_${idGif}"><i class="fas fa-download"></i></button>
            <a href="./originalGifDarkMode.html" class="buttonsGif expandButton" id="expandButton_${idGif}"><i class="fas fa-expand-alt"></i></a>
            <div class="informationGif">
                <span class="user" id="user_${idGif}">${usernameGif}</span>
                <span class="title" id="title_${idGif}">${titleGif}</span>
            </div>
            <div class="containerImg">
                <img src=${source} alt=${titleGif} class="gif" id=${idGif}>
            </div>`;
        }else{
            div.innerHTML = `<button class="buttonsGif likeButton" id="likeButton_${idGif}"><i class="far fa-heart"></i></button>
            <button class="buttonsGif downloadButton" id="downloadButton_${idGif}"><i class="fas fa-download"></i></button>
            <a href="./html/originalGif.html" class="buttonsGif expandButton" id="expandButton_${idGif}"><i class="fas fa-expand-alt"></i></a>
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
}

function searchSeeMore (value){
    let search = searchGifos(value);
    search.then(data =>
        {getSearchSeeMore(data);
        }).catch(err => 
            {console.error(err);
        });
}

function getSearchSeeMore(data){
    let dataGif = data.data;
    let hasData = dataGif.length;
    let search = document.getElementById("searchGifos");
    if (hasData > 0){
        insertGifos (dataGif, search);
    }
    else{
        let seeMoreButton = document.getElementById("seeMore");
        seeMoreButton.style.display = "none";
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
    console.log(index);
}

function showGifMobile(data){
    let width = seeMore.offsetWidth;
    let path = window.location.pathname.search("index");
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
        console.log(index);
        let a = document.createElement("a");
        if (path == -1){
            a.href = "./originalGifDarkMode.html";
        }else{
            a.href = "./html/originalGif.html";
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

function goViewCreateGif(){
    let path = window.location.pathname.search("index");
    let a = document.createElement("a");
        if (path == -1){
            a.href = "./createGifDarkMode.html";
        }else{
            a.href = "./html/createGif.html";
        }
        a.click();
}

function querySuggestion(event){
    let value = event.srcElement.innerText;
    deletesNodes();
    search (value);
}