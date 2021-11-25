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
        url: baseUrl + "/report/stock-report",
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ` + sessionStorage.getItem("token"),
        },
        success: function (response) {
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
        var usedStockPercentage = ((tableRow.maximumCapacity - tableRow.stock)*100/tableRow.maximumCapacity).toFixed(2);
        var percentageClass = "percentage-green";
        if(usedStockPercentage <= 30){
            percentageClass = "percentage-green";
        }else if(usedStockPercentage <= 60){
            percentageClass = "percentage-blue";
        }else if(usedStockPercentage <= 90){
            percentageClass = "percentage-orange";
        }else{
            percentageClass = "percentage-red";
        }

        var tr = "" +
            "<tr>" +
            "<td>" + tableRow.address + "</td>" +
            "<td>" + tableRow.monthlyExpectedStock.toFixed(2) + "Kg</td>" +
            "<td>" + tableRow.maximumCapacity.toFixed(2) + "Kg</td>" +
            "<td>" + tableRow.stock.toFixed(2) + "Kg</td>" +
            "<td>" + tableRow.totalMonthlyPaddyLimitPerFarmer.toFixed(2) + "Kg</td>" +
            "<td class=\" " + percentageClass + "\" >" + usedStockPercentage + "%</td>" +
            "<td><a href=\"#\" class=\"btn btn-sm btn-primary\">More</a></td>" +
            "</tr>";

        $('#dataTable tbody').append(tr);
    }

    if (data.length == 0) {
        var div = "" +
            "<tr> <td colspan='6' class='font-weight-bold pt-5 text-lg'> Content Not available </td> </tr>";
        $('#dataTable tbody').append(div);
    }
}