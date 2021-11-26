baseUrl = "http://localhost:8080/pcs";

$(document).ready(function () {

    var employee = JSON.parse(sessionStorage.getItem("employee"));

    if (employee != null) {
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
}

var createCashInflowTableBody = function (data) {
    $("#dataTableCashInflows tbody").empty();

    for (const tableRow of data) {
        var tr = "" +
            "<tr>" +
            "<td><a href=\"#\" class=\"btn btn-success btn-sm\"><i class=\"fas fa-arrow-up\"></i></a></td>"+
            "<td>" + tableRow.farmer.name + "</td>" +
            "<td>" + tableRow.branch.address + "</td>" +
            "<td>" + tableRow.date + "</td>" +
            "<td>Rs" + tableRow.paddyPrice.buyingPrice.toFixed(2) +" x "+tableRow.weight.toFixed(2) + "Kg</td>" +
            "<td>" + tableRow.payment.amount.toFixed(2) + " Kg</td>" +
            "<td>" + tableRow.payment.bank + "</td>" +
            // "<td><a href=\"#\" class=\"btn btn-sm btn-primary\">More</a></td>" +
            "</tr>";

        $('#dataTableCashInflows tbody').append(tr);
    }

    if (data.length == 0) {
        var div = "" +
            "<tr> <td colspan='6' class='font-weight-bold pt-5 text-lg'> Content Not available </td> </tr>";
        $('#dataTableCashInflows tbody').append(div);
    }
}

var createCashOutflowTableBody = function (data) {
    $("#dataTableCashOutflows tbody").empty();

    for (const tableRow of data) {
        var tr = "" +
            "<tr>" +
            "<td><a href=\"#\" class=\"btn btn-danger btn-sm\"><i class=\"fas fa-arrow-down\"></i></a></td>"+
            "<td>" + tableRow.customer.name + "</td>" +
            "<td>" + tableRow.branch.address + "</td>" +
            "<td>" + tableRow.date + "</td>" +
            "<td>Rs" + tableRow.paddyPrice.sellingPrice.toFixed(2) +" x "+tableRow.weight.toFixed(2) + "Kg</td>" +
            "<td>" + tableRow.payment.amount.toFixed(2) + " Kg</td>" +
            "<td>" + tableRow.payment.bank + "</td>" +
            // "<td><a href=\"#\" class=\"btn btn-sm btn-primary\">More</a></td>" +
            "</tr>";

        $('#dataTableCashOutflows tbody').append(tr);
    }

    if (data.length == 0) {
        var div = "" +
            "<tr> <td colspan='6' class='font-weight-bold pt-5 text-lg'> Content Not available </td> </tr>";
        $('#dataTableCashOutflows tbody').append(div);
    }
}