var branchID;
$(document).ready(function ()
{
    var branch =  JSON.parse(sessionStorage.getItem("branch"));
   // console.log(branch);
     branchID = branch.id;
    //console.log(branchID);
    GetPaddySales();

})
function GetPaddySales()
{
    GetRequest("paddySelling/getByBranchID/"+branchID,SuccessPaddySalesGet);
}

function SuccessPaddySalesGet(Response)
{
    console.log(Response);
    for(let count = 0; count < Response.length; count++){
        $('#PaddySalesTable').append('<tr>'+
                                          '<td scope="row">'+ Response[count].id +'</td>'+
                                          '<td>'+Response[count].customer.name+'</td>'+
                                          '<td>'+ Response[count].weight+'</td>'+
                                          '<td>'+ Response[count].paddyPrice.sellingPrice+'</td>'+
                                          '<td>'+ (Response[count].paddyPrice.buyingPrice)*(Response[count].weight) +'</td>'+
                                          '<td>'+ Response[count].date +'</td>'+
                                          '<td>'+
                                              '<a  href="javascript:void(0);" data-toggle="modal" data-target="#VerifyModal">'+
                                                 '<button  type="submit" class="btn btn-danger">'+
                                                      'Confirm'+
                                                  '</button>'+
                                              '</a>'+
                                          '</td>'+

                                      '</tr>')
    }
}
