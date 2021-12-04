var branchID;
$(document).ready(function ()
{
    var branch =  JSON.parse(sessionStorage.getItem("branch"));
   // console.log(branch);
     branchID = branch.id;
    //console.log(branchID);
    GetPaddyOrders();

})
function GetPaddyOrders()
{
    GetRequest("paddyPurchase/getByBranchID/"+branchID,SuccessPaddyOrderGet);
}

function SuccessPaddyOrderGet(Response)
{
    console.log(Response);
    for(let count = 0; count < Response.length; count++){
        $('#PaddyOrdertable').append('<tr>'+
                                          '<td scope="row">'+ Response[count].id +'</td>'+
                                          '<td>'+Response[count].farmer.name+'</td>'+
                                          '<td>'+ Response[count].date +'</td>'+
                                          '<td>'+ Response[count].weight+'</td>'+
                                          '<td>'+ Response[count].paddyPrice.buyingPrice+'</td>'+
                                          '<td>'+ (Response[count].paddyPrice.buyingPrice)*(Response[count].weight) +'</td>'+
                                          '<td>'+
                                              '<a  href="javascript:void(0);" data-toggle="modal" data-target="#VerifyModal">'+
                                                 '<button  type="submit" class="btn btn-danger">'+
                                                      'Print Pay Order'+
                                                  '</button>'+
                                              '</a>'+
                                          '</td>'+

                                      '</tr>')
    }
}


