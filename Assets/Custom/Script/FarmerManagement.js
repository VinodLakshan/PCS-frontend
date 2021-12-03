let selectedFarmer = sessionStorage.getItem("selectedFarmer");

var branchID;
var farmers = [];

$(document).ready(function ()
{

    GetRequest("common/rolesAndBranches", farmerSuccess);
    var branch =  JSON.parse(sessionStorage.getItem("branch"));
   // console.log(branch);
    branchID = branch.id;
    //console.log(branchID);
    GetFarmers();
//    populateTable();


})
function GetFarmers()
{
    GetRequest("farmer/getByBranchID/"+branchID,SuccessFarmerGet);

}

//function populateTable(){
//
//}

//function SuccessFarmerGet(Response)
//{
//    console.log(Response);
//}

function SuccessFarmerGet(Response)
{
    $("#farmerTable tbody").empty();
    console.log(Response);
    for(let count = 0; count < Response.length; count++){
        $('#farmerTable').append('<tr>'+
                                          '<td scope="row">'+ "F0" + Response[count].id +'</td>'+
                                          '<td>'+Response[count].name+'</td>'+
                                          '<td>'+ Response[count].address +'</td>'+
                                          '<td>'+ Response[count].telephoneNumber+'</td>'+
                                          '<td>'+
                                          '<a  href="javascript:void(0);" data-toggle="modal" data-target="#VerifyModal">'+
                                                                                           '<button type="button" class="btn btn-sm btn-success w-75" onClick="UpdateFarmer('+ Response[count].id +')">'+
                                                                                                'Edit'+
                                                                                            '</button>'+
                                                                                        '</a>'+
                                          '</td>'+
                                          '<td>'+
                                              '<a  href="javascript:void(0);" data-toggle="modal" data-target="#VerifyModal">'+
                                                 '<button  type="submit" class="btn btn-sm btn-danger w-75" id="deleteBtn" onClick="DeleteFarmer('+ Response[count].id +')">'+
                                                      'Delete   '+
                                                  '</button>'+
                                              '</a>'+
                                          '</td>'+

                                      '</tr>')

    }

    farmers = Response;
    if (Response.length > 0 && selectedFarmer != undefined) {
        let Index = farmers.findIndex(Farm => Farm.id === parseInt(selectedFarmer));
        if (Index > -1) {
            $('#inputName').val(farmers[Index].name);
            $('#nicNumber').val(farmers[Index].nicNumber);
            $('#telephoneNumber').val(farmers[Index].telephoneNumber);
            $('#address').val(farmers[Index].address);
        }
    }

}

function DeleteFarmer(farmerId) {

    if (confirm("Are you sure to delete this farmer with ID F0" + farmerId + "?")) {

        DeleteRequest("farmer/"+farmerId, {},SuccessFarmerDelete);

    }

}


function SuccessFarmerDelete()
{
    console.log("Deleted");
    alert("Farmer Deleted")
    GetFarmers();

}



var saveFarmerId;

//Delete From Here

function UpdateFarmer(farmerId) {

//    DeleteRequest("farmer/"+farmerId, {},SuccessFarmerDelete);
    sessionStorage.setItem("selectedFarmer", farmerId);
    window.location.href = "EditFarmer.html";

}

function farmerSuccess(response) {
    for (const branch of response.branches) {
        $('#selectBranch').append(new Option(branch.address, branch.id));
    }

    $('#selectBranch').val(branchID);
}


$('#updateFarmer').click(function () {
    clearValidations();
    var formData = $('#formUpdate').serializeObject();
    var isAnyError = updateValidation(formData);

    if (!isAnyError) {
        let requestData = setRequestData(formData);

        requestData.branch.id = branchID;
        requestData.id = selectedFarmer;
        console.log(requestData);
        UpdateRequest("farmer", requestData, updateFarmerSuccess);

    }
});

$('#cancelUpdate').click(function () {

        window.location.href = "FarmerManagement.html";

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

function updateFarmerSuccess(response) {
    sessionStorage.setItem("branch", JSON.stringify(response.data.branch));

    PopUpWithTitleAndText("Success","Farmer Details Updated","success");

    setTimeout(function()
    {
        window.location.href = "FarmerManagement.html";
    },2000);

}


