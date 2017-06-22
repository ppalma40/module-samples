angular.module('MlsListingSearch').directive('propertyType', function () {
    return {
        restrict: 'E',
        templateUrl: './propertyType.html',
        controller: ['$scope', '$element', '$attrs', 'searchCriteria', '$uibModal', 'searchResults','searchDataFields',
            function ($scope, $element, $attrs, searchCriteria, $uibModal, searchResults, searchDataFields) {
                var dialog;
                var testData = [];
                $scope.DisplayName = $scope.filter.DisplayName;

            $scope.summaryShowing = {
                "Single Family": false,
                "Lease": false,
                "Condo/Co-Op": false,
                "Land": false,
                "Income": false,
                "Mobile Home": false,
                "Sale": false,
                "Lease": false,
                "Business Opportunity": false
            };

            var propertyTypes = searchCriteria().PropertyType;
            propertyTypes.forEach(function (propertyType) {
                if (propertyType.subcriteria[0] && propertyType.subcriteria[0].summary.length > 0)
                    $scope.summaryShowing[propertyType.name] = true;
            });

            $scope.propertyTypesTemplates = searchDataFields.getPropertyTypeTemplatesForSearch(searchCriteria().SearchType, searchCriteria().User.MlsId);

                var templates = angular.copy($scope.propertyTypesTemplates);
                $scope.openPriceRange = function (type, summaryShowing) {
                    dialog = $uibModal.open({
                        templateUrl: './priceRangeModal.html',
                        controller: 'priceRangeController',
                        resolve: {
                            propertyType: function () {
                                return type;
                            },
                            summaryShowing: function () {
                                return summaryShowing;
                            }
                        }
                    });

                    dialog.result.then(function (result) {

                    }, function () {

                    });
                };

                $scope.$watch(function () {
                    return searchCriteria().PropertyType;
                }, function (val, val2) {

                    val.forEach(function (pType) {
                        if (!angular.equals(pType, $scope.propertyTypesTemplates[pType.id]))
                            angular.copy(pType, $scope.propertyTypesTemplates[pType.id]);
                    });
                    
                    var ids = val.map(function (a) {
                        return a.id;
                    });
                    
                    templates.filter(function (each) {
                        return ids.indexOf(each.id) == -1;
                    }).forEach(function (pType) {
                        if (!angular.equals(pType, $scope.propertyTypesTemplates[pType.id]))
                            angular.copy(pType, $scope.propertyTypesTemplates[pType.id]);
                    });

                }, true);

            $scope.remove = function (propertyType, priceType) {
                var showing = false;

                angular.forEach(propertyType.subcriteria, function (type) {
                    if (type.field === priceType) {
                        type.summary = '';
                        type.value1 = '';
                        type.value2 = '';
                        type.options = '';
                    }

                    if (type.summary.length > 0)
                        showing = true;
                });

                $scope.summaryShowing[propertyType.name] = showing;
            };

            $scope.toggleSelection = function (propertyType) {
                var element;

                if (propertyType.checked) {
                    element = angular.element('#propertyTypeClear');
                    element.attr('style', 'display: block;');
                    searchCriteria().PropertyType.push(propertyType);
                } else {
                    
                    var idx = searchCriteria().PropertyType.map(function (e) { return e.name; }).indexOf(propertyType.name);
                    searchCriteria().PropertyType.splice(idx, 1);
                    
                    if (!searchCriteria().PropertyType.length) {
                        element = angular.element('#propertyTypeClear');
                        element.attr('style', 'display: none;');
                    }
                    $scope.summaryShowing[propertyType.name] = false;
                }
                
            };

            $scope.$on('propertyTypeClear', function () {
                var propertyTypes = [];
                angular.forEach(searchCriteria().PropertyType, function (type) {
                    propertyTypes.push(type)
                });
                angular.forEach(propertyTypes, function (type) {
                    type.checked = false;
                    $scope.toggleSelection(type);
                });
            });

            
        }]
    };
})