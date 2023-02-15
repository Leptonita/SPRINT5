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
            const divJoke = document.querySelector("div .joke");
            if (divJoke !== null) {
                return divJoke.innerHTML = json.joke;
            }
            console.log();
        });
    });
}
