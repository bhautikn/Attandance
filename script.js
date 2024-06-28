// let Students;
/*
let Students = [
    {
        'RollNumber': 1,
        'Name': 'Name1'
    }
]
// or fetch from other file 

*/
// fetch('student.json').then(res=>res.json()).then((res=>{Students = res}));
let rollDisplay = document.getElementById('roll-no');
let nextBtn = document.getElementById('next-btn');
// let previusBtn = document.getElementById('previus-btn');
let repeatBtn = document.getElementById('repeat-btn');
let absentBtn = document.getElementById('absent-btn');
// let digits = document.getElementsByClassName('number');
let absentRolls = document.getElementById('absent-roll');
let classInfo = document.getElementById('class-info');
let namePlate = document.getElementById('name-plate');
let audioBtn = document.getElementById('speaker-div');
let copyBtn = document.getElementById('copy-btn');
let changeTheme = document.getElementById('change-theme');
let downloadBtn = document.getElementById('download-btn');
let voiceSelectOption = document.getElementById('select-voice');

let isAudio = true;
let outString = "";
let arr = [];
let absents = [];
// let roollNumber = [0, 0, 1];
let roll = 101;
let speaker = new SpeechSynthesisUtterance();

if (!localStorage.siteObj) {
    addToLocalStorage({
        // isDark: true,
        isAudio: true,
        speechRate: 1,
        volume: 1,
        voice: 0
    });
}

{
    isAudio = getToLocalStorage('isAudio');
    // changeTheme.checked = getToLocalStorage('isDark');
    if (!isAudio) {
        audioBtn.style.border = '2px solid darkgrey';
        audioBtn.innerHTML = '<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 9L22 15M22 9L16 15M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        audioBtn.firstChild.firstChild.style.stroke = 'darkgrey'
    }
    // if (changeTheme.checked) {
    //     let r = document.querySelector(':root');
    //     darkTheme(r);
    // }
    document.getElementById('speech-rate').value = getToLocalStorage('speechRate');
    document.getElementById('volume-changer').value = getToLocalStorage('volume') * 100;
    speaker.rate = getToLocalStorage('speechRate');
    speaker.volume = getToLocalStorage('volume');
    speaker.voice = speechSynthesis.getVoices()[getToLocalStorage('voice')];
}

document.body.addEventListener('keyup', (e) => {
    if (e.key == 'ArrowRight') increaseRoll();
    else if (e.key == 'ArrowLeft') repeatRoll();
    else if (e.key == 'ArrowDown' || e.key == 'ArrowUp') addAbsent();
})
speechSynthesis.addEventListener("voiceschanged", () => {
    let temp = speechSynthesis.getVoices()
    let voiceIndex = getToLocalStorage('voice');
    speaker.voice = speechSynthesis.getVoices()[getToLocalStorage('voice')];
    voiceSelectOption.innerHTML = temp.map((e, index) => {
        if (index == voiceIndex)
            return `<option value="${e.name}" selected>${e.name}</option>`
        return `<option value="${e.name}">${e.name}</option>`
    }).join('');
})
voiceSelectOption.addEventListener('click', (e) => {
    let classIndex = voiceSelectOption.selectedIndex;
    speaker.voice = speechSynthesis.getVoices()[classIndex];
    addToLocalStorage({ voice: classIndex });
})
nextBtn.addEventListener('click', () => { increaseRoll() })
repeatBtn.addEventListener('click', () => {
    repeatRoll();
})
absentBtn.addEventListener('click', addAbsent);

function showSpeakerMenu(e) {
    let temp = document.getElementById('context-menu');
    temp.style.display = 'block';
    temp.style.top = e.y + "px";
    temp.style.left = e.x + "px";
    setTimeout(() => {
        document.body.addEventListener('click', function tempFunction(f) {
            if (!temp.contains(f.target)) {
                temp.style.display = 'none';
                this.removeEventListener("click", tempFunction)
            }
        })
    }, 100);
}

