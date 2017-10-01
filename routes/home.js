const express = require('express')
const app = express()
const moment = require('moment');
const { fetch } = require('../util/movie-list')

const router = express.Router();


function createStyle(){
    return '<style> .movie{ margin-bottom:15px }</style>';
}

function createMovieCard(movie){
    
    const when = moment(movie.date).fromNow();
    return `<div class='movie'><a href='/watch/${movie.name}'>${movie.name}</a> / ${when}</div>`;
}

router.get('/', function (req, res) {
    fetch().then(list=>{
        const movies = list.reduce((content,movie)=>{
            return content+createMovieCard(movie)
        },createStyle())
        res.send(movies)
    })
})

module.exports = router;