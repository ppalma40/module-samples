angular.module('MlsListingSearch')
    .directive('hotsheetChangeTypes', ['searchDataFields', 'user', 'searchCriteria', function(searchDataFields, user, searchCriteria) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {

                function recallChangeTypes() {
                    searchDataFields.GetMvoLookups(user.Username, 'ChangeType', searchCriteria().SearchType).then(function(res) {
                        scope.ChangeTypes = searchCriteria().ChangeType.ChangeTypes.map(id => _.find(res, lookup => lookup.ShortValue === id.value));
                    });
                };
                recallChangeTypes();

                scope.removeChangeType = function(changeType) {
                    var changeTypes =  _.filter( searchCriteria().ChangeType.ChangeTypes, function(item) {
                        return item.value !== changeType.ShortValue;
                    });
                    searchCriteria().ChangeType.ChangeTypes = changeTypes;
                    recallChangeTypes();

                };
            }
        };
    }])
