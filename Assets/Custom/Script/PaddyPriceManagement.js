function UpdateSellingPrice(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let newSellingPrice = $('#NewSellingPrice').val();
    let buyingPrice = $('#CurrentBuyingPrice').val();
    let entity = new PaddyPrice1( date, buyingPrice, newSellingPrice);

    if(parseInt(newSellingPrice)>0 && newSellingPrice!=="" && newSellingPrice!==null)
        PostRequest("paddyPrice/PaddyPriceSave",entity,SuccessPaddySellingPriceSave)
    else
        PopUpWithTitleAndText("Warning","Invalid Input","warning");
}
function SuccessPaddySellingPriceSave(Response){
    console.log(Response);

    if(Response.id > 0 )
    {
         $('#NewSellingPrice').val("");
         $('#CurrentSellingPrice').val(Response.sellingPrice);
        PopUpWithTitleAndText("Success","Paddy Selling Price Updated Successfully","success");
    }
    else
    {
         PopUpWithTitleAndText("Error","Paddy Selling Price Not Updated","error");
    }
}
function UpdateBuyingPrice(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let newBuyingPrice = $('#NewBuyingPrice').val();
    let sellingPrice = $('#CurrentSellingPrice').val();
    let entity = new PaddyPrice1( date, newBuyingPrice, sellingPrice );

     if(parseInt(newBuyingPrice)>0 && newBuyingPrice!=="" && newBuyingPrice!==null)
    PostRequest("paddyPrice/PaddyPriceSave",entity,SuccessPaddyBuyingPriceSave)
     else
            PopUpWithTitleAndText("Warning","Invalid Input","warning");
}
function SuccessPaddyBuyingPriceSave(Response){
    console.log(Response);
     if(Response.id > 0 )
        {
             $('#NewBuyingPrice').val("");
             $('#CurrentBuyingPrice').val(Response. buyingPrice);
            PopUpWithTitleAndText("Success","Paddy Buying Price Updated Successfully","success");
        }
        else
        {
             PopUpWithTitleAndText("Error","Paddy Buying Price Not Updated","error");
        }
}