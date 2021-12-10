//***** Variables *****//
let _Branches = [];
let _PaddyPrice = [];
let _TransferRequest = [];
let _SelectedTransferReq;

$(document).ready(function ()
{
    GetAllBranch();
    GetPaddyPrice();
    GetAllPaddyTransferRequest();
    GetAllVehicle();
})

function GetPaddyPrice()
{
    GetRequest("paddyPrice/TodayPaddyPriceGet",SuccessPaddyPriceGet);
}

function SuccessPaddyPriceGet(Response)
{
    _PaddyPrice = Response;
}

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

            $('#DrpBranch').append('<option value="'+ Branch.id +'"> '+ Branch.address +' </option>');
            $('#RegionTo').append('<option value="'+ Branch.id +'"> '+ Branch.address +' </option>');
        }
    }
    //console.log(Response)
}

function CalculateTotalPrice()
{
    let Weight = $('#Quantity').val().trim();
    $('#TotalPrice').val(Weight * _PaddyPrice.sellingPrice);
}

function CmdSubmitSale()
{
    let CustomerName = $('#CustomerName').val().trim();
    let Weight = $('#Quantity').val().trim();
    let BranchId = $('#DrpBranch').val();

    if(ValidateName(CustomerName))
    {
        if(Weight < _Branches[_Branches.findIndex(Branch => Branch.id === parseInt(BranchId))].stock || Weight>0)
        {
            let Entity = new PaddySale(null, Weight, new PaddyPrice(_PaddyPrice.id),new Branch(BranchId),new Customer(CustomerName), new Payment(Weight * _PaddyPrice.sellingPrice));
            // console.log(Entity);
            PostRequest("paddySelling/Save", Entity, SuccessSaleSave);
        }
        else
            PopUpWithTitleAndText("Invalid Quantity", "Quantity Cannot Be More Than Stock Available Or Zero", "warning");
    }
    else
        PopUpWithTitleAndText("Invalid Name", "Name Cannot Be Empty Or Contain Any Special Characters", "warning");
}

function SuccessSaleSave(Response)
{
    // console.log(Response);
    if(Response.status === "OK")
    {
        $('.salesField').val("");
        PopUpWithTitleAndText("Sales Success", "", "success");
    }
    else
        PopUpWithTitleAndText("Failed","" ,"error");
}

function GetAllPaddyTransferRequest()
{
    GetRequest("PaddyTransfer",SuccessGetAllTransfer);
}

function SuccessGetAllTransfer(Response)
{
    if(Response.status === "OK")
    {
        _TransferRequest = Response.data;
        for(let Request of Response.data)
        {
            if(Request.status === 0)
            {
                $('#TblBodyPaddyTransfer').append('<tr>' +
                    '<td>'+ Request.date +'</td>' +
                    '<td>'+ Request.branch.address +'</td>' +
                    '<td>'+ Request.stock +' Kg</td>' +
                    '<td><button onclick="CmdTransferProceed(this)" id="'+ Request.id +'" class="btn btn-sm btn-primary">Proceed</button></td>' +
                    '</tr>');
            }
        }
    }
}

function CmdTransferProceed(Dom)
{
    $('#TblBodyPaddyTransfer').css('background-color','#fff');
    $(Dom).parent().parent().css('background-color','#eee');

    let Id = Dom.id;
    let Index = _TransferRequest.findIndex(Req => Req.id === parseInt(Id));
    _SelectedTransferReq = _TransferRequest[Index];

    $('#TransportQuantity').val(_TransferRequest[Index].stock);
    $('#TransportFromBranch').val(_TransferRequest[Index].branch.address);
}

function GetAllVehicle()
{
    GetRequest("Vehicle",SuccessVehiclesGet);
}

function SuccessVehiclesGet(Response)
{
    if(Response.status === "OK")
    {
        for(let Vehicle of Response.data)
        {
            $('#Vehicle').append('<option value="'+ Vehicle.id +'"> '+ Vehicle.vehicleNumber +' </option>');
        }
    }
}

function CmdCompleteTransfer()
{
    let ToBranch = parseInt($('#RegionTo').val());
    let Vehicle = parseInt($('#Vehicle').val());

    if(_SelectedTransferReq.branch.id === ToBranch)
    {
        PopUpWithTitleAndText("Invalid Request","Cannot Transfer To Same Branch","warning");
    }
    else
    {
        _SelectedTransferReq.toBranch = new Branch(ToBranch);
        _SelectedTransferReq.vehicle = new Vehicles(Vehicle);
        _SelectedTransferReq.status = 1;

        PutRequest("PaddyTransfer",_SelectedTransferReq,SuccessUpdateTransfer);
    }
}

function SuccessUpdateTransfer(Response)
{
    if(Response.status === "OK")
    {
        $('#TblBodyPaddyTransfer').html("");
        GetAllPaddyTransferRequest();
        $('.transferField').val("");
        $('#BranchStockBar').html("");
        $('#DrpBranch').html("");
        $('#RegionTo').html("");
        GetAllBranch();
    }
    else
    {

    }
}