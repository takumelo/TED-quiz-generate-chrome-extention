function main_test(){
    let num = document.getElementById("blankNumber").value;
    if(!isNaN(num)){
        if(num >= 0){
            _setQuizNumber(num);
            let config = { "message": "test_input" };
            message_to_contentjs(config);
            isQuizExsist();
            return;
        }
        alert("input number must positive and integer.");
        return;
    }
    alert("input must be number.");
    return;
}

function check(){
    let config = { "message": "check_input" };
    message_to_contentjs(config);
    // return;
}

function reset(){
    let config = {"message": "reset"};
    message_to_contentjs(config);
    isQuizExsist();
}

function isQuizExsist(){
    let config = {"message": "is_quiz_exist"};
    message_to_contentjs(config);
}

function _setQuizNumber(num){
    let config = { "message": "set_quiz_number", "number": num };
    // console.log(num);
    message_to_contentjs(config);
}

function message_to_contentjs(config){
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var activeTab = tabs[0];
        // console.log("send msg");
        chrome.tabs.sendMessage(activeTab.id, config);
    });
}

// listener to content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // console.log("listener run");
        if (request.message === "not_exist") {
            // quiz was already made.
            let check_wrap = document.getElementById("check_wrap");
            let reset_wrap = document.getElementById("reset_wrap");
            if(check_wrap !== null){
                check_wrap.innerHTML = "";
            }
            if(reset_wrap.innerHTML !== null){
                reset_wrap.innerHTML = "";
            }
        }else if(request.message === "exist"){
            // quiz have not made.
            if(document.getElementById("check") === null){
                let check_wrap = document.getElementById("check_wrap");
                let reset_wrap = document.getElementById("reset_wrap");
                let check_btn = document.createElement("button");
                let reset_btn = document.createElement("button");
                check_btn.id = "check";
                reset_btn.id = "reset";
                check_btn.animate([{opacity: '0'}, {opacity: '1'}], 500);
                reset_btn.animate([{opacity: '0'}, {opacity: '1'}], 500);
                let check_btn_txt = document.createTextNode("Check");
                let reset_btn_txt = document.createTextNode("Reset");
                check_btn.appendChild(check_btn_txt);
                reset_btn.appendChild(reset_btn_txt);
                check_btn.addEventListener("click", check);
                reset_btn.addEventListener("click", reset);
                check_wrap.appendChild(check_btn);
                reset_wrap.appendChild(reset_btn);
            }
        }
    }
);

// when popup.html open
window.onload = function(){
    isQuizExsist();
}

document.getElementById('btn').addEventListener('click', main_test);
// document.getElementById('check').addEventListener('click', check);
// document.getElementById('reset').addEventListener('click', reset);
