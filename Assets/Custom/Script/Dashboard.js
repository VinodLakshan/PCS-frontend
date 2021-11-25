$(document).ready(function ()
{
    GetPaddyPrice();
    GetFarmersCount();
})

function GetFarmersCount()
{
    GetRequest("farmer/count",SuccessGetFarmersCount);
}

function SuccessGetFarmersCount(Response)
{
    if(Response.status === "OK")
        $('#FarmersCount').html(Response.data);
    else
        $('#FarmersCount').html("---");
}

function GetPaddyPrice()
{
    GetRequest("paddyPrice/TodayPaddyPriceGet",SuccessPaddyPriceGet);
}

function SuccessPaddyPriceGet(Response)
{
    console.log(Response);
    if(Response.length !== 0)
    {
        $('#SellingPrice').html(Response.sellingPrice);
        $('#PurchasePrice').html(Response.buyingPrice);
    }
    else
    {
        $('#SellingPrice').html("---");
        $('#PurchasePrice').html("---");
    }
}