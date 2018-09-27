const express = require('express');
var app = express();
const hbs = require('hbs');
const fs = require('fs');

app.set('view engine', 'hbs');

var requestCounter = 0;

app.use((req, res, next) => {
  var n = requestCounter++;
  var now = new Date();
  var log = `[${n}] ${now.toString()}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) console.log('Unable to append to server.log.')
  });
  res.on("finish", function() {
    var now2 = new Date();
    var dif = now2.getTime() - now.getTime();
    log = `[${n}] ${now2.toString()}: ${dif} msc.`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
      if (err) console.log('Unable to append to server.log.')
    });
  });
  next();
});
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/_partials');

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  setTimeout(() => {
    var model = getBaseModel();
    model.pageTitle = 'My Home Page';
    model.welcomeMessage = 'Welcome to my website';
    res.render('home.hbs', model);
  }, 3000);
});

app.get('/about', (req, res) => {
  var model = getBaseModel();
  model.pageTitle = 'My About Page';
  res.render('about.hbs', model);
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});



app.listen(3000, () => {
  console.log('Server is up on port 3000');
});

// -- -- -- HELPERS -- -- --
function getBaseModel() {
  return {
    currentYear: new Date().getFullYear()
  }
}
