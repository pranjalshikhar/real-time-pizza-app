require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo');


// Database Connection
const url = process.env.MONGO_CONNECTION_URL;
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected..');
}).catch(err => {
    console.log('Connection Failed..');
});


// Session Config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: MongoDbStore.create({
        mongoUrl: url
    }),
}));



app.use(flash());


// Assets
app.use(express.static(__dirname +  '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


// Global Middleware
app.use((req, res, next) =>{
    res.locals.session = req.session
    next()
})



// Set Template
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views/'));
app.set('view engine', 'ejs');


// Call Routes
require('./routes/web')(app);


app.listen(PORT, ()=> {
    console.log(`Connected at ${PORT}`);
});