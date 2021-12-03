let selectedCustomer = sessionStorage.getItem("selectedCustomer");

var branchID;
var customers = [];

$(document).ready(function ()
{
    GetRequest("common/rolesAndBranches", customerSuccess);
    var branch =  JSON.parse(sessionStorage.getItem("branch"));
   // console.log(branch);
    branchID = branch.id;
    //console.log(branchID);
    GetCustomers();
//    populateTable();
})
function GetCustomers()
{
    GetRequest("customer/getByBranchID/"+branchID,SuccessCustomerGet);
}

//function populateTable(){
//
//}


//{
//    console.log(Response);
//}

function SuccessCustomerGet(Response)
{
    $("#customerTable tbody").empty();
    console.log(Response);
    for(let count = 0; count < Response.length; count++){
        $('#customerTable').append('<tr>'+
                                          '<td scope="row">'+ "C0" + Response[count].id +'</td>'+
                                          '<td>'+Response[count].name+'</td>'+
                                          '<td>'+ Response[count].address +'</td>'+
                                          '<td>'+ Response[count].branch.address+'</td>'+
                                          '<td>'+
                                          '<a  href="javascript:void(0);" data-toggle="modal" data-target="#VerifyModal">'+
                                                                                           '<button  type="submit" class="btn btn-sm btn-success w-75" onClick="UpdateCustomer('+ Response[count].id +')">'+
                                                                                                'Edit'+
                                                                                            '</button>'+
                                                                                        '</a>'+
                                          '</td>'+
                                          '<td>'+
                                              '<a  href="javascript:void(0);" data-toggle="modal" data-target="#VerifyModal">'+
                                                 '<button  type="submit" class="btn btn-sm btn-danger w-75" id="deleteBtn" onClick="DeleteCustomer('+ Response[count].id +')">'+
                                                      'Delete   '+
                                                  '</button>'+
                                              '</a>'+
                                          '</td>'+

                                      '</tr>')

    }

    customers = Response;
    if (Response.length > 0 && selectedCustomer != undefined) {
        let Index = customers.findIndex(Cus => Cus.id === parseInt(selectedCustomer));
        if (Index > -1) {
            $('#inputName').val(customers[Index].name);
            $('#address').val(customers[Index].address);
        }
    }

}

function DeleteCustomer(customerId) {

    DeleteRequest("customer/"+customerId, {},SuccessCustomerDelete);

}

function SuccessCustomerDelete()
{
    console.log("Deleted");
    GetCustomers();
}


//Update Functions

function UpdateCustomer(customerId) {

    sessionStorage.setItem("selectedCustomer", customerId);
    window.location.href = "EditCustomer.html";

}

function customerSuccess(response) {
    for (const branch of response.branches) {
        $('#selectBranch').append(new Option(branch.address, branch.id));
    }

    $('#selectBranch').val(branchID);
}


$('#updateCustomer').click(function () {
    clearValidations();
    var formData = $('#formUpdate').serializeObject();
    var isAnyError = updateValidation(formData);

    if (!isAnyError) {
        let requestData = setRequestData(formData);

        requestData.branch.id = branchID;
        requestData.id = selectedCustomer;
        console.log(requestData);
        UpdateRequest("customer", requestData, updateCustomerSuccess);

    }
});

$('#cancelUpdate').click(function () {

        window.location.href = "CustomerManagement.html";

});

var updateValidation = function (formData) {

    var errorText = "";
    var isAnyError = false;

    if (formData.inputName == "") {
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

function updateCustomerSuccess(response) {
    sessionStorage.setItem("branch", JSON.stringify(response.data.branch));

    PopUpWithTitleAndText("Success","Customer Details Updated","success");

    setTimeout(function()
    {
        window.location.href = "CustomerManagement.html";
    },2000);

}







