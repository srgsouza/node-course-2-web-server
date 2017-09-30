

const express = require('express'); //web framework for nodejs
const hbs = require('hbs'); // Express.js template engine plugin for Handlebars
const fs = require('fs');

const port = process.env.PORT || 3000; // Needed for Heroku - 'process.env' stores the environment variables/values
var app = express();

hbs.registerPartials(__dirname + '/views/partials');  // allows for the use of Handlebars partials (reusable parts of a webpage)
hbs.registerHelper('getCurrentYear', () => {  // Register a helper
  return new Date().getFullYear();
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase(text);
});

app.set('view engine', 'hbs');  // Setting view engine template

// middleware
app.use((req, res, next) => { // next() is required to tell the function when to move on.
  var now = new Date().toString();  // toString make it human readable timestamp
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });
  next();
});

// // This middleware will server the maintenance page and stop all other requests - note the absense of next()
// // Uncomment when site is under maintenance
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// })

// Middleware that serves static files - __dirname gets the program directory
app.use(express.static(__dirname + '/public'));   // 'app.use' is how we register a middleware. It takes a funciton

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Hi there. Welcome to this site',
  });
});

app.get('/about', (req, res) => {
  // res.send('About Page');
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to send request'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
  });
});

app.listen(3000, () => {
  console.log(`Server is up on port ${port}`);
});
