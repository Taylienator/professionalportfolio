const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
var Mailchimp = require('mailchimp-api-v3');


const app = express();
const PORT = process.env.PORT || 8080;

var mailchimp = new Mailchimp(process.env.API_KEY);

app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));
app.use(express.static(__dirname + '/views'));


app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) =>{

    const data ={
        person:{
            firstName: 'Taylor',
            lastName: 'Lake'
        }
    }

    res.render('index' , data);
});

app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
});

app.get('/contact', (req, res) =>{
    res.render('contact');
});

app.post('/thanks', (req, res) =>{
    mailchimp.post('/lists/a96956f05d/members', {
        email_address : req.body.email,
        status : 'subscribed'
      })
      .then((response) => {
        res.render('thanks', { contact: req.body })
        
      }).catch(err => res.status(400).send(err.message));
});



