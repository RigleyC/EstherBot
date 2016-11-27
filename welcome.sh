curl https://api.smooch.io/v1/appusers/c7f6e6d6c3a637261bd9656f/messages \
     -X POST \
     -H 'content-type: application/json' \
     -H 'authorization: Bearer your-jwt' \
     -d '
{
    "role": "appMaker",
    "items": [{
        "title": "Tacos",
        "description": "Description",
        "mediaUrl": "http://example.org/image.jpg",
        "actions": [{
            "text": "Select",
            "type": "postback",
            "payload": "TACOS"
        }, {
            "text": "More info",
            "type": "link",
            "uri": "http://example.org"
        }]
    }, {
        "title": "Ramen",
        "description": "Description",
        "mediaUrl": "http://example.org/image.jpg",
        "actions": [{
            "text": "Select",
            "type": "postback",
            "payload": "RAMEN"
        }, {
            "text": "More info",
            "type": "link",
            "uri": "http://example.org"
        }]
    }]
}
