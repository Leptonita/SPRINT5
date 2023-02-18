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
                console.log(`Hoy, prediccion cada hora del dia:\n\n array estado del cielo  `, skyTodayHoursArr, "array temperatura: ", temperatureTodayHoursArr);
                // hour must be a string, have two digits and be higher than 0 (they don't provide any value for 00:00, so we will get the prevision for the next hour)
                const toDay = new Date();
                let nowHour = toDay.getHours().toString();
                // nowHour = "1";
                if (nowHour === "0") {
                    nowHour = "01";
                }
                else if (Number(nowHour) < 10) {
                    nowHour = "0" + nowHour;
                }
                console.log("nowHour: ", nowHour);
                const skyThisHourArr = skyTodayHoursArr.filter((sItem) => {
                    console.log(typeof sItem);
                    return sItem.periodo === nowHour;
                });
                const tempThisHourArr = temperatureTodayHoursArr.filter((tItem) => tItem.periodo === nowHour);
                console.log(`datos para las ${nowHour} de hoy - Array: estado del Cielo - Temperatura`, skyThisHourArr, " - ", tempThisHourArr);
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
const dirApi = getWeather(urlMeteoApi);
console.log("direction datos meteo AEMET, getWeather(urlMeteoApi)", dirApi);
//
//JOKES 
// by icanhazdadjoke.com/
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
        const urlDadJoke = "https://icanhazdadjoke.com/";
        const myHeaders = new Headers({
            "Accept": "application/json",
            "User-Agent": "My Library (https://github.com/Leptonita/sprint5)"
        });
        yield fetch(urlDadJoke, {
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
        })
            .catch(function (error) {
            console.log("error", error);
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
