var express = require("express");
var router = express.Router();
const request = require("request-promise");
const cheerio = require("cheerio");
var cookieParser = require("cookie-parser");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate')
  var novel = [];
  var idnovels = req.query.id;
  var pages = req.query.page;
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
  var view = null;
  var othername = null;
  var lasterchapter = null;
  var idnovel = null;
  var idchapter = null;
  var cover = null;
  var des = null;
  var lastupdates = [];
  var update_time = null;
  var id = null;
  var totalpages = null;
  console.log(URL + idnovels + '/trang-' + pages + '/')
  getPageContent(URL + idnovels + '/trang-' + pages).then($ => {
    novelsname = $("h3.title").text();
    cover = $('.book img').attr('src');
    // cover = 'https://webnovel.online'+cover;
    // othername = $(".truyen_info_right li:nth-child(1) span").text();
    author = $("[itemprop=author]").text();
    console.log(author)
    $(".info [itemprop=genre]").each(function (result) {
      genres = $(this).text();
      idgenres = $(this).attr("href");
      idgenres = idgenres.slice(idgenres.search("the-loai") + 9);
      //   console.log(idgenres);
      genresdata.push({
        genrename: genres,
        idgenres: idgenres
      });
    });
   let status = $("span.text-primary").text();
   console.log(status)
   if(status === ''){
    status = $("span.text-success").text();
   }
    description = $("[itemprop=description]").html();
    // des = $("#noidungm").text();
    // // description = description.slice(1,description.search('<hr>'))
    $(".list-chapter li").each(function (result) {
      $(this)
        .find("a")
        .each(function () {
          chaptername = $(this).text();
          var chapterid = $(this).attr("href");
          idchapter = chapterid.slice(
            chapterid.lastIndexOf(idnovels) + (idnovels.length)
          );
          chapterlist.push({
            chaptername: chaptername,
            idchapter: idchapter
          })
        });

    });
    let lastpage = '';
    let totalpage = $("ul.pagination.pagination-sm li a:contains('Cuối')").attr("href")
    let nextpage = $("ul.pagination.pagination-sm li a:contains('Trang tiếp')").attr("href")
    let lasspage = $("ul.pagination.pagination-sm li a:contains('Chọn trang')").attr("href")
    console.log(totalpage)
    if (totalpage !== undefined) {
      lastpage = totalpage.slice(totalpage.indexOf('trang-') + 6, (totalpage.indexOf('#list-chapter')) - 1)
    } else {
      if (nextpage !== undefined) {
        if (lasspage !== undefined) {
          console.log(nextpage)
          let page = $("ul.pagination.pagination-sm li a").eq(-3).attr("href");
          console.log(page)
          if (page !== undefined) {
            lastpage = page.slice(page.indexOf('trang-') + 6, (page.indexOf('#list-chapter')) - 1)
          }
          else {
            lastpage = '1'
          }
        } else {
          let page = $("ul.pagination.pagination-sm li a").eq(-2).attr("href");
          lastpage = page.slice(page.indexOf('trang-') + 6, (page.indexOf('#list-chapter')) - 1)
        }

      } else {
        lastpage = pages
      }

    }

    console.log(lastpage)
    novel = {
      novelsname: novelsname,
      idnovels: idnovels,
      pages: (pages !== null && pages !== undefined) ? pages : 1,
      author: author,
      cover: cover,
      genresdata: genresdata,
      status: status,
      // des: des,
      description: description,
      chapterlist: chapterlist,
      totalpage: lastpage
    }
    // console.log(chapterlist);
    res.send(JSON.stringify(novel));
  });
});

module.exports = router;
