angular.module('MlsListingSearch')
    .controller('statusDateController', [
        '$scope', 'searchCriteria', 'status', '$uibModalInstance', 'statusService', function ($scope, searchCriteria, status, $uibModalInstance, statusService) {
            var oldStartDate = status.startDate;
            var oldEndDate = status.endDate;
            
            $scope.applyToAll = false;
            $scope.status = status;
            $scope.popupStartDate = null;
            $scope.popupEndDate = null;
            $scope.title = status.name.replace(/\b\w/g, function(l){ return l.toUpperCase() })
            $scope.offMarketStatuses = ['Sold', 'Canceled', 'Expired', 'Withdrawn'];

            if (status.startDate)
                $scope.popupStartDate = status.startDate;
            if (status.endDate)
                $scope.popupEndDate = status.endDate;

            $scope.disabledApply = function () {
                return $scope.popupStartDate == null && $scope.popupEndDate == null && $scope.offMarketStatuses.indexOf($scope.status.name) > -1
            };

            $scope.resetValues = function () {
                $scope.popupStartDate = oldStartDate;
                $scope.popupEndDate = oldEndDate;
            };

            $scope.maxDate = new Date();

            $scope.getStartRangeClass = function (date, mode) {

                if (mode === 'day') {
                    if ($scope.popupStartDate && $scope.popupEndDate) {
                        if (date > $scope.popupStartDate && date < $scope.popupEndDate) {
                            
                            return 'range';
                        }
                    }
                }
            };


            $scope.altInputFormats = ['mm/dd/yyyy', 'MM/dd/yy'];

            $scope.getEndRangeClass = function (date, mode) {

                if (mode === 'day') {
                    if ($scope.popupStartDate && $scope.popupEndDate) {
                        if (date > $scope.popupStartDate && date < $scope.popupEndDate) {
                          
                            return 'range';
                        } 
                    }
                }
            };

            $scope.apply = function () {
               
                if ($scope.statusDateForm.$valid) {
                     status.startDate = $scope.popupStartDate;
                     status.endDate = $scope.popupEndDate;
                    if ($scope.applyToAll) {

                        angular.forEach(searchCriteria().Status, function (value, key) {
                            value.startDate = status.startDate;
                            value.endDate = status.endDate;
                            value.dateSummary = statusService.getDateSummary(status.startDate, status.endDate);
                            value.showDateSummary = true;
                        });
                    }
                    if (status.startDate || status.endDate) {

                        var myStatus= _.find(searchCriteria().Status, function(s) {
                            return s.name == status.name;
                        });
                        myStatus.startDate = status.startDate;
                        myStatus.endDate = status.endDate;
                        myStatus.dateSummary = statusService.getDateSummary(status.startDate, status.endDate);
                        myStatus.showDateSummary = true;
                        status.dateSummary = statusService.getDateSummary(status.startDate, status.endDate);
                        status.showDateSummary = true;
                    } else {
                        status.showDateSummary = false;
                        status.dateSummary = '';
                    }
                    $uibModalInstance.close();
                }
            }
            $scope.cancel = function () {
                $scope.resetValues();
                $uibModalInstance.close();
            }
            $scope.setCustom = function () {
                angular.element('#startDate').focus();
            }

            $scope.statusDateOptions = {
                showWeeks: false
            }

            $scope.setThisMonth = function () {
                var date = new Date();
                var startDate = new Date(date.getFullYear(), date.getMonth(), 1);
                $scope.popupStartDate = startDate;

                $scope.popupEndDate = new Date();
            }
            $scope.setLastSeven = function () {
                var startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                $scope.popupStartDate = startDate;

                $scope.popupEndDate = new Date();
            }
            $scope.setLastThirtyDays = function () {
                var startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
                $scope.popupStartDate = startDate;

                $scope.popupEndDate = new Date();
            }
            $scope.setLastThreeMonths = function () {
                var startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 3);
                $scope.popupStartDate = startDate;

                $scope.popupEndDate = new Date();
            }
            $scope.setLastSixMonths = function () {
                var startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 6);
                $scope.popupStartDate = startDate;

                $scope.popupEndDate = new Date();
            }
            $scope.setLastYear = function () {
                var startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 12);
                $scope.popupStartDate = startDate;

                $scope.popupEndDate = new Date();
            }
        }
    ]);