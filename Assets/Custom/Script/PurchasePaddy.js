baseUrl = "http://localhost:8080/pcs";

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

        branchDetails = sessionStorage.getItem("branch");
        branchDetails = JSON.parse(branchDetails);

        if (employee.role.roleName == "Collection_Officer") {
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

var loadDetails = function () {

    $.ajax({
        type: "GET",
        url: baseUrl + "/paddyPrice/TodayPaddyPriceGet",
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ` + sessionStorage.getItem("token"),
        },
        success: function (response) {
            paddyPrices = response;
        },
        error: function (error) {
            console.log("Error loading latest Paddy prices");
        }
    });

    $.ajax({
        type: "GET",
        url: baseUrl + "/branch/" + branchDetails.id,
        contentType: "application/json",
        success: function (response) {
            branchDetails = response.data;
            loadInfoCardDetails();
        },
        error: function (error) {
            console.log("Error loading Branch details");
        }
    });

    $.ajax({
        type: "GET",
        url: baseUrl + "/farmer",
        contentType: "application/json",
        success: function (response) {
            var farmers = response.data;
            $('#selectFarmer').find('option').not(':first').remove();
            for (const farmer of farmers) {
                $('#selectFarmer').append(new Option(farmer.name + " - " + farmer.registrationNumber, JSON.stringify(farmer)));
            }
        },
        error: function (error) {
            console.log("Error loading Farmers");
        }
    });

    $.ajax({
        type: "GET",
        url: baseUrl + "/paddy/" + branchDetails.id,
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ` + sessionStorage.getItem("token"),
        },
        success: function (response) {
            setupTableData(response.data);
        },
        error: function (error) {

            if (error.status == 401) {
                $('#userModel').modal({
                    backdrop: 'static',
                    keyboard: false
                });

            } else {
                console.log("Error loading Paddy Purchases");
            }
        }
    });
}

var loadInfoCardDetails = function () {
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

    $.ajax({
        type: "POST",
        url: baseUrl + "/paddy",
        async: true,
        contentType: "application/json",
        headers: {
            'Authorization': `Bearer ` + sessionStorage.getItem("token"),
        },
        data: JSON.stringify(paddyPurchase),
        success: function (response) {

            showGeneralModal("success", "");
            resetForm();
        },
        error: function (error) {

            if (error.status == 401) {
                $('#userModel').modal({
                    backdrop: 'static',
                    keyboard: false
                })

            } else if (error.status == 403) {
                $('#unauthorizedModel').modal({
                    backdrop: 'static',
                    keyboard: false
                });

            } else {
                showGeneralModal("error", error);
            }
        }
    });
});

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

var validateFields = function (formData) {

    var errorText = "";
    var isAnyError = false;

    if (formData.farmer == "") {
        errorText = "Please select a Farmer."
        isAnyError = setError("selectFarmer");

    } else if (formData.weight == "" || formData.weight == 0) {
        errorText = "Please insert the weight."
        isAnyError = setError("inputWeight");

    } else if (branchDetails.totalMonthlyPaddyLimitPerFarmer != 0 && formData.weight > farmerRemainingLimit) {
        errorText = "Weight should not exceed Farmer's Remaining limit."
        isAnyError = setError("inputWeight");
    }

    if (isAnyError) {
        $('#errorAlert').removeClass("d-none");
    }
    return isAnyError;
}

var setError = function (element) {
    $("#" + element).addClass("border-danger");
    $("#" + element).focus();
    return true;
}

var clearValidations = function () {

    $('#selectFarmer').removeClass("border-danger");
    $('#inputWeight').removeClass("border-danger");
    $('#errorAlert').text("");
    $('#errorAlert').addClass("d-none");
}

var setRequestData = function (formData) {

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

var resetForm = function () {
    $('#selectFarmer'). val("");
    $('#inputWeight').val(0);
    $('#spanTotalAmount').text("00.00");
    $('#spanFarmerMonthlyPaddy').text("0.00");
    $('#spanFarmerAvailablePaddy').text("0.00");

}

var showGeneralModal = function (type, response) {

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

var setupTableData = function (data) {

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

var formatCurrency = function (value) {
    value = value.toFixed(2);
    var parts = value.split(".");
    parts[0] = Number(parts[0]).toLocaleString();
    return parts[0] + "." + parts[1];
}
