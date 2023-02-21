"use strict";
// API Meteorología  ::::
// AEMET OpenData es una API REST desarrollado por AEMET 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const urlMeteoApi = "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/08019/?api_key=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnbG9yaWFuZXRAZ21haWwuY29tIiwianRpIjoiYjRiYjgxMDUtMjUyNi00NTFjLWE1ZTUtM2E3ZGJhYzgxNTY1IiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2NzY1Nzg2MzUsInVzZXJJZCI6ImI0YmI4MTA1LTI1MjYtNDUxYy1hNWU1LTNhN2RiYWM4MTU2NSIsInJvbGUiOiIifQ.fVh7ThLMij0-ZuF2BHuUkEE95u1-XpNan0B3QJR3nw4";
const theHeaders = {
    "accept": "application/json",
    "cache-control": "no-cache"
};
function numberToString(num) {
    //convert a number to a string with 2 characters
    let numString = num.toString();
    if (num < 10 && num >= 0) {
        numString = "0" + numString;
    }
    return numString;
}
function getWeather(url) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(url, {
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
                let nowHour = numberToString(toDay.getHours());
                let nowMinutes = numberToString(toDay.getMinutes());
                //YYYY-MM-DD today (la fecha de hoy)
                const toDayString = `${numberToString(toDay.getFullYear())}-${numberToString(toDay.getMonth() + 1)}-${numberToString(toDay.getDate())}`;
                console.log("Hoy es: ", toDayString + "T" + nowHour + ":" + nowMinutes);
                //[] ... day
                const todayPredictions = json[0].prediccion.dia.filter((day) => {
                    // filtering result by date YYYY-MM-DD
                    return (day.fecha.substring(0, 10) === toDayString);
                });
                console.log("[] ... predicciones para hoy - todos los datos en array", todayPredictions);
                //[] ... Hours
                const skyTodayHoursArr = todayPredictions[0].estadoCielo;
                const temperatureTodayHoursArr = todayPredictions[0].temperatura;
                console.log(`[] ... prediccion por horas para:\n\n  [] ... estado del cielo`, skyTodayHoursArr, "\n  [] ... temperatura: ", temperatureTodayHoursArr);
                const skyThisHourArr = skyTodayHoursArr.filter((sItem) => {
                    //filtering by the current hour of 'estadoCielo' prediction 
                    return sItem.periodo === nowHour;
                });
                //filtering by the current hour of "temperatura" prediction 
                const tempThisHourArr = temperatureTodayHoursArr.filter((tItem) => tItem.periodo === nowHour);
                console.log(`datos para las ${nowHour} de hoy: ${toDayString} - Array: estado del Cielo - Temperatura`, skyThisHourArr, " - ", tempThisHourArr);
                //now values of "estadoCielo" and "temperatura"
                const skyDescriptionNow = skyThisHourArr[0].descripcion;
                const skyValueNow = skyThisHourArr[0].value;
                const temperatureNow = tempThisHourArr[0].value;
                const messageWeather = `Hoy: <img src="img/estado_cielo/${skyValueNow}.png" alt="cielo ${skyDescriptionNow.toLowerCase()}"> <strong> ${temperatureNow} ºC </strong>`;
                console.log(`Hoy: cielo ${skyDescriptionNow.toLowerCase()} (value: ${skyValueNow}) y ${temperatureNow} ºC`);
                //show results on the HTML page
                const meteoDiv = document.querySelector("#meteo");
                (meteoDiv !== null) ? meteoDiv.innerHTML = messageWeather : "sin previsión";
                //return messageWeather;
            })
                .catch(function (error) {
                console.log("error", error);
            });
        });
    });
}
const dirApi = getWeather(urlMeteoApi);
console.log("direction datos meteo AEMET, getWeather(urlMeteoApi)", dirApi);
//
//JOKES
// by icanhazdadjoke.com/
// by https://api.chucknorris.io
//mood icons visible only when clicking the button to begin
const moodBtnsContainer = document.getElementById("moodBtnsContainer");
if (moodBtnsContainer != null) {
    moodBtnsContainer.style.visibility = "hidden";
}
const reportJokes = [];
const moodButtons = document.querySelectorAll('[data-score]');
let previousJoke = "";
let moodScoreButton = "";
let bg = 0;
function getJoke() {
    return __awaiter(this, void 0, void 0, function* () {
        //random 0 or 1 - to choose the API source of the jokes
        let sourceIdJoke = Math.round(Math.random());
        let urlSource = "";
        if (sourceIdJoke === 0) {
            urlSource = "https://icanhazdadjoke.com/";
        }
        else if (sourceIdJoke === 1) {
            urlSource = "https://api.chucknorris.io/jokes/random";
        }
        const myHeaders = new Headers({
            "Accept": "application/json",
            "User-Agent": "My Library (https://github.com/Leptonita/sprint5)"
        });
        yield fetch(urlSource, {
            method: 'GET',
            headers: myHeaders
        })
            .then(response => response.json())
            .then(json => {
            //show mood buttons
            if (moodBtnsContainer != null) {
                moodBtnsContainer.style.visibility = "visible";
            }
            const divJoke = document.querySelector("div .joke");
            if (divJoke !== null) {
                let currentJoke = "";
                if (sourceIdJoke === 0) {
                    currentJoke = json.joke;
                }
                else if (sourceIdJoke === 1) {
                    currentJoke = json.value;
                }
                let lastScoreJoke = moodScoreButton;
                getMoodScore();
                const d = new Date();
                reportJokes.push({ joke: previousJoke, score: lastScoreJoke, date: d.toISOString() });
                previousJoke = currentJoke;
                //background change
                let bgContainer = document.querySelector(".container");
                if (bgContainer !== null) {
                    if (bg === 0) {
                        bgContainer.style.backgroundImage = "url('img/blob-wine-3shapes.svg')";
                        bg = 1;
                    }
                    else {
                        bgContainer.style.backgroundImage = "url('img/blob-wine-3shapes-1.svg')";
                        bg = 0;
                    }
                }
                //show reportJokes
                console.log(reportJokes);
                //show joke
                return divJoke.innerHTML = `\"${currentJoke}\"`;
            }
            else {
                return alert("sorry, something went wrong! No joke, no fun");
            }
        })
            .catch(function (error) {
            console.log("error", error);
        });
    });
}
//getting mood scores where 1=sad 2=normal 3=happy
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
}
