baseUrl = "http://localhost:8080/pcs";

$('#btnLogin').click(function (){
    var formData = $('#formLogin').serializeObject();
    $.ajax({
        type: "POST",
        url:  baseUrl + "/employee/login",
        data: JSON.stringify(formData),
        contentType: "application/json",
        success: function (response) {
            sessionStorage.setItem("employee", JSON.stringify(response.data));
            sessionStorage.setItem("branch", JSON.stringify(response.data.branch));
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


