define(
[
    'bootstrap/module', 
    'bootstrap/lib/plugins/text!../template/yo-circular-progressbar.html',
    'bootstrap/lib/plugins/css!../css/circular-progressbar.css'
], 
function(yoBootstrap, yoCircularProgressbarTemplate) {
    "use strict";
    yoBootstrap.constant('yoCircularProgressbarConfig',{
        _radius: 60,
        _strokeWidth: 5,
        _max: 100,
        _speedNormal: 150,
        _speedSlow: 300,
        _speedFast: 75
    })
    .controller('yoCircularProgressbarController', ['$scope', '$element', '$timeout','yoCircularProgressbarConfig', function($scope, $element, $timeout,yoCircularProgressbarConfig){
        var barWrapper, barBackground, progressBar,
            radius = 0,
            strokeWidth = 0,
            center = { x: 0, y: 0 },
            min, max, value,
            speed, delay, step;
        
        $scope.count = $scope.min? parseInt($scope.min):0;

        this.init = function(element){
            radius = parseInt($scope.radius)? parseInt($scope.radius) : yoCircularProgressbarConfig._radius;
            strokeWidth = parseInt($scope.strokeWidth)? parseInt($scope.strokeWidth) : yoCircularProgressbarConfig._strokeWidth;
            center.x = radius + strokeWidth;
            center.y = radius + strokeWidth;

            min = parseInt($scope.min)? parseInt($scope.min):0;
            max = parseInt($scope.max)? parseInt($scope.max):yoCircularProgressbarConfig._max;

            speed = getAnimationSpeed();

            //Styling svg elements
            barWrapper = element.find('.bar-wrapper');
            barBackground = element.find('.bar-background');
            progressBar = element.find('.bar');

            barWrapper.attr({
                'width': 2*center.x,
                'height': 2*center.y
            });

            barBackground.attr({
                'r': radius,
                'cx': center.x,
                'cy': center.y,
                'stroke-width': strokeWidth
            });

            progressBar.attr({
                'stroke-width': strokeWidth,
            });
        };

        this.reDraw = function(updatedValue, updatedMax){
            //Clean up count
            $scope.count = 0;

            //Update variables
            value = updatedValue;
            max = parseInt(updatedMax)? parseInt(updatedMax):yoCircularProgressbarConfig._max;
            step = max/speed;
            delay = 0.1*speed/step;

            loadingProgressBar();
        };

        var updateProgressBar = this.updateProgressBar = function(max){
            progressBar.attr({
                'd': getArcData(center.x, center.y, radius, percentageToDegree(min), percentageToDegree(max))
            });
        };

        var loadingProgressBar = function() {
            if($scope.count< (value<=max?value:max)) {
                $scope.count+=Math.ceil(step);
                updateProgressBar($scope.count);

                $timeout(loadingProgressBar,delay);
            }
            else {
                $scope.count = value;
            }
        };

        var loadingAnimation = $timeout(loadingProgressBar,delay);

        $scope.$on('$destroy', function(){
            $timeout.cancel(loadingAnimation);
        });

        //Private Helper Function
        var polarToCartesian = function(cx, cy, r, degree) {
            var radian = (parseInt(degree)-90) * Math.PI / 180.0;

            return {
                x: cx + (r * Math.cos(radian)),
                y: cy + (r * Math.sin(radian))
            };
        };

        var getArcData = function(cx, cy, r, startDegree, endDegree) {
            var d = [];

            var startPoint = polarToCartesian(cx, cy, r, endDegree),
                endPoint = polarToCartesian(cx, cy, r, startDegree),
                arcSweep = (endDegree-startDegree)<=180? 0:1;

            if (endDegree === 360) {
                d = ["M", cx, cy, "m", -r, 0, "a", r, r, 0, 1, 0, r*2, 0, "a", r, r, 0, 1, 0, -r*2, 0];
            }
            else {
                d = ["M", startPoint.x, startPoint.y, "A", r, r, 0, arcSweep, 0, endPoint.x, endPoint.y];  
            }

            return d.join(" ");
        };

        var percentageToDegree = function(number){
            if(number >= max) {
                return 360;
            }
            else {
                return number/max * 360.0;
            }
        };

        var getAnimationSpeed = function(){
            if($scope.speed === 'slow') {
                return yoCircularProgressbarConfig._speedSlow;
            }
            else if ($scope.speed === 'fast') {
                return yoCircularProgressbarConfig._speedFast;
            }
            else {
                return yoCircularProgressbarConfig._speedNormal;
            }
        };
    }])

    .directive('yoCircularProgressbar', function() {
        return {
            restrict: 'AE',
            transclude: true,
            replace: true,
            template: yoCircularProgressbarTemplate,
            controller: 'yoCircularProgressbarController',
            scope: {
                radius: '@yoRadius',
                strokeWidth: '@yoStrokeWidth',
                value: '=yoValue',
                max: '=yoMax',
                title: '@yoTitle',
                speed: '@yoSpeed'
            },
            link: function(scope, elements, attrs, ctrl) {
                ctrl.init(elements);  

                scope.$watchCollection('[value, max]', function(updatedData){
                    ctrl.reDraw(updatedData[0], updatedData[1]);
                });
            }
        };
    });
});