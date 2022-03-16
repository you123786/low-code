{
    function ddlTopFun(ddlTopID) {
        const ddlTop = document.querySelector(`#${ddlTopID}`);
        let option = `<option value="top 100">前100筆</option><option value="Top 500">前500筆</option><option value="">全部</option>`

        ddlTop.innerHTML = option;

        let changeDDLTop = function() {
            console.log(this.value);
        }
        ddlTop.addEventListener('change', changeDDLTop)
    }

}