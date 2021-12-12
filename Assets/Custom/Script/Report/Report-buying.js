baseUrl = "http://localhost:8080/pcs";

var dataTableInstance;
var dataTopBuyersTableInstance;

$(document).ready(function () {

    var employee = JSON.parse(sessionStorage.getItem("employee"));

    if (employee != null) {
        document.getElementById('userName').innerHTML = employee.name;
        dataTableInstance = $('#dataTable').DataTable();
        dataTopBuyersTableInstance = $('#topBuyersTable').DataTable();
        loadTableData();
    } else {
        $('#userModel').modal({
            backdrop: 'static',
            keyboard: false
        })
    }

});

var loadTableData = function () {
    GetRequest("report/buying-report", loadBuyingDataSuccess);
    GetRequest("customer", getAllCustomersSuccess);
    GetRequest("farmer", getAllFarmersSuccess);
}

function loadBuyingDataSuccess(response) {
    createTableBody(response);
    createTopBuyersTableBody(response);
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
            tableRow.farmer.id,
            tableRow.farmer.name,
            tableRow.branch.address,
            tableRow.date,
            'Rs' + tableRow.paddyPrice.buyingPrice.toFixed(2),
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

var createTopBuyersTableBody = function (data) {
    $("#topBuyersTable tbody").empty();

    let buyerMap = new Map();

    for (const tableRow of data) {
        if (buyerMap.has(tableRow.farmer.id)) {
            let getInitialValue = buyerMap.get(tableRow.farmer.id);
            getInitialValue.push(tableRow);
            buyerMap.set(tableRow.farmer.id, getInitialValue);
        } else {
            buyerMap.set(tableRow.farmer.id, [tableRow]);
        }

    }

    for (let [key, value] of buyerMap) {
        var valueSet = value;
        cumulativeWeight = 0;
        cumulativePayment = 0;
        farmerName = "";
        branch = "";
        valueSet.forEach(value => {
            cumulativeWeight += value.weight;
            cumulativePayment += value.payment.amount;
            farmerName = value.farmer.name;
            branch = value.branch.address;
        });
        dataTopBuyersTableInstance.row.add([
            farmerName,
            branch,
            '<span class="badge badge-success">' + cumulativeWeight.toFixed(2) + 'Kg</span>',
            '<span class="badge badge-warning">Rs' + cumulativePayment.toFixed(2) + '</span>'
        ]).draw(false);

    }
    if (data.length == 0) {
        var div = "" +
            "<tr> <td colspan='6' class='font-weight-bold pt-5 text-lg'> Content Not available </td> </tr>";
        $('#topBuyersTable tbody').append(div);
    }
}