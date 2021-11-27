baseUrl = "http://localhost:8080/pcs";

var dataTableInstanceIn;
var dataTableInstanceOut;

var paddyPrices = {
    id: 0,
    buyingPrice: 0,
    sellingPrice: 0,
    date: ""
};

$(document).ready(function () {

    var employee = JSON.parse(sessionStorage.getItem("employee"));

    if (employee != null) {
        document.getElementById('userName').innerHTML = employee.name;
        dataTableInstanceIn =  $('#dataTableCashInflows').DataTable();
        dataTableInstanceOut = $('#dataTableCashOutflows').DataTable();
        loadTableData();
    } else {
        $('#userModel').modal({
            backdrop: 'static',
            keyboard: false
        })
    }

});

var loadTableData = function () {

    $.ajax({
        type: "GET",
        url: baseUrl + "/report/buying-report",
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ` + sessionStorage.getItem("token"),
        },
        success: function (response) {
            console.log(response);
            createCashInflowTableBody(response);
        },
        error: function (error) {
            console.log(error);
            console.log("Error occured while getting stock report.");
            if (error.status == 401) {
                $('#userModel').modal({
                    backdrop: 'static',
                    keyboard: false
                })

            } else if (error.status == 403) {
                $('#userSessionExpiredModel').modal({
                    backdrop: 'static',
                    keyboard: false
                });
            } else {
                $('#generalError').modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }
        }
    });

    $.ajax({
        type: "GET",
        url: baseUrl + "/report/selling-report",
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ` + sessionStorage.getItem("token"),
        },
        success: function (response) {
            console.log(response);
            createCashOutflowTableBody(response);
        },
        error: function (error) {
            console.log(error);
            console.log("Error occured while getting stock report.");
            if (error.status == 401) {
                $('#userModel').modal({
                    backdrop: 'static',
                    keyboard: false
                })

            } else if (error.status == 403) {
                $('#userSessionExpiredModel').modal({
                    backdrop: 'static',
                    keyboard: false
                });
            } else {
                $('#generalError').modal({
                    backdrop: 'static',
                    keyboard: false
                });
            }
        }
    });

    GetRequest("paddyPrice/TodayPaddyPriceGet", getTodayPaddyPricesSuccess);
}

var totalCashInflows = 0;
var cashinflowTransactionCount;
var totalCashOutflows = 0;
var cashOutflowTransactionCount;
var createCashInflowTableBody = function (data) {
    
    cashinflowTransactionCount = data.length;
    data.forEach(element => {
        totalCashInflows += parseFloat(element.payment.amount);
    });
    document.getElementById('cashInflowAmount').innerHTML = 'Rs ' + totalCashInflows.toFixed(2);
    document.getElementById('cashInflowTCount').innerHTML = 'Transaction Count : ' + cashinflowTransactionCount;

    $("#dataTableCashInflows tbody").empty();
    for (const tableRow of data) {
        dataTableInstanceIn.row.add([
            '<a href=\"#\" class=\"btn btn-success btn-sm\"><i class=\"fas fa-arrow-up\"></i></a>',
            tableRow.farmer.name,
            tableRow.branch.address,
            tableRow.date,
            'Rs' + tableRow.paddyPrice.buyingPrice.toFixed(2) +" x "+tableRow.weight.toFixed(2)+'Kg',
            'Rs' + tableRow.payment.amount.toFixed(2) ,
            tableRow.payment.bank
        ]).draw(false);
    }

    if (data.length == 0) {
        var div = "" +
            "<tr> <td colspan='6' class='font-weight-bold pt-5 text-lg'> Content Not available </td> </tr>";
        $('#dataTableCashInflows tbody').append(div);
    }
}

var createCashOutflowTableBody = function (data) {

    cashOutflowTransactionCount = data.length;
    data.forEach(element => {
        totalCashOutflows += parseFloat(element.payment.amount);
    });
    document.getElementById('cashOutflowAmount').innerHTML = 'Rs ' + totalCashOutflows.toFixed(2);
    document.getElementById('cashOutflowTCount').innerHTML = 'Transaction Count : ' + cashOutflowTransactionCount;

    document.getElementById('incomeAmount').innerHTML = 'Rs ' + (totalCashInflows - totalCashOutflows).toFixed(2);
    document.getElementById('incomeTCount').innerHTML = 'Transaction Count : ' + (cashOutflowTransactionCount + cashinflowTransactionCount);

    $("#dataTableCashOutflows tbody").empty();
    for (const tableRow of data) {
       dataTableInstanceOut.row.add([
            '<a href=\"#\" class=\"btn btn-danger btn-sm\"><i class=\"fas fa-arrow-down\"></i></a>',
            tableRow.customer.name,
            tableRow.branch.address,
            tableRow.date,
            'Rs' + tableRow.paddyPrice.sellingPrice.toFixed(2) +" x "+tableRow.weight.toFixed(2) + "Kg",
            'Rs' + tableRow.payment.amount.toFixed(2) ,
            tableRow.payment.bank
        ]).draw(false);
    }

    if (data.length == 0) {
        var div = "" +
            "<tr> <td colspan='6' class='font-weight-bold pt-5 text-lg'> Content Not available </td> </tr>";
        $('#dataTableCashOutflows tbody').append(div);
    }
}

function getTodayPaddyPricesSuccess(response) {
    paddyPrices = response;
    console.log(response);
}