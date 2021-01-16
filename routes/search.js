var express = require("express");
var router = express.Router();
const request = require("request-promise");
const cheerio = require("cheerio");
var cookieParser = require("cookie-parser");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  var novel = [];
  var id = req.query.id;
  var page = req.query.page;
  const URL =
    "https://truyenfull.vn/tim-kiem/?tukhoa=";

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
  var lasterchapter = null;
  var idnovel = null;
  var idchapter = null;
  var cover = null;
  var lastupdates = [];
  var update_time = null;
  var view = null;
  var totalpages = null;
  var des = null;
  console.log(URL + id + '&page=' + page)
  getPageContent(URL + id + '&page=' + page).then($ => {
    // console.log(
    //   "http://www.nettruyen.com/tim-truyen?status=-1&sort=15&page=" + page
    // );
    // var pagett = $(".pagination-outter ul li.hidden").text();
    // totalpage = pagett.slice(pagett.search("/") + 2);
    $("div.row[itemscope]").each(function (result) {
      // console.log($(this).html())
      $(this)
        .find(".truyen-title a")
        .each(function () {
          novelsname = $(this).text();
          idnovel = $(this).attr('href');
          // idnovel = idnovel.slice(1)
          idnovel = idnovel.slice(idnovel.lastIndexOf(".vn/") + 4);

        });
      $(this)
        .find(".col-xs-2.text-info a")
        .each(function () {
          lasterchapter = $(this).text();
          var chapterid = $(this).attr('href');
          idchapter = chapterid.slice(chapterid.lastIndexOf(idnovel) + (idnovel.length));

        });
      $(this)
        .find(".author")
        .each(function () {
          view = $(this).text();
        });

      $(this)
        .find(".lazyimg")
        .each(function () {
          cover = $(this).attr('data-desk-image');
          // cover = 'https://webnovel.online' + cover;
          // console.log(cover);
          //   console.log(idchapter)
        });
      // $(this)
      //   .find("span:nth-child(2)")
      //   .each(function () {
      //     view = $(this).text();
      //     // console.log(cover);
      //     //   console.log(idchapter)
      //   });

      data.push({
        'novelsname': novelsname,
        'idnovel': idnovel,
        'lasterchapter': lasterchapter,
        'idchapter': idchapter,
        'cover': cover,
        'author': view,
        // 'lastupdates': lastupdates
      })
    });
    var totalpage = $("ul.pagination.pagination-sm li a").eq(-2).attr("href");
    console.log(totalpage)
    let lastpage = '';
    if (totalpage !== undefined) {
      lastpage = totalpage.slice(totalpage.indexOf('page=') + 5)
    }
    else {
      lastpage = '1'
    }

    var novels = {
      url: URL + page,
      page: parseInt(page),
      data: data,
      totalpage: parseInt(lastpage)
    };

    res.send(JSON.stringify(novels));
  });
});

module.exports = router;
