$(".scrape").click(function () {
    $.getJSON("/articles", function (data) {
        for (var i = 0; i < data.length; i++) {
            $("#articles").append("<div data-id='" + data[i]._id + "'>")
            $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + "</p>");
            var LINK = data[i].link;
            $("#articles").append("<a href='" + data[i].link + "' data-id='" + data[i]._id + "'><br />" + data[i].link + "</a>" +
                "<br><button data-id='" + data[i]._id + "' class='addNote'>Add Note</button><button  data-id='" + data[i]._id + "' class='updateNote'>Update Note</button><button data-id='" + data[i]._id + "'class='deleteNote'>Delete Note</button></div><br>")
        }
    });
});
// on click event for p tag to enter note
$(document).on("click", ".addNote", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    // ajax call for the article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // add information to page
        .then(function (data) {
            console.log(data);

            // the title of article
            $("#notes").append("<h2>" + data.title + "</h2>");

            // input to enter new title
            $("#notes").append("<input id='titleinput' name='title' placeholder='title'>");

            // text area to add new body
            $("#notes").append("<textarea id='bodyinput' name='body' placeholder='insert note here'></textarea>");

            // a button to submit a new note
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>SaveNote</button>");

            // If theres a note in the article
            if (data.note) {
                // place the title of note in title input
                $("#titleinput").val(data.note.title);
                // place the body of note in text area
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a post request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            // value taken from title input
            title: $("titleinput").val(),
            // value taken from note text area
            body: $("#bodyinput").val()
        }
    })
        // with that done
        .then(function (data) {
            // long the response
            console.log(data);
            // empty the notes section
            $("#notes").empty();
        });
    // Also remove the values entered in the input and text area for note entry

    $("#titleinput").val("");
    $("#bodyinput").val("");

});