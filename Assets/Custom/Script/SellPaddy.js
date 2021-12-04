baseUrl = "http://localhost:8080/pcs";

var dataTableInstance;

$(document).ready(function () {

    var employee = JSON.parse(sessionStorage.getItem("employee"));

    if (employee != null) {
        document.getElementById('userName').innerHTML = employee.name;

        dataTableInstance = $('#tableSellOrders').DataTable();
        GetRequest("report/selling-report", loadSellPaddyOrders);
        GetRequest("customer", loadAllCustomers);

    } else {
        $('#userModel').modal({
            backdrop: 'static',
            keyboard: false
        })
    }

});

function loadAllCustomers(response){
    $('#selectCustomer').find('option').not(':first').remove();
    for (const customer of response.data) {
        $('#selectCustomer').append(new Option(customer.name , JSON.stringify(customer)));
    }
    document.getElementById("totCustomers").innerHTML = response != undefined ? response.data.length : "00";
}

function loadSellPaddyOrders(response) {
    $("#tableSellOrders tbody").empty();

    for (const tableRow of response) {

        dataTableInstance.row.add([
            tableRow.customer.name,
            tableRow.branch.address,
            tableRow.weight.toFixed(2) + 'Kg',
            tableRow.date,
            'Rs' + tableRow.payment.amount.toFixed(2)
        ]).draw(false);
    }

    if (response.length == 0) {
        var div = "" +
            "<tr> <td colspan='6' class='font-weight-bold pt-5 text-lg'> Content Not available </td> </tr>";
        $('#tableSellOrders tbody').append(div);
    }
}

$('#btnSell').click(function () {
    document.getElementById("errorName").innerHTML = "";
    document.getElementById("errorAddress").innerHTML = "";
    document.getElementById("inputCName").value = "";
    document.getElementById("inputCAddress").value = "";
    $('#addCustomerModel').modal('show');
});



$('#btn-add').click(function () {
    // $('#addCustomerModel').modal('show');

    var cname = document.getElementById("inputCName").value;
    var cAddress = document.getElementById("inputCAddress").value;

    if(cname == ""){
        document.getElementById("errorName").innerHTML = "This is a required field.";
    }else if(cAddress == ""){
        document.getElementById("errorAddress").innerHTML = "This is a required field.";
    }else{
        // do the addition
    }

    console.log(cname + " -  " + cAddress);
});

$('#inputCName').click(function () {
    document.getElementById("errorName").innerHTML = "";
});

$('#inputCAddress').click(function () {
    document.getElementById("errorAddress").innerHTML = "";
});