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
    let boundMain = grid.querySelector(`.grid-bound-main`);
    let boundDetail = grid.querySelector(`.grid-bound-detail`);

    initGrid();

    function initGrid() {
        let thead = grid.querySelector(`.grid-thead`);
        if (thead !== null) thead.remove();
        let tbody = grid.querySelector(`.grid-tbody`);
        if (tbody !== null) tbody.remove();

        getFetch(url, data).then(jsonData => creatGrid(jsonData)).then(() => { EventListener() })
    }

    function creatGrid(data) {
        grid.innerHTML += creatThead(boundMain) + creatTbody(data, boundMain)

        function creatThead(field) {
            let thead = `<div class="grid-thead"><div class="grid-tr">`;
            field.querySelectorAll('div').forEach(event => { thead += `<div class='grid-th'>${event.innerHTML}</div>` })
            return thead += `</div></div>`;
        }

        function creatTbody(data, field) {
            let tbody = `<div class='grid-tbody'>`;
            data.forEach(data => {
                tbody += `<div class='grid-tr'>`;
                field.querySelectorAll('div').forEach(event => { tbody += `<div class='grid-td'>${data[event.dataset.field]}</div>`; })
                tbody += `</div>`;
                if (data['detail'] != undefined)
                    tbody += creatDetail(data['detail']);
            })
            return tbody += `</div>`
        }

        function creatDetail(data) {
            return `<div class="${boundDetail.className} elem-none">${creatThead(boundDetail)}${creatTbody(data,boundDetail)}</div>`;
        }

    }

    function EventListener() {
        let mainTRs = document.querySelectorAll(`#${gridID} >.grid-tbody >.grid-tr`);
        let mainItemLight = grid.classList.contains('ItemLight');
        let detailTRs = document.querySelectorAll(`#${gridID} >.grid-tbody >.grid-detail >.grid-tbody >.grid-tr`);

        if (mainItemLight) mainTRs.forEach((item) => {
            item.addEventListener('click', function() {
                clickFun(this, `#${gridID} >.grid-tbody >.grid-tr.selected-item`, true)
            })
        });

        if (boundDetail == null) return;
        if (boundDetail.classList.contains('ItemLight')) detailTRs.forEach((item) => {
            item.addEventListener('click', function() {
                clickFun(this, `#${gridID} >.grid-tbody >.grid-detail .grid-tr.selected-item`, false)
            })
        });

        function clickFun(a, str, b) {
            let selectedItem = document.querySelector(str);
            let detailSelItem = document.querySelector(`#${gridID} >.grid-tbody >.grid-detail .grid-tr.selected-item`);
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