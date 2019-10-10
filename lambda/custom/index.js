/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const stations = require('./stations.json');
const SmartCardArray=  require('./SmartCardInfo.json');
const SKILL_NAME = "Bangalore Metro";

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {

    const speechText = 'Welcome to Bangalore Metro. I can help you with the route from one station to another! Just say your origin and destination station to know your route.';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse();
  },
};

const RouteIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'RouteIntent';
  },
  handle(handlerInput) {
    const sourceStation = handlerInput.requestEnvelope.request.intent.slots.sourceStation.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    const destinationStation = handlerInput.requestEnvelope.request.intent.slots.destinationStation.resolutions.resolutionsPerAuthority[0].values[0].value.name;

    const sourceLine = stations.filter(x => x.name === sourceStation);
    const destinationLine = stations.filter(x => x.name === destinationStation);
    console.log("Our destination is ");
    console.log(destinationLine);
    var speechText = `Okay! So to go from ${sourceStation} to ${destinationStation}, you will have to take the`;
    var sourceOrder = sourceLine[0].order;
    var destinationOrder = destinationLine[0].order;
    var majesticGreenOrder = 14;
    var majesticPurpleOrder = 8;

    if ((sourceLine[0].line == "green" && destinationLine[0].line == "green") || (sourceLine[0].line == "purple" && destinationLine[0].line == "purple")) {
     
      console.log("inbside green");
      console.log(sourceLine);
      var stationsFiltered = stations.filter(x => {
        if (x.order < sourceOrder && x.order > destinationOrder && x.line == sourceLine[0].line) {
          return true;
        }
        if (x.order > sourceOrder && x.order < destinationOrder && x.line == sourceLine[0].line) {
          return true;
        }
        if (x.order == destinationOrder && x.line == sourceLine[0].line) {
          return true;
        }
        return false;
      });
      speechText += ` ${sourceLine[0].line} line. Get down ${stationsFiltered.length} stations from ${sourceStation}. ${destinationStation} will come right after`;

      // When travelling the opposite direction
      if (sourceOrder > destinationOrder) {
        stationsFiltered = stationsFiltered.sort(function (a, b) {
          return b.order - a.order;
        });
      }
      
      speechText += ` ${stationsFiltered[stationsFiltered.length-1].name} station`;

      if(destinationOrder - sourceOrder == 1 || sourceOrder - destinationOrder == -1){
        speechText = `On the ${sourceLine[0].line} line, ${sourceStation} and ${destinationStation} are just next to each other`;
      }
    } else if (sourceLine[0].line == "green" && destinationLine[0].line == "purple") {
      // When you have to switch lines from green to purple
      var speechText = `Okay! So to go from ${sourceStation} to ${destinationStation}, you will have to switch from green to purple line. From ${sourceStation}, take the train towards`;
      if (sourceOrder < 14) {
        speechText += `Yelachenahalli`;
      } else {
        speechText += `Nagasandra`;
      }
      var distance = Math.abs(sourceOrder - majesticGreenOrder);
      speechText += ` and get down at Majestic which is ${distance - 1} stations away. From Majestic, take the train towards`;
      var destinationCalculation = 0;
      if (destinationOrder > 8) {
        speechText += 'Baipaynahalli';
        destinationCalculation = destinationOrder - 1;
      } else {
        speechText += 'Mysore Road';
        destinationCalculation = destinationOrder + 1;
      }
      var destinationDistance = Math.abs(destinationOrder - majesticPurpleOrder);
      speechText += ` and get down ${destinationDistance - 1} stations later.`;
      var stationsFiltered = stations.filter(x => {
        if (x.order == destinationCalculation && x.line == destinationLine[0].line) {
          return true;
        }
        return false;
      });
     
      if(stationsFiltered.length > 0){
        speechText += ` ${destinationStation} will come right after. ${stationsFiltered[0].name} station`;
      }

    } else if (sourceLine[0].line == "purple" && destinationLine[0].line == "green"){
      var speechText = `Okay! So to go from ${sourceStation} to ${destinationStation}, you will have to switch from purple to green line. From ${sourceStation}, take the train towards`;
      if (sourceOrder < 8){
        speechText += 'Baiyappanahalli';
      } else {
        speechText += 'Mysore Road';
      }
      var distance = Math.abs(sourceOrder - majesticPurpleOrder);
      speechText += ` and get down at Majestic which is ${distance - 1} stations away. From Majestic, take the train towards`;
      var destinationCalculation = 0;
      if (destinationOrder > 14) {
        speechText += 'Yelachenahalli';
        destinationCalculation = destinationOrder - 1;
      } else {
        speechText += 'Nagasandra';
        destinationCalculation = destinationOrder + 1
      }
      var destinationDistance = Math.abs(destinationOrder - majesticGreenOrder);
      speechText += ` and get down ${destinationDistance - 1} stations later.`;
      var stationsFiltered = stations.filter(x => {
        if (x.order ==  destinationCalculation && x.line == destinationLine[0].line) {
          return true;
        }
        return false;
      });
      console.log(stationsFiltered);
      if(stationsFiltered.length > 0){
        speechText += ` ${destinationStation} will come right after ${stationsFiltered[0].name} station`;
      }

    }
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse();
  },
};


const SmartCardIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'SmartCardIntent';
  },
  handle(handlerInput) {
    var speechText = 'hello,welcome to smart card';
    const action = handlerInput.requestEnvelope.request.intent.slots.action.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    //speechText+=`you will be able to ${action}`;
    for(var i=0;i<3;i++){
        if (action.toLowerCase().trim() === SmartCardArray.SmartCards[i].key.toLowerCase().trim())
        speechText+= SmartCardArray.SmartCards[i].answer;
        }
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'I can help you with the route from one station to another. Just say your Origin station and your destination station to get started';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(SKILL_NAME, speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(SKILL_NAME, speechText)
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
    RouteIntentHandler,
    SmartCardIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
