let constructionInfo = {};
let errFlag = false;
const isNumber = () => !isNaN(Number((constructionInfo.squareFootage))) == true;

//mark pseudo-form's element
const markElement = el => {   
    //mark element 
    let houseConfiguration = el.className.replace(/ .+$/, ""); //check that element has either picked/unpicked class only
    let els = [...document.querySelectorAll("." + houseConfiguration)].forEach(el => {
        el.classList.remove("picked-el");
        el.classList.add("unpicked");
    });
    el.classList.remove("unpicked");
    el.classList.add("picked-el"); 

    //save marked element's value
    let dataValue = (el.getAttribute("dataValue"));
    constructionInfo[houseConfiguration] = dataValue || el.value;
    //console.log(constructionInfo); //test
}

//delete unpicked pseudo-form elements, and leave picked only
const deleteUnpicked = () => {
    [...document.querySelectorAll(".unpicked")].forEach(el => el.remove());
    [...document.querySelectorAll("label")].forEach(el => {
        if(el.getAttribute("garageSize") != constructionInfo.garageSize){
            el.remove();
        }
        });
    [...document.querySelectorAll("input")].forEach(el => el.remove());
    //handle input field
    let squareFootage = document.createTextNode(constructionInfo.squareFootage);
    document.querySelector(".squareFootageTitle").after(squareFootage);
}

//calculate estimated cost for a house-siding
const makeCalculations = () => {
    let squareFootage = Number(constructionInfo.squareFootage);
    let storeyType = constructionInfo.storeyEl == "1" ? 175 * squareFootage : 135 * squareFootage;
    let garageSize = 15000 * Number(constructionInfo.garageSize);
    let exteriorType = () => {
        let ext = constructionInfo.exterior;
        let price = 0;
        switch(ext) {
            case "wood":
                price = 5000 + 10 * squareFootage;
                break;
            case "brick":
                price = 8000 + 10 * squareFootage;
                break;
            case "stucco":
                price = 6000;
                break;
            case "stone":
                price = 16000;
                break;
        }
        return price;
    }
    return storeyType + garageSize + exteriorType();
}

//validate if a user enter right data
const validatePicks = () => {
    if(errFlag) {
        document.querySelector("div.err").remove();
    }
    //warn user what's wrong
    if(Object.keys(constructionInfo).length < 5  || !isNumber()) {
        let oldEl = document.querySelector('div#btn-result');
        let newEl = document.createElement('div');
        newEl.setAttribute("class", "err");
        if(!isNumber() || constructionInfo.squareFootage == "" || constructionInfo.squareFootage == " ") {
            newEl.innerHTML = "<p>Square footage must have numbers only!</p>";
        } else {
            newEl.innerHTML = "<p>You must pick all 5 options to calculate the estimated cost</p>";
        }
        oldEl.parentNode.insertBefore(newEl, oldEl);
        errFlag = true;
        return false;
    }
    return true;
}

//print esitmated cost in DOM
const printEstimatedCost = () => {
    let oldEl = document.querySelector('div#btn-result');
    let newEl = document.createElement('div');
    newEl.setAttribute("class", "output-block");
    newEl.innerHTML = "<span class='title'>Estimated Cost</span>$" + makeCalculations();
    oldEl.parentNode.replaceChild(newEl, oldEl);
}

//output
const getOutput = () => {  
    if(validatePicks()){
        deleteUnpicked();
        printEstimatedCost();
    }
}