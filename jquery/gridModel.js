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
function creatGrid(grid, gridData) {
    let th = grid.querySelectorAll('.grid-thead>.grid-tr>.grid-th');

    if (!!grid.querySelector(`.grid-tbody`))
        grid.querySelector(`.grid-tbody`).remove();

    let tr = '';
    gridData.forEach(data => {
        let td = '';
        th.forEach(event => {
            td += `<div class='grid-td'>${data[event.dataset.field]}</div>`;
        })
        tr += `<div class='grid-tr'>${td}</div>`;
    });
    grid.innerHTML += `<div class='grid-tbody'>${tr}</div>`
}

//取得Grid資料
function getGrid(url, data, gridID) {
    let grid = document.querySelector(`#${gridID}`);
    getFetch(url, data).then(jsonData => {
        creatGrid(grid, jsonData);
    }).then(
        () => {
            grid.querySelectorAll('.grid-tbody >.grid-tr').forEach((event) => {
                event.addEventListener('click', () => {
                    let selectedItem = grid.querySelector('.selected-item')
                    if (selectedItem !== null & selectedItem != event)
                        selectedItem.classList.remove('selected-item');
                    event.classList.toggle('selected-item');
                });
            });
        }
    );
}

//
function postRadio(url, radioName, gridID) {
    let radio = document.querySelector(`[name=${radioName}]:checked`);
    let data = { "status": `${radio.value}` };
    getGrid(url, data, gridID);
}

//TabsFun(main-tabs-box的id)
function TabsFun(tabsBoxID) {
    let mainTabBox = document.querySelector(`#${tabsBoxID}`);
    let detailBoxes = mainTabBox.querySelectorAll(".detail-box");

    InitTabs();

    function InitTabs() {
        if (detailBoxes.length > 0) {
            detailBoxes.forEach(function(item, index) {
                CreateTabs(item, index);
                item.dataset.tabBox = "tab" + index;
            });
        }
    }

    function CreateTabs(item, index) {
        let tabLI = document.createElement("li");
        tabLI.className = "detail-tab";
        tabLI.dataset.item = "tab" + index;
        tabLI.innerHTML = item.dataset.title;

        tabLI.addEventListener("click", function() {
            ChangeTabBoxActive.call(this);
            ChangeTabActive.call(this);
        });
        AddTab(tabLI);
    }

    function AddTab(tab) {
        let tabs = mainTabBox.querySelectorAll(".detail-tab");
        if (mainTabBox.querySelector("ul.tabList") != null)
            tabs.item(tabs.length - 1).after(tab);
        else {
            let tabUL = document.createElement("ul");
            tabUL.classList.add("tabList");
            tabUL.prepend(tab);
            mainTabBox.prepend(tabUL);
        }
    }

    function ChangeTabBoxActive() {
        let selectedItemVal = this.dataset.item;
        let activeDetail = mainTabBox.querySelector(".detail-box.active");
        if (activeDetail != null)
            activeDetail.classList.remove("active");
        detailBoxes.forEach(function(tabBox) {
            if (tabBox.dataset.tabBox === selectedItemVal) {
                tabBox.classList.add("active");
            }
        });
    }

    function ChangeTabActive() {
        let activeTab = mainTabBox.querySelector(".detail-tab.active");
        if (activeTab != null)
            activeTab.classList.remove("active");
        this.classList.add("active");
    }
}