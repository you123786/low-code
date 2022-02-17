//GET資料
function getFetch(url, data) {

    let headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    return fetch(url, {
            method: "GET",
            headers: headers,
            data: JSON.stringify(data)
        })
        .then(response => {
            return response.json();
        }).catch((err) => {
            console.log('錯誤:', err);
        });
}

//產生動態grid資料
function setGrid(gridID, data) {
    let grid = document.querySelector(`#${gridID}`);
    let tr = '';

    if (!!document.querySelector(`#${gridID}>.grid-tbody`))
        document.querySelector(`.grid-tbody`).remove();

    data.forEach(data => {
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
    grid.innerHTML += `<div class='grid-tbody'>${tr}</div>`
}

//取得Grid資料
function getGrid(url, gridID) {

    getFetch(url, {}).then(jsonData => {
        setGrid(gridID, jsonData);
    });
}

//
function postRadio(url, radioName, gridID) {
    let radio = document.querySelector(`[name=${radioName}]:checked`);
    let data = { "status": `${radio.value}` };
    getFetch(url, data).then(jsonData => {
        setGrid(gridID, jsonData);
    });
}