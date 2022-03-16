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

        grid.innerHTML += `<div class="grid-main ${boundMain.dataset.style}">${creatThead(boundMain) + creatTbody(data, boundMain)}</div>`;

        function creatThead(field) {
            let thead = `<div class="grid-thead"><div class="grid-tr">`;
            field.querySelectorAll('div[data-field]').forEach(event => {
                let tdContent = event.dataset.field == 'template' ? event.querySelector('div[data-header]').innerHTML : event.innerHTML;
                thead += `<div class='grid-th ${event.classList}'>${tdContent}</div>`
            })
            return thead += `</div></div>`;
        }

        function creatTbody(data, boundGrid) {
            let tbody = `<div class='grid-tbody'>`;
            data.forEach(data => {
                tbody += `<div class='grid-tr'>`;
                boundGrid.querySelectorAll('div[data-field]').forEach(event => {
                    let tdContent = event.dataset.field == 'template' ? event.querySelector('div[data-item]').innerHTML : data[event.dataset.field];
                    tbody += `<div class='grid-td ${event.classList}' data-field='${event.dataset.field}'>${tdContent}</div>`
                })
                tbody += `</div>`;
                if (data['detail'] != undefined)
                    tbody += creatDetail(data['detail']);
            })
            return tbody += `</div>`
        }

        function creatDetail(data) {
            return `<div class="grid-detail ${boundDetail.dataset.style} elem-none">${creatThead(boundDetail)}${creatTbody(data,boundDetail)}</div>`;
        }

    }

    function EventListener() {
        let mainGrid = grid.querySelector(`.grid-main`);
        let detailGrid = grid.querySelector(`.grid-detail`);


        if (mainGrid.classList.contains('ItemLight'))
            grid.querySelectorAll(`.grid-main>.grid-tbody >.grid-tr`).forEach((item) => {
                item.addEventListener('click', function() { clickMainFun(this) })
            });

        if (detailGrid !== null && detailGrid.classList.contains('ItemLight'))
            grid.querySelectorAll(`.grid-detail>.grid-tbody >.grid-tr`).forEach((item) => {
                item.addEventListener('click', function() { clickDetailFun(this) })
            });

        function clickMainFun(chickItem) {
            let MainSelItem = grid.querySelector(' .grid-main >.grid-tbody >.grid-tr.selected-item');
            let detailSelItem = grid.querySelector('.grid-detail >.grid-tbody >.grid-tr.selected-item');

            if (MainSelItem !== null & MainSelItem != chickItem) {
                MainSelItem.classList.remove('selected-item');
                if (boundDetail != null) {
                    MainSelItem.nextElementSibling.classList.add('elem-none');
                    if (detailSelItem != null) detailSelItem.classList.remove('selected-item');
                }
            }
            chickItem.classList.toggle('selected-item');
            if (boundDetail != null) chickItem.nextElementSibling.classList.toggle('elem-none');
        }

        function clickDetailFun(chickItem) {
            let detailSelItem = grid.querySelector('.grid-detail >.grid-tbody >.grid-tr.selected-item');
            if (detailSelItem !== null & detailSelItem != chickItem)
                detailSelItem.classList.remove('selected-item');
            chickItem.classList.toggle('selected-item');
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

function SQLBuilderFun(selBtnID) {
    selBtn = document.querySelector(`#${selBtnID}`);
    SQLBuilder = document.querySelector('.sqlBuilder-box');

    function initSQLBuilder() {

    }

    function creatSQLBuilder() {
        SQLBuilder.innerHTML +=
            `<div>
            <bu>
        </div>`
    }
}