angular.module('MlsListingSearch')
    .controller('priceRangeController', [
        '$scope', 'searchCriteria', 'propertyType', '$uibModalInstance', 'priceRangeService', '$compile', 'summaryShowing',
        function ($scope, searchCriteria, propertyType, $uibModalInstance, priceRangeService, $compile, summaryShowing) {

            $scope.showSold = false;
            $scope.propertyTypeClone = null;
            $scope.propertyTypeClone = angular.copy(propertyType);
            $scope.showPriceRanges = {
                ListPricePerSqft: false,
                ListPricePerLsz: false,
                ListPricePerAcre: false,
                SoldPricePerSqFt: false,
                SpLpPercent: false,
                SpOlpPercent: false,
                ListPrice: true,
                SoldPrice: false
            };

            angular.forEach(searchCriteria().Status, function (value, key) {
                if (value.name === 'Sold') {
                    $scope.showPriceRanges.SoldPrice = true;
                    $scope.showSold = true;
                }
            });

            $scope.showNullOrZero = {
                ListPricePerSqft: false,
                ListPricePerLsz: false,
                ListPricePerAcre: false,
                SpLpPercent: false,
                SpOlpPercent: false
            };


            $scope.rangeChange = function (min, max, value) {
                if (min.length > 0 || max.length > 0) {
                    $scope.showNullOrZero[value] = true;

                } else {
                    $scope.showNullOrZero[value] = false;
                }
            }

            $scope.toggleSelection = function toggleSelection(option) {
                var idx = $scope.propertyTypeClone.options.indexOf(option);

                if (idx > -1) {
                    $scope.propertyTypeClone.options.splice(idx, 1);
                }
                else {
                    $scope.propertyTypeClone.options.push(option);
                }
            };

            angular.forEach($scope.propertyTypeClone.subcriteria, function (value, key) {
                $scope.rangeChange(value.value1, value.value2, value.field);
            });

            $scope.isAutoSuggest = function (field) {
                return field === 'ListPrice' || field === 'SoldPrice' ? true : false;
            };

            $scope.priceCategories = priceRangeService.getPriceCategories(searchCriteria().PropertyType, $scope.propertyTypeClone, $scope.showSold, $scope);

            $scope.selectedPrice = $scope.priceCategories[0];

            $scope.getPriceName = function (fieldName) {
                return priceRangeService.getPriceName(fieldName);
            }

            $scope.applyToAll = false;


            var getPriceLimit = function (ptype) {
                var arr = [{
                    'ListPricePerSqft': 6
                }, {
                    'ListPricePerLsz': 6
                }, {
                    'ListPricePerAcre': 6
                }, {
                    'SpLpPercent': 3
                }, {
                    'SpOlpPercent': 3
                }];
                return arr.filter(function (value) {
                    return value;
                });
            }

            $scope.priceLimit = getPriceLimit($scope.propertyTypeClone.abbr);
            var originalValues = priceRangeService.setOriginalValues($scope.propertyTypeClone);

            var priceRange = {
                minListPriceRanges: priceRangeService.getMinPriceRange($scope.propertyTypeClone.name),
                maxListPriceRanges: priceRangeService.getMinPriceRange($scope.propertyTypeClone.name),
                minSoldPriceRanges: priceRangeService.getMinPriceRange($scope.propertyTypeClone.name),
                maxSoldPriceRanges: []
            };

            $scope.priceRange = priceRange;

            $scope.setMaxListPriceRange = function (value, priceType) {
                if (priceType === 'maxListPrice') {
                    priceRange.maxListPriceRanges = priceRangeService.calculatePriceRange(value.replace(/,/g, ''), $scope.propertyTypeClone.name);
                } else if (priceType === 'maxSoldPrice') {
                    priceRange.maxSoldPriceRanges = priceRangeService.calculatePriceRange(value.replace(/,/g, ''), $scope.propertyTypeClone.name);
                }
                if (priceType.indexOf('max') > -1) {
                    var maxPrice = angular.element('#' + priceType);
                    maxPrice.focus();
                }
            };

            var addPriceRange = function (selectedprice) {
                switch (selectedprice) {
                    case 'List Price/Sq Ft':
                        $scope.showPriceRanges.ListPricePerSqft = true;
                        break;
                    case 'List Price/Lot Size':
                        $scope.showPriceRanges.ListPricePerLsz = true;
                        break;
                    case 'List Price/Acre':
                        $scope.showPriceRanges.ListPricePerAcre = true;
                        break;
                    case 'Sold Price/Sq Ft':
                        $scope.showPriceRanges.SoldPricePerSqFt = true;
                        break;
                    case 'SP/LP %':
                        $scope.showPriceRanges.SpLpPercent = true;
                        break;
                    case 'SP/OLP %':
                        $scope.showPriceRanges.SpOlpPercent = true;
                        break;
                    default:
                        break;
                }
            };

            $scope.addPriceRange = function (selectedPrice) {
                var index = $scope.priceCategories.indexOf(selectedPrice);
                $scope.priceCategories.splice(index, 1);

                addPriceRange(selectedPrice);

                $scope.selectedPrice = $scope.priceCategories[0];
            };

            $scope.showPriceRangesTest = function (field) {

            }

            $scope.ok = function (propertyTypeClone) {
                var hasSummary = false;

                angular.forEach(propertyTypeClone.subcriteria, function (criteria) {

                    angular.forEach(propertyType.subcriteria, function (subProp) {
                        if (subProp.field === criteria.field) {
                            subProp.options = criteria.options;
                            subProp.value1 = criteria.value1;
                            subProp.value2 = criteria.value2;
                            subProp.summary = criteria.summary;

                            subProp.summary = priceRangeService.getPriceSummary(criteria.value1, criteria.value2, criteria.field);
                            if (subProp.summary.length > 0) {
                                hasSummary = true;
                            }

                            summaryShowing[propertyType.name] = hasSummary;
                        }
                    });

                    criteria.summary = priceRangeService.getPriceSummary(criteria.value1, criteria.value2, criteria.field);
                    if (criteria.summary.length > 0) {
                        hasSummary = true;
                    }

                    summaryShowing[propertyTypeClone.name] = hasSummary;
                    if ($scope.applyToAll) {
                        angular.forEach(searchCriteria().PropertyType, function (property, key) {

                            angular.forEach(property.subcriteria, function (propertyCriteria) {
                                if (propertyCriteria.field === criteria.field) {
                                    propertyCriteria.options = criteria.options;
                                    propertyCriteria.value1 = criteria.value1;
                                    propertyCriteria.value2 = criteria.value2;
                                    propertyCriteria.summary = criteria.summary;
                                }
                            });
                            summaryShowing[property.name] = hasSummary;
                        });
                    }
                });

                $uibModalInstance.close(searchCriteria().PropertyType);
            };

            $scope.cancel = function () {
                $uibModalInstance.close();
            };


        }
    ]);