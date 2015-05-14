var Beard = angular.module('Beard', ['ngResource']);

Beard.controller('SearchCtrl', SearchCtrl);

function SearchCtrl($scope, $resource) {
    
    var key = '0e5658ce-4c07-4ef7-a525-f824577253cd',
        champs = (function() {
            var champs = null;
            $.ajax({
                async: false,
                global: false,
                url: 'res/js/champs.json',
                dataType: 'json',
                success: function(d) {
                    champs = d;   
                }
            });
            return champs;
        })();
    
    $scope.user = $resource('https://na.api.pvp.net/api/lol/na/v1.4/summoner/:action/:name?api_key=:apikey', 
        {action:'by-name', name:'wild beard', apikey: key, callback: 'JSON_CALLBACK'}
    );
    $scope.matchHist = $resource('https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/:id/recent?api_key=:apikey',
        {id:'id',apikey: key, callback: 'JSON_CALLBACK'}
    );
    
    $scope.doSearch = function() {
        var id, name = $scope.searchTerm.replace(/\s/g, '');
        $scope.user.get({name:$scope.searchTerm}, function(result) {
            $('.bg-redhead').hide();
            id = result[name].id;
            $scope.matchHist.get({id:id}, function(result) {
                for ( var i in result.games ) {
                    if ( result.games[i].subType == 'NORMAL' ) {
                        result.games[i].subType = 'Normal';
                    } else if ( result.games[i].subType == 'RANKED_SOLO_5x5' ) {
                        result.games[i].subType = 'Ranked';   
                    } else if ( result.games[i].subType == 'ARAM_UNRANKED_5x5' ) {
                        result.games[i].subType = 'ARAM';
                    } else if ( result.games[i].subType == 'NORMAL_3x3' ) {
                        result.games[i].subType = 'Twisted Treeline';   
                    } else if ( result.games[i].subType == 'BOT' ) {
                        result.games[i].subType = 'Bots';   
                    }
                    for ( var x in champs ) {
                        if ( result.games[i].championId == champs[x].id ) {
                            result.games[i].championId = champs[x].name;   
                        }
                    }
                }
                $scope.searchResults = result.games;
            });
        }, function(errorRes) {
            $('.bg-redhead').text('Summoner not found.').show();
        });
        
    };
    
    $scope.matchLength = function(seconds) {
        var minutes = Math.floor(seconds / 60);
        var sec = seconds - minutes * 60;
        return minutes + 'm ' + sec + 's';
    };
    
} // End SearchCtrl()