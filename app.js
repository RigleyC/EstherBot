'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.render('index', {
        appToken: process.env.SMOOCH_APP_TOKEN
    });
});

function persistentMenu(sender){
 request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token:'EAAPdujJRHJcBAGuTBZCQYQ773GEa6izIu05CZAc95yIGlEWAp65cdQTmT800W2hc75ox4bOc7YGSeGSgj28Coh2XuVqWnSdqmjhnTy9M4GgZBjrBXipqRPSzZAHANaXsZALxncYpG6PFvhT5y0Ec19c9GcfUpEuq96sid1OhEsQZDZD'},
    method: 'POST',
    json:{
        setting_type : "call_to_actions",
        thread_state : "existing_thread",
        call_to_actions:[
            {
              type:"postback",
              title:"FAQ",
              payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
            },
            {
              type:"postback",
              title:"I Prodotti in offerta",
              payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
            },
            {
              type:"web_url",
              title:"View Website",
              url:"https://google.com/"
            }
          ]
    }

}, function(error, response, body) {
    console.log(response)
    if (error) {
        console.log('Error sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error: ', response.body.error)
    }
})
}
