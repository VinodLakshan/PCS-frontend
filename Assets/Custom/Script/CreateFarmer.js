var branchID;

$(document).ready(function () {

    GetRequest("common/rolesAndBranches", farmerSuccess);

    var branch =  JSON.parse(sessionStorage.getItem("branch"));
   // console.log(branch);
    branchID = branch.id;
    //console.log(branchID);

//    populateTable();

});



function farmerSuccess(response) {
    for (const branch of response.branches) {
        $('#selectBranch').append(new Option(branch.address, branch.id));

    }

    $('#selectBranch').val(branchID);

}


$('#addFarmer').click(function () {
    clearValidations();
    var formData = $('#formCreate').serializeObject();
    var isAnyError = registerValidation(formData);

    if (!isAnyError) {
        var requestData = setRequestData(formData);
        PostRequest("farmer", requestData, registerFarmerSuccess);

    }
});

var registerValidation = function (formData) {

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

    var farmer = {
        name: formData.inputName,
        nicNumber: formData.nicNumber,
        telephoneNumber: formData.telephoneNumber,
        address: formData.address,
        branch: {
            id: formData.branch
        }
    }

    return farmer;
}

function registerFarmerSuccess(response) {
    sessionStorage.setItem("branch", JSON.stringify(response.data.branch));

    PopUpWithTitleAndText("Success","New Farmer Created","success");

    setTimeout(function()
    {
        window.location.href = "FarmerManagement.html";
    }, 2000);

}
