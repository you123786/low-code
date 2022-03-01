//fetch資料GET、POST、PUT、DELETE、HEAD
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
function gridsFun(url, data, gridID) {
    const grid = document.querySelector(`#${gridID}`);
    let boundMain = grid.querySelector(`.bound-main`);
    let boundDetail = grid.querySelector(`.bound-detail`);

    initGrid();

    function initGrid() {
        let mainTable = grid.querySelector(`.grid-main`);
        if (mainTable !== null) thead.remove();

        getFetch(url, data).then(jsonData => creatGrid(jsonData, boundMain)).then(() => {
            EventListener()
        })
    }

    function creatGrid(data) {

        grid.innerHTML += `<div class="grid-main ${boundMain.dataset.style}">${creatThead(boundMain) + creatTbody(data, boundGrid)}</div>`;

        function creatThead(field) {
            let thead = `<div class="grid-thead"><div class="grid-tr">`;
            field.querySelectorAll('div').forEach(event => { thead += `<div class='grid-th'>${event.innerHTML}</div>` })
            return thead += `</div></div>`;
        }

        function creatTbody(data, boundGrid) {
            let tbody = `<div class='grid-tbody'>`;
            data.forEach(data => {
                tbody += `<div class='grid-tr'>`;
                boundGrid.querySelectorAll('div').forEach(event => {
                    if (event.dataset.field == 'select') {
                        tbody += `<div class='grid-td'>${event.innerHTML}</div>`
                    } else {
                        tbody += `<div class='grid-td'>${data[event.dataset.field]}</div>`;
                    }
                })
                tbody += `</div>`;
                if (data['detail'] != undefined)
                    tbody += creatDetail(data['detail']);
            })
            return tbody += `</div>`
        }

        function creatDetail(data) {
            return `<div class="detail-grid ${boundDetail.dataset.style} elem-none">${creatThead(boundDetail)}${creatTbody(data,boundDetail)}</div>`;
        }

    }

    function EventListener() {
        let mainGrid = grid.querySelector(`.grid-main`);
        let detailGrid = grid.querySelector(`grid-detail`);
        let mainTRs = grid.querySelectorAll(`.grid-main>.grid-tbody >.grid-tr`);
        let detailTRs = grid.querySelectorAll(`.grid-detail>.grid-tbody >.grid-tr`);

        if (mainGrid.classList.contains('ItemLight')) mainTRs.forEach((item) => {
            item.addEventListener('click', function() {
                clickFun(this, mainGrid, true)
            })
        });

        if (detailGrid == null) return;
        if (detailGrid.classList.contains('ItemLight')) detailTRs.forEach((item) => {
            item.addEventListener('click', function() {
                clickFun(this, detailGrid, false)
            })
        });

        function clickFun(a, b) {
            let selectedItem = grid.querySelector(' .grid-master >.grid-tbody >.grid-tr.selected-item');
            let detailSelItem = grid.querySelector('.grid-detail >.grid-tbody >.grid-tr.selected-item');
            if (selectedItem !== null & selectedItem != a) {
                selectedItem.classList.remove('selected-item');
                if (b) {
                    selectedItem.nextElementSibling.classList.add('elem-none');
                    if (detailSelItem != null) detailSelItem.classList.remove('selected-item');
                }
            }
            a.classList.toggle('selected-item');
            if (b) a.nextElementSibling.classList.toggle('elem-none');
        }
    }
}

//
function postRadio(url, radioName, gridID) {
    let radio = document.querySelector(`[name=${radioName}]:checked`);
    let data = { "status": `${radio.value}` };
    gridsFun(url, data, gridID);
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