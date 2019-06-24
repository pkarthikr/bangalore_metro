/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const stations = require('./stations.json');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    
    const speechText = 'Welcome to Bangalore Metro. I can help you get from one station to the other, and help you with the fare.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .addDelegateDirective({
        name: 'FareIntent',
        confirmationStatus: 'NONE',
        slots: {}
      })
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

// const InProgressFareIntentHandler = {
//   canHandle(handlerInput) {
//     return handlerInput.requestEnvelope.request.type === 'IntentRequest'
//       && handlerInput.requestEnvelope.request.intent.name === 'FareIntent'
//       && handlerInput.requestEnvelope.request.dialogState !== 'COMPLETED'
//   },
//   handle(handlerInput) {
//     handlerInput = handlerInput.requestEnvelope.request.intent;
//     if(handlerInput.slots.sourceStation.resolutions.resolutionsPerAuthority[0].status.code == "ER_SUCCESS_NO_MATCH"){
//       console.log("WE did not get a match for this station");
//     }; 

//     // console.log(stations.green);
//     // var stationCount = stations.green.filter(x => x.name == stationName);
//     // if(stationCount == 0){
//     //   const speechText = "I am sorry, I was not able to find the station.";
//     //   return handlerInput.responseBuilder
//     //   .speak(speechText)
//     //   .reprompt('Here we are')
//     //   .getResponse();
//     // }  
//   }
// }

const FareIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'FareIntent';
  },
  handle(handlerInput) {
    const sourceStation = handlerInput.requestEnvelope.request.intent.slots.sourceStation.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    const destinationStation = handlerInput.requestEnvelope.request.intent.slots.destinationStation.resolutions.resolutionsPerAuthority[0].values[0].value.name;

    // First check if both stations are on the green line. 
    const sourceGreen = stations.green.filter(x => x.name === sourceStation);
    const destinationGreen = stations.green.filter(x => x.name === destinationStation);
    var speechText = `Okay! So you want to go from ${sourceStation} to ${destinationStation}`;

    // If both the stations are on the same line
    if(sourceGreen.length > 0 && destinationGreen.length > 0){
      speechText = `Both are on green line`;
    }


    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('Here we are')
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    FareIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
