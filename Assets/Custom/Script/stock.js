var branchID;
$(document).ready(function ()
{
    var branch =  JSON.parse(sessionStorage.getItem("branch"));
   // console.log(branch);
     branchID = branch.id;
    //console.log(branchID);
    GetStockDetails();

})
function GetStockDetails()
{
    GetRequest("branch/"+branchID,SuccessStockDetailsGet);
}
function SuccessStockDetailsGet(Response)
{
    if(Response.length !== 0)
    {
        $('#TotalCurrentStock').html(Response.data.stock);
        $('#AvailableStockCapacity').html((Response.data.maximumCapacity)-(Response.data.stock));
        $('#BranchId').val(Response.data.address);
    }
    else
    {
        $('#CurrentBuyingPrice').val(0);
        $('#CurrentSellingPrice').val(0);
    }
}

function CmdTransferRequest()
{
    let Capacity = $('#Capacity').val();

    let Entity = new PaddyTransfer(new Branch(branchID),Capacity);
    PostRequest("PaddyTransfer/save", Entity, SuccessReq);
}

function SuccessReq(Response)
{
    if(Response.status === "OK")
    {
        PopUpWithTitleAndText("Success Transfer Request","request has been sent to head branch","success");
        $('#Capacity').val("");
        $('#SendStockCapacity').modal('hide');
    }
}
