## Welcome to iVelopment's coding world. 

Here is where prospective clients can learn about our coding practices, level or expertise, processes and procedures. At the end of the day what matters most is that you are getting good quality work. 

Below you'll find a small but substancial sample of our coding portfolio using a variety of technologies along with the URL to the site (if available) of some of our clients. You can always reach out to us by going to [IVELOPMENT](http://www.ivelopment.com/) to learn more about us.

### Angular 

AngularJS is a JavaScript-based open-source front-end web application framework mainly maintained by Google and by a community of individuals and corporations to address many of the challenges encountered in developing single-page applications.

### Here is a sample of Directives

```markdown
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
    
   ```

To view the site go to [THE MLS](https://www.themls.com/).

### Additional Information on Angular works

If you would like to see additional information on Angular on other structures click below: 

[CONTROLLERS](https://github.com/ppalma40/module-samples/tree/master/modules/controllers)
[DIRECTIVES](https://github.com/ppalma40/module-samples/tree/master/modules/directives)
[SERVICES](https://github.com/ppalma40/module-samples/tree/master/modules/services)

### Backbone

Backbone.js is a JavaScript framework with a RESTful JSON interface and is based on the model–view–presenter (MVP) application design paradigm. Backbone is known for being lightweight, as its only hard dependency is on one JavaScript library, Underscore.js, plus jQuery for use of the full library. It is designed for developing single-page web applications, and for keeping various parts of web applications (e.g. multiple clients and the server) synchronized.

### API Documentation we do for our customers

### Why Write Good Documentation?
It makes using your API a pleasure, and with that comes praise. Which means more people will recommend your service, and everyone likes to know they are liked and loved. With that comes an increase in credability, which is beneficial in itself. Depending on your business model this could mean more money for your company.

Check our API documentation work [HERE](http://67.192.157.62/api/help)




