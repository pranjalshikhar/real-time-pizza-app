const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');


// Assets
app.use(express.static(__dirname +  '/public'));


// Database Connection
const url = 'mongodb://localhost/pizza';
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected..');
}).catch(err => {
    console.log('Connection Failed..');
});



// Set Template
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views/'));
app.set('view engine', 'ejs');


// Call Routes
require('./routes/web')(app);


app.listen(PORT, ()=> {
    console.log(`Connected at ${PORT}`);
});