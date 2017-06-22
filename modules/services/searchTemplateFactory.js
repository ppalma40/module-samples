
angular.module('MlsListingSearch')
    .factory('searchTemplate', ['$resource', 'user', '$cacheFactory',
        function($resource, user, $cacheFactory) {
            var searchTemplateUrl = '/URL__PATH/:SearchTemplateID';
            var templateCache = $cacheFactory('templatesCache');

            function clearCache (response) {
               
                templateCache.removeAll();

                return response.resource;
            }

            var SearchTemplate = $resource(searchTemplateUrl, {
                agentId: user.Username
            }, {
                'get': {
                    cache: templateCache,
                    method:'GET'
                },
                'getAll': {
                    isArray: true,
                    url: '/URL__PATH/:agentId/template/:searchType',
                    method: 'GET'
                },
                'update': {
                    method: 'PUT',
                    params: {
                        searchType: '@SearchType',
                        SearchTemplateID: '@SearchTemplateID',
                        agentId: '@AgentId'
                    },
                    interceptor: {
                        'response': clearCache
                    }
                },
                'save': {
                    method: 'POST',
                    params: {
                        searchType: '@SearchType',
                        SearchTemplateID: '@SearchTemplateID',
                        agentId: '@AgentId'
                    },
                    interceptor: {
                        'response': clearCache
                    }
                },
                'setAsDefault': {
                    method: 'GET',
                    url: '/URL__PATH/:SearchTemplateID',
                    params: {
                        searchType: '@SearchType',
                        SearchTemplateID: '@SearchTemplateID',

                    },
                    interceptor: {
                        'response': clearCache
                    }

                },
                'delete': {
                    method: 'DELETE',
                    params: {
                        searchType: '@SearchType',
                        SearchTemplateID: '@SearchTemplateID',
                        agentId: '@AgentId'
                    },
                    interceptor: {
                        'response': clearCache
                    }

                },
                'GetFieldsForSearchType': {
                    method: 'GET',
                    isArray: true,
                    url: '/URL__PATH/:searchType',
                    params: {
                        searchType: '@SearchType'

                    },
                    cache: true
                },
                'CustomFormNameExist': {
                    method: 'GET',
                    url: '/URL__PATH/:SearchTemplateID',
                    params: {
                        searchType: '@SearchType',
                        SearchTemplateID: '@SearchTemplateID',
                        agentId: '@AgentId',
                        templateDisplayName: '@FormDisplayName'
                    }
                }
            });

            return SearchTemplate;
        }
    ]);
