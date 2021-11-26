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
        url: baseUrl + "/report/selling-report",
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ` + sessionStorage.getItem("token"),
        },
        success: function (response) {
            console.log(response);
            createTableBody(response);
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

var createTableBody = function (data) {
    $("#dataTable tbody").empty();

    for (const tableRow of data) {
        var tr = "" +
            "<tr>" +
            "<td>" + tableRow.customer.name + "</td>" +
            "<td>" + tableRow.branch.address + "</td>" +
            "<td>" + tableRow.date + "</td>" +
            "<td>Rs" + tableRow.paddyPrice.sellingPrice.toFixed(2) + "</td>" +
            "<td>" + tableRow.weight.toFixed(2) + " Kg</td>" +
            "<td>Rs" + tableRow.payment.amount.toFixed(2) + "</td>" +
            // "<td><a href=\"#\" class=\"btn btn-sm btn-primary\">More</a></td>" +
            "</tr>";

        $('#dataTable tbody').append(tr);
    }

    if (data.length == 0) {
        var div = "" +
            "<tr> <td colspan='6' class='font-weight-bold pt-5 text-lg'> Content Not available </td> </tr>";
        $('#dataTable tbody').append(div);
    }
}