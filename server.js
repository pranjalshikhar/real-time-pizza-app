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
const passport = require('passport');
const Emitter = require('events')



// Database Connection
const url = process.env.MONGO_CONNECTION_URL;
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected..');
}).catch(err => {
    console.log('Connection Failed..');
});



// Event Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)



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



// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())



app.use(flash());



// Assets
app.use(express.static(__dirname +  '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))



// Global Middleware
app.use((req, res, next) =>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})



// Set Template
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views/'));
app.set('view engine', 'ejs');



// Call Routes
require('./routes/web')(app);
app.use((req, res) => {
    res.status(404).render('errors/404')
})



const server = app.listen(PORT, ()=> {
    console.log(`Connected at ${PORT}`);
});



// Socket
const io = require('socket.io')(server)
io.on('connection', (socket) =>{
    console.log('Socket.io Connected..');
    // console.log(socket.id)
    socket.on('join', (orderId) => {
        console.log(orderId)
        socket.join(orderId)
    });
    
});

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})