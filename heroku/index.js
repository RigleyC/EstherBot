'use strict';

const smoochBot = require('smooch-bot');
const MemoryLock = smoochBot.MemoryLock;
const SmoochApiStore = smoochBot.SmoochApiStore;
const SmoochApiBot = smoochBot.SmoochApiBot;
const StateMachine = smoochBot.StateMachine;
const app = require('../app');
const script = require('../script');
const SmoochCore = require('smooch-core');
const jwt = require('../jwt');
const fs = require('fs');
//------------------------------------
const bodyParser = require('body-parser');
//------------------------------------


class BetterSmoochApiBot extends SmoochApiBot {
    constructor(options) {
        super(options);
    }

    sendImage(imageFileName) {
        const api = this.store.getApi();
        let message = Object.assign({
            role: 'appMaker'
        }, {
            name: this.name,
            avatarUrl: this.avatarUrl
        });
        var real = fs.realpathSync(imageFileName);
        let source = fs.readFileSync(real);

        return api.conversations.uploadImage(this.userId, source, message);
    }
}

const name = 'SmoochBot';
const avatarUrl = 'https://raw.githubusercontent.com/RigleyC/RigleyBot/master/img/messenger_code_208203396256408.png';
const store = new SmoochApiStore({
    jwt
});
const lock = new MemoryLock();

function createWebhook(smoochCore, target) {
    return smoochCore.webhooks.create({
            target,
            triggers: ['message:appUser']
        })
        .then((res) => {
            console.log('Smooch webhook created at target', res.webhook.target);
            return smoochCore.webhooks.create({
                        target,
                        triggers: ['postback']
                    })
                    .then((res) => {
                        console.log('Smooch postback webhook created at target', res.webhook.target);
                    })
                    .catch((err) => {
                        console.error('Error creating Smooch webhook:', err);
                        console.error(err.stack);
                    });
            }            
        )
        .catch((err) => {
            console.error('Error creating Smooch webhook:', err);
            console.error(err.stack);
        });
}

// Create a webhook if one doesn't already exist
if (process.env.SERVICE_URL) {
    const target = process.env.SERVICE_URL.replace(/\/$/, '') + '/webhook';
    const smoochCore = new SmoochCore({
        jwt
    });
    smoochCore.webhooks.list()
        .then((res) => {
            if (!res.webhooks.some((w) => w.target === target)) {
                createWebhook(smoochCore, target);
            }
        });
}
//-------------------------------------------------------------------------------------
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());
//-------------------------------------------------------------------------------------
app.post('/',handleMessage);
//--------------------------------------------------------------------------------
    app.post('/webhook', function(req, res, next) {
    var isPostback = req.body.trigger == "postback";
    var msg = '';

    const appUser = req.body.appUser;
    const userId = appUser.userId || appUser._id;
    const stateMachine = new StateMachine({
        script,
        bot: new BetterSmoochApiBot({
            name,
            avatarUrl,
            lock,
            store,
            userId
        })
    });    

    if(!isPostback) {
        const messages = req.body.messages.reduce((prev, current) => {
            if (current.role === 'appUser') {
                prev.push(current);
            }
            return prev;
        }, []);

        if (messages.length === 0 && !isTrigger) {
            return res.end();
        }
//--------------------------------------------------------
function sendMessage(recipientId, message) {
    request({
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// send rich message with kitten
function kittenMessage(recipientId, text) {
    
    text = text || "";
    var values = text.split(' ');
    
    if (values.length === 3 && values[0] === 'kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {
            
            var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
            
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Cute kitten picture",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                                }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }]
                    }
                }
            };
    
            sendMessage(recipientId, message);
            
            return true;
        }
    }
    
    return false;
    
};
//--------------------------------------------------------
/* if (event.message && event.message.text) { 
			let text = event.message.text
			if (text === 'Generic') {
				sendGenericMessage(sender)
            }
}
*/
//--------------------------------------------------------        

        msg = messages[0];
    } else {
        msg = req.body.postbacks[0];
        msg.text = msg.action.text;
    }

    stateMachine.receiveMessage(msg)
        .then(() => res.end())
        .catch((err) => {
            console.error('SmoochBot error:', err);
            console.error(err.stack);
            res.end();
        });
});
//----------------------------------------------------------------
/*
if (event.message && event.message.text) {
			let text = event.message.text
			if (text === 'Generic') {
				sendGenericMessage(sender)
			//	continue
			}
		//	sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))   
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
			continue
		}
	//}
	res.sendStatus(200)
    });
    */
//----------------------------------------------------------------
var server = app.listen(process.env.PORT || 8000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Smooch Bot listening at http://%s:%s', host, port);
});

