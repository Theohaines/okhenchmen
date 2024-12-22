const express = require('express');
const dotenv = require('dotenv').config();
const path = require('path');

const app = express();

app.use('/scripts', express.static(path.resolve('src/client/scripts')));
app.use('/styles', express.static(path.resolve('src/client/styles')));
app.use('/media', express.static(path.resolve('src/client/media')));

app.use('/landing', express.static(path.resolve('src/client/pages/landing')));

app.get('/', (req, res) => {
    res.status(200).sendFile(path.resolve('src/client/pages/landing/index.html'));
});

app.listen(process.env.PORT, () => {
    console.log("Server listening on", process.env.PORT);
})