baseUrl = "http://localhost:8080/pcs";

$(document).ready(function () {

    $.ajax({
        type: "GET",
        url: baseUrl + "/common/rolesAndBranches",
        async: true,
        contentType: "application/json",
        success: function (response) {
            for (const role of response.roles) {
                $('#selectRole').append(new Option(role.roleName, role.id));
            }

            for (const branch of response.branches) {
                $('#selectBranch').append(new Option(branch.address, branch.id));
            }
        },
        error: function (error) {
            console.log("Error loading roles and branches");
        }
    });
});

$('#btnRegister').click(function () {
    clearValidations();
    var formData = $('#formRegister').serializeObject();
    var isAnyError = registerValidation(formData);

    if (!isAnyError) {
        var requestData = setRequestData(formData);
        $.ajax({
            type: "POST",
            url:  baseUrl + "/employee/register",
            data: JSON.stringify(requestData),
            contentType: "application/json",
            success: function (response) {
                sessionStorage.setItem("employee", JSON.stringify(response.data));
                sessionStorage.setItem("token", response.token);
                window.location.href = "Dashboard.html";
            },

            error: function (response) {
                console.log(response);
                $('#errorAlert').text(response.responseJSON.message);
                $('#errorAlert').removeClass("d-none");
            }
        });


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
    $('#selectRole').removeClass("border-danger");
    $('#selectBranch').removeClass("border-danger");
    $('#inputPassword').removeClass("border-danger");
    $('#inputRepeatPassword').removeClass("border-danger");
    $('#errorAlert').text("");
    $('#errorAlert').addClass("d-none");
}

var setRequestData = function (formData) {

    var employee = {
        name : formData.name,
        userName : formData.username,
        password : formData.password,
        role : {
            id : formData.role
        },
        branch : {
            id : formData.branch
        }
    }

    return employee;
}
