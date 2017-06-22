describe('MlsListingSearch module', function () {
    var $controller,
        $rootScope,
        searchCriteria,
        user,
        searchTemplate,
        $q,
        propertyType;
        
    beforeEach(module('MlsListingSearch'));

    beforeEach(inject(function (_$controller_, _searchCriteria_, _$rootScope_, _user_, _searchTemplate_, _$q_, _priceRangeService_) {
        $controller = _$controller_;
        searchCriteria = _searchCriteria_;
        $rootScope = _$rootScope_;
        user = _user_;
        searchTemplate = _searchTemplate_;
        $q = _$q_;
        priceRangeService = _priceRangeService_;
    }));

    describe('priceRangeController', function () {
        var $scope, priceRangeController, propertyType, $uibModalInstance;


        beforeEach(function () {
            $scope = $rootScope.$new();
            propertyType = {};
            $uibModalInstance = {                    
                close: jasmine.createSpy('modalInstance.close'),
                dismiss: jasmine.createSpy('modalInstance.dismiss'),
                result: {
                    then: jasmine.createSpy('modalInstance.result.then')
                }
            }
            searchCriteria(user, searchTemplate('QCK'));
            priceRangeController = $controller('priceRangeController', { $scope: $scope, searchCriteria: searchCriteria, propertyType: propertyType, $uibModalInstance: $uibModalInstance, priceRangeService: priceRangeService });

        });

        it('should have a propertyType price', function () {
            var propertyType = { id: 0, Value: 0, name: "Single Family", minListPrice: '650,000', maxListPrice: '750,000', minSoldPrice: '', maxSoldPrice: '', listPriceSummary: null, soldPriceSummary: null }
            expect(propertyType.minListPrice).toBe('650,000');
        });

        it('should have a priceRange', function () {
            expect($scope.priceRange.startingPriceRanges).toBeDefined();
        });

        it('should have a priceRange startingPriceRanges with length', function () {
            expect($scope.priceRange.startingPriceRanges.length).toEqual(10);
            expect($scope.priceRange.endingPriceRanges.length).toEqual(0);
        });

        it('should call clear method and clear all listPrices', function () {
            $scope.propertyType.minListPrice = 'test';
            $scope.clear();
            expect(propertyType.minListPrice).toBe('');
            expect(propertyType.maxListPrice).toBe('');
            expect(propertyType.minSoldPrice).toBe('');
            expect(propertyType.maxSoldPrice).toBe('');
        });

        it('should call ok method and update listPriceSummary', function () {
            var propertyType = { id: 0, Value: 0, name: "Single Family", minListPrice: '650,000', maxListPrice: '750,000', minSoldPrice: '', maxSoldPrice: '', listPriceSummary: null, soldPriceSummary: null }
            $scope.ok(propertyType);
            expect(propertyType.listPriceSummary).toBe('$650K-$750K');
        });

        it('should call ok method and update all selected propertytypes', function () {
            searchCriteria().PropertyType =
            [
                { id: 0, Value: 0, name: "Single Family", minListPrice: '', maxListPrice: '', minSoldPrice: '', maxSoldPrice: '', listPriceSummary: null, soldPriceSummary: null },
                { id: 1, Value: 4, name: "Lease", minListPrice: '', maxListPrice: '', minSoldPrice: '', maxSoldPrice: '', listPriceSummary: null, soldPriceSummary: null }
            ];
            var propertyType = { id: 0, Value: 0, name: "Single Family", minListPrice: '650,000', maxListPrice: '750,000', minSoldPrice: '', maxSoldPrice: '', listPriceSummary: null, soldPriceSummary: null }
            $scope.applyToAll = true;
            $scope.ok(propertyType);
            expect(searchCriteria().PropertyType).toEqual(jasmine.arrayContaining(
                [{ id: 0, Value: 0, name: "Single Family", minListPrice: '650,000', maxListPrice: '750,000', minSoldPrice: '', maxSoldPrice: '', listPriceSummary: '$650K-$750K', soldPriceSummary: '' },
                { id: 1, Value: 4, name: "Lease", minListPrice: '650,000', maxListPrice: '750,000', minSoldPrice: '', maxSoldPrice: '', listPriceSummary: '$650K-$750K', soldPriceSummary: '' }]
        ));
        });
    });

})