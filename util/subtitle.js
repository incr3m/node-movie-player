const srt2vtt = require('srt-to-vtt')
const fs = require('fs')
 

const fetchSrt = (name) =>{
    
}
fs.createReadStream('some-subtitle-file.srt')
  .pipe(srt2vtt())
  .pipe(fs.createWriteStream('some-html5-video-subtitle.vtt'))