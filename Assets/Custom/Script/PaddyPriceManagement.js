function UpdateSellingPrice(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let newSellingPrice = $('#NewSellingPrice').val();
    let buyingPrice = $('#CurrentBuyingPrice').val();
    let entity = new PaddyPrice( date, buyingPrice, newSellingPrice);

    PostRequest("paddyPrice/PaddyPriceSave",entity,SuccessPaddySellingPriceSave)
}
function SuccessPaddySellingPriceSave(Response){
    console.log(Response);
}
function UpdateBuyingPrice(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let newBuyingPrice = $('#NewBuyingPrice').val();
    let sellingPrice = $('#CurrentSellingPrice').val();
    let entity = new PaddyPrice( date, sellingPrice, newBuyingPrice);

    PostRequest("paddyPrice/PaddyPriceSave",entity,SuccessPaddyBuyingPriceSave)
}
function SuccessPaddyBuyingPriceSave(Response){
    console.log(Response);
}