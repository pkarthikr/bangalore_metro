module.exports = {
  translation: {
    SKILL_NAME: 'Bangalore Metro',
    WELCOME: [
      'Welcome to Bangalore Metro. I can help you with the route from one station to another! Just say your origin and destination station to know your route.'
    ],
    HELP: [
      'I can help you with the route from one station to another. Just say your Origin station and your destination station to get started'
    ],
    BYE: [
      'Goodbye!'
    ],
    ERROR: [
      'Sorry, I can\'t understand the command. Please say again.'
    ],
    DIRECTION_NEXT_STATION: [
      'On the %(line)s line, %(sourceStation)s and %(destinationStation)s are just next to each other'
    ],
    DIRECTION_WITHOUT_SWITCH: [
      'Okay! So to go from %(sourceStation)s to %(destinationStation)s, you will have to take the %(line)s line. Get down %(stationCount)s stations from %(sourceStation)s. %(destinationStation)s will come right after %(previousStation)s station'
    ],
    DIRECTION_WITH_SWITCH: [
      'Okay! So to go from %(sourceStation)s to %(destinationStation)s, %(lineSwitchMessage)s. %(trainRouteMessage)s'
    ],
    LINE_ONLY_SWITCH: [
      'you will have to switch from %(lineOne)s to %(lineTwo)s line'
    ],
    LINE_FIRST_SWITCH: [
      'you will have to first switch from %(lineOne)s to %(lineTwo)s '
    ],
    LINE_NEXT_SWITCH: [
      'and then to %(line)s '
    ],
    LINE_FINAL_SWITCH: [
      'and finally to %(lineLast)s line. '
    ],
    TRAIN_FIRST_ROUTE: [
      'From %(sourceStation)s, take the train towards %(endStation)s and get down at %(destinationStation)s which is %(stationCount)d stations away. '
    ],
    TRAIN_NEXT_ROUTE: [
      'From %(sourceStation)s, take the train towards %(endStation)s and get down at %(destinationStation)s which is %(stationCount)d stations away. '
    ],
    TRAIN_LAST_ROUTE: [
      'From %(sourceStation)s, take the train towards %(endStation)s and get down %(stationCount)d stations later. %(destinationStation)s will come right after %(previousStation)s station. '
    ]
  }
}