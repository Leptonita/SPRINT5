"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const moodBtnsContainer = document.getElementById("moodBtnsContainer");
if (moodBtnsContainer != null) {
    moodBtnsContainer.style.visibility = "hidden";
}
const reportJokes = [];
const moodButtons = document.querySelectorAll('[data-score]');
let previousJoke = "";
let moodScoreButton = "";
function getJoke() {
    return __awaiter(this, void 0, void 0, function* () {
        const myHeaders = new Headers({
            "Accept": "application/json",
            "User-Agent": "My Library (https://github.com/Leptonita/sprint5)"
        });
        yield fetch('https://icanhazdadjoke.com/', {
            method: 'GET',
            headers: myHeaders
        })
            .then(response => response.json())
            .then(json => {
            if (moodBtnsContainer != null) {
                moodBtnsContainer.style.visibility = "visible";
            }
            const divJoke = document.querySelector("div .joke");
            if (divJoke !== null) {
                let currentJoke = json.joke;
                //let lastScoreJoke = moodScoreButton[moodScoreButton.length - 1];
                let lastScoreJoke = moodScoreButton;
                getMoodScore();
                const d = new Date();
                reportJokes.push({ joke: previousJoke, score: lastScoreJoke, date: d.toISOString() });
                previousJoke = currentJoke;
                console.log(reportJokes);
                return divJoke.innerHTML = json.joke;
            }
            else {
                return alert("sorry, something went wrong! No joke, no fun");
            }
        });
    });
}
function getMoodScore() {
    moodScoreButton = "";
    moodButtons.forEach(button => button.addEventListener('click', () => {
        const moodScore = button.getAttribute("data-score");
        console.log(moodScore);
        if (moodScore !== null && (moodScore === "1" || moodScore === "2" || moodScore === "3")) {
            moodScoreButton = moodScore;
        }
        else {
            moodScoreButton = "";
        }
    }));
    /*
    console.log("moodScoreButton", moodScoreButton);

    
                getMoodScore();
                const d = new Date();

                reportJokes.push({ joke: json.joke, score: moodScoreButton[moodScoreButton.length - 1], date: d.toISOString() });

                console.log(reportJokes);
    */
}
