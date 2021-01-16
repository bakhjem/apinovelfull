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
    let prechap = $("#prev_chap").attr("href");
    let nextchap = $("#next_chap").attr("href");
    prechap = prechap.slice(
      prechap.lastIndexOf(idnovels) + (idnovels.length)
    );
    nextchap = nextchap.slice(
      nextchap.lastIndexOf(idnovels) + (idnovels.length)
    );
    console.log(prechap)
    console.log(nextchap)
    novel = {
      idnovels: idnovels,
      idchapter: idchapter,
      chaptername: chaptername,
      content: content,
      prechap: prechap,
      nextchap: nextchap
    }
    res.send(JSON.stringify(novel));
  });
});

module.exports = router;
