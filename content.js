// content.js

function ansData(index, correct, answer, originDom) {
    this.index = index;
    this.correct = correct;
    this.answer = answer;
    this.originDom = originDom;
}

function createTable(ansDataList) {
    // console.log(ansDataList);
    let table = document.createElement('table');

    let trh = document.createElement("tr");
    let th1 = document.createElement("th");
    let th2 = document.createElement("th");
    let th3 = document.createElement("th");
    let th1Text = document.createTextNode("No.");
    let th2Text = document.createTextNode("Your Answer");
    let th3Text = document.createTextNode("Correct");
    th1.appendChild(th1Text);
    th2.appendChild(th2Text);
    th3.appendChild(th3Text);
    trh.appendChild(th1);
    trh.appendChild(th2);
    trh.appendChild(th3);
    table.appendChild(trh);

    let dataLen = ansDataList.length;
    for (let i = 0; i < dataLen; i++) {
        let tr = document.createElement("tr");

        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");

        let text1 = document.createTextNode(ansDataList[i].index + 1);
        let text2 = document.createTextNode(ansDataList[i].answer);
        let text3 = document.createTextNode(ansDataList[i].correct);

        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        table.appendChild(tr);
    }
    return table;
}

class DomManager {
    constructor() {
        this.domList = null;
        this.domListlen = 0;
        this.minInd = 0;
        this.maxInd = 0;
        this.qNum = 0;
        this.ansDataList = [];
        // this.incrementId = 0;
        this.numSet = new Set();
    }
    *_getRandomInt() {
        const min = Math.ceil(this.minInd);
        const max = Math.floor(this.maxInd);
        while (true) {
            yield Math.floor(Math.random() * (max - min) + min);
        }
    }
    _replaceDom(obj, id) {
        // console.log("replace targets parent:" + obj.parentNode.text);
        const borderStyle = "border: 1px solid rgba(217,30,24,1); outline:none;";
        obj.outerHTML = `<input type="text" id="${id}" name="Q" size="${obj.textContent.length}" style="${borderStyle}">`;
    }
    resetDomList() {
        let inputList = document.querySelectorAll("input[name='Q']");
        for (let dom of inputList) {
            // console.log(dom.text);
            dom.outerHTML = this.ansDataList[Number(dom.id)].originDom.outerHTML;
        }
        // reset Dom node. so re-take domList.
        let domList = document.querySelectorAll("span.inline");
        domManager.setDomList(domList);
        this.ansDataList = [];
    }
    _storeAns(obj, id) {
        let data = new ansData(id, obj.textContent, "", obj);
        this.ansDataList.push(data);
    }
    _setYourAns() {
        let ans = document.querySelectorAll("input[name='Q']");
        let ansLen = ans.length;
        for (let i = 0; i < ansLen; i++) {
            this.ansDataList[i].answer = ans[i].value;
        }
    }
    setQuizNumber(num) {
        this.qNum += Number(num);
        this.qNum = Math.min(this.qNum, this.domListlen);
    }
    setDomList(domList) {
        this.domList = domList;
        this.domListlen = this.domList.length;
        this.maxInd = this.domListlen;
    }
    exec() {
        // console.log("running exec");
        const iter = this._getRandomInt();
        while (this.numSet.size != this.qNum) {
            this.numSet.add(iter.next().value);
        }
        this.resetDomList();
        const sortedNumList = [...this.numSet].sort((a, b) => a - b);
        // console.log("setlist:");
        // console.log(sortedNumList);
        let incrementId = 0;
        sortedNumList.forEach(num => {
            this._storeAns(this.domList[num], incrementId);
            this._replaceDom(this.domList[num], incrementId);
            ++incrementId;
        })
    }
}

let domManager = new DomManager();

