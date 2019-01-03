var express = require("express")
var mongoose = require("mongoose")
var cheerio = require("cheerio")
var axios = require("axios")
var db = require("./models")
var PORT = 3000
var app = express()
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"
mongoose.connect(MONGODB_URI)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))
app.get("/scrape", function(req, res) {
    axios.get("https://www.coolstuffinc.com/").then(function(response) {
        var $ = cheerio.load(response.data)
        $("div.gm-article-preview-header").each(function(i, element) {
            var result = {}
            result.title = $(this).find("h1").text()
            result.link = $(this).find("a").attr("href")
            result.summary = $(this).find("div.gm-article-preview-excerpt").text()
            result.author = $(this).find("span.author").text()
            result.published = $(this).find("span.date-published").text()
            console.log(result.title)
            console.log(result.link)
            console.log(result.summary)
            db.Article.create(result)
                .then(function(dbArticle){
                    console.log(dbArticle)
                })
                .catch(function(err) {
                    console.log(err)
                })
        })
        res.send("Scrape Complete")
    })
})
app.get("/articles", function(req, res) {
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle)
        })
        .catch(function(err) {
            res.json(err)
        })
})
app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function(dbArticle) {
            res.json(dbArticle)
        })
        .catch(function(err) {
            res.json(err)
        })
})
app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
        .then(function(dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true })
        })
        .then(function(dbArticle) {
            res.json(dbArticle)
        })
        .catch(function(err) {
            res.json(err)
        })
})
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!")
})

//{ $push:{notes: dbNote._id} }