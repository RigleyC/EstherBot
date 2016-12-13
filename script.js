'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('Então você quer conhecer Rigley? Diga Olá e vamos começar!.')
                .then(() => 'speak');
        }
    },
//----------------------------------------------------------------------------------------------------------
    start2: {
    receive: (bot, message) => {
        const name = message.text;
        if (message.text == 'rig') {
        return bot.say({
                'type': 'template',
                'payload': {
                    'template_type': 'generic',
                    'elements': [
                        {
                            'title': 'Classic White T-Shirt',
                            'image_url': 'http://petersapparel.parseapp.com/img/item100-thumb.png',
                            'subtitle': 'Soft white cotton t-shirt is back in style',
                            'buttons': [
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/view_item?item_id=100',
                                    'title': 'View Item'
                                },
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/buy_item?item_id=100',
                                    'title': 'Buy Item'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Bookmark Item',
                                    'payload': 'White T-Shirt'
                                }
                            ]
                        },
                        {
                            'title': 'Classic Grey T-Shirt',
                            'image_url': 'http://petersapparel.parseapp.com/img/item101-thumb.png',
                            'subtitle': 'Soft gray cotton t-shirt is back in style',
                            'buttons': [
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/view_item?item_id=101',
                                    'title': 'View Item'
                                },
                                {
                                    'type': 'web_url',
                                    'url': 'https://petersapparel.parseapp.com/buy_item?item_id=101',
                                    'title': 'Buy Item'
                                },
                                {
                                    'type': 'postback',
                                    'title': 'Bookmark Item',
                                    'payload': 'Grey T-Shirt'
                                }
                            ]
                        }
                    ]
                }
        }
                   )
        
         .then(() => 'speak');
         }

    }
        },   
   
		       
//----------------------------------------------------------------------------------------------------------	

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }

//---------------------------------------------------------------------------
		/*
        	if (message === 'Generic') {
				sendGenericMessage()
            }
            */
//--------------------------------------------------------        
/*            
            
            function sendGenericMessage() {
	        let message = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
}
*/
//------------------------------------------------------------------------------
        
            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }
//------------------------------------------------------------------------------
              
//------------------------------------------------------------------------------                

                if (!_.has(scriptRules, upperText)) {
                    return bot.say(`Desculpa, não consegui entender 😔.`).then(() => 'speak');
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
