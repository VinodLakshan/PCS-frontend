baseUrl = "http://localhost:9091/pcs";

$('#btnLogin').click(function () {
    var formdata = $('#formLogin').serializeObject();
    if(!validateFields(formdata)) {
        PostRequest("employee/login", formdata, loginSeccess);
    }
});

function validateFields(formData) {
    clearValidations();
    var errorText = "";
    var isAnyError = false;

    if (formData.userName == null || formData.userName == "") {
        errorText = "Please provide the username."
        isAnyError = setError("inputUserName");

    } else if (formData.password == null || formData.password == "") {
        errorText = "Please provide the password"
        isAnyError = setError("inputPassword");

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

    $('#inputUserName').removeClass("border-danger");
    $('#inputPassword').removeClass("border-danger");
    $('#errorAlert').text("");
    $('#errorAlert').addClass("d-none");
}

function loginSeccess(response) {
    sessionStorage.setItem("employee", JSON.stringify(response.data));
    sessionStorage.setItem("branch", JSON.stringify(response.data.branch));
    sessionStorage.setItem("token", response.token);
    window.location.href = "Dashboard.html";
}
