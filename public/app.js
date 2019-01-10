function displayArticles() {
    $("#articles").empty()
    $.getJSON("/articles", function(data) {
        for (var i = 0; i < data.length; i++) {
            $("#articles").append("<p data-id='" + data[i]._id + "' class='headline'>" + data[i].title + "</p>")
            $("#articles").append("<p data-id='" + data[i]._id + "' class='byline'>" + data[i].author + " | " + data[i].published + "</p>")
            $("#articles").append("<p data-id='" + data[i]._id + "' class='description'>" + data[i].summary +"</p>")
            $("#articles").append("<a data-id='" + data[i]._id + "' href='https://www.coolstuffinc.com" + data[i].link + "'><i>https://www.coolstuffinc.com" + data[i].link + "<i></a><hr />")
        }
    })
}
displayArticles()
$("#scrape-btn").on("click", function(){
    $.get("/scrape").then(displayArticles)
})
$(document).on("click", "p", function() {
    $("#notes").empty()
    var thisId = $(this).attr("data-id")
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function(data) {
            console.log(data)
            $("#notes").append("<h2>" + data.title + "</h2>")
            $("#notes").append("<input id='titleinput' name='title' >")
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>")
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>")
            if (data.note) {
                $("#titleinput").val(data.note.title)
                $("#bodyinput").val(data.note.body)
            }
        })
})
$(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id")
    $.ajax({
        method: "Post",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function(data) {
            console.log(data)
            $("#notes").empty()
        })
    $("#titleinput").val("")
    $("#bodyinput").val("")
})