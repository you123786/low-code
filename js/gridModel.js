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
    let grid = document.querySelector(`#${gridID}`);
    let main = grid.querySelector(`.grid-main`);
    let detail = grid.querySelector(`.grid-detail`);
    let thead = grid.querySelector(`.grid-thead`);
    let tbody = grid.querySelector(`.grid-tbody`);
    let gridData = getFetch(url, data);
    let mainField = grid.querySelectorAll('.grid-main>div');
    let detailField = grid.querySelectorAll('.grid-detail>div');

    initGrid();

    function initGrid() {

        if (thead !== null) thead.remove();
        if (tbody !== null) tbody.remove();
        creatThead();
        (detail == null) ? gridData.then(jsonData => creatTbody(jsonData)).then(() => { gridEventListener() }): gridData.then(jsonData => creatTbodyDetail(jsonData)).then(() => { gridDetailEventListener() });
    }

    function creatThead() {
        grid.innerHTML += `<div class="grid-thead"><div class="grid-tr">${main.innerHTML}</div></div>`
    }

    function creatTbody(gridData) {
        let tbodyContent = '';
        gridData.forEach(data => {
            tbodyContent += `<div class='grid-tr'>`;
            mainField.forEach(event => { tbodyContent += `<div class='grid-td'>${data[event.dataset.field]}</div>`; })
            tbodyContent += `</div>`;
        })
        grid.innerHTML += `<div class='grid-tbody'>${tbodyContent}</div>`
    }

    function creatTbodyDetail(gridData) {
        let tbodyContent = '';
        gridData.forEach(data => {
            tbodyContent += `<div class='grid-tr'>`;
            mainField.forEach(event => { tbodyContent += `<div class='grid-td'>${data[event.dataset.field]}</div>`; })
            tbodyContent += `</div>`;
            let detailContent = "";
            data['detail'].forEach(data => {
                detailContent += "<div class='grid-tr'>"
                detailField.forEach(event => { detailContent += `<div class='grid-td'>${data[event.dataset.field]}</div>`; })
                detailContent += "</div>"
            })

            tbodyContent += `<div class="${detail.className} elem-none">
                                <div class="grid-thead"><div class="grid-tr">${detail.innerHTML}</div></div>
                                <div class='grid-tbody'>${detailContent}</div>
                            </div>`
        })
        grid.innerHTML += `<div class='grid-tbody'>${tbodyContent}</div>`
    }

    function gridEventListener() {
        let mainTR = document.querySelectorAll(`#${gridID} >.grid-tbody >.grid-tr`);
        let mainItemLight = grid.classList.contains('ItemLight');

        if (mainItemLight) mainTR.forEach((item) => { item.addEventListener('click', clickFun) });

        function clickFun() {
            let selectedItem = document.querySelector(`#${gridID} >.grid-tbody >.grid-tr.selected-item`);
            if (selectedItem !== null & selectedItem != this) selectedItem.classList.remove('selected-item');
            this.classList.toggle('selected-item');
        }
    }

    function gridDetailEventListener() {
        let mainItemLight = grid.classList.contains('ItemLight');
        let detailItemLight = document.querySelector(`.grid-detail`).classList.contains('ItemLight');
        let mainTRs = document.querySelectorAll(`#${gridID} >.grid-tbody >.grid-tr`);
        let detailTRs = document.querySelectorAll(`#${gridID} >.grid-tbody >.grid-detail >.grid-tbody >.grid-tr`)

        if (mainItemLight) mainTRs.forEach((item) => { item.addEventListener('click', clickMainFun) });

        if (detailItemLight) detailTRs.forEach((item) => { item.addEventListener('click', clickDetailFun) });

        function clickMainFun() {
            let mainSelItem = document.querySelector(`#${gridID} >.grid-tbody >.grid-tr.selected-item`)
            let detailSelItem = document.querySelector(`#${gridID} >.grid-tbody >.grid-detail .grid-tr.selected-item`);

            if (mainSelItem !== null & mainSelItem != this) {
                mainSelItem.classList.remove('selected-item');
                mainSelItem.nextElementSibling.classList.add('elem-none');
                if (detailSelItem != null) detailSelItem.classList.remove('selected-item');
            }
            this.classList.toggle('selected-item');
            this.nextElementSibling.classList.toggle('elem-none');
        }

        function clickDetailFun() {
            let detailSelItem = document.querySelector(`#${gridID} >.grid-tbody >.grid-detail .grid-tr.selected-item`)
            if (detailSelItem !== null & detailSelItem != this) detailSelItem.classList.remove('selected-item');
            this.classList.toggle('selected-item');
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