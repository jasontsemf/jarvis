// 'use strict';

const {dialogflow,ActionsSdkConversation} = require('actions-on-google');
const functions = require('firebase-functions');

const app = dialogflow({
    debug: true
});

app.intent("selectnumber", (conv, params) => {
    let nums = params.number;
    // let num = nums[0];
    let fileNames = ["jarvis_alarm.mp3", "jarvis_beep.mp3", "jarvis_on.mp3", "jarvis_morning.mp3"];
    let baseURL = "https://storage.googleapis.com/jarvis_audio_file/";
    let start = `<speak>A wise selection, enjoy.`
    let middle = "";
    for (let i = 0; i< nums.length; i++){
        middle += `<audio src="${baseURL}${fileNames[nums[i]-1]}">didn't get the audio file</audio><break time="2s"/>`;
    }
    let end = `</speak>`;
    conv.ask(start + middle + end);
});

app.intent("days until", (conv, params) => {
    // getting origial by using context
    const ctx = conv.contexts.get('outputuntil');
    const ctxParams = ctx.parameters;
    let dateUntil = params.dateUntil;
    let dateUntilOG = ctxParams['dateUntil.original'];

    const ctxDay = conv.contexts.get('outputday');
    const ctxDayParams = ctxDay.parameters;
    let dateWhen = ctxDayParams['dateWhen'];
    let dateWhenOG = ctxDayParams['dateWhen.original'];
    
    let d = 0;
    let today = new Date();
    let theDay;
    let theDayOG;

    if(dateUntil){
        theDay = dateUntil;
    }else{
        if(dateWhen){
            theDay = dateWhen;
        }
    }
    d = new Date(theDay);

    if(dateUntilOG){
        theDayOG = dateUntilOG;
    }else{
        if(dateWhenOG){
            theDayOG = dateWhenOG;
        }
    }

    let diff = parseInt((d - today) / (24 * 3600 * 1000));
    let msg = `There ${(diff > 1) ? "are" : "is"} ${diff} ${(diff > 1) ? "days" : "day"} left until ${theDayOG}`;

    conv.ask(msg);
});

exports.jarvis = functions.https.onRequest(app);