audioBtn.addEventListener('click', () => {
    if (!isAudio) {
        audioBtn.style.border = '2px solid seagreen';
        audioBtn.innerHTML = '<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 9C16.5 9.5 17 10.5 17 12C17 13.5 16.5 14.5 16 15M19 6C20.5 7.5 21 10 21 12C21 14 20.5 16.5 19 18M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'

    }
    else {
        audioBtn.style.border = '2px solid darkgrey';
        audioBtn.innerHTML = '<svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 9L22 15M22 9L16 15M13 3L7 8H5C3.89543 8 3 8.89543 3 10V14C3 15.1046 3.89543 16 5 16H7L13 21V3Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        audioBtn.firstChild.firstChild.style.stroke = 'darkgrey'
    }
    isAudio = !isAudio;
    addToLocalStorage({ isAudio: isAudio });
})
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(absentRolls.value);
    copyBtn.innerHTML = '<svg width="25px" height="25px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 5L8 15l-5-4"/></svg>'
    setTimeout(() => {
        copyBtn.innerHTML = `<svg fill="#000000" width="25px" height="25px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
    viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve">
<g id="Text-files">
   <path d="M53.9791489,9.1429005H50.010849c-0.0826988,0-0.1562004,0.0283995-0.2331009,0.0469999V5.0228
       C49.7777481,2.253,47.4731483,0,44.6398468,0h-34.422596C7.3839517,0,5.0793519,2.253,5.0793519,5.0228v46.8432999
       c0,2.7697983,2.3045998,5.0228004,5.1378999,5.0228004h6.0367002v2.2678986C16.253952,61.8274002,18.4702511,64,21.1954517,64
       h32.783699c2.7252007,0,4.9414978-2.1725998,4.9414978-4.8432007V13.9861002
       C58.9206467,11.3155003,56.7043495,9.1429005,53.9791489,9.1429005z M7.1110516,51.8661003V5.0228
       c0-1.6487999,1.3938999-2.9909999,3.1062002-2.9909999h34.422596c1.7123032,0,3.1062012,1.3422,3.1062012,2.9909999v46.8432999
       c0,1.6487999-1.393898,2.9911003-3.1062012,2.9911003h-34.422596C8.5049515,54.8572006,7.1110516,53.5149002,7.1110516,51.8661003z
        M56.8888474,59.1567993c0,1.550602-1.3055,2.8115005-2.9096985,2.8115005h-32.783699
       c-1.6042004,0-2.9097996-1.2608986-2.9097996-2.8115005v-2.2678986h26.3541946
       c2.8333015,0,5.1379013-2.2530022,5.1379013-5.0228004V11.1275997c0.0769005,0.0186005,0.1504021,0.0469999,0.2331009,0.0469999
       h3.9682999c1.6041985,0,2.9096985,1.2609005,2.9096985,2.8115005V59.1567993z"/>
   <path d="M38.6031494,13.2063999H16.253952c-0.5615005,0-1.0159006,0.4542999-1.0159006,1.0158005
       c0,0.5615997,0.4544001,1.0158997,1.0159006,1.0158997h22.3491974c0.5615005,0,1.0158997-0.4542999,1.0158997-1.0158997
       C39.6190491,13.6606998,39.16465,13.2063999,38.6031494,13.2063999z"/>
   <path d="M38.6031494,21.3334007H16.253952c-0.5615005,0-1.0159006,0.4542999-1.0159006,1.0157986
       c0,0.5615005,0.4544001,1.0159016,1.0159006,1.0159016h22.3491974c0.5615005,0,1.0158997-0.454401,1.0158997-1.0159016
       C39.6190491,21.7877007,39.16465,21.3334007,38.6031494,21.3334007z"/>
   <path d="M38.6031494,29.4603004H16.253952c-0.5615005,0-1.0159006,0.4543991-1.0159006,1.0158997
       s0.4544001,1.0158997,1.0159006,1.0158997h22.3491974c0.5615005,0,1.0158997-0.4543991,1.0158997-1.0158997
       S39.16465,29.4603004,38.6031494,29.4603004z"/>
   <path d="M28.4444485,37.5872993H16.253952c-0.5615005,0-1.0159006,0.4543991-1.0159006,1.0158997
       s0.4544001,1.0158997,1.0159006,1.0158997h12.1904964c0.5615025,0,1.0158005-0.4543991,1.0158005-1.0158997
       S29.0059509,37.5872993,28.4444485,37.5872993z"/>
</g>
</svg>` }, 2000);

})
downloadBtn.addEventListener('click', () => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(absentRolls.value));
    let time = new Date();
    element.setAttribute('download',
        'attandance_' + time.getDay() + '-' + time.getMonth() + '-' + time.getFullYear() + '_' + time.getHours() + ':' + time.getMinutes() + '_sem3.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    downloadBtn.innerHTML = '<svg width="25px" height="25px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none"><path stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 5L8 15l-5-4"/></svg>'
    setTimeout(() => { downloadBtn.innerHTML = '<svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11L12 15M12 15L8 11M12 15V3M21 15V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' }, 2000);
})

