var branchID;
$(document).ready(function ()
{
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
                                                                                           '<button  type="submit" class="btn btn-sm btn-success w-75">'+
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
}

function DeleteFarmer(farmerId) {

    DeleteRequest("farmer/"+farmerId, {},SuccessFarmerDelete);

}

function SuccessFarmerDelete()
{
    console.log("Deleted");
    GetFarmers();

}




