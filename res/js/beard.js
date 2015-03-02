var Beard = angular.module('Beard', ['ngResource']);

Beard.controller('SearchCtrl', SearchCtrl);

function SearchCtrl($scope, $resource) {
    
    var key = '0e5658ce-4c07-4ef7-a525-f824577253cd';
    
    $scope.user = $resource('https://na.api.pvp.net/api/lol/na/v1.4/summoner/:action/:name?api_key=:apikey', 
        {action:'by-name', name:'wild beard', apikey: key, callback: 'JSON_CALLBACK'}
    );
    $scope.matchHist = $resource('https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/:id/recent?api_key=:apikey',
        {id:'id',apikey: key, callback: 'JSON_CALLBACK'}
    );
    
    $scope.doSearch = function() {
        var id, name = $scope.searchTerm.replace(/\s/g, '');
        $scope.user.get({name:$scope.searchTerm}, function(result) {
            id = result[name].id;
            $scope.matchHist.get({id:id}, function(result) {
                $scope.searchResults = result.games;
            });
        });
        
    };
    
    $scope.matchLength = function(seconds) {
        var minutes = Math.floor(seconds / 60);
        var sec = seconds - minutes * 60;
        return minutes + 'm ' + sec + 's';
    };
    
} // End SearchCtrl()