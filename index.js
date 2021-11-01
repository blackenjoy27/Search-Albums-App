const model = (() => {
    const sendHttpRequest = (method, url, data) => {
        return fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: data ? { "Content-Type": "application/json" } : {}
        }).then(response => {
            return response.json();
        })
    }

    const getDataByName = (name) => {
        return sendHttpRequest("GET", `https://itunes.apple.com/search?term=${name}&media=music&entity=album&attribute=artistTerm&limit=500`)
            .then(response => {
                return response;
            })
    }
    return { getDataByName }
})();

const AppController = ((model) => {
    const init = () => {
        setUpEvent();
    }

    const updateElements = (data) => {
        for (let i = 0; i < data.length; i++) {
            const content = document.createElement('div');
            content.textContent = data[i].collectionName;
            content.setAttribute("aria-lable", "name of the album")
            content.classList.add("content-title")

            const img = document.createElement('img');
            img.setAttribute("src", data[i].artworkUrl100);
            img.setAttribute("alt", `picture of the ${data[i].collectionName}`)
            img.classList.add("content-image")

            const item = document.createElement('li');
            item.classList.add("column", "content-list-item");
            item.appendChild(img);
            item.appendChild(content);;
            document.querySelector(".content-list").appendChild(item);
        }
    }
    const searchArtist = () => {
        const input = document.querySelector(".box-input_field").value;
        document.querySelector(".content-list").innerHTML = "";
        if (!input || !input.trim()) {
            document.querySelector(".contents-info").textContent = "Search Albums by ArtistName:"
        } else {
            model.getDataByName(input)
                .then(albumns => {
                    document.querySelector(".contents-info").textContent = `${albumns.resultCount} results for "${input}"`
                    updateElements(albumns.results)
                })
        }
    }

    const setUpEvent = () => {
        const searchBtn = document.querySelector(".box-btn");
        searchBtn.addEventListener("click", searchArtist);
        const inputElement = document.querySelector(".box-input_field");
        inputElement.addEventListener("keydown", e => {
            if (e.code === "Enter") {
                searchArtist()
            }
        })
    }
    return { init }

})(model)

AppController.init();

