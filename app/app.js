function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
angular.module('yelpEasy', [])
    .config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['**']);
    })
    .factory('Results', function($http) {
        var consumerSecret = 'l_VQaMDZPMG2BScyVv6uaujqbSM';
        var tokenSecret = 'CXaIxS4QLlLtOt91_phvN-mjwHs';

        var getData = function(name, type, cbNum, cb) {
            var method = 'GET';
            var url = 'http://api.yelp.com/v2/search';
            var params = {
                callback: 'angular.callbacks._' + cbNum,
                location: name,
                category_filter: type,
                oauth_consumer_key: 'NHjxaFVARbxUKmALhv4-uw',
                oauth_token: 'V8_kdz_yjOC_xdDhw0a5S-QAD98ytr3U',
                oauth_signature_method: "HMAC-SHA1",
                oauth_timestamp: new Date().getTime(),
                oauth_nonce: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                term: 'food',
            };
            var signature = oauthSignature.generate(method, url, params, consumerSecret, tokenSecret, {
                encodeSignature: false
            });
            params['oauth_signature'] = signature;
            
            $http.jsonp(url, {
                params: params
            }).success(cb).catch(function(err) {
                console.error(err);
            })

        }

        var choose = function(yelpData, cb) {
            var result = null;
            var recurse = function(dats) {
                console.log(dats)
                var ind = dats.businesses[Math.floor(Math.random() * dats.businesses.length)];
                console.log(ind.rating)
                if (ind.rating < 3 || ind.is_closed) {
                    recurse(dats);
                } else {
                    result = ind;
                }
            }
            recurse(yelpData);
            cb(result);
        }

        // var getData = function(city, genre){
        //   return $http.jsonp({
        //     method: 'GET',
        //     url: 'http://api.yelp.com/v2/search/?location=San Francisco, CA&limit=1&category_filter=pizza',
        //     oauth_consumer_key: "NHjxaFVARbxUKmALhv4-uw",
        //     oauth_token: "V8_kdz_yjOC_xdDhw0a5S-QAD98ytr3U",
        //     oauth_signature_method: "HMAC-SHA1",

        // .then(function(resp) {
        //     console.log(resp)
        //     return resp
        return {
            getData: getData,
            choose: choose
        }
    })

.controller('YelpController', function($scope, $window, Results) {
    $scope.result = {};
    $scope.show = false;
    $scope.count = 0;
    $scope.urlTest = 'http://www.yelp.com/biz/little-star-pizza-san-francisco'
    $scope.mapUrl = null

    $scope.getResults = function() {
        $scope.result = {};

        console.log($scope.result)
        Results.getData($scope.city, $scope.cuisine.toLowerCase(), $scope.count, function(data) {
            Results.choose(data, function(selection) {
                $scope.result.restaurant = selection
                $scope.mapUrl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyDemlRiZZBfMxvQ3WjFdnbdmBNoDrGH__g&q=" + selection.name.split(' ').join('+') + ',' + selection.location.city;
                console.log($scope.mapUrl)
            })
        })
        $scope.show = true;
        $scope.count++;
    }
})
