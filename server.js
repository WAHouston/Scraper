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
            var title = $(element).find("h1").text()
            var link = $(element).find("a").attr("href")
            var summary = $(element).find("div.gm-article-preview-excerpt").text()
            console.log(title)
            console.log(link)
            console.log(summary)
        })
    })
})
