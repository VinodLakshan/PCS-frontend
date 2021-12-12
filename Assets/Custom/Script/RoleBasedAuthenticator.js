
// USER_MANAGEMENT , FARMER_MANAGEMENT, PADDY_PURCHASE, PADDY_ORDERS, FINANCE, STOCKS, CUSTOMER_MANAGEMENT,
// STOCK_REPORT, BUYING_REPORT, SELLING_REPORT, INCOME_REPORT, SELL_PADDY, PADDY_DISTRIBUTION, PADDY_PRICE_MANAGEMENT
// only above values are allowed to config left navigation

let roleRestrictedNavItems = new Map([
    ["Admin", []],
    ["Collection_Officer", ["PADDY_PRICE_MANAGEMENT"]],
    ["Paying_Officer", ["PADDY_PRICE_MANAGEMENT"]],
    ["Store_Keeper", ["PADDY_ORDERS", "PADDY_PRICE_MANAGEMENT"]],
    ["Finance_Officer", ["USER_MANAGEMENT","FARMER_MANAGEMENT", "PADDY_PRICE_MANAGEMENT"]],
    ["Manager", []]
]);

$(document).ready(function () {
    var employee = JSON.parse(sessionStorage.getItem("employee"));
    if (employee != null) {
        console.log(employee.role.roleName);
        restrictedList = roleRestrictedNavItems.get(employee.role.roleName);
        if(restrictedList != undefined){
            restrictedList.forEach(element => {
                console.log(element);
                document.getElementById(element).style.display = "none";
            });
        }
    }
});