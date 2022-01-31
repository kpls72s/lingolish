import { randomWord, disabledKeys, setGameLevel } from "./data/utilitys.js";

const deleteButton = document.getElementById("delete");
const Keys = Array.from(document.querySelectorAll(".keys"));
const inputs = Array.from(document.querySelectorAll(".input"));
const userGuess = document.getElementById("userGuess");
const computerGuess = document.getElementById("computerGuess");
const radioButtons = Array.from(document.querySelectorAll("input[type=radio]"));
const winnerModal = document.getElementById("winner-modal");
const winnerMessage = document.getElementById("winner-message");

let Player = "user";
let randomString = "";
let recordCorrectLetter = 0;
let userSelects = [];
let userCorrectSelect = new Array(5).fill("");
let computerSelects = [];
let GAME_LEVEL = "";
let computerIncorrect = [];
let computerCorrect = [];

radioButtons.forEach((element) =>
  element.addEventListener("change", (e) => {
    GAME_LEVEL = setGameLevel(e.target);
    for (let radioButton of radioButtons) {
      radioButton.disabled = true;
    }
  })
);

// ---------------  Select Random Word --------------------//
randomString = randomWord();

// ---------------- Set Click Handler For Keyboard Keys ------------------------- //
Keys.forEach((key) => {
  key.addEventListener("click", (e) => {
    Player === "user" && keysAnimation();
    function keysAnimation() {
      key.classList.add("keysAnime");
      setTimeout(() => {
        key.classList.remove("keysAnime");
      }, 200);
    }
    setInput(key.textContent);
  });
});

// ---------------- Set Click Handler For Delete Key ------------------------- //
deleteButton.addEventListener("click", (e) => {
  deleteButton.classList.add("keysAnime");
  setTimeout(() => {
    deleteButton.classList.remove("keysAnime");
  }, 200);
  let i = inputs.length;
  while (i >= 0) {
    i--;
    if (inputs[i - 1].dataset.value !== "") {
      inputs[i - 1].innerHTML = "";
      inputs[i - 1].dataset.value = "";
      userSelects.pop();
      break;
    }
  }
});

// ---------------- Reset Inputs ------------------------------ //
function fillInput() {
  for(let i=0 ; i < inputs.length ; i++){
    inputs[i].dataset.value = "";
    inputs[i].style.color = "";
    inputs[i].innerHTML = userCorrectSelect[i];
    userCorrectSelect[i] !== "" && (inputs[i].style.color = "rgba(217, 164, 31,0.3)");
  }
}

// ---------------- Enter User Selection In Inputs ----------------------- //

function setInput(letter) {

  Player === "user" && userTurn();

  function userTurn() {
    for (let i = 0; i < inputs.length; i++) {
      if (inputs[i].dataset.value === "") {
        inputs[i].dataset.value = letter;
        inputs[i].style.color = "";
        inputs[i].innerHTML = letter;
        userSelects.push(letter);
        break;
      }
    }
    if (userSelects.length === 5) {
      let guessList = "";
      let color = "";
      for (let i = 0; i < userSelects.length; i++) {
        if (randomString.includes(userSelects[i])) {
            color = userSelects[i] === randomString[i] ? "goldenrod" : "green";
            guessList += `<span style="color :${color}"}>${userSelects[i]}</span>&nbsp;`;
            if(userSelects[i] === randomString[i]){
              userCorrectSelect[i] = randomString[i];
            }
        }else{
          guessList += `<span>${userSelects[i]}</span>&nbsp;`;
        }
      }
      userGuess.lastElementChild.innerHTML += `<li>${guessList}</li>`;
      Player = "computer";
      let endUserGame = checkWord();
      endUserGame &&
        setTimeout(() => {
          computerTurn();
        }, 2000);
        userSelects = [];
    }

  }
}

// -------------------- Checks if the inputs match the pattern ----------------- //
function checkWord() {
  if (userCorrectSelect.join("") === randomString) {
    setTimeout(() => {
      winnerMessage.style.height = "200px";
      winnerMessage.style.padding = "80px 10px 80px 10px";
      winnerMessage.firstElementChild.innerHTML = "CONGRATULATIONS YOU WON";
      winnerMessage.lastElementChild.innerHTML = `PASSWORD IS : ${randomString}`;
      winnerModal.style.height = "100%";
    }, 1200);
    setTimeout(() => {
      location.reload();
    }, 3500);
    return false;
  } else {
    setTimeout(() => {
      fillInput();
      disabledKeys();
    }, 500);
    return true;
  }
}

