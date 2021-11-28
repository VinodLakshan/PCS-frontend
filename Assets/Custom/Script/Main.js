//Localhost
let _BaseURL = "http://localhost:9091/pcs/";
let _Token = sessionStorage.getItem("token");

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

function DeleteRequest(Url,Entity,SuccessFunction)
{
    $.ajax(
    {
        type: "DELETE",
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

function UpdateRequest(Url,Entity,SuccessFunction)
{
    $.ajax(
    {
        type: "PUT",
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