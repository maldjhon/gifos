const apyKey = "kDcSPTWLzqz5YieHFpaMNSFKhAHJUuV4";
var buttonInit = document.getElementById("buttonInit");
var buttonRecord = document.getElementById("buttonRecord");
var buttonRecord = document.getElementById("buttonRecord");
var buttonStop = document.getElementById("buttonStop");
var buttonSend = document.getElementById("buttonSend");
var downloadButton = document.getElementById("downloadButton");
var linkButton = document.getElementById("linkButton");
var objectURL;
const constrain = {
    audio: false,
    video: { width: 480, height: 340 }
};
var stream = "";
var recorder = "";
var idSendGif;
var n=0;
var arrayMyGifs = new Array ();

buttonInit.addEventListener("click", ()=>{
    setStyleTitle();
    getStreamAndRecord();
});
buttonRecord.addEventListener("click", ()=>{
    setRecord();
    recorder = RecordRTC(stream, {
    type: 'gif',
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240});
    recorder.startRecording();
});
buttonStop.addEventListener("click",()=>{
    recorder.stopRecording((event)=>{
        setSendGif();
        fetch (event)
        .then(function(response){
            return  response.blob();
        })
        .then(function(myBlob){
            objectURL = URL.createObjectURL(myBlob);
        })
        });
});

buttonSend.addEventListener("click",() =>{
    sendGif();
});

downloadButton.addEventListener("click",()=>{download()});
linkButton.addEventListener("click",()=>{copyLink();})

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

async function getMedia(constrain){
    const mediaStream = await navigator.mediaDevices.getUserMedia(constrain);
    return mediaStream;
}

async function sendApiGif(url,form){
    const resp = await fetch (url,{
        method: 'POST',
        body:form});
    const data = await resp.json();
    return data;
}

async function searchMyGif (id){
    let url = `https://api.giphy.com/v1/gifs/${id}?api_key=${apyKey}`;
    const resp = await fetch (url);
    const data = await resp.json();
    return data; 
}

function getStreamAndRecord () { 
    let get = getMedia(constrain);
    get.then(mediaStream => {
        idSendGif = mediaStream.id;
        setVideo();
        streamVideo(mediaStream);
    }).catch(err => 
        {console.error(err);
    });
}

function setStyleTitle(){
    let check = document.getElementById("changeText");
    let one = document.getElementById("changeOne");
    buttonInit.style.display = "none";
    check.setAttribute("checked","true");
    one.setAttribute("checked","true");
}

function setVideo(){
    let check = document.getElementById("hiddenText");
    let video = document.getElementById("displayVideo");
    let param = document.getElementById("changeParam");
    let one = document.getElementById("changeTwo");
    buttonRecord.style.display = "block";
    check.setAttribute("checked","true");
    one.setAttribute("checked","true");
    video.setAttribute("checked","true");
    param.setAttribute("checked","true");
}

function streamVideo (mediaStream){
    stream = mediaStream;
    let contianer = document.getElementById("containerVideo");
    let video = document.createElement("video");
    video.srcObject = mediaStream;
    video.play();
    contianer.appendChild(video);
}

function setRecord(){
    buttonRecord.style.display = "none";
    buttonStop.style.display = "block";
    var interval = window.setInterval(setTime,1000);
}

function setTime(){
    let i = 0;
    let interval = document.getElementById("interval");
    let date = new Date(); 
    date.setHours(00,00,n);
    interval.innerText = date.toLocaleTimeString();
    n++;
}

function setSendGif (){
    buttonStop.style.display = "none";
    buttonSend.style.display = "block";
    let interval = document.getElementById("interval");
    let again = document.getElementById("again");
    interval.style.display = "none";
    again.style.display = "block";
}

function sendGif(){
    waitSend();
    let form = new FormData();
    form.append('file', recorder.getBlob(), `${idSendGif}.gif`);
    let url = `https://upload.giphy.com/v1/gifs?api_key=${apyKey}`;
    let send = sendApiGif(url,form);
    send.then(data => {
        sendSuccesful();
        let id = data.data.id;
        localStorage.setItem(`mygif_${id}`,id);
        let searchId = searchMyGif (id);
            searchId.then(data => {
                sendLocalStorage(data,id);
            }).catch(err => 
                {console.error(err);
            });
    }).catch(err => 
        {console.error(err);
    });
}   

function waitSend(){
    let check = document.getElementById("waitSend");
    let again = document.getElementById("again");
    let hover = document.getElementById("hoverDisplay");
    check.setAttribute("checked","true");
    hover.setAttribute("checked","true");
    again.style.display = "none";
    buttonSend.style.display = "none";
}

function sendSuccesful(){
    let success = document.getElementById("sucessful");
    let loader = document.querySelector(".loader");
    let weSendGif = document.querySelector(".weSendGif");
    success.setAttribute("checked","true");
    loader.style.display = "none";
    weSendGif.style.display = "none";
}

function download(){
    let url = arrayMyGifs[0].original;
    let idImg = arrayMyGifs[0].id;
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

function sendLocalStorage(data,id){
    let dataGif = data.data;
    let myGif = getData (dataGif);
    let idGif = myGif[0];
    let titleGif = myGif[1];
    let usernameGif = myGif[2];
    let source = myGif[3];
    let original = myGif[4];
    addInfoArray (arrayMyGifs,idGif,titleGif,usernameGif,source,original); 
    localStorage.setItem(`mygif_${id}`,JSON.stringify(arrayMyGifs));
}

function getData (dataGif){
    let info = new Array();
    let i;
    for (i in dataGif){
        let gifs = dataGif[i];
        if (i == "id"){
            var idGif = gifs;
        }
        else if (i == "title"){
            var titleGif = gifs;
        }
        else if (i == "username"){
            var usernameGif = gifs;
        }
        else if (i == "images"){
            let k;
            let imagesGif = gifs;
            for (k in imagesGif){
                if (k == "fixed_width_downsampled"){
                    let l;
                    let urlImageGif= imagesGif.fixed_width_downsampled;
                    for (l in urlImageGif){
                        if (l =="url"){
                            var source = urlImageGif[l];
                        }
                    }
                }else if (k == "original"){
                    let l;
                    let urlImageGif= imagesGif.original;
                    for (l in urlImageGif){
                        if (l =="url"){
                            var original = urlImageGif[l];
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

function copyLink(){
    let url = arrayMyGifs[0].original;
    let aux = document.createElement("input");
    aux.value = url;
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
}