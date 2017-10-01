const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const recursive = require("recursive-readdir");
const config = require('./config.json');
const MOVIE_DIR = config.MOVIE_DIR;
const PORT = config.PORT;
const moment = require('moment');
const home = require('./routes/home')
const movies = require('./routes/movies')
const watch = require('./routes/watch')
const cors = require('cors')
// const _ = require('lodash')

app.use(cors())
app.use(movies)
app.use(home)
app.use(watch)

app.listen(PORT, function () {
  console.log('Example app listening on port '+PORT+'!')
})