angular.module('yelpEasy.services', [])
.factory('results', function ($http) {
  var getResult = function(city, genre){
    return $http({
      method: 'GET',
      url: 'http://api.yelp.com/v2'
    })
    .then(function (resp){
      return resp.data
    })
  };

  return{
    getResult: getResult
  }

})