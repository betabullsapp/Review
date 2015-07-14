define([
    'listing/module'
], function (listing) {
    return listing
        .directive('businessLicenses', [function () {
            return {
                restrict: 'E',
                scope: {
                    currentBusiness: '=business'
                },
                link: function(scope, element, attr) {
                    scope.$watch('currentBusiness', function(newVal) {
                        if (newVal === undefined) {
                            return;
                        }
                        angular.forEach(scope.currentBusiness.licenses, function(value, key) {
                            var paragraph = '<p class="license" id="license-'+key+'">'+value.licenseType+' '+value.licenseNumber+'</p>';
                            element.append(paragraph);
                        });
                    });
                }
            };
        }]);
});