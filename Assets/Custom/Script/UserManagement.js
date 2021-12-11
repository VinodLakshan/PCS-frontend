let selectedEmployee = sessionStorage.getItem("selectedEmployee");

var branchID;
var employees = [];

$(document).ready(function ()
{
    GetRequest("common/rolesAndBranches", employeeSuccess);
    var branch =  JSON.parse(sessionStorage.getItem("branch"));
   // console.log(branch);
    branchID = branch.id;
    //console.log(branchID);
    GetEmployee();
//    populateTable();
})
function GetEmployee()
{
    GetRequest("employee/getByBranchID/"+branchID,SuccessEmployeeGet);
}

//function populateTable(){
//
//}

function SuccessEmployeeGet(Response)
{
    console.log(Response);
}

function SuccessEmployeeGet(Response)
{
    $("#employeeTable tbody").empty();
    console.log(Response);
    for(let count = 0; count < Response.length; count++){
        $('#employeeTable').append('<tr>'+
                                          '<td scope="row">'+ "U0" + Response[count].id +'</td>'+
                                          '<td>'+Response[count].name+'</td>'+
                                          '<td>'+ Response[count].userName +'</td>'+
                                          '<td>'+ Response[count].branch.address+'</td>'+
                                          '<td>'+ Response[count].role.roleName+'</td>'+
                                          '<td>'+
                                              '<a  href="javascript:void(0);" data-toggle="modal" data-target="#VerifyModal">'+
                                                 '<button  type="submit" class="btn btn-sm btn-danger w-75" onClick="DeleteEmployee('+ Response[count].id +')">'+
                                                      'Delete   '+
                                                  '</button>'+
                                              '</a>'+
                                          '</td>'+

                                      '</tr>')
    }

        employees = Response;
        if (Response.length > 0 && selectedEmployee != undefined) {
            let Index = employees.findIndex(Emp => Emp.id === parseInt(selectedEmployee));
            if (Index > -1) {
                $('#inputName').val(employees[Index].name);
                $('#inputUserName').val(employees[Index].userName);
                $('#telephoneNumber').val(employees[Index].telephoneNumber);
                $('#address').val(employees[Index].telephoneNumber);
                $('#inputPassword').val(employees[Index].telephoneNumber);
                $('#inputRepeatPassword').val(employees[Index].telephoneNumber);
            }
        }

}

function DeleteEmployee(employeeId) {


if (confirm("Are you sure to delete this employee with ID U0" + employeeId + "?")) {

        DeleteRequest("employee/"+employeeId, {},SuccessEmployeeDelete);

    }
}

function SuccessEmployeeDelete()
{
    console.log("Deleted");

    PopUpWithTitleAndText("Success","User Deleted","success");

    setTimeout(function()
    {
        window.location.href = "UserManagement.html";
    },2000);

    GetEmployee();

}



//Update Functions

function UpdateEmployee(employeeId) {

//    DeleteRequest("employee/"+employeeId, {},SuccessEmployeeDelete);
    sessionStorage.setItem("selectedEmployee", employeeId);
    window.location.href = "EditUser.html";

}

function employeeSuccess(response) {
    for (const branch of response.branches) {
        $('#selectBranch').append(new Option(branch.address, branch.id));
    }

    for (const branch of response.branches) {
        $('#selectBranch').append(new Option(branch.address, branch.id));
    }

    $('#selectBranch').val(branchID);
}


$('#updateEmployee').click(function () {
    clearValidations();
    var formData = $('#formUpdate').serializeObject();
    var isAnyError = updateValidation(formData);

    if (!isAnyError) {
        let requestData = setRequestData(formData);

        requestData.branch.id = branchID;
        requestData.id = selectedEmployee;
        console.log(requestData);
        UpdateRequest("employee", requestData, updateEmployeeSuccess);

    }
});

$('#cancelUpdate').click(function () {

        window.location.href = "UserManagement.html";

});

var updateValidation = function (formData) {

    var errorText = "";
    var isAnyError = false;

    if (formData.name == "") {
        errorText = "Please provide a name"
        isAnyError = setError("inputName");

    } else if (formData.username == "") {
        errorText = "Please provide a username"
        isAnyError = setError("inputUserName");

    } else if (formData.username == "") {
        errorText = "Please provide a Telephone Number"
        isAnyError = setError("telephoneNumber");

    } else if (formData.username == "") {
        errorText = "Please provide an Address"
        isAnyError = setError("address");

    } else if (formData.branch == "") {
        errorText = "Please select a branch"
        isAnyError = setError("selectBranch");

    } else if (formData.role == "") {
        errorText = "Please select a role"
        isAnyError = setError("selectRole");

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
        name: formData.name,
        userName: formData.username,
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

function updateEmployeeSuccess(response) {
    sessionStorage.setItem("branch", JSON.stringify(response.data.branch));

    PopUpWithTitleAndText("Success","Employee Details Updated","success");

    setTimeout(function()
    {
        window.location.href = "UserManagement.html";
    },2000);

}





