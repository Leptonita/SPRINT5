// API Meteorología  ::::
// AEMET OpenData es una API REST desarrollado por AEMET 

const urlMeteoApi: string = "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/08019/?api_key=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnbG9yaWFuZXRAZ21haWwuY29tIiwianRpIjoiYjRiYjgxMDUtMjUyNi00NTFjLWE1ZTUtM2E3ZGJhYzgxNTY1IiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2NzY1Nzg2MzUsInVzZXJJZCI6ImI0YmI4MTA1LTI1MjYtNDUxYy1hNWU1LTNhN2RiYWM4MTU2NSIsInJvbGUiOiIifQ.fVh7ThLMij0-ZuF2BHuUkEE95u1-XpNan0B3QJR3nw4";


const theHeaders = {
    "accept": "application/json",
    "cache-control": "no-cache"
}

function numberToString(num: number): string {
    //convert a number to a string with 2 characters
    let numString: string = num.toString();
    if (num < 10 && num >= 0) {
        numString = "0" + numString;
    }
    return numString;
}

async function getWeather(url: string) {
    await fetch(url, {
        method: 'GET',
        headers: theHeaders
    })
        .then(responseUrl => responseUrl.json())
        .then(jsonUrl => {
            console.log("url - json response", url, jsonUrl.datos);
            //AEMET el objeto jsonUrl devuelve, mediante atributo "datos", una direccion a los datos meteorologicos que son array de objetos
            fetch(jsonUrl.datos, {
                method: 'GET',
                headers: theHeaders
            })
                .then(response => response.json())
                .then(json => {
                    console.log("json response", json);

                    const toDay = new Date();
                    // be carefull with toISOString because it returns UTC time that is one hour less 
                    //console.log("Hoy es: ", toDay.toISOString().substring(0, 19)) is one hour less;

                    // constructing the date with each element to become a string and to look like the ISO time without delays ::: 

                    // The hour, month, ... must be a string and have two digits 
                    let nowHour: string = numberToString(toDay.getHours());
                    let nowMinutes: string = numberToString(toDay.getMinutes());

                    //YYYY-MM-DD today (la fecha de hoy)
                    const toDayString: string = `${numberToString(toDay.getFullYear())}-${numberToString(toDay.getMonth() + 1)}-${numberToString(toDay.getDate())}`;

                    console.log("Hoy es: ", toDayString + "T" + nowHour + ":" + nowMinutes);

                    /* AEMET provides previsions of 3 days (only 48hours in total).
                    Around 5 or 6 hours before the current time and more info for the future. Therefore at midnight we can find previsions of the day before, today and tomorrow. So we must look for the data of the current time iterating  */
                    interface DayPred {
                        estadoCielo: string[],
                        fecha: string,

                        temperatura: string[],
                        vientoAndRachaMax: string[]
                    }
                    //[] ... day
                    const todayPredictions = json[0].prediccion.dia.filter((day: DayPred) => {
                        // filtering result by date YYYY-MM-DD
                        return (day.fecha.substring(0, 10) === toDayString)
                    });

                    console.log("[] ... predicciones para hoy - todos los datos en array", todayPredictions);

                    //[] ... Hours
                    const skyTodayHoursArr = todayPredictions[0].estadoCielo;
                    const temperatureTodayHoursArr = todayPredictions[0].temperatura;

                    console.log(`[] ... prediccion por horas para:\n\n  [] ... estado del cielo`, skyTodayHoursArr,
                        "\n  [] ... temperatura: ", temperatureTodayHoursArr);

                    //[] ... now 
                    interface Sitem {
                        value: string,
                        periodo: string,
                        descripcion: string
                    }
                    const skyThisHourArr = skyTodayHoursArr.filter((sItem: Sitem) => {
                        //filtering by the current hour of 'estadoCielo' prediction 
                        return sItem.periodo === nowHour
                    });

                    interface Titem {
                        value: string,
                        periodo: string
                    }

                    //filtering by the current hour of "temperatura" prediction 
                    const tempThisHourArr = temperatureTodayHoursArr.filter((tItem: Titem) => tItem.periodo === nowHour);

                    console.log(`datos para las ${nowHour} de hoy: ${toDayString} - Array: estado del Cielo - Temperatura`, skyThisHourArr, " - ", tempThisHourArr);

                    //now values of "estadoCielo" and "temperatura"
                    const skyDescriptionNow = skyThisHourArr[0].descripcion;
                    const temperatureNow = tempThisHourArr[0].value;
                    const messageWeather = `Hoy: cielo ${skyDescriptionNow.toLowerCase()} y ${temperatureNow} ºC`;
                    console.log(messageWeather);

                    //show results on the HTML page
                    const meteoDiv = document.querySelector("#meteo");
                    (meteoDiv !== null) ? meteoDiv.innerHTML = messageWeather : "sin previsión";
                    //return messageWeather;
                })
                .catch(function (error) {
                    console.log("error", error);
                });
        })
}
const dirApi = getWeather(urlMeteoApi);

console.log("direction datos meteo AEMET, getWeather(urlMeteoApi)", dirApi);

//
//JOKES
// by icanhazdadjoke.com/
// by https://api.chucknorris.io

//mood icons visible only when clicking the button to begin
const moodBtnsContainer: HTMLElement | null = document.getElementById("moodBtnsContainer");
if (moodBtnsContainer != null) {
    moodBtnsContainer.style.visibility = "hidden";
}

const reportJokes: { joke: string, score: string, date: string }[] = [];

const moodButtons = document.querySelectorAll('[data-score]');

let previousJoke: string = "";

let moodScoreButton: string = "";




async function getJoke() {

    //random 0 or 1 - to choose the API source of the jokes
    let sourceIdJoke: number = Math.round(Math.random());

    let urlSource: string = "";
    if (sourceIdJoke === 0) {
        urlSource = "https://icanhazdadjoke.com/";
    } else if (sourceIdJoke === 1) {
        urlSource = "https://api.chucknorris.io/jokes/random";
    }

    const myHeaders = new Headers({
        "Accept": "application/json",
        "User-Agent": "My Library (https://github.com/Leptonita/sprint5)"
    });

    await fetch(urlSource, {
        method: 'GET',
        headers: myHeaders
    })
        .then(response => response.json())
        .then(json => {
            //show mood buttons
            if (moodBtnsContainer != null) {
                moodBtnsContainer.style.visibility = "visible";
            }

            const divJoke: HTMLElement | null = document.querySelector("div .joke");

            if (divJoke !== null) {

                let currentJoke: string = "";
                if (sourceIdJoke === 0) {
                    currentJoke = json.joke;

                } else if (sourceIdJoke === 1) {
                    currentJoke = json.value;
                }

                let lastScoreJoke = moodScoreButton;

                getMoodScore();
                const d = new Date();

                reportJokes.push({ joke: previousJoke, score: lastScoreJoke, date: d.toISOString() });

                previousJoke = currentJoke;

                //show reportJokes
                console.log(reportJokes);
                //show joke
                return divJoke.innerHTML = currentJoke;

            } else {
                return alert("sorry, something went wrong! No joke, no fun");
            }
        })
        .catch(function (error) {
            console.log("error", error);
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

}

