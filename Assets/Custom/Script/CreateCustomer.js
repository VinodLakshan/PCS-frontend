baseUrl = "http://localhost:9091/pcs";


$(document).ready(function () {

    GetRequest("common/rolesAndBranches", customerSuccess);

});

function customerSuccess(response) {
    for (const branch of response.branches) {
        $('#selectBranch').append(new Option(branch.address, branch.id));
    }
}


$('#addCustomer').click(function () {
    clearValidations();
    var formData = $('#formCreate').serializeObject();
    var isAnyError = registerValidation(formData);

    if (!isAnyError) {
        var requestData = setRequestData(formData);
        PostRequest("customer", requestData, registerCustomerSuccess);

    }
});

var registerValidation = function (formData) {

    var errorText = "";
    var isAnyError = false;

    if (formData.name == "") {
        errorText = "Please Provide a Name"
        isAnyError = setError("inputName");

    } else if (formData.address == "") {
        errorText = "Please Provide a Address"
        isAnyError = setError("address");

    } else if (formData.branch == "") {
        errorText = "Please select a Branch"
        isAnyError = setError("selectBranch");
    }

    if (isAnyError) {
        $('#errorAlert').text(errorText);
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

    $('#inputName').removeClass("border-danger");
    $('#address').removeClass("border-danger");
    $('#selectBranch').removeClass("border-danger");
    $('#errorAlert').text("");
    $('#errorAlert').addClass("d-none");
}

var setRequestData = function (formData) {

    var customer = {
        name: formData.inputName,
        address: formData.address,
        branch: {
            id: formData.branch
        }
    }

    return customer;
}

function registerCustomerSuccess(response) {
    sessionStorage.setItem("branch", JSON.stringify(response.data.branch));
    window.location.href = "CustomerManagement.html";
        alert("New Customer Created");
}
