const path = require('path')
const fs = require('fs')
const recursive = require("recursive-readdir");
const MOVIE_DIR = '../movies'
const MOVIE_ROUTE = '/movies'
const moment = require('moment');

function ignoreFunc(file, stats) {
    return !(stats.isDirectory() || path.basename(file).endsWith(".mp4"));
}

function toList(files){
    let list = [];
    files.forEach((file) => {
        const stat = fs.statSync(file);
        const name = path.basename(file);
        list.push({name,url:file.replace(MOVIE_DIR,MOVIE_ROUTE),path:file,date:stat.ctime});
    });
    list.sort(function(a, b) {
        return moment(b.date)-moment(a.date);
    });
    return list;
}

const fetch = () => new Promise((resolve,reject)=>{
    recursive(MOVIE_DIR, [ ignoreFunc ], (err, files) => {
        if(err){
            reject(err);
        }
        const movieList = toList(files);
        resolve(movieList)
    });
})

const search = (name) => new Promise((resolve,reject)=>{
    fetch().then(list => {
        resolve(list.find(movie=>{
            return movie.name === name;
        }));
    })
    .catch(err=>{
        reject(err)
    })
})

const fetchSubtitles = (name) => new Promise((resolve,reject)=>{
    search(name).then(movie => {
        if(!movie){
            resolve();
            return;
        }
        const movieDir = path.dirname(movie.path);
        recursive(movieDir, [ (file,stats)=>{
            return !(stats.isDirectory() || path.basename(file).endsWith(".srt"));
        } ], (err, files) => {
            if(err){
                reject(err);
                return;
            }
            resolve(files);
        });
    })
    .catch(err=>{
        reject(err)
    })
})

module.exports = { fetch, search, fetchSubtitles }
