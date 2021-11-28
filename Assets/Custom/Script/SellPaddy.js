baseUrl = "http://localhost:8080/pcs";

var dataTableInstance;
var dataTopBuyersTableInstance;

$(document).ready(function () {

    var employee = JSON.parse(sessionStorage.getItem("employee"));

    if (employee != null) {
        document.getElementById('userName').innerHTML = employee.name;
    } else {
        $('#userModel').modal({
            backdrop: 'static',
            keyboard: false
        })
    }

});