
let roleRestrictedNavItems = new Map([
    ["Admin", []],
    ["Collection_Officer", ["USER_MANAGEMENT","FARMER_MANAGEMENT"]],
    ["Paying_Officer", []],
    ["Store_Keeper", ["PADDY_ORDERS","STOCKS"]],
    ["Finance_Officer", []],
    ["Manager", ["SELL_PADDY"]]
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