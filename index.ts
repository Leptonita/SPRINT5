const moodBtnsContainer: HTMLElement | null = document.getElementById("moodBtnsContainer");

if (moodBtnsContainer != null) {
    moodBtnsContainer.style.visibility = "hidden";
}

const reportJokes: { joke: string, score: string, date: string }[] = [];

const moodButtons = document.querySelectorAll('[data-score]');



let previousJoke: string = "";

let moodScoreButton: string = "";


async function getJoke() {
    const myHeaders = new Headers({
        "Accept": "application/json",
        "User-Agent": "My Library (https://github.com/Leptonita/sprint5)"
    });

    await fetch('https://icanhazdadjoke.com/', {
        method: 'GET',
        headers: myHeaders
    })
        .then(response => response.json())
        .then(json => {

            if (moodBtnsContainer != null) {
                moodBtnsContainer.style.visibility = "visible";
            }

            const divJoke: HTMLElement | null = document.querySelector("div .joke");

            if (divJoke !== null) {

                let currentJoke: string = json.joke;
                //let lastScoreJoke = moodScoreButton[moodScoreButton.length - 1];
                let lastScoreJoke = moodScoreButton;

                getMoodScore();
                const d = new Date();

                reportJokes.push({ joke: previousJoke, score: lastScoreJoke, date: d.toISOString() });

                previousJoke = currentJoke;
                console.log(reportJokes);
                return divJoke.innerHTML = json.joke;
            } else {
                return alert("sorry, something went wrong! No joke, no fun");
            }



        });
}



function getMoodScore() {
    moodScoreButton = "";
    moodButtons.forEach(button =>
        button.addEventListener('click', () => {
            const moodScore: string | null = button.getAttribute("data-score");
            console.log(moodScore);
            if (moodScore !== null && (moodScore === "1" || moodScore === "2" || moodScore === "3")) {
                moodScoreButton = moodScore;
            } else {
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
