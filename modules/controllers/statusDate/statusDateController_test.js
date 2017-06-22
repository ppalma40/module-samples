describe('MlsListingSearch module', function () {
    var $controller,
        $rootScope,
        searchCriteria,
        user,
        searchTemplate,
        $q,
        status,
        $uibModalInstance;

    beforeEach(module('MlsListingSearch'));

    beforeEach(inject(function (_$controller_, _searchCriteria_, _$rootScope_, _user_, _searchTemplate_,_$q_) {
        $controller = _$controller_;
        searchCriteria = _searchCriteria_;
        $rootScope = _$rootScope_;
        user = _user_;
        searchTemplate = _searchTemplate_;
        $q = _$q_;
    }));

    describe('status Date Controller', function () {
        var $scope, areasController, status, $uibModalInstance;


        beforeEach(function () {
            $scope = $rootScope.$new();
            status = {};
            $uibModalInstance = {};
            searchCriteria(user, searchTemplate('QCK'));
            areasController = $controller('statusDateController', { $scope: $scope, searchCriteria: searchCriteria, status: status, $uibModalInstance: $uibModalInstance });

        });

        it('should call clear to clear model', function () {
            $scope.status.StartDate = "test";
            $scope.clear();
            expect($scope.status.StartDate).toBe(null);
        });
        
        it('should call setThisMonth and define dates', function () {
            $scope.setThisMonth();
            expect($scope.status.StartDate).toBeDefined();
        });
        
        it('should call setLastSeven and define dates', function () {
            $scope.setLastSeven();
            expect($scope.status.StartDate).toBeDefined();
        });
        
        it('should call setLastThirtyDays and define dates', function () {
            $scope.setLastThirtyDays();
            expect($scope.status.StartDate).toBeDefined();
        });

        it('should call setLastThreeMonths and define dates', function () {
            $scope.setLastThreeMonths();
            expect($scope.status.StartDate).toBeDefined();
        });
        
        it('should call setLastSixMonths and define dates', function () {
            $scope.setLastSixMonths();
            expect($scope.status.StartDate).toBeDefined();
        });
        
        it('should call setLastYear and define dates', function () {
            $scope.setLastYear();
            expect($scope.status.StartDate).toBeDefined();
        });

    });

})