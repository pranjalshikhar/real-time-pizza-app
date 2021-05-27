const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');

// Use CSS
app.use(express.static(__dirname +  '/public'));



// Set Template
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views/'));
app.set('view engine', 'ejs');

// Call Routes
require('./routes/web')(app);

app.listen(PORT, ()=> {
    console.log(`Connected at ${PORT}`);
});