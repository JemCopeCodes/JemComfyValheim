// This script sends responses to the Comfy Valheim discord server so we get alerted when someone requests a mod.
// This script gets placed in a Google Form, the webhook comes from Discord.
var POST_URL = "GET A WEBHOOK URL FROM DISCORD INTEGRATIONS AND PUT IT HERE?thread_id=If you want the bot to post into just a thread put the thread ID here.";

function onSubmit(e) {
    var form = FormApp.getActiveForm();
    var allResponses = form.getResponses();
    var latestResponse = allResponses[allResponses.length - 1];
    var response = latestResponse.getItemResponses();
    var items = [];

    for (var i = 0; i < response.length; i++) {
        var question = response[i].getItem().getTitle();
        var answer = response[i].getResponse();
        try {
            var parts = answer.match(/[\s\S]{1,1024}/g) || [];
        } catch (e) {
            var parts = answer;
        }

        if (answer == "") {
            continue;
        }
        for (var j = 0; j < parts.length; j++) {
            if (j == 0) {
                items.push({
                    "name": question,
                    "value": parts[j],
                    "inline": false
                });
            } else {
                items.push({
                    "name": question.concat(" (cont.)"),
                    "value": parts[j],
                    "inline": false
                });
            }
        }
    }

    var options = {
        "method": "post",
        "headers": {
            "Content-Type": "application/json",
        },
        "payload": JSON.stringify({
            "content": "‌",
            "embeds": [{
                "title": "New Builder Project Submitted!",
                "url": "https://docs.google.com/spreadsheets/d/12OPCS9K8XhtAtwYu4KPFQXtXH-hK2tSBmxxdeOZ6qDc/edit?usp=sharing",
              "color": 0x6ff2df,
                "fields": items,
                "image": {
                  "url": "https://drive.google.com/uc?id=" + items.find(x => x.name === 'Image Upload').value
                },
                timestamp: new Date(),
                "footer": {
                    "text": "Issues with the bot? Contact Jemmeh." 
                }
            }]
        })
    };

    UrlFetchApp.fetch(POST_URL, options);
};
