$(document).ready(function ()
{
    GetPaddyPrice();
    GetFarmersCount();
    GetAllBranch();
})

function GetFarmersCount()
{
    GetRequest("farmer/count",SuccessGetFarmersCount);

    // let Entity = new User("testr","gfdf");
    // PostRequest("employee/login",Entity,SuccesLogin)
}

// function SuccesLogin(Response)
// {
//
// }
function GetAllBranch()
{
    GetRequest("branch",SuccessAllBranchGet);
}

function SuccessAllBranchGet(Response)
{
    if(Response.status === "OK")
    {
        _Branches = Response.data;
        let BarString = "";
        for(let Branch of Response.data)
        {
            let Percentage = (Branch.stock/Branch.maximumCapacity)*100;
            BarString = '<div class="mb-3">' +
                '                             <div class="small text-gray-500">'+ Branch.address +'' +
                '                                 <div class="small float-right"><b>'+ Branch.stock +' of '+ Branch.maximumCapacity +' Kg</b></div>\n' +
                '                             </div>' +
                '                             <div class="progress" style="height: 12px;">' +
                '                                 <div class="progress-bar bg-info" role="progressbar" style="width: '+ Percentage +'%" aria-valuenow="'+ Branch.stock +'"\n' +
                '                                   aria-valuemin="0" aria-valuemax="'+ Branch.maximumCapacity +'"></div>' +
                '                             </div>' +
                '                        </div>';
            $('#BranchStockBar').append(BarString);
        }
    }
    //console.log(Response)
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