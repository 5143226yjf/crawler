/**
 * Created by yjf on 16-12-17.
 */
'use strict';

var http = require('http');
var express = require('express');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var url = 'http://www.toutiao.com/i6465822406278660621/?tt_from=copy_link&utm_campaign=client_share&app=news_article&utm_source=copy_link&iid=14753739459&utm_medium=toutiao_ios';

// 使用jQuery语法
app.get('/', function(req, res) {
    request(url, function(error, response, body) {
       if (!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        var data = $('.article-title');
        var content = [];
        $('.article-content div p').each(function () {
            content.push($(this).html());
        });
        var sub = [];
        $('.original').nextAll().each(function () {
            sub.push($(this).text());
        });
        console.log(sub)
        console.log($('.article-sub').length)
        res.json({
             title: data.text(),
             orgin: $('.original').text(),
             author:  sub[0],
             time: sub[1],
             content: content
        });
       }
     })
   });
   var server = app.listen(3007, function() {
    console.log('listening at 3007');
  });
