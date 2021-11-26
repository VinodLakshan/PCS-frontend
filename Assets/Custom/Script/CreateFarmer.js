let BaseURL = "http://localhost:9091/pcs";

$('#addFarmer').click(function (){
    var formdata = $('#formCreate').serializeObject();
    $.ajax({
        type: "POST",
        url:  baseUrl + "/farmer",
        data: JSON.stringify(formdata),
        contentType: "application/json",
        success: function (response) {

        },
        error: function (response) {
            if (response.status == 403){
                $('#alertError').text(response.responseJSON.message)
                $('#alertError').removeClass("d-none");
            }
        }
    });
});
