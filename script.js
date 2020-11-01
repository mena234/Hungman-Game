const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const manParts = document.querySelectorAll(".figure-part");

// const wordList = ["Programming", "Instruction", "Gamming", "Morcos", "Mina", "Fady", "Mokhtar", "Wessa", "Abanoub"];
const wordList = ["Mena", "Mina", "Fady", "Mokhtar"];

// wrong letter which user enter;
let wrongLetters = [];

// all uniq user key press are saved here
let allPressedLetters = [];

// number of letters that exist in the correct word
let correctWordLettersNumber = 0;

// number if letters that use enter by wrong
let wrongLetterNumber = -1;

// unique letters that found in the right word
let letterExistInTheRightWord = [];

let objectOfUniqLettersAndCount = {};

// add click event to play again button which reload page when clicked
playAgainBtn.addEventListener("click", () => {
    location.reload();
});

const setObjectOfUniqLetterAndCount = (wordLetterArray) => {
    wordLetterArray.forEach((element) => {
        objectOfUniqLettersAndCount[element] = 0;
    });

    for (let i = 0; i < wordLetterArray.length; i++) {
        const element = wordLetterArray[i];
        objectOfUniqLettersAndCount[element]++;
    }
};


// this function will increase letterExistInTheRightWord only if the letter i wrote is uniq and i didn't wrote it before
const checkIfLetterHaveBeenWroteBefore = (key) => {
    // if array is empty anyway we have to push the letter in the array
    if (letterExistInTheRightWord.length === 0) {
        letterExistInTheRightWord.push(key);
        correctWordLettersNumber+=objectOfUniqLettersAndCount[key];
        return;
    }

    // if array isn't empty we have to check if the key which user pressed 
    // is exist in the letterExistInTheRightWord and if exist we have to stop function
    for (let i = 0; i < letterExistInTheRightWord.length; i++) {
      const element = letterExistInTheRightWord[i];
      if (element === key) {
        return;
      }
    }

    // if key which user pressed isn't exist in the letterExistInTheRightWord
    // we have to push the key in it and increase the correctWordLettersNumber
    // by the number of letter found in the word
    letterExistInTheRightWord.push(key);
    correctWordLettersNumber+=objectOfUniqLettersAndCount[key];
  
    console.log(letterExistInTheRightWord);
};

// show the man parts by remove the figure-part-display class
const manPartsShow = () => {
    manParts[wrongLetterNumber].classList.remove("figure-part-display");
};

// this function show the popup with certain message in case of user failed or success
const showPopUp = (message) => {
    popup.classList.add("popup-container-show");
    finalMessage.textContent = message;
};

// show popup if the user have been failed
const checkfailedToCompleteWord = () => {
    const numberOfTries = manParts.length;
    if (wrongLetters.length >= numberOfTries) {
        showPopUp(
            "Sorry You Have Been Failed To Complete Word Please Try again"
        );
    }
};

// show a popup if the user have been successed
const wordCompletedSuccessfuly = (wordLetterArray) => {
    console.log(correctWordLettersNumber);
    console.log(wordLetterArray.length);
    if (correctWordLettersNumber >= wordLetterArray.length) {
        const message = `You Have Been Successed Word Is (${wordLetterArray.join(
            ""
        )})`;
        showPopUp(message);
    }
};

// show notification if the user enter same letter twice
const alertIfDuplicatedLetters = (key, isExist) => {
    if (allPressedLetters.length === 0) {
        allPressedLetters.push(key);
        return;
    }
    for (let i = 0; i < allPressedLetters.length; i++) {
        if (key === allPressedLetters[i].toLowerCase()) {
            notification.classList.add("show");
            isExist = true;
            break;
        }
    }
    if (!isExist) {
        allPressedLetters.push(key);
        notification.classList.remove("show");
    }
};

// this function responsible for show the wrong letters in the worng letter list
const showWrongLetters = (letter) => {
    wrongLetters.push(letter);
    wrongLetterNumber++;
    const letterElement = document.createElement("span");
    letterElement.textContent = letter;
    wrongLettersEl.appendChild(letterElement);
    manPartsShow();
    checkfailedToCompleteWord();
};

// this function will fire when ever user press a key
const keyboardLetterPressed = (wordLetterArray, e, isFound) => {
    alertIfDuplicatedLetters(e.key, false);
    for (let i = 0; i < wordLetterArray.length; i++) {
        if (e.key === wordLetterArray[i].toLowerCase()) {
            const pressedLetter = wordEl.children[i].children[0];
            pressedLetter.classList.remove("letter-hidden");
            checkIfLetterHaveBeenWroteBefore(e.key);
            isFound = true;
        }
    }
    if (!isFound) {
        showWrongLetters(e.key);
    }
    wordCompletedSuccessfuly(wordLetterArray);
};

// this function responsible for create number of span equal the number 
// of letters in the chosen word
const createSpansForLetters = (wordLettersArray) => {
    wordLettersArray.forEach((l) => {
        const letterElement = document.createElement("span");
        const wrapElement = document.createElement("span");
        wrapElement.classList.add("wrap-element")
        wrapElement.appendChild(letterElement);
        letterElement.textContent = l;
        letterElement.classList.add("letter-hidden");
        wordEl.appendChild(wrapElement);
    });
};


// this function will reponsible for add keypress event 
const pressKeyboardKeys = (wordLetterArray) => {
    window.addEventListener("keypress", (e) => {
        if (
            (e.keyCode >= 65 && e.keyCode <= 90) ||
            (e.keyCode >= 90 && e.keyCode <= 126)
        ) {
            keyboardLetterPressed(wordLetterArray, e, false);
        }
    });
};

// this function return random word from word list
const getRandomWord = (wordList) => {
    let wordIndex = Math.floor(Math.random() * wordList.length);
    return wordList[wordIndex].toLowerCase();
};


// this function responsible for split word to array of letters and pass it to the function which will operate them
const createLettersFromRandomWord = () => {
    const word = getRandomWord(wordList);
    console.log(word);
    const wordLettersArray = word.split("");
    setObjectOfUniqLetterAndCount(wordLettersArray);
    createSpansForLetters(wordLettersArray);
    pressKeyboardKeys(wordLettersArray);
};

createLettersFromRandomWord();