// ----------------- Computer Start Game -------------- //

function computerTurn() {
  console.log("computer");
  let selectWord;
  switch (GAME_LEVEL) {
    case "EASY":
      selectWord = easyGame();
      checkComputerState(selectWord);
      break;
    case "NORMAL":
      selectWord = normalGame();
      checkComputerState(selectWord);
      break;
    case "HARD":
      selectWord = hardGame();
      checkComputerState(selectWord);
      break;
    default:
      "";
  }
  computerGuess.lastElementChild.innerHTML += `<li style="color : goldenrod">${selectWord}</li>`;
  disabledKeys();
  Player = "user";
}

function checkComputerState(newWord) {
  if (newWord === randomString) {
    winnerMessage.style.height = "200px";
    winnerMessage.style.padding = "80px 10px 80px 10px";
    winnerMessage.firstElementChild.innerHTML = "COMPUTER WINNER";
    winnerMessage.lastElementChild.innerHTML = `PASSWORD IS : ${randomString}`;
    winnerModal.style.height = "100%";
    setTimeout(() => {
      location.reload();
    }, 3500);
  } else {
    return false;
  }
}

function easyGame() {
  let selectItem;
  do {
    selectItem = randomWord();
  } while (computerSelects.indexOf(selectItem) !== -1);
  computerSelects.push(selectItem);

  return selectItem;
}

function normalGame() {
  let selectItem = "";
  let regex = null;
  let checkChar = null;
  let condition = true;
  let countEqual = 0;
  let countIncorrect = 0;

  do {
    countEqual = 0;
    countIncorrect = 0;
    selectItem = randomWord();
    if (computerSelects.indexOf(selectItem) === -1) {
      selectItem !== randomString && computerSelects.push(selectItem);

      for (let i = 0; i < computerCorrect.length; i++) {
        countEqual += selectItem.includes(computerCorrect[i]) ? 1 : 0;
      }
      for (let j = 0; j < selectItem.length; j++) {
        countIncorrect +=
          computerIncorrect.indexOf(selectItem[j]) !== -1 ? 1 : 0;
      }
      if (countEqual === computerCorrect.length && countIncorrect < 2) {
        condition = false;
      } else {
        condition = true;
      }
    } else {
      condition = true;
    }
  } while (condition);

  for (let i = 0; i < selectItem.length; i++) {
    regex = new RegExp(selectItem[i], "ig");
    checkChar = regex.exec(randomString);
    if (checkChar) {
      computerCorrect.indexOf(checkChar[0]) !== -1 ||
        computerCorrect.push(checkChar[0]);
    } else {
      computerIncorrect.indexOf(selectItem[i]) === -1 &&
        computerIncorrect.push(selectItem[i]);
    }
  }
  return selectItem;
}

function hardGame() {
  let selectItem = "";
  let regex = null;
  let checkChar = null;
  let condition = true;
  let count = 0;
  let countEqual = 0;
  let countIncorrect = 0;

  do {
    countEqual = 0;
    count = 0;
    countIncorrect = 0;
    selectItem = randomWord();
    if (computerSelects.indexOf(selectItem) === -1) {
      selectItem !== randomString && computerSelects.push(selectItem);

      for (let i = 0; i < computerCorrect.length; i++) {
        if (computerCorrect[i] !== undefined) {
          count++;
          countEqual += computerCorrect[i] === selectItem[i] ? 1 : 0;
        }
      }

      for (let j = 0; j < countIncorrect.length; j++) {
        countIncorrect +=
          computerIncorrect.indexOf(selectItem[j]) !== -1 ? 1 : 0;
      }

      if (countEqual === count && countIncorrect <= 1) {
        condition = false;
      } else {
        condition = true;
      }
    } else {
      condition = true;
    }
  } while (condition);

  for (let i = 0; i < selectItem.length; i++) {
    regex = new RegExp(selectItem[i], "ig");
    checkChar = regex.exec(randomString);
    if (checkChar) {
      computerCorrect.indexOf(checkChar[0]) !== -1 ||
        (computerCorrect[checkChar.index] = checkChar[0]);
    } else {
      computerIncorrect.indexOf(selectItem[i]) === -1 &&
        computerIncorrect.push(selectItem[i]);
    }
  }
  return selectItem;
}

randomWord();
console.log(randomString);
