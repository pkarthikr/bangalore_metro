/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const i18n = require('i18next'); 
const sprintf = require('i18next-sprintf-postprocessor');

const { findStation, shortestRoute } = require('./libs/route');

const languageStrings = {
  'en-US' : require('./i18n/en-US'),
  'en-IN' : require('./i18n/en-IN')
}

const LocalizationInterceptor = {
  process(handlerInput) {
      const localizationClient = i18n.use(sprintf).init({
          lng: handlerInput.requestEnvelope.request.locale,
          fallbackLng: 'en-US',
          resources: languageStrings
      });

      localizationClient.localize = function () {
          const args = arguments;
          let values = [];

          for (var i = 1; i < args.length; i++) {
              values.push(args[i]);
          }
          const value = i18n.t(args[0], {
              returnObjects: true,
              postProcess: 'sprintf',
              sprintf: values
          });

          if (Array.isArray(value)) {
              return value[Math.floor(Math.random() * value.length)];
          } else {
              return value;
          }
      }

      const attributes = handlerInput.attributesManager.getRequestAttributes();
      attributes.t = function (...args) {
          return localizationClient.localize(...args);
      };
  },
};

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {

    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    const speechText = requestAttributes.t('WELCOME');

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(requestAttributes.t('SKILL_NAME'), speechText)
      .getResponse();
  },
};

const RouteIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'RouteIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    const sourceStationId = handlerInput.requestEnvelope.request.intent.slots.sourceStation.resolutions.resolutionsPerAuthority[0].values[0].value.id;
    const destinationStationId = handlerInput.requestEnvelope.request.intent.slots.destinationStation.resolutions.resolutionsPerAuthority[0].values[0].value.id;

    const sourceStation = findStation(sourceStationId);
    const destinationStation = findStation(destinationStationId);

    let shortRoute = shortestRoute(sourceStation, destinationStation);

    let speechText = '';

    if(shortRoute.lines.length === 1){
      let route = shortRoute.routes[0];
      if(route.source.id === route.previous.id){
        speechText = requestAttributes.t('DIRECTION_NEXT_STATION', {
          line: shortRoute.lines[0],
          sourceStation: route.source.name,
          destinationStation: route.destination.name
        });
      }
      else{
        speechText = requestAttributes.t('DIRECTION_WITHOUT_SWITCH', {
          line: shortRoute.lines[0],
          sourceStation: route.source.name,
          destinationStation: route.destination.name,
          previousStation: route.previous.name,
          stationCount: route.stationCount
        });
      }
    }
    else{
      let lineOne = shortRoute.lines[0];
      let lineTwo = shortRoute.lines[1];
      let lineSwitchMessage = '';
      if(shortRoute.lines.length === 2){
        lineSwitchMessage = requestAttributes.t('LINE_ONLY_SWITCH', { lineOne, lineTwo });
      }
      else{
        lineSwitchMessage = shortRoute.lines.map((line, index, lines) => {
          if(index === 0){
            return '';
          }
          else if(index === 1){
            return requestAttributes.t('LINE_FIRST_SWITCH', {
              lineOne: lines[0],
              lineTwo: lines[1]
            });
          }
          else if(index === lines.length - 1){
            return requestAttributes.t('LINE_FINAL_SWITCH', {
              lineLast: line
            });
          }
          else{
            return requestAttributes.t('LINE_NEXT_SWITCH', {
              line
            });
          }
        }).join(' ');
      }
      let trainRouteMessage = shortRoute.routes.map((route, index, routes) => {
        if(index === 0){
          return requestAttributes.t('TRAIN_FIRST_ROUTE', {
            line: route.source.line,
            sourceStation: route.source.name,
            destinationStation: route.destination.name,
            previousStation: route.previous.name,
            endStation: route.end.name,
            stationCount: route.stationCount
          })
        }
        else if(index === routes.length - 1){
          return requestAttributes.t('TRAIN_LAST_ROUTE', {
            line: route.source.line,
            sourceStation: route.source.name,
            destinationStation: route.destination.name,
            previousStation: route.previous.name,
            endStation: route.end.name,
            stationCount: route.stationCount
          })
        }
        else{
          return requestAttributes.t('TRAIN_NEXT_ROUTE', {
            line: route.source.line,
            sourceStation: route.source.name,
            destinationStation: route.destination.name,
            previousStation: route.previous.name,
            endStation: route.end.name,
            stationCount: route.stationCount
          })
        }
      }).join(' ');
      speechText = requestAttributes.t('DIRECTION_WITH_SWITCH', {
        sourceStation: sourceStation.name,
        destinationStation: destinationStation.name,
        lineSwitchMessage,
        trainRouteMessage
      });
    }
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(requestAttributes.t('SKILL_NAME'), speechText)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    const speechText = requestAttributes.t('HELP');

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(requestAttributes.t('SKILL_NAME'), speechText)
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
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    const speechText = requestAttributes.t('BYE');

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(requestAttributes.t('SKILL_NAME'), speechText)
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
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

    console.log(`Error handled: ${error.message}`, error);

    return handlerInput.responseBuilder
      .speak(requestAttributes.t('ERROR'))
      .reprompt(requestAttributes.t('ERROR'))
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    RouteIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();