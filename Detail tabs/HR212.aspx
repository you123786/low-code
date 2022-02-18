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
            CheckActionForShowDetailBox();
            //DetailWindowsAddCloseBtn();
            //ResetOpenedWindows();

            function InitTabs() {

                if (detailBoxes.length > 0) {
                    detailBoxes.forEach(function(item, index) {
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
                detailBoxes.forEach(function(tabBox) {
                    if (tabBox.dataset.tabBox === selectedItemVal) {
                        tabBox.classList.add("active");
                    }
                });
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
        TabsDetail.InitTabs();
    </script>

</body>

</html>