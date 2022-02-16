function getFetch(url) {

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    return fetch(url, {
            method: "GET",
            headers: headers,
            data: {
                status: ""
            }
        })
        .then(response => {
            return response.json();
        }).catch((err) => {
            console.log('錯誤:', err);
        });
}

function postFetch(url, data) {

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    return fetch(url, {
        method: "POST",
        headers: headers,
        body: {
            data
        }
    })
}

function getGrid(url, gridID) {
    let grid = document.querySelector(`#${gridID}`);

    getFetch(url).then(jsonData => {
        let tr = '';
        jsonData.forEach(data => {
            function td() {
                let th = grid.querySelectorAll('.grid-thead>.grid-tr>.grid-th');
                let tr = '';
                th.forEach(th => {
                    tr += `<div class='grid-td'>${data[th.dataset.field]}</div>`;
                })
                return tr;
            }

            tr += `<div class='grid-tr'>${td()}</div>`;
        });
        table.innerHTML += `<div class='grid-tbody'>${tr}</div>`
    })
}

function postRadio(url, radioName) {
    let radio = document.querySelectorAll();
    console.log(radio);
    document.querySelector('')
    let data = { "statue": `${radio}` };
    postFetch(url, )
}