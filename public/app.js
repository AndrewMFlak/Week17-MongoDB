$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});
// on click event for p tag
$(document).on("click", "p", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    // ajax call for the article
    $.ajax({
        method: "Get",
        url: "/articles/" + thisId
    })
    // add information to page
    .then(function(data) {
        console.log(data);

        // the title of article
        $("#notes").append("<h2>" + data.title + "</h2>");

        // input to enter new title
        $("#notes").append("<input id='titleinput' name='title'>");

        // text area to add new body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");

        // a button to submit a new note
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>SaveNote</button>");

        if(data.note) {
            // place the title of note in title input
            $("#titleinput").val(data.note.title);
            // place the body of note in text area
            $("#bodyinput").val(data.note.body);
        }
    });
});