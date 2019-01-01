var express = require("express")
var mongoose = require("mongoose")
var cheerio = require("cheerio")
var axios = require("axios")
var db = require("./models")
var PORT = 3000
var app = express()
axios.get("https://www.coolstuffinc.com/").then(function(response) {
    var $ = cheerio.load(response.data)
    //Check if date is in database
    //If it is, don't add it/if not, add it
    $("h1.display-title").each(function(i, element) {
        var title = $(element).children().text()
        var link = $(element).find("a").attr("href")
    })
    $("div.gm-article-preview-excerpt").each(function(i, element) {
        var summary = $(element).text()
    })
})