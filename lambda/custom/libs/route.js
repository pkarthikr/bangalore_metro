const stations = require('./stations.json');

function findStation(stationId){
  return stations.find(station => station.id === stationId);
}

//TODO: Right now can handle only a max of 2 lines. Either should support generic number of lines or should overwrite fo specific cities.
function shortestRoute(sourceStation, destinationStation) {
  if(sourceStation.line === destinationStation.line) {
    let lineStations = stations.filter(station => station.line === sourceStation.line).sort((a, b) => a.order - b.order);
    if(sourceStation.order < destinationStation.order){
      return {
        lines: [sourceStation.line],
        routes: [{
          source: sourceStation,
          previous: lineStations.find(station => station.order === (destinationStation.order - 1)),
          destination: destinationStation,
          end: lineStations[lineStations.length -1],
          stationCount: Math.abs(destinationStation.order - sourceStation.order) - 1
        }]
      }
    }
    else{
      return {
        lines: [sourceStation.line],
        routes: [{
          source: sourceStation,
          previous: lineStations.find(station => station.order === (destinationStation.order + 1)),
          destination: destinationStation,
          end: lineStations[0],
          stationCount: Math.abs(destinationStation.order - sourceStation.order) - 1
        }]
      }
    }
  }
  else{
    let sourceLineStations = stations.filter(station => station.line === sourceStation.line).sort((a, b) => a.order - b.order);
    let destinationLineStations = stations.filter(station => station.line === destinationStation.line).sort((a, b) => a.order - b.order);
    let sourceJunctions = sourceLineStations.filter(station => station.isJunction);
    let destinationJunctions = destinationLineStations.filter(station => station.isJunction);
    let commonJunctionIds = sourceJunctions.filter(source => !!destinationJunctions.find(destination => destination.id === source.id)).map(station => station.id);
    let shortestRoute = null, minDistance = Infinity;
    commonJunctionIds.forEach(junctionId => {
      let route = findRouteViaJunction(sourceStation, destinationStation, junctionId);
      let distance = findRoutesDistance(route);
      if(distance < minDistance){
        shortestRoute = route;
        minDistance = distance;
      }
    });
    return {
      lines: shortestRoute.map(route => route.source.line),
      routes: shortestRoute
    }
  }
}

function findRouteViaJunction(sourceStation, destinationStation, junctionId){
  let sourceLineStations = stations.filter(station => station.line === sourceStation.line).sort((a, b) => a.order - b.order);
  let destinationLineStations = stations.filter(station => station.line === destinationStation.line).sort((a, b) => a.order - b.order);
  let routes = [];
  let sourceJunction = sourceLineStations.find(station => station.id === junctionId);
  let destinationJunction = destinationLineStations.find(station => station.id === junctionId);
  if(sourceStation.order < sourceJunction.order){
    routes = [{
      source: sourceStation,
      previous: sourceLineStations.find(station => station.order === (sourceJunction.order - 1)),
      destination: sourceJunction,
      end: sourceLineStations[sourceLineStations.length - 1],
      stationCount: Math.abs(sourceJunction.order - sourceStation.order) - 1
    }];
  }
  else if(sourceStation.order > sourceJunction.order){
    routes = [{
      source: sourceStation,
      previous: sourceLineStations.find(station => station.order === (sourceJunction.order + 1)),
      destination: sourceJunction,
      end: sourceLineStations[0],
      stationCount: Math.abs(sourceJunction.order - sourceStation.order) - 1
    }];
  }
  if(destinationJunction.order < destinationStation.order){
    routes.push({
      source: destinationJunction,
      previous: destinationLineStations.find(station => station.order === (destinationStation.order - 1)),
      destination: destinationStation,
      end: destinationLineStations[destinationLineStations.length - 1],
      stationCount: Math.abs(destinationStation.order - destinationJunction.order) - 1
    });
  }
  else if(destinationJunction.order > destinationStation.order){
    routes.push({
      source: destinationJunction,
      previous: destinationLineStations.find(station => station.order === (destinationStation.order + 1)),
      destination: destinationStation,
      end: destinationLineStations[0],
      stationCount: Math.abs(destinationStation.order - destinationJunction.order) - 1
    });
  }
  return routes;
}

function findRoutesDistance(routes){
  return routes.reduce((memo, route) => {
    return memo + Math.abs(route.destination.order - route.source.order) - 1;
  }, 0);
}

module.exports = {
  findStation,
  shortestRoute
}