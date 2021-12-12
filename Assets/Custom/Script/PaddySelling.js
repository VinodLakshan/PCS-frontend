var branchID;
let _selectedPaddySaleId = 0;
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
        if(Response[count].status===0){
         $('#PaddySalesTable').append('<tr>'+
                                                  '<td scope="row">'+ Response[count].id +'</td>'+
                                                  '<td>'+Response[count].customer.name+'</td>'+
                                                  '<td>'+ Response[count].weight+'</td>'+
                                                  '<td>'+ Response[count].paddyPrice.sellingPrice+'</td>'+
                                                  '<td>'+ (Response[count].paddyPrice.buyingPrice)*(Response[count].weight) +'</td>'+
                                                  '<td>'+ Response[count].date +'</td>'+
                                                  '<td>'+

                                                         '<button  type="button" data-toggle="modal" data-target="#VerifyModal" onclick="ConfirmClick('+ Response[count].id+')" class="btn btn-danger">'+
                                                              'Confirm'+
                                                          '</button>'+

                                                  '</td>'+

                                              '</tr>')

        }

    }
}
function ConfirmClick(id)
{
_selectedPaddySaleId = id;


}
function ConfirmPaddySale()
{
let entity = new PaddySaleUpdate(_selectedPaddySaleId,1);
PutRequest("paddySelling",entity,successPaddySaleUpdate);
}
function successPaddySaleUpdate(Response)
{
if(Response.status === "OK"){

           PopUpWithTitleAndText("Success","Paddy Sale Confirmed Successfully","success");
           $('#VerifyModal').modal("hide");
           $('#PaddySalesTable').html("");
           GetPaddySales();

        }
        else
        {
             PopUpWithTitleAndText("Error","Paddy Sale Not Confirmed","error");
        }
}