function outputHTML() {
    // console.log("start output result as HTML.");

    let html = document.createElement("html");
    let body = document.createElement("body");
    let modalStyle = document.getElementById("modalStyle").cloneNode(true);
    let result = document.getElementById("resultModalBody").cloneNode(true);
    html.appendChild(modalStyle);
    body.appendChild(result);
    html.appendChild(body);

    let blob = new Blob([html.outerHTML], { type: "text/html" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    let date = new Date();
    let yStr = date.getFullYear().toString();
    let mStr = (date.getMonth() + 1).toString();
    let dStr = date.getDate().toString();
    if (mStr.length == 1) { mStr = "0" + mStr }
    if (dStr.length == 1) { dStr = "0" + dStr }

    link.download = yStr + mStr + dStr + ".html";

    link.click();
}

function outputTxt() {
    // console.log("execute output");

    let textData = [];
    textData.push("test date:");
    let date = new Date();
    textData.push(date.toLocaleDateString());
    textData.push("talk title:");
    textData.push(document.title);
    textData.push("talk URL:");
    textData.push(document.URL);
    for (const ansData of domManager.ansDataList) {
        for (var key in ansData) {
            if (ansData.hasOwnProperty(key)) {
                textData.push(key);
                textData.push(ansData[key]);
            }
        }
    }
    let concatText = textData.join("\n");

    let blob = new Blob([concatText], { type: "text/plan" });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    let yStr = date.getFullYear().toString();
    let mStr = (date.getMonth() + 1).toString();
    let dStr = date.getDate().toString();
    if (mStr.length == 1) { mStr = "0" + mStr }
    if (dStr.length == 1) { dStr = "0" + dStr }

    link.download = yStr + mStr + dStr + ".txt";
    link.click();
}

function VideoCtrl(event){
    let video = document.getElementsByTagName("video")[0];
    let timeWidth = 10;
    // !currentTime pass by value not ref.
    let currentTime = video.currentTime;
    let duration = video.duration;
    let isPause = video.paused;
    // console.log(event.key);
    if (event.ctrlKey && event.key === "ArrowLeft") {
        // console.log("left arrow!!!");
        if(currentTime < timeWidth){
            video.currentTime = 0;
        }else{
            video.currentTime -= timeWidth;
        }
    } else if (event.ctrlKey && event.key === "ArrowRight") {
        // console.log("right arrow!!!");
        let added_time = currentTime + timeWidth;
        if(added_time > duration){
            video.currentTime = duration;
        }else{
            video.currentTime += timeWidth;
        }
    } else if (event.ctrlKey &&event.key === " ") {
        // console.log("space key!!!");
        if(isPause){
            video.play();
        }else{
            video.pause();
        }
    }
}

document.addEventListener("keydown", VideoCtrl);

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        // console.log("receive msg");
        var config_req = Object.assign({}, request);

        if (domManager.domList === null) {
            let domList = document.querySelectorAll("span.inline");
            domManager.setDomList(domList);
        }

        if (request.message === "test_input") {
            domManager.exec();
            // storeTest = domManager.ansDataList;
        } else if (request.message === "check_input") {
            // console.log("check ans");

            if (domManager.qNum === 0) {
                alert("you have to generate Quiz before correct answer.");
                return;
            }

            domManager._setYourAns();

            let modal = document.getElementById("resultModal");
            if (modal == null) {
                await fetch(chrome.runtime.getURL('/result_modal.html'))
                    .then(response => response.text())
                    .then(data => {
                        document.body.innerHTML += data;

                        // Get the modal
                        modal = document.getElementById("resultModal");

                        // // Get the button that opens the modal
                        // var btn = document.getElementById("OpenModalBtn");

                        // Get the <span> element that closes the modal
                        let span = document.getElementsByClassName("close")[0];

                        // When the user clicks on <span> (x), close the modal
                        span.onclick = function () {
                            modal.style.display = "none";
                        }

                        // When the user clicks anywhere outside of the modal, close it
                        window.onclick = function (event) {
                            if (event.target == modal) {
                                modal.style.display = "none";
                            }
                        }

                        let output_button = document.getElementById("outputBtn");
                        output_button.addEventListener('click', outputHTML, false);
                    }).catch(err => {
                        // handle error
                    });
            };
            let tblContainer = document.getElementById("resultModalBody");
            let tbl = createTable(domManager.ansDataList);
            while (tblContainer.firstChild) {
                tblContainer.firstChild.remove()
            }
            tblContainer.appendChild(tbl);
            modal.style.display = "block";
        } else if (request.message === "set_quiz_number") {
            domManager.setQuizNumber(request.number);
        } else if (request.message === "reset") {
            domManager.resetDomList();
            domManager.qNum = 0;
            domManager.numSet = new Set();
        } else if (request.message === "is_quiz_exist") {
            let msg;
            let replacedDom = document.querySelectorAll("input[name='Q']");
            if (replacedDom.length == 0) {
                // console.log("not exist domList.");
                msg = "not_exist";
            } else {
                // console.log("exist domList.");
                msg = "exist";
            }
            // back to popup.js
            chrome.runtime.sendMessage({
                message: msg,
            });
        }
        chrome.runtime.sendMessage(config_req)
    }
);

