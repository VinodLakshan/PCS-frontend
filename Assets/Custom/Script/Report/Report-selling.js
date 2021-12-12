baseUrl = "http://localhost:8080/pcs";

var dataTableInstance;
var topSellersDataTableInstance;

$(document).ready(function () {

    var employee = JSON.parse(sessionStorage.getItem("employee"));

    if (employee != null) {
        document.getElementById('userName').innerHTML = employee.name;
        dataTableInstance = $('#dataTable').DataTable();
        topSellersDataTableInstance = $('#topSellersTable').DataTable();
        loadTableData();
    } else {
        $('#userModel').modal({
            backdrop: 'static',
            keyboard: false
        })
    }

});

var loadTableData = function () {
    GetRequest("report/selling-report", loadSellingReportSuccess);
    GetRequest("customer", getAllCustomersSuccess);
    GetRequest("farmer", getAllFarmersSuccess);
}

function loadSellingReportSuccess(response){
    createTableBody(response);
    createTopSellersTableBody(response);
}

function getAllCustomersSuccess(response){
    document.getElementById('totCustomer').innerHTML = response !== undefined ? response.data.length + " - Total No of Customers "
     : "0 - Total No of Customers"; 
}

function getAllFarmersSuccess(response){
    document.getElementById('totFarmers').innerHTML = response !== undefined ? response.data.length + " - Total No of Farmers "
     : "0 - Total No of Farmers"; 
}

var createTableBody = function (data) {
    $("#dataTable tbody").empty();

    for (const tableRow of data) {

        dataTableInstance.row.add([
            tableRow.customer.name,
            tableRow.branch.address,
            tableRow.date,
            'Rs' + tableRow.paddyPrice.sellingPrice.toFixed(2),
            tableRow.weight.toFixed(2) + 'Kg',
            'Rs' + tableRow.payment.amount.toFixed(2)
        ]).draw(false);
    }

    if (data.length == 0) {
        var div = "" +
            "<tr> <td colspan='6' class='font-weight-bold pt-5 text-lg'> Content Not available </td> </tr>";
        $('#dataTable tbody').append(div);
    }
}

var createTopSellersTableBody = function (data) {
    $("#topSellersTable tbody").empty();

    let sellerMap = new Map();

    for (const tableRow of data) {

        if (sellerMap.has(tableRow.customer.id)) {
            let getInitialValue = sellerMap.get(tableRow.customer.id);
            getInitialValue.push(tableRow);
            sellerMap.set(tableRow.customer.id, getInitialValue);
        } else {
            sellerMap.set(tableRow.customer.id, [tableRow]);
        }

    }

    for (let [key, value] of sellerMap) {
        var valueSet = value;
        cumulativeWeight = 0;
        cumulativePayment = 0;
        customerName = "";
        branch = "";
        valueSet.forEach(value => {
            cumulativeWeight += value.weight;
            cumulativePayment += value.payment.amount;
            customerName = value.customer.name;
            branch = value.branch.address;
        });
        topSellersDataTableInstance.row.add([
            customerName,
            branch,
            '<span class="badge badge-success">' + cumulativeWeight.toFixed(2) + 'Kg</span>',
            '<span class="badge badge-warning">Rs' + cumulativePayment.toFixed(2) + '</span>'
        ]).draw(false);

    }
    if (data.length == 0) {
        var div = "" +
            "<tr> <td colspan='6' class='font-weight-bold pt-5 text-lg'> Content Not available </td> </tr>";
        $('#topSellersTable tbody').append(div);
    }
}