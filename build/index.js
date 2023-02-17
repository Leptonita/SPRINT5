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
}
// API Meteorología :::: AEMET OpenData es una API REST desarrollado por AEMET 
const urlApi = "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/horaria/08019/?api_key=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnbG9yaWFuZXRAZ21haWwuY29tIiwianRpIjoiYjRiYjgxMDUtMjUyNi00NTFjLWE1ZTUtM2E3ZGJhYzgxNTY1IiwiaXNzIjoiQUVNRVQiLCJpYXQiOjE2NzY1Nzg2MzUsInVzZXJJZCI6ImI0YmI4MTA1LTI1MjYtNDUxYy1hNWU1LTNhN2RiYWM4MTU2NSIsInJvbGUiOiIifQ.fVh7ThLMij0-ZuF2BHuUkEE95u1-XpNan0B3QJR3nw4";
const theHeaders = {
    "accept": "application/json",
    "cache-control": "no-cache"
};
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
                const todayPredictions = json[0].prediccion.dia[0];
                console.log("predicciones para hoy", todayPredictions);
                //estado del cielo por horas, dia[0] es hoy
                const skyTodayHoursArr = todayPredictions.estadoCielo;
                const temperatureTodayHoursArr = todayPredictions.temperatura;
                console.log("hoy, prediccion cada hora del dia: estado del Cielo - Temperatura", skyTodayHoursArr, " - ", temperatureTodayHoursArr);
                const toDay = new Date();
                const nowHour = toDay.getHours();
                console.log(nowHour);
                const skyThisHourArr = skyTodayHoursArr.filter((sItem) => {
                    console.log(typeof sItem);
                    return sItem.periodo === nowHour.toString();
                });
                const tempThisHourArr = temperatureTodayHoursArr.filter((tItem) => tItem.periodo === nowHour.toString());
                console.log("datos prediccion actual, en esta hora - Array: estado del Cielo - Temperatura", skyThisHourArr, " - ", tempThisHourArr);
                const skyDescriptionNow = skyThisHourArr[0].descripcion;
                const temperatureNow = tempThisHourArr[0].value;
                const messageWeather = `Hoy: cielo ${skyDescriptionNow.toLowerCase()} y ${temperatureNow} ºC`;
                console.log(messageWeather);
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
const dirApi = getWeather(urlApi);
console.log("getWeather(urlApi)", dirApi);
