<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>需自動排班人員建檔[HR212]</title>
    <script>
        window.addEventListener("DOMContentLoaded", function() {
            SelectItem.clickedid = document.querySelector("#clickedid");
            SelectItem.hiddenid = document.querySelector("#hiddenid");
            //SelectItem.clickedid.value = "";
            //SelectItem.hiddenid.value = "";
            if (SelectItem.clickedid.value !== "")
                SelectItem.ResetSelRow(document.querySelector("#" + SelectItem.clickedid.value));
        });


        function DeleteItem() {
            return confirm('<%=GlobalResx.Language.MsgRemindConfirmDelete%>'); //確定要刪除嗎?
        }

        var TabsDetail = {
            menuId: "",
            InitTabs: TabsFuns,
            ShowCurrentDeatilBox: function() {
                let actionUrl = new URL(document.querySelector("form").action);
                if (actionUrl.searchParams.get("display") === null) {
                    actionUrl.searchParams.append("display", "block");
                    document.querySelector("form").action = actionUrl.href;
                }
            }
        };

        function TabsFuns() {
            this.menuId = document.querySelector(".hidden-page-menuId").value + document.querySelector("#__VIEWSTATEGENERATOR").value;
            let menuId = this.menuId;
            let tabSessionName = menuId + "tab";
            let detailBoxSessionName = menuId + "DetailBox";
            let mainTabBox = document.querySelector(".main-tabs-box");
            if (mainTabBox === null)
                return;
            let deatilBoxes = mainTabBox.querySelectorAll(".detail-box");
            if (deatilBoxes === null)
                return;

            InitTabs();
            AddShowTabsBeforePostback();
            CheckActionForShowDetailBox();

            ClearSessionStorageByPostBack();
            URLAddParamsIsPostBack();
            DefaultSelect();
            //DetailWindowsAddCloseBtn();
            //ResetOpenedWindows();

            function InitTabs() {

                if (deatilBoxes.length > 0) {
                    deatilBoxes.forEach(function(item, index) {
                        CreateTabs(item, index);
                        item.dataset.tabBox = "tab" + index;
                    });
                }
            }

            function CheckActionForShowDetailBox() {
                let actionUrl = new URL(document.querySelector("form").action);

                if (actionUrl.searchParams.get("display") === null) {
                    sessionStorage.removeItem(detailBoxSessionName);
                } else {
                    actionUrl.searchParams.delete("display");
                    document.querySelector("form").action = actionUrl.href;
                }

            }

            //function CreatePagingBox() {
            //    document.querySelector(". detail-data-table").forEach(function () {
            //        let pagingBox = document.createElement("div");
            //        let leftBtn = document.createElement("div");
            //        let rightBtn = document.createElement("div");
            //        let firstBtn = document.createElement("div");
            //        let lastBtn = document.createElement("div");
            //        let pageCurrentNum = document.createElement("input");
            //        let pageTotalNum = document.createElement("div");
            //        let pageSize = document.createElement("input");
            //        pagingBox.classList.add("paging-box");
            //    });
            //}
            function AddShowTabsBeforePostback() {
                document.querySelector("#tabsBox").querySelectorAll("*").forEach(function(item) {
                    if (item.hasAttributes()) {
                        for (let i = 0; i < item.attributes.length; i++) {
                            let index = item.attributes[i].value.indexOf("__doPostBack");
                            if (index > -1) {
                                item.attributes[i].value = item.attributes[i].value.slice(0, index) + "TabsDetail.ShowCurrentDeatilBox();" + item.attributes[i].value.slice(index);
                                break;
                            } else if (item.tagName.toLocaleLowerCase() === "input" && !item.getAttribute("onclick") && (item.getAttribute("type") && item.getAttribute("type").toLowerCase() === "submit")) {
                                item.setAttribute("onclick", "TabsDetail.ShowCurrentDeatilBox();");
                                break;
                            }
                        }
                    }
                });
            }

            function URLAddParamsIsPostBack() {
                let actionUrl = new URL(document.querySelector("form").action);
                if (actionUrl.searchParams.get("isPostBack") === null) {
                    actionUrl.searchParams.append("isPostBack", "Y");
                    document.querySelector("form").action = actionUrl.href;
                }

                //if (currentIframe === null) {
                //    let url = new URL(location.href);
                //    if (url.searchParams.get("isPostBack") !== null) {
                //        url.searchParams.delete("isPostBack")
                //        history.pushState({}, 0, url.href);
                //    }
                //}
            }

            function ClearSessionStorageByPostBack() {
                let isPostBack = new URL(location.href).searchParams.get("isPostBack");
                let block = new URL(location.href).searchParams.get("display");
                if (!isPostBack || !block) {
                    sessionStorage.removeItem(tabSessionName);
                    sessionStorage.removeItem(detailBoxSessionName);
                }
            }

            function DefaultSelect() {
                let defaultSelectItem = document.querySelector(".detail-box.active");
                if (defaultSelectItem || sessionStorage.getItem(tabSessionName)) {
                    let selectItemVal = defaultSelectItem ? defaultSelectItem.dataset.tabBox : sessionStorage.getItem(tabSessionName);
                    let tabs = mainTabBox.querySelectorAll(".detail-tab");
                    tabs.forEach(function(tab) {
                        if (sessionStorage.getItem(tabSessionName) === null) {
                            if (tab.dataset.item === selectItemVal)
                                tab.classList.add("active");
                        } else {
                            if (tab.dataset.item === sessionStorage.getItem(tabSessionName)) {
                                ChangeTabActive.call(tab);
                                ChangeTabBoxActive.call(tab);
                            }
                        }
                    });
                } else {
                    let fistTab = mainTabBox.querySelector(".detail-tab");
                    if (!fistTab)
                        return;
                    ChangeTabActive.call(fistTab);
                    ChangeTabBoxActive.call(fistTab);
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
                let activeDetail = document.querySelector(".detail-box.active");
                if (activeDetail != null)
                    activeDetail.classList.remove("active");
                deatilBoxes.forEach(function(tabBox) {
                    if (tabBox.dataset.tabBox === selectedItemVal) {
                        tabBox.classList.add("active");
                    }
                });
                sessionStorage.setItem(tabSessionName, selectedItemVal);
            }

            function ChangeTabActive() {
                let activeTab = document.querySelector(".detail-tab.active");
                if (activeTab != null)
                    activeTab.classList.remove("active");
                this.classList.add("active");
            }
        };
    </script>
</head>

<body onkeydown="if(event.keyCode==13){  event.keyCode=9;}" ms_positioning="GridLayout">
    <form id="Form1" method="post" runat="server">
        <uc1:GuideControl runat="server" id="GuideControl" />
        <uc1:AuthorityControl runat="server" id="AuthorityControl" />
        <uc1:SQLBuilder runat="server" id="SQLBuilder" />
        <ul class="btnBox btnBox-li-inline-block">
            <li>
                <asp:DropDownList ID="ddlTop" runat="server">
                    <asp:ListItem Value="" Text="<%$ Resources: Language, All %>" twtext="全部"></asp:ListItem>
                    <asp:ListItem Value=" top 100 " Text="<%$ Resources: Language, top100 %>" twtext="前100筆" Selected="True"></asp:ListItem>
                </asp:DropDownList>
            </li>
            <li>
                <asp:Button ID="buton_add" runat="server" CommandName="Search" Text="<%$ Resources: Language, Add %>" twtext="新 增"></asp:Button>
                <asp:Button ID="buton_edit" runat="server" CommandName="Search" Text="<%$ Resources: Language, Edit %>" twtext="修 改" OnClientClick="return SelectItem.SelMsg();"></asp:Button>
                <asp:Button ID="buton_delete" runat="server" CommandName="Search" Text="<%$ Resources: Language, Delete %>" twtext="刪 除" OnClientClick="return SelectItem.SelMsg();return DeleteItem();"></asp:Button>
                <asp:Button ID="btnSearch" runat="server" CommandName="Search" Text="<%$ Resources: Language, Search %>" twtext="查詢"></asp:Button>
                <asp:Button ID="buton_tijiao" runat="server" CommandName="Search" Text="<%$ Resources: Language, Audit %>" twtext="審 核" OnClientClick="return SelectItem.SelMsg();"></asp:Button>
                <asp:Button ID="But_bohui" runat="server" CommandName="Search" Text="<%$ Resources: Language, Reject %>" twtext="駁 回" OnClientClick="return SelectItem.SelMsg();"></asp:Button>

            </li>
            <li>
                <asp:RadioButtonList ID="RadioButtonList1" runat="server" CssClass="radioList radStatus" RepeatDirection="Horizontal" AutoPostBack="True" RepeatLayout="Flow">
                    <asp:ListItem Value="0" Selected="True" Text="<%$ Resources: Language, New %>" twtext="新建"></asp:ListItem>
                    <asp:ListItem Value="3" Text="<%$ Resources: Language, Audited %>" twtext="已審核"></asp:ListItem>
                    <asp:ListItem Value="-1" Text="<%$ Resources: Language, All %>" twtext="全部"></asp:ListItem>
                </asp:RadioButtonList>
            </li>
            <li>
                <asp:RadioButtonList ID="Radiobuttonlist2" runat="server" CssClass="radioList radStatus" RepeatDirection="Horizontal" AutoPostBack="True" RepeatLayout="Flow">
                    <asp:ListItem Value="1" Selected="True" Text="<%$ Resources: Language, Inservice %>" twtext="在職"></asp:ListItem>
                    <asp:ListItem Value="0" Text="<%$ Resources: Language, Resigned %>" twtext="離職"></asp:ListItem>
                </asp:RadioButtonList>
                <asp:Label ID="Label1" runat="server" CssClass="font-color-red" Visible="False"></asp:Label>
            </li>
        </ul>

        <table cellspacing="0" cellpadding="0" width="100%">
            <tr>
                <td>
                    <asp:DataGrid ID="Datagrid1" runat="server" Width="100%" CssClass="dataTable ItemLight" CaptionAlign="Left" CellPadding="3" AllowSorting="True" AutoGenerateColumns="False">
                        <SelectedItemStyle ForeColor="#000033" BackColor="#FFDEB5"></SelectedItemStyle>
                        <HeaderStyle CssClass="dataTableHeader"></HeaderStyle>
                        <Columns>
                            <asp:BoundColumn DataField="CorpNo" HeaderText="<%$ Resources: Language, CorpNo %>" FooterText="公司別"></asp:BoundColumn>
                            <asp:BoundColumn DataField="employee" HeaderText="<%$ Resources: Language, Employee ID %>" FooterText="員工編號"></asp:BoundColumn>
                            <asp:BoundColumn DataField="name" HeaderText="<%$ Resources: Language, Employee Name %>" FooterText="員工姓名"></asp:BoundColumn>
                            <asp:BoundColumn DataField="ApplyDate" HeaderText="<%$ Resources: ApplicationTime %>" FooterText="申請時間"></asp:BoundColumn>
                            <asp:BoundColumn DataField="RankLevel" HeaderText="<%$ Resources: RankCode %>" FooterText="職級代碼"></asp:BoundColumn>
                            <asp:BoundColumn DataField="RankNO" HeaderText="<%$ Resources: PositionCode %>" FooterText="職位代碼"></asp:BoundColumn>
                            <asp:BoundColumn DataField="IfScanCard" HeaderText="<%$ Resources: WhetherAttendance %>" FooterText="是否需考勤"></asp:BoundColumn>
                            <asp:BoundColumn DataField="tStatus" HeaderText="<%$ Resources: Language, tStatus %>" FooterText="狀態"></asp:BoundColumn>
                            <asp:TemplateColumn HeaderText="狀態值" Visible="false">
                                <ItemTemplate>
                                    <asp:TextBox ID="tStatus" runat="server" ReadOnly="true" Text='<%# Eval("tStatus") %>'></asp:TextBox>
                                </ItemTemplate>
                            </asp:TemplateColumn>
                            <asp:BoundColumn DataField="Remark" HeaderText="<%$ Resources: Language, Remark %>" FooterText="備註"></asp:BoundColumn>
                            <asp:BoundColumn DataField="userName" HeaderText="<%$ Resources: Language, aUser %>" FooterText="創建人"></asp:BoundColumn>
                            <asp:BoundColumn DataField="su3" HeaderText="<%$ Resources: Language, Auditor %>" FooterText="審核人"></asp:BoundColumn>
                        </Columns>
                    </asp:DataGrid>
                    <uc1:PageingControl runat="server" id="PageingControl" />
                </td>
            </tr>
        </table>
        <asp:TextBox ID="hiddenid" runat="server" CssClass="elem-none"></asp:TextBox>
        <asp:TextBox ID="clickedid" runat="server" CssClass="elem-none"></asp:TextBox>
        <asp:Button ID="DetailBtn" runat="server" Text="Button" OnClick="DetailBtn_Click" CssClass="elem-none" />

        <div class="main-tabs-box" id="tabsBox" runat="server" visible="false">
            <div class="detail-box" data-title="項目一">
                <asp:GridView ID="GridView1" width="100%" runat="server" CssClass="dataTable">
                    <HeaderStyle CssClass="selected-item-detail" />
                </asp:GridView>
                <uc1:PageingControl runat="server" id="DetailPageingControl" />
                <asp:Button ID="TestBtn" runat="server" Text="測試按鈕" UseSubmitBehavior="False" OnClick="TestBtn_Click" />

                <button type="button" onclick="OpenDeatilBox('test01');">Button</button>
                <br />
                <br />
            </div>
            <div class="detail-box" data-title="項目二">
                <asp:Button ID="Button2" runat="server" Text="Button" />
            </div>
            <div class="detail-box" data-title="項目三">
                <asp:RadioButtonList ID="RadioButtonList3" runat="server" AutoPostBack="True">
                    <asp:ListItem>單選1</asp:ListItem>
                    <asp:ListItem>單選2</asp:ListItem>
                </asp:RadioButtonList>
                <asp:TextBox ID="TextBox1" runat="server" AutoPostBack="True" Text="項目三內容"></asp:TextBox>

            </div>

            <div id="test01" class="detail-window" style="background:#ff6a00; width:100%; height:300px; display:none">
                <table id="employeeTable" class="detail-data-table elem-none" border="1" rules="all">
                    <tr>
                        <th id="CorpNo">CorpNo</th>
                        <th id="employeeID">employeeID</th>
                        <th id="ApplyDate">ApplyDate</th>
                        <th id="Remark">Remark</th>
                    </tr>
                </table>
            </div>
        </div>
    </form>
    <style>
        .main-tabs-box ul.tabList {
            background: #E0ECFF;
            margin: 10px 0 0 0;
            padding: 10px 0 0 0;
            border-bottom: 1px solid #95B8E7;
        }
        
        .detail-tab {
            color: #0E2D5F;
            text-align: center;
            display: inline-block;
            background: #EFF5FF;
            margin: 0 0 -1px 5px;
            padding: .5rem 1rem;
            border: 1px solid #95B8E7;
            border-radius: 5px 5px 0 0;
            cursor: pointer;
            user-select: none;
        }
        
        .detail-tab.active {
            background: #fff;
            border-bottom-color: #fff;
        }
        
        .detail-box {
            display: none;
            width: 100%;
            height: 300px;
            padding: .8rem;
        }
        
        .detail-box.active {
            display: block;
        }
        
        .DetailPageingControl {
            text-align: left;
        }
    </style>
    <script>
        //alert();
        //alert(document.querySelector("#__EVENTTARGET").value);
        //alert(document.querySelector("#__EVENTARGUMENT").value);
        //alert(document.querySelector("#__LASTFOCUS").value);

        //let menuId = document.querySelector(".hidden-page-menuId").value + document.querySelector("#__VIEWSTATEGENERATOR").value;
        //function DataBind(element, data) {
        //    if (element === null || typeof element === "undefined") {
        //        throw "Element not found."
        //    }

        //    let tableTds = [];
        //    let tdEles = element.querySelectorAll("td");
        //    if (tdEles.length > 0) {
        //        tdEles.forEach(function (item) {
        //            item.parentElement.removeChild(item);
        //        });
        //    }
        //    element.querySelectorAll("th").forEach(function (th) {
        //        tableTds.push(th.id);
        //    });
        //    try {
        //        if (typeof data !== "object")
        //            data = JSON.parse(data);
        //    } catch {
        //        alert("Data error!");
        //        return;
        //    }
        //    for (let i = 0; i < data.length; i++) {
        //        let trEle = document.createElement("tr");
        //        for (let h = 0; h < tableTds.length; h++) {
        //            let tdEle = document.createElement("td");
        //            tdEle.innerHTML = data[i][tableTds[h]];
        //            trEle.appendChild(tdEle);
        //        }
        //        element.querySelector("tbody").append(trEle);
        //    }
        //}
        //DataBind(document.querySelector("#employeeTable"), [
        //    {
        //        "corpno": "Molecule Man",
        //        "code": 29,
        //        "name": "Dan Jukes"
        //    },
        //    {
        //        "corpno": "Madame Uppercut",
        //        "code": 39,
        //        "name": "Jane Wilson"
        //    }
        //]);
        <%--function AjaxTest(corpNo, code) {
            fetch("<%=ResolveUrl("~/HR/HR2F/TestAjax.ashx")%>
        ", {
        method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                corpNo: corpNo,
                employeeID: code
            })
        }).then(data => data.json()).then(json => {
            //document.querySelector("#TestTextBox").value = text;
            DataBind(document.querySelector("#employeeTable"), json);
        });
        }-- % >

        //function CloseDetailWindow(item) {
        //    let sessionName = menuId + "DetailBox";
        //    detailWindow = document.querySelector("#" + item.dataset.windowId);
        //    if (detailWindow == null)
        //        return;
        //    let getSession = sessionStorage.getItem(sessionName).split(',');
        //    let index = getSession.findIndex(id => id === item.dataset.windowId);
        //    if (index > -1)
        //        getSession.splice(index, 1);
        //    if (getSession.length === 0)
        //        sessionStorage.removeItem(sessionName);
        //    else
        //        sessionStorage.setItem(sessionName, getSession);
        //    detailWindow.style.display = "none";
        //}
        //function HiddenTabsBox() {
        //    document.querySelector("#tabsBox").style.display = "none";
        //    let actionUrl = new URL(document.querySelector("form").action);
        //    if (actionUrl.searchParams.get("display") !== null) {
        //        actionUrl.searchParams.delete("display");
        //        document.querySelector("form").action = actionUrl.href;
        //    }
        //}

        //function OpenDeatilBox(elementID) {
        //    let detailBox = document.querySelector("#" + elementID);
        //    detailBox.style.display = "block";
        //    let sessionName = menuId + "DetailBox";
        //    let getSession = sessionStorage.getItem(sessionName);
        //    getSession = getSession === null ? [] : getSession.trim().split(",");

        //    if (getSession.length === 0)
        //        getSession = [elementID];
        //    else if (getSession.findIndex(id => id === elementID) === -1)
        //        getSession.push(elementID);

        //    sessionStorage.setItem(sessionName, getSession.join(","));
        //}

        //function ResetOpenedWindows() {
        //    let sessionName = menuId + "DetailBox";
        //    if (sessionStorage.getItem(sessionName) === null)
        //        return;
        //    sessionStorage.getItem(sessionName).split(",").forEach(function (elementID) {
        //        if (elementID === "")
        //            return;
        //        let detailBox = document.querySelector("#" + elementID);
        //        if (detailBox !== null)
        //            detailBox.style.display = "block";
        //    });

        //};
        //function DetailWindowsAddCloseBtn() {
        //    document.querySelectorAll(".detail-window").forEach(function (detialWindow) {
        //        let closeBtn = document.createElement("div");
        //        closeBtn.classList.add("close-btn");
        //        closeBtn.dataset.windowId = detialWindow.id;
        //        closeBtn.addEventListener("click", function () {
        //            CloseDetailWindow(this);
        //        });
        //        closeBtn.innerHTML = "X";
        //        detialWindow.append(closeBtn);
        //    });
        //}
        TabsDetail.InitTabs();
    </script>

</body>

</html>