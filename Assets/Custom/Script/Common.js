function PopUpSimpleText(Text)
{
    Swal.fire(Text)
}

function PopUpWithTitleAndText(Title,Text,Type)
{
    Swal.fire(Title, Text, Type )//"success", "error", "warning", "info" or "question"
}