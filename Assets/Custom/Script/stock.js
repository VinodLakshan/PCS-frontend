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
    console.log(Response);
    if(Response.length !== 0)
    {

        $('#TotalCurrentStock').html(Response.data.stock);
        $('#AvailableStockCapacity').html((Response.data.maximumCapacity)-(Response.data.stock));

    }
    else
    {

        $('#CurrentBuyingPrice').val(0);
        $('#CurrentSellingPrice').val(0);
    }
}