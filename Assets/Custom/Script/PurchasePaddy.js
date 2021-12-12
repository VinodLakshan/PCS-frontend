baseUrl = "http://localhost:9091/pcs";

var paddyPrices = {
    id: 0,
    buyingPrice: 0,
    sellingPrice: 0,
    date: ""
};
var paddyPurchase;
var purchaseTotalAmount = 0;
var farmerRemainingLimit = 0;
var branchDetails;
var selectedFarmer;

$(document).ready(function () {

    var employee = JSON.parse(sessionStorage.getItem("employee"));

    if (employee != null) {

        if (employee.role.roleName == "Collection_Officer" || employee.role.roleName == "Admin") {
            loadDetails();

        } else {
            $('#unauthorizedModel').modal({
                backdrop: 'static',
                keyboard: false
            });
        }

    } else {
        $('#userModel').modal({
            backdrop: 'static',
            keyboard: false
        })
    }

});

function loadDetails() {

    branchDetails = sessionStorage.getItem("branch");
    branchDetails = JSON.parse(branchDetails);

    GetRequest("paddyPrice/TodayPaddyPriceGet", getTodayPaddyPricesSuccess);
    GetRequest("branch/" + branchDetails.id, getBranchDetailsSuccess);
    GetRequest("farmer", getFarmerDetailsSuccess);
    GetRequest("paddy/" + branchDetails.id, getPaddyPurchasesForBranchSuccess);
}

function getTodayPaddyPricesSuccess(response) {
    paddyPrices = response;
}

function getBranchDetailsSuccess(response) {
    branchDetails = response.data;
    loadInfoCardDetails();
}

function getFarmerDetailsSuccess(response) {
    var farmers = response.data;
    $('#selectFarmer').find('option').not(':first').remove();
    for (const farmer of farmers) {
        $('#selectFarmer').append(new Option(farmer.name + " - " + farmer.registrationNumber, JSON.stringify(farmer)));
    }
}

function getPaddyPurchasesForBranchSuccess(response) {
    setupTableData(response.data);
}

function loadInfoCardDetails() {
    $('#divBuyingPrice').text(formatCurrency(paddyPrices.buyingPrice));
    $('#divMaximumCapacity').text(branchDetails.maximumCapacity.toLocaleString());
    $('#divCurrentStock').text(branchDetails.stock.toLocaleString());
    $('#divExpectedStock').text(branchDetails.monthlyExpectedStock.toLocaleString());
}

$('#btnPurchase').click(function () {

    clearValidations();
    var formData = $('#purchaseForm').serializeObject();

    if (!validateFields(formData)) {
        setRequestData(formData);
        $('#confirmationModel').modal('show');
    }
});

$('#btnConfirm').click(function () {
    $('#confirmationModel').modal('hide');

    PostRequest("paddy", paddyPurchase, makePaddyPurchaseSuccess);
    // $.ajax({
    //     type: "POST",
    //     url: baseUrl + "/paddy",
    //     async: true,
    //     contentType: "application/json",
    //     headers: {
    //         'Authorization': `Bearer ` + sessionStorage.getItem("token"),
    //     },
    //     data: JSON.stringify(paddyPurchase),
    //     success: function (response) {
    //
    //         showGeneralModal("success", "");
    //         resetForm();
    //     },
    //     error: function (error) {
    //
    //         if (error.status == 401) {
    //             $('#userModel').modal({
    //                 backdrop: 'static',
    //                 keyboard: false
    //             })
    //
    //         } else if (error.status == 403) {
    //             $('#unauthorizedModel').modal({
    //                 backdrop: 'static',
    //                 keyboard: false
    //             });
    //
    //         } else {
    //             showGeneralModal("error", error);
    //         }
    //     }
    // });
});

function makePaddyPurchaseSuccess(response) {
    showGeneralModal("success", "");
    resetForm();
}

$('#selectFarmer').change(function () {

    var farmersPaddyAmount = 0;
    if (this.value != "") {
        selectedFarmer = JSON.parse(this.value);
        farmersPaddyAmount = selectedFarmer.totalMonthlyPaddyAmount;

        if (branchDetails.totalMonthlyPaddyLimitPerFarmer != 0) {
            farmerRemainingLimit = branchDetails.totalMonthlyPaddyLimitPerFarmer - farmersPaddyAmount;
            if (farmerRemainingLimit >= 0) farmerRemainingLimit = formatCurrency(farmerRemainingLimit);

        } else {
            farmerRemainingLimit = "No Limit";
        }

        $('#spanFarmerAvailablePaddy').text(farmerRemainingLimit);
    } else {
        $('#spanFarmerMonthlyPaddy').text("0.00");
        $('#spanFarmerAvailablePaddy').text("0.00");
    }

    $('#inputWeight').attr({
        "max": farmerRemainingLimit
    });

    $('#spanFarmerMonthlyPaddy').text(formatCurrency(farmersPaddyAmount));
});

