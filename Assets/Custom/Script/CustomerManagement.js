var branchID;
$(document).ready(function ()
{
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

//function SuccessFarmerGet(Response)
//{
//    console.log(Response);
//}

function SuccessCustomerGet(Response)
{
    $("#customerTable tbody").empty();
    console.log(Response);
    for(let count = 0; count < Response.length; count++){
        $('#customerTable').append('<tr>'+
                                          '<td scope="row">'+ "F0" + Response[count].id +'</td>'+
                                          '<td>'+Response[count].name+'</td>'+
                                          '<td>'+ Response[count].address +'</td>'+
                                          '<td>'+ Response[count].branch.address+'</td>'+
                                          '<td>'+
                                          '<a  href="javascript:void(0);" data-toggle="modal" data-target="#VerifyModal">'+
                                                                                           '<button  type="submit" class="btn btn-sm btn-success w-75">'+
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
}

function DeleteCustomer(customerId) {

    DeleteRequest("customer/"+customerId, {},SuccessCustomerDelete);

}

function SuccessCustomerDelete()
{
    console.log("Deleted");
    GetCustomers();

}




