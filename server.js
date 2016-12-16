/**
 * Created by yjf on 16-12-17.
 */
'use strict';

var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');

var i = 0;
var url = "http://www.ss.pku.edu.cn/index.php/newscenter/news/2391";

function fetchPage(x) {
    startRequest(x);
}

function startRequest(x){
    //向服务器发起一次get请求
    http.get(x,(res)=>{
        var html = '';
        var title = [];
        res.setEncoding('utf-8');
        //监听data事件，每次取一块数据
        res.on('data',(chunk)=>{
            html += chunk;
        });
        res.on('end',()=>{
           var $ =cheerio.load(html);
            var time =$('.article-info a:first-child').next().text().trim();
            var news_item ={
                title:$('div.article-title a').text().trim(),
                Time:time,
                link:"http://www.ss.pku.edu.cn" + $("div.article-title a").attr('href'),
                author:$('[title=供稿]').text().trim(),
                i:i=i+1,
            };
            console.log(news_item);
            var news_title = $('div.article-title a').text().trim();
            saveContent($,news_title);
            saveImg($,news_title);

            var nextLink='http://www.ss.pku.edu.cn'+$('li.next a').attr('href');
            var str1 = nextLink.split('-'); //去掉url后的中文
            var str =encodeURI(str1[0]);
            if(i<=10){
                fetchPage(str);
            }
        });
    }).on('error',(err)=>{
        console.log(err);
    });
}

function saveContent($,news_title) {
    $('.article-content p').each(()=>{
        var x = $(this).text();
        var y = x.substring(0,2).trim();
        if(y == ''){
            x= x+ '\n';
            fs.appendFile('./data/',news_title, '---'+'utf-8',(error)=>{
                if(error){
                    console.log(error);
                }
            })
        }
    })
}

function saveImg($,news_title) {
    $('.article-content img').each(()=>{
      var img_title = $(this).parent().next().text().trim();
        if(img_title.length>35||img_title == ''){
            img_title = 'Null';
        }
        var img_filename = img_title+ '.jpg';
        var img_src = 'http://www.ss.pku.edu.cn'+$(this).attr('src');
        request.head(img_src,(err)=>{
            if(err){
                console.log(err);
            }
            request(img_src).pipe(fs.createWriteStream('./image/'+news_title+ '---' + img_filename));

        })
    })
}
fetchPage(url);