document.getElementById('speech-rate').addEventListener('change', (e) => {
    speaker.rate = e.target.value;
    addToLocalStorage({ speechRate: speaker.rate });
})
document.getElementById('volume-changer').addEventListener('change', (e) => {
    speaker.volume = e.target.value / 100;
    addToLocalStorage({ volume: speaker.volume });
})

// changeTheme.addEventListener('click', () => {
//     let r = document.querySelector(':root');
//     if (changeTheme.checked)
//         darkTheme(r);
//     else
//         lightTheme(r);
// })


function isDuplicate(arr, e) {
    for (i of arr)
        if (i === e) return true;
    return false;
}
function deleteElement(arr, e) {
    arr.indexOf(e) != -1 ? arr.splice(arr.indexOf(e), 1) : null;
    updateTextArea();
}
function addAbsent() {
    if (roll >= 570) return;
    // if (!isDuplicate(arr, roll) && roll != 0 && roll%100 != 0){
    // arr.push(roll);
    absents.push(roll);
    updateTextArea();
    // console.log(arr);
    // }
    increaseRoll();
}
function increaseRoll(p = 2, index = 1) {
    //spacial condition according sem
    if (roll >= 569) return;
    roll += 1;
    //spacial condition according sem
    if (roll == 305) roll = 401;
    rollDisplay.innerHTML = roll;
    if ((roll - 1) % 100 == 0) outString += "\n\n";

    // if((roollNumber[0]+""+roollNumber[1]) >= 65){
    //     roll = roll+100-65;
    //     for (i of digits)
    //         i.innerHTML = 0;
    //     roollNumber = [0,0, roll/100];
    //     classInfo.innerHTML = roll/100;

    //     let tempClass= '';
    //     if(roollNumber[2]== 2) tempClass = 'B: '
    //     else if(roollNumber[2]== 3) tempClass = 'C: '
    //     else if(roollNumber[2]== 4) tempClass = 'D: '
    //     else if(roollNumber[2]== 5) tempClass = 'H: '
    //     outString+= "\n\n"+tempClass;
    // }
    // if(digits[p].style.display == 'block'){
    //     digits[p].style.display = 'none';
    //     digits[p+1].style.display = 'block';
    //     if(roollNumber[index] == 9){
    //         roollNumber[index] = 0;
    //         digits[p+1].innerHTML = roollNumber[index];
    //         increaseRoll(0, 0);
    //     }
    //     else digits[p+1].innerHTML = ++roollNumber[index];
    // }
    // else{
    //     digits[p+1].style.display = 'none';
    //     digits[p].style.display = 'block';
    //     if(roollNumber[index] == 9){
    //         roollNumber[index] = 0
    //         digits[p].innerHTML = roollNumber[index];
    //         increaseRoll(0, 0);
    //     }
    //     else digits[p].innerHTML = ++roollNumber[index];
    // }
    // roll = parseInt(roollNumber[2]+""+roollNumber[0]+""+roollNumber[1]);
    // if(Students.filter(data=>roll == data.RollNumber).length == 1)
    //     var [{Name}] = Students.filter(data=>roll == data.RollNumber);
    // namePlate.innerHTML = Name;
    speekRollNumber(roll);
}

