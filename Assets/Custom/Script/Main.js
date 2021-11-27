//Localhost
let _BaseURL = "http://localhost:8080/pcs/";
let _Token = sessionStorage.getItem("token");
//let _Token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhcnVuIiwicm9sZXMiOlsiYWRtaW4iXSwiZXhwIjoxNjM3ODQ5OTIxLCJpYXQiOjE2Mzc4NDgxMjF9.CM1ti7JdW-BRGAwcloSo8Ptx-mvjJRSnGwh_suq21bs";

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