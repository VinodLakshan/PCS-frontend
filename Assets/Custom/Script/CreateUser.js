
baseUrl = "http://localhost:9091/pcs";

$(document).ready(function () {

    GetRequest("common/rolesAndBranches", loadRolesAndBranchesSuccess);

});

function loadRolesAndBranchesSuccess(response) {
    for (const role of response.roles) {
        $('#selectRole').append(new Option(role.roleName, role.id));
    }

    for (const branch of response.branches) {
        $('#selectBranch').append(new Option(branch.address, branch.id));
    }
}

$('#addEmployee').click(function () {
    clearValidations();
    var formData = $('#formCreate').serializeObject();
    var isAnyError = registerValidation(formData);

    if (!isAnyError) {
        var requestData = setRequestData(formData);
        PostRequest("employee/register", requestData, registerEmployeeSuccess);

    }
});

var registerValidation = function (formData) {

    var errorText = "";
    var isAnyError = false;

    if (formData.name == "") {
        errorText = "Please provide a name"
        isAnyError = setError("inputName");

    } else if (formData.username == "") {
        errorText = "Please provide a username"
        isAnyError = setError("inputUserName");

    } else if (formData.telephoneNumber == "") {
            errorText = "Please provide a Telephone Number"
            isAnyError = setError("inputTelephoneNumber");

    } else if (formData.address == "") {
    errorText = "Please provide an Address"
    isAnyError = setError("inputAddress");

    } else if (formData.role == "") {
        errorText = "Please select a role"
        isAnyError = setError("selectRole");

    } else if (formData.branch == "") {
        errorText = "Please select a branch"
        isAnyError = setError("selectBranch");

    } else if (formData.password !== formData.repeatPassword) {
        errorText = "Passwords mismatched"
        isAnyError = setError("inputRepeatPassword");
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
    $('#inputUserName').removeClass("border-danger");
    $('#telephonenNumber').removeClass("border-danger");
    $('#address').removeClass("border-danger");
    $('#selectBranch').removeClass("border-danger");
    $('#selectRole').removeClass("border-danger");
    $('#inputPassword').removeClass("border-danger");
    $('#inputRepeatPassword').removeClass("border-danger");
    $('#errorAlert').text("");
    $('#errorAlert').addClass("d-none");
}

var setRequestData = function (formData) {

    var employee = {
        name: formData.name,
        userName: formData.username,
        telephoneNumber: formData.telephoneNumber,
        address: formData.address,
        password: formData.password,
        role: {
            id: formData.role
        },
        branch: {
            id: formData.branch
        }
    }

    return employee;
}

function registerEmployeeSuccess(response) {
    sessionStorage.setItem("employee", JSON.stringify(response.data));
    sessionStorage.setItem("branch", JSON.stringify(response.data.branch));
    sessionStorage.setItem("token", response.token);

    PopUpWithTitleAndText("Success","New User Created","success");

    setTimeout(function()
    {
        window.location.href = "UserManagement.html";
    }, 2000);


}