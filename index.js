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

    const updateElements = (data, more) => {
        for (let i = 0; i < data.length; i++) {
            if (i === 50 && !more) {
                break;
            }
            const content = document.createElement('div');
            content.textContent = data[i].collectionName;
            content.setAttribute("aria-lable", "name of the album")
            content.classList.add("content-title")

            const img = document.createElement('img');
            img.setAttribute("src", data[i].artworkUrl100);
            img.setAttribute("alt", `picture of the ${data[i].collectionName}`)
            img.classList.add("content-image")
            img.addEventListener("click", () => {
                document.querySelector(".modal").classList.add("modal-show");

                const closeBtn = document.createElement("button");
                closeBtn.classList.add("modal-btn-close")
                closeBtn.textContent = "close";
                closeBtn.addEventListener("click", closeModal)

                const modalImg = document.createElement("img");
                modalImg.setAttribute("src", data[i].artworkUrl100);
                modalImg.classList.add("modal-img")

                const span = document.createElement("span");
                span.textContent = `Price: $${data[i].collectionPrice}`;
                span.classList.add("modal-content-price");

                const albumTitle = document.createElement("h2");
                albumTitle.textContent = data[i].collectionName;
                document.querySelector(".modal").appendChild(modalImg);
                document.querySelector(".modal").appendChild(albumTitle);
                document.querySelector(".modal").appendChild(closeBtn);
                document.querySelector(".modal").appendChild(span);
            })

            const item = document.createElement('li');
            item.classList.add("column", "content-list-item");
            item.appendChild(img);
            item.appendChild(content);;
            document.querySelector(".content-list").appendChild(item);
        }
    }

    const closeModal = () => {
        document.querySelector(".modal").innerHTML = "";
        document.querySelector(".modal").classList.remove("modal-show");
    }


    const searchArtist = (more) => {
        const input = document.querySelector(".box-input_field").value;
        document.querySelector(".content-list").innerHTML = "";
        if (!input || !input.trim()) {
            document.querySelector(".contents-info").textContent = "Search Albums by ArtistName:"
        } else {
            model.getDataByName(input)
                .then(albumns => {
                    console.log(albumns)
                    document.querySelector(".contents-info").textContent = `${albumns.resultCount} results for "${input}"`
                    updateElements(albumns.results, more)
                })
        }
    }

    const setUpEvent = () => {
        const addMoreBtn = document.querySelector(".btn-more");
        addMoreBtn.addEventListener("click", () => {
            searchArtist(true)
        })
        const searchBtn = document.querySelector(".box-btn");
        searchBtn.addEventListener("click", () => {
            searchArtist(false)
        });
        const inputElement = document.querySelector(".box-input_field");

        inputElement.addEventListener("keydown", e => {
            searchArtist(false)
        })

    }
    return { init }

})(model)

AppController.init();

