
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
            const divJoke: HTMLElement | null = document.querySelector("div .joke");
            if (divJoke !== null) {
                return divJoke.innerHTML = json.joke;
            }

            console.log()
        });
}
