angular.module('MlsListingSearch')
    .directive('compositeFilter', ['$compile', 'searchCriteria', function ($compile, searchCriteria) {
        var SNAKE_CASE_REGEXP = /[A-Z]/g;
        function snake_case(name, separator) {
            separator = separator || '_';
            return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
                return (pos ? separator : '') + letter.toLowerCase();
            });
        }

        return {
            restrict: 'EA',
            templateUrl:'./compositeFilter.html',
            link: function (scope, elem, attrs) {

                scope.clearValues = function (filter) {
                    if (filter === 'propertyType') {
                        scope.$broadcast('propertyTypeClear');
                        searchCriteria().PropertyType = searchCriteria().PropertyType.filter(function (propertyTypes) {
                            return false;
                        });
                        
                        var element = angular.element('#propertyTypeClear');
                        element.attr('style', 'display: none;');
                    }
                }
            }
        };
    }]);