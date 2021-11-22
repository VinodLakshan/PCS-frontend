baseUrl = "http://localhost:8080/pcs";

$('#btnLogin').click(function (){
    var formdata = $('#formLogin').serializeObject();
    $.ajax({
        type: "POST",
        url:  baseUrl + "/employee/login",
        data: JSON.stringify(formdata),
        contentType: "application/json",
        success: function (response) {
            sessionStorage.setItem("employee", JSON.stringify(response.data));
            sessionStorage.setItem("token", response.token);
            window.location.href = "Dashboard.html";
        },
        error: function (response) {
            if (response.status == 403){
                $('#alertError').text(response.responseJSON.message)
                $('#alertError').removeClass("d-none");
            }
        }
    });
});
