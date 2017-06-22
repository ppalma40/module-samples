angular.module('MlsListingSearch')
    .factory('searchCriteriaRecentSearchSummary', ['$resource', '$q', '$http', '$log', 'searchDataFields', 'searchCriteriaFieldTypes', '$filter',
        function($resource, $q, $http, $log, searchDataFields, searchCriteriaFieldTypes, $filter) {
            function defaultSummaryPrinter(field) {
                if (this[field] === null ||
                    this[field] === '' ||
                    angular.isUndefined(this[field])
                ) return [];

                if (this[field].items) return summaryPrinters.Mvo.call(this, field);
                if (angular.isArray(this[field])) return summaryPrinters.Collection.call(this, field);
                if (angular.isDefined(this[field].min) || angular.isDefined(this[field].max)) return summaryPrinters.Range.call(this, field);
                if (typeof this[field] === 'object') {
                    var keys = Object.keys(this[field]);
                    var res = keys.filter(key => this[field][key]).length;
                    
                    if (res < 1) return [];
                }

                var str = '';
                $log.warn('Field doesn\'t have summary printer: ', field, this[field]);
                str += this[field].toString();

                return [str];
            }



            var summaryPrinters = {
                NoOp: function() {
                    return []
                },
                Status: function() {
                    var str = '';

                    str += this.Status.map(function(status) {
                    var statusStr =  status.name;
                    
                    if(status.startDate) {
                        statusStr += ' ' + $filter('date')(status.startDate, 'MM/dd/yyyy');
                    }
                    
                    if(status.endDate) {
                        statusStr += '-' + $filter('date')(status.endDate, 'MM/dd/yyyy');
                    }

                    return statusStr;
                }).join(', ');

                return [str];
                },
                PropertyType: function() {

                    if (this.PropertyType.length == 0) return [];

                    var str = '';

                    str += this.PropertyType.map(function(e) {

                        return e.name;
                    }).join(',');

                    return [str];
                },
                Range: function accessRange(fieldName) {
                    if ((this[fieldName].min === null || this[fieldName].min === "") && (this[fieldName].max === null || this[fieldName].max === "")) return [];
                        var str = '';
					   str +=  fieldName + ' ';

                    if (this[fieldName].min !== null && this[fieldName].min !== '') {
                        str += this[fieldName].min + ' ';
                    }

                    if (this[fieldName].max !== null && this[fieldName].max !== '') {
                        str += 'up to ' + this[fieldName].max;
                    }

                    return [str];

                },
                Collection: function accessCollection(fieldName) {

                    if (this[fieldName].length < 1) return [];
                    var str = '';

                    if (fieldName == 'ListSellAgent' ) {
                        str += this[fieldName].map(function (elem) {

                            return elem.username;
                        }).join(",");

                        return [str];
                    }
                    if (fieldName == 'ListSellOffice') {
                        str += this[fieldName].map(function (elem) {

                            return elem.firmCode;
                        }).join(",");

                        return [str];
                    }
                    str += this[fieldName].join(',');

                    return [str];
                },
                Mlsnum: function(fieldName) {
                    if (this[fieldName].mlsNumbers === null || this[fieldName].mlsNumbers.length < 1) return [];
                    var str = '';
					
                    str += 'Mls# ';
                    str += this[fieldName].mlsNumbers.map(e => e.text).join(',');

                    return [str];
                },
                Text: function(fieldName) {

                    if (this[fieldName].text === null || this[fieldName].text.length < 1) return [];
                    var str = '';

                    str += this[fieldName].text.map(function(elem) {

                        return elem.text;
                    }).join(',');

                    return [str];
                },
                Bool: function(fieldName) {
                    if (this[fieldName] === null || angular.isUndefined(this[fieldName])) return [];
                    if (this[fieldName] === 'N/A') return [];
                    if (this[fieldName] === 'All') return [];
                    var str = fieldName + ' ';

                    str += this[fieldName] == 1 ? 'YES' : 'NO';

                    return [str];
                },
                StreetDirPrefix: function(fieldName) {
                    if (!this[fieldName].value) return [];
                    var str = '';

                    str += this[fieldName].value;

                    return [str];
                },
                Mvo: function accessMvo(fieldName) {
                    if (this[fieldName].items.length < 1) return [];
                    var str = fieldName + ' ';

                    str += this[fieldName].items.map(function(e) {

                        return e.Label;
                    }).join(', ');

                    return [str];
                },
                area: function(fieldName) {

                    if (this[fieldName].length < 1) return [];
                    var str = ''; 

                    str += this[fieldName].map(function(each) {

                        return each.AreaName;
                    }).join(', ');

                    return [str];
                },
                city: function(fieldName) {

                    if (this[fieldName].length < 1) return [];
                    var str = '';

                    str += this[fieldName].map(function(each) {

                        return each.Name;
                    }).join(',');

                    return [str];

                },
                Zip: function(fieldName) {

                    if (this[fieldName].length < 1) return [];
                    var str = '';

                    str += this[fieldName].map(function(each) {
                        
                        return each.text;
                    }).join(',');

                    return [str];
                },
                subdivision: function(fieldName) {

                    if (this[fieldName].text === null || this[fieldName].text.length < 1) return [];
                    var str = '';

                    str += this[fieldName].text.map(function(each) {

                        return each.SubdivDisplay;
                    }).join(',');

                    return [str];
                },
                county: function(fieldName) {
                    if (this[fieldName].length < 1) return [];
                    var str = '';

                    str += this[fieldName].map(function(each) {

                        return each.ShortValue;
                    }).join(',');

                    return [str];
                },
                Inventory: function(fieldName) {

                    if (this[fieldName].value == null) return [];
                    var str = '';

                    str += this[fieldName].value.toString();

                    return [str];
                },
                ChangeType: function(fieldName) {

                    if (this[fieldName].ChangeTypes == null || this[fieldName].ChangeTypes == "") return [];

                    var str = '';

                    str += this[fieldName].ChangeTypes.map(function(each) {

                        return each.label;
                    }).join(',');

                    str += ' ' + this[fieldName].DateMethod.toString();

                    if (this[fieldName].ChangeDate.DateSince != null)
                        str += ' ' + $filter('date')(this[fieldName].ChangeDate.DateSince, 'MM/dd/yyyy HH:mm');
                    if (this[fieldName].ChangeDate.DateTo !== null)
                        str += ' ' + $filter('date')(this[fieldName].ChangeDate.DateTo, 'MM/dd/yyyy');

                    if (this[fieldName].DateMethod.toString() == 'DaysBeforeToday')
                        str += ' ' + this[fieldName].DaysBeforeToday.toString();

                    return [str];
                },
                TransactionSide: function(fieldName) {

                    if (this[fieldName].value == null) return [];

                    var str = '';
                    str += this[fieldName].value.toString();

                    return [str];
                },
                mvoText: function(fieldName) {

                    return summaryPrinters.Text.call(this, fieldName);
                },

                Unknown: defaultSummaryPrinter
            };

            return function getSummaryString(criteria) {
                var summaryArray = [];
                var fields = Object.keys(criteria);

                fields = fields.filter(function(each) {

                    return each.indexOf('User') == -1;
                });

                fields.forEach(function(fieldName) {

                    var fieldDescriptor = searchCriteriaFieldTypes[fieldName] || {
                        Type: 'Unknown'
                    };
                    var accessor = summaryPrinters[fieldDescriptor.Type] || defaultSummaryPrinter;

                    try {
                        summaryArray = summaryArray.concat(accessor.call(criteria, fieldName));
                    } catch (error) {
                        $log.error('Error creating summary for: ' + fieldName + ' - ' + accessor.name + ' Error: ' + error);
                        $log.log(fieldName);

                    }
                });

                return summaryArray.join('; ');
            };
        }
    ]);