function speekRollNumber(rollNumber) {
    if (isAudio) {
        if (rollNumber % 100 == 0) speaker.text = rollNumber
        else if (rollNumber % 100 == 1) speaker.text = rollNumber
        else if (rollNumber % 10 == 0) speaker.text = rollNumber % 100;
        else if (rollNumber % 10 == 1) speaker.text = rollNumber % 100;
        else speaker.text = rollNumber % 10;
        speechSynthesis.speak(speaker);
    }
}
// function previus(p=2, index=1){
//     roll -= 1;
//     rollDisplay.innerHTML = roll;
// if((roollNumber[0]+""+roollNumber[1]) > 0){
//     if(digits[p].style.display == 'block'){
//         digits[p].style.display = 'none';
//         digits[p+1].style.display = 'block';
//         if(roollNumber[index] == 0 && roollNumber[0] != 0){
//             roollNumber[index] = 9;
//             digits[p+1].innerHTML = roollNumber[index];
//             previus(0, 0);
//         }
//         else digits[p+1].innerHTML = --roollNumber[index];
//     }
//     else{
//         digits[p+1].style.display = 'none';
//         digits[p].style.display = 'block';
//         if(roollNumber[index] == 0 && roollNumber[0] != 0){
//             roollNumber[index] = 9
//             digits[p].innerHTML = roollNumber[index];
//             previus(0, 0);
//         }
//         else digits[p].innerHTML = --roollNumber[index];
//     }
//     roll = parseInt(roollNumber[2]+""+roollNumber[0]+""+roollNumber[1]);
//     if(Students.filter(data=>roll == data.RollNumber).length ==1)
//         var [{Name}] = Students.filter(data=>roll == data.RollNumber);
//     namePlate.innerHTML = Name;  
// }
// if(roll < arr[arr.length-1]) arr.pop();
// let tempArray = outString.split(', ');
// if(tempArray[tempArray.length-1].charAt(1) == ':'){
//     tempArray = tempArray[tempArray.length-1].split(' ');
//     if(roll < tempArray[1]) outString = tempArray[0]+" ";
// }
// else{
//     if(roll < tempArray[tempArray.length-1]) tempArray.pop();
//     outString = tempArray.join(', ');
// }
// absentRolls.innerHTML = outString;
// }
function repeatRoll() {
    speaker.text = roll % 100;
    speechSynthesis.speak(speaker);
}
function handlePresntRoll(e) {
    if (e.key == 'Enter') {
        let tempRoll = e.target.value;
        if (tempRoll.length != 3) {
            return;
        }
        e.target.value = "";
        tempRoll = parseInt(tempRoll);
        deleteElement(absents, tempRoll);
        // absents.push(tempRoll);
        // absents.sort();
        updateTextArea();
    }
}
function handleAbsentRoll(e) {
    if (e.key == 'Enter') {
        let tempRoll = e.target.value;
        if (tempRoll.length != 3) {
            return;
        }
        e.target.value = "";
        tempRoll = parseInt(tempRoll);
        if (isDuplicate(absents, tempRoll)) return;
        absents.push(tempRoll);
        absents.sort();
        updateTextArea();
    }
}
function updateTextArea() {
    // if (outString[outString.length - 1] == undefined) outString += roll;
    // else if (outString[outString.length - 1] == '\n') outString += roll;
    // else outString += ", " + roll;
    outString = absents.join(', ');
    absentRolls.value = outString;
}
function darkTheme(r) {
    r.style.setProperty('--back-color', '#222')
    r.style.setProperty('--txt-color', 'white')
    r.style.setProperty('--light-bg-color', '#333')
    r.style.setProperty('--hover-color', '#333')
    r.style.setProperty('--nav-bar-color', 'rgb(51, 69, 74)')
    addToLocalStorage({ isDark: true });
}
function lightTheme(r) {
    r.style.setProperty('--back-color', 'white')
    r.style.setProperty('--txt-color', '#333')
    r.style.setProperty('--light-bg-color', 'whitesmoke')
    r.style.setProperty('--hover-color', '#ddd')
    r.style.setProperty('--nav-bar-color', 'rgb(218, 236, 241)')

    addToLocalStorage({ isDark: false });
}
function classChange(e) {
    let temp = parseInt(e.target.value);
    e.target.blur();
    // let temp = 301;
    // let classIndex = temp.selectedIndex.value;
    outString = "";
    roll = temp;
    // absentRolls.innerHTML = outString;
    rollDisplay.innerHTML = temp;

    // roollNumber[2] = classIndex;
    // roll = classIndex*100+1;
    // digits[2].innerHTML = 1;
    // classInfo.innerHTML = classIndex;
}
function addToLocalStorage(argsObj) {
    let obj = {};
    if (localStorage.siteObj)
        obj = JSON.parse(localStorage.siteObj);
    obj = { ...obj, ...argsObj }
    localStorage.setItem('siteObj', JSON.stringify(obj));
}
function getToLocalStorage(key) {
    let obj = {};
    if (localStorage.siteObj)
        obj = JSON.parse(localStorage.siteObj);
    return obj[key];
}