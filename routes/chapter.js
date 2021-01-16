var express = require("express");
var router = express.Router();
const request = require("request-promise");
const cheerio = require("cheerio");
var cookieParser = require("cookie-parser");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  var novel = {};
  var idnovels = req.query.novelid;
  var idchapter = req.query.chapterid;
  const URL = "https://truyenfull.vn/";

  const getPageContent = uri => {
    const options = {
      uri,
      headers: {
        "User-Agent": "Request-Promise"
      },
      transform: body => {
        return cheerio.load(body);
      }
    };

    return request(options);
  };
  var data = [];
  var novelsname = null;
  var author = null;
  var genresdata = [];
  var chapterlist = [];
  var dateupdate = null;
  var othername = null;
  var lasterchapter = null;
  var idnovel = null;
  var cover = null;
  var totalcontent = '';
  var content = '';
  var id = null;
  var totalpages = null;
  getPageContent(URL + idnovels + idchapter).then($ => {
    chaptername = $('.chapter-title').text();
    $("#chapter-c").each(function (result) {
      content = $(this).html();
      // totalcontent = totalcontent.concat(content, '</br>')
      // totalcontent = content.slice(content.search('<hr'),content.lastIndexOf('<hr>'))
    })
    // if (totalcontent === '') {
    //   totalcontent = $('#content').html();
    //   novel = {
    //     idnovels: idnovels,
    //     idchapter: idchapter,
    //     chaptername: chaptername,
    //     content: totalcontent
    //   }
    //   return res.send(JSON.stringify(novel));
    // }
    // if(totalcontent === null){
    //   totalcontent = 
    // }
    novel = {
      idnovels: idnovels,
      idchapter: idchapter,
      chaptername: chaptername,
      content: content
    }
    res.send(JSON.stringify(novel));
  });
});

module.exports = router;
