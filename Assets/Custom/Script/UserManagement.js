var branchID;
$(document).ready(function ()
{
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
                                                                                           '<button  type="submit" class="btn btn-sm btn-success w-75">'+
                                                                                                'Edit'+
                                                                                            '</button>'+
                                                                                        '</a>'+
                                          '</td>'+
                                          '<td>'+
                                              '<a  href="javascript:void(0);" data-toggle="modal" data-target="#VerifyModal">'+
                                                 '<button  type="submit" class="btn btn-sm btn-danger w-75" onClick="DeleteEmployee('+ Response[count].id +')">'+
                                                      'Delete   '+
                                                  '</button>'+
                                              '</a>'+
                                          '</td>'+

                                      '</tr>')
    }
}

function DeleteEmployee(employeeId) {

    DeleteRequest("employee/"+employeeId, {},SuccessEmployeeDelete);

}

function SuccessEmployeeDelete()
{
    console.log("Deleted");
    GetEmployee();

}




