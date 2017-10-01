const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const recursive = require("recursive-readdir");
const config = require('./../config.json');
const { HOST } = config;
const moment = require('moment');
const { search, fetchSubtitles } = require('../util/movie-list');
const srt2vtt = require('srt-to-vtt')

const router = express.Router();
router.get('/watch/subtitles/:id', function (req, res) {
  fetchSubtitles(req.params.id).then(subtitles=>{
    if(subtitles&&subtitles.length>0){
      res.set('Content-Type', 'text/vtt');
      fs.createReadStream(subtitles[0])
      .pipe(srt2vtt())
      .pipe(res);
    }
    else
      res.send(subtitles)
  });
});

router.get('/watch/:id', function (req, res) {
    
    search(req.params.id).then(movie=>{
      if(!movie){
        res.send();
        return;
      }
      const content = `
      <!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <meta name="theme-color" content="#000000">
          
          <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
          <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
          
          <link href="http://vjs.zencdn.net/6.2.7/video-js.css" rel="stylesheet">
          <script src="http://vjs.zencdn.net/ie8/1.1.2/videojs-ie8.min.js"></script>
          <title>React App</title>
        </head>
        <body>
          <noscript>
            You need to enable JavaScript to run this app.
          </noscript>
          <div id="root">
            <h2>${movie.name}</h2>
          </div>
          <video id="my-video" class="video-js" controls preload="auto" width="640" height="264"
          poster="MY_VIDEO_POSTER.jpg" data-setup="{}" crossorigin="anonymous">
            <source src="${HOST}${movie.url}" type='video/mp4'>
            <p class="vjs-no-js">
              To view this video please enable JavaScript, and consider upgrading to a web browser that
              <a href="http://videojs.com/html5-video-support/" target="_blank">supports HTML5 video</a>
            </p>
            <track kind="captions" src="${HOST}/watch/subtitles/${movie.name}" srclang="en" label="English" default>
          </video>
          <script src="http://vjs.zencdn.net/6.2.7/video.js"></script>
        </body>
      </html>
      
      `
      res.send(content)
    });
})

module.exports = router;