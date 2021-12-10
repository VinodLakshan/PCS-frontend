baseUrl = "http://localhost:9091/pcs";

var branchID;

$(document).ready(function () {

    GetRequest("common/rolesAndBranches", employeeSuccess);

    var branch =  JSON.parse(sessionStorage.getItem("branch"));
    // console.log(branch);
    branchID = branch.id;

});

function employeeSuccess(response) {
    for (const branch of response.branches) {
        $('#selectBranch').append(new Option(branch.address, branch.id));
    }
}


$('#updateEmployee').click(function () {
    clearValidations();
    var formData = $('#formUpdate').serializeObject();
    var isAnyError = updateValidation(formData);

    if (!isAnyError) {
        var requestData = setRequestData(formData);
        UpdateRequest("employee/getByBranchID/"+branchID, requestData, updateEmployeeSuccess);

    }
});

$('#cancelUpdate').click(function () {

        window.location.href = "UserManagement.html";

});

var updateValidation = function (formData) {

    var errorText = "";
    var isAnyError = false;

    if (formData.inputName == "") {
        errorText = "Please Provide a Name"
        isAnyError = setError("inputName");

    } else if (formData.nicNumber == "") {
        errorText = "Please Provide a NIC Number"
        isAnyError = setError("inputNICNumber");

    } else if (formData.telephoneNumber == "") {
            errorText = "Please Provide a Telephone Number"
            isAnyError = setError("telephoneNumber");

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
    $('#nicNumber').removeClass("border-danger");
    $('#telephoneNumber').removeClass("border-danger");
    $('#address').removeClass("border-danger");
    $('#selectBranch').removeClass("border-danger");
    $('#errorAlert').text("");
    $('#errorAlert').addClass("d-none");
}

var setRequestData = function (formData) {

    var employee = {
        name: formData.inputName,
        nicNumber: formData.nicNumber,
        telephoneNumber: formData.telephoneNumber,
        address: formData.address,
        branch: {
            id: formData.branch
        }
    }

    return employee;
}

function updateEmployeeSuccess(response) {
    sessionStorage.setItem("branch", JSON.stringify(response.data.branch));
    window.location.href = "UserManagement.html";
    alert("Employee Details Updated");
}
