const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const config = require('./../config.json');

const { MOVIES_DIR } = config;

const { fetch } = require('./../util/movie-list') 
// const _ = require('lodash')

const router = express.Router();

router.use('/'+MOVIES_DIR, express.static(path.join(__dirname, '..' , MOVIES_DIR)))

// router.get('/', function (req, res) {
//     fetch().then(list=>{
//         const movies = list.reduce((content,movie)=>{
//             return content+createMovieCard(movie)
//         },createStyle())
//         res.send(movies)
//     })
// })

module.exports = router;