$('#inputWeight').change(function () {

    purchaseTotalAmount = this.value * paddyPrices.buyingPrice;
    $('#spanTotalAmount').text(formatCurrency(purchaseTotalAmount));
});

$('#btnLogout').click(function () {
    sessionStorage.clear();
});

function validateFields(formData) {

    var errorText = "";
    var isAnyError = false;

    if (formData.farmer == "") {
        errorText = "Please select a Farmer."
        isAnyError = setError("selectFarmer");

    } else if (formData.weight == "" || formData.weight == 0) {
        errorText = "Please insert the weight."
        isAnyError = setError("inputWeight");

    } else if (branchDetails.totalMonthlyPaddyLimitPerFarmer != 0 &&
        (Number(formData.weight) > Number(farmerRemainingLimit))) {
        errorText = "Weight should not exceed Farmer's Remaining limit."
        isAnyError = setError("inputWeight");
    }

    if (isAnyError) {
        $('#errorAlert').text(errorText);
        $('#errorAlert').removeClass("d-none");
    }
    return isAnyError;
}

function setError(element) {
    $("#" + element).addClass("border-danger");
    $("#" + element).focus();
    return true;
}

function clearValidations() {

    $('#selectFarmer').removeClass("border-danger");
    $('#inputWeight').removeClass("border-danger");
    $('#errorAlert').text("");
    $('#errorAlert').addClass("d-none");
}

function setRequestData(formData) {

    var curDate = new Date();
    var curDate = curDate.getDate() + '-' + (curDate.getMonth() + 1) + '-' + curDate.getFullYear();
    formData.farmer = JSON.parse(formData.farmer);

    paddyPurchase = {
        date: curDate,
        weight: formData.weight,
        farmerId: formData.farmer.id,
        branchId: branchDetails.id,
        paymentAmount: purchaseTotalAmount,
        paddyPriceId: paddyPrices.id
    }
}

$('#btnGeneralModalOkay').click(function () {
    loadDetails();
});

function resetForm() {
    $('#selectFarmer').val("");
    $('#inputWeight').val(0);
    $('#spanTotalAmount').text("00.00");
    $('#spanFarmerMonthlyPaddy').text("0.00");
    $('#spanFarmerAvailablePaddy').text("0.00");

}

function showGeneralModal(type, response) {

    if (type == "error") {

        $('#generalModalHeaderSuccess').addClass("d-none");
        $('#generalModalHeaderError').removeClass("d-none");
        $('#generalModalText').text(response.responseJSON.error + ".");

    } else {

        $('#generalModalHeaderSuccess').removeClass("d-none");
        $('#generalModalHeaderError').addClass("d-none");
        $('#generalModalText').text("Paddy purchase saved.");
    }

    $('#generalModal').modal('show');
}

function setupTableData(data) {

    var tableRows = [];

    for (const row of data) {

        var tableRow = {
            purchaseId: row.id,
            farmer: row.farmer.name,
            weight: row.weight.toFixed(2).toLocaleString() + " KG",
            date: row.date,
            payment: formatCurrency(row.payment.amount),
            status: row.payment.status
        }

        tableRows.push(tableRow)
    }

    $("#purchasePaddyTable tbody").empty();

    for (const tableRow of tableRows) {

        var statusClass = "badge-success";
        if (tableRow.status != "Completed") {
            statusClass = "badge-warning";
        }

        var tr = "" +
            "<tr>" +
            "<td>" + tableRow.purchaseId + "</td>" +
            "<td>" + tableRow.farmer + "</td>" +
            "<td>" + tableRow.weight + "</td>" +
            "<td>" + tableRow.date + "</td>" +
            "<td>" + tableRow.payment + " LKR</td>" +
            "<td><span class=\"badge " + statusClass + " \">" + tableRow.status + "</span></td>" +
            "</tr>";

        $('#purchasePaddyTable tbody').append(tr);
    }

    if (tableRows.length == 0) {
        var div = "" +
            "<tr> <td colspan='6' class='font-weight-bold pt-5 text-lg'> No Puchases to show </td> </tr>";

        $('#purchasePaddyTable tbody').append(div);
    }
}

function formatCurrency(value) {
    value = value.toFixed(2);
    var parts = value.split(".");
    parts[0] = Number(parts[0]).toLocaleString();
    return parts[0] + "." + parts[1];
}
