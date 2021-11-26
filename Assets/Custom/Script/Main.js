//Localhost
let _BaseURL = "http://localhost:9091/pcs/";
let _Token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhcnVuIiwicm9sZXMiOlsiYWRtaW4iXSwiZXhwIjoxNjM3Nzc3NDEyLCJpYXQiOjE2Mzc3NzU2MTJ9.O3X5klVplDfjF_p4e1t2NVXvIpaXvGg6gc9FCsz1F5o";

function PostRequest(Url,Entity,SuccessFunction)
{
    $.ajax(
    {
        type: "POST",
        url: _BaseURL + Url,
        contentType: "application/json", // NOT dataType!
        headers: { 'Authorization': "Bearer " + _Token },
        data: JSON.stringify(Entity),
        success: SuccessFunction,
        error: function(xhr, status, error)
        {
            alert(xhr.status + " " +xhr.responseText);
        }
    });
}

function GetRequest(Url,SuccessFunction)
{
    $.ajax(
    {
        type: "GET",
        url: _BaseURL + Url,
        contentType: "application/json", // NOT dataType!
        headers: { 'Authorization': "Bearer " + _Token },
        success: SuccessFunction,
        error: function(xhr, status, error)
        {
            alert(xhr.status + " " +xhr.responseText);
        }
    });
}