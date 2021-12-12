var branchID;
let _selectedPaddyOrderId= 0;
let _Orders = [];
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
    _Orders = Response;
    for(let count = 0; count < Response.length; count++){
         if(Response[count].status===0){
        $('#PaddyOrdertable').append('<tr>'+
                                          '<td scope="row">'+ Response[count].id +'</td>'+
                                          '<td>'+Response[count].farmer.name+'</td>'+
                                          '<td>'+ Response[count].date +'</td>'+
                                          '<td>'+ Response[count].weight+'</td>'+
                                          '<td>'+ Response[count].paddyPrice.buyingPrice+'</td>'+
                                          '<td>'+ (Response[count].paddyPrice.buyingPrice)*(Response[count].weight) +'</td>'+
                                          '<td>'+
                                               '<button  type="button" data-toggle="modal" data-target="#PayOrderModal" onclick="PayOrderClick('+ Response[count].id+')" class="btn btn-danger">'+
                                                    'Print Pay Order'+
                                                '</button>'+
                                          '</td>'+

                                      '</tr>')

        }
    }
}
function PayOrderClick(id)
{
_selectedPaddyOrderId = id;


}
function ConfirmPayOrder()
{
let entity = new PaddyOrderUpdate(_selectedPaddyOrderId,1);
PutRequest("paddyPurchase",entity,successPaddyOrderUpdate);


}
function successPaddyOrderUpdate(Response)
{
if(Response.status === "OK"){

           PopUpWithTitleAndText("Success","Farmer Verified Successfully","success");
           $('#PayOrderModal').modal("hide");
           $('#PaddyOrdertable').html("");
           GetPaddyOrders()

        }
        else
        {
             PopUpWithTitleAndText("Error","Verified Unsuccessful ","error");
        }
}
 function generatePDF()
{
    let index = _Orders.findIndex(order => order.id === _selectedPaddyOrderId);
    console.log(_Orders[index]);
    var doc = new jsPDF();

     doc.setFont("helvetica");
     doc.setTextColor(0,0,255);
     doc.setFontSize(30);
     doc.setFontType("bold");
     doc.text(20, 20, '   PAY ORDER');
     doc.line(10, 27, 800, 27, style='FD');

     doc.setFontSize(10);
     doc.setTextColor(0,0,0);
     doc.text(10, 40, 'PAY ORDER ID : #0000'+ _Orders[index].id );
     doc.text(10, 45, 'BRANCH : '+ _Orders[index].branch.address );
     doc.text(10, 50, 'FARMER NAME : '+ _Orders[index].farmer.name );
     doc.text(10, 55, 'PAYMENT BANK : '+ _Orders[index].payment.bank );
     doc.text(10, 60, 'PURCHASE DATE : '+ _Orders[index].date );
     doc.line(10, 75, 800, 75, style='FD');

     doc.setFontSize(15);
     doc.setTextColor(0,0,255);
     doc.text(15, 82,'PURCHASE SUMMARY');
     doc.line(10, 85, 800, 85, style='FD');

     doc.setFontSize(10);
     doc.setTextColor(0,0,0);
     doc.text(15, 91, '   UNIT PRICE                                                 WEIGHT                                                  TOTAL');
     doc.line(10, 95, 600, 95, style='FD');
     doc.text(15, 101, '       '+_Orders[index].paddyPrice.buyingPrice+'RS                                                          '+_Orders[index].weight+'KG                                                   '+_Orders[index].weight *_Orders[index].paddyPrice.buyingPrice+'RS');
     doc.line(10, 105, 600, 105, style='FD');

      doc.setFontSize(12);
      doc.setTextColor(255,0,0);
      doc.text(90, 111, 'TOTAL PAYABLE AMOUNT '+_Orders[index].weight *_Orders[index].paddyPrice.buyingPrice+'RS');
      doc.line(85, 115, 600, 115, style='FD');





    // Save the PDF
    doc.save('PayOrder.pdf');
}



