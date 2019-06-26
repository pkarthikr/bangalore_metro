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
      .reprompt(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const FareIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'FareIntent';
  },
  handle(handlerInput) {
    const sourceStation = handlerInput.requestEnvelope.request.intent.slots.sourceStation.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    const destinationStation = handlerInput.requestEnvelope.request.intent.slots.destinationStation.resolutions.resolutionsPerAuthority[0].values[0].value.name;

    const sourceLine = stations.filter(x => x.name === sourceStation);
    const destinationLine = stations.filter(x => x.name === destinationStation);

    var speechText = `Okay! So to go from ${sourceStation} to ${destinationStation}, you will have to take the`;

    if((sourceLine[0].line == "green" && destinationLine[0].line == "green")|| (sourceLine[0].line == "purple" && destinationLine[0].line == "purple" )){
      var sourceOrder = sourceLine[0].order;
      var destinationOrder = destinationLine[0].order;
      console.log(sourceOrder);
      console.log(destinationOrder);
      var stationsFiltered = stations.filter(x => {if(x.order < sourceOrder && x.order > destinationOrder && x.line == sourceLine[0].line){
        return true;
      } if(x.order > sourceOrder && x.order < destinationOrder && x.line == sourceLine[0].line){
        return true;
      }
      return false;
      });
      speechText += `green line. Get down ${stationsFiltered.length} stations from ${sourceStation}. The stations are`;

      // When travelling the opposite direction
      if(sourceOrder > destinationOrder){
        stationsFiltered = stationsFiltered.sort(function(a,b){
          return b.order - a.order;
        });
      }
      console.log("Are we here");
      console.log(stationsFiltered);
      stationsFiltered.forEach(function(station){
        speechText += `<break time = "1s"/>${station.name}`
      });
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
