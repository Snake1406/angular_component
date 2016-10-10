var app = angular.module('testTask', []);

app.controller('testTaskCtrl', ['$scope', function($scope) {
    $scope.emails = [];
    $scope.addEmails = function() {
        var strValues = "abcdefg12345";
        var strEmail = "";
        var strTmp;
        for (var i = 0; i < 10; i++) {
            strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
            strEmail = strEmail + strTmp;
        }
        strTmp = "";
        strEmail = strEmail + "@";
        for (var j = 0; j < 8; j++) {
            strTmp = strValues.charAt(Math.round(strValues.length * Math.random()));
            strEmail = strEmail + strTmp;
        }
        strEmail = strEmail + ".com"
        $scope.emails.push({
            email: strEmail,
            isValid: true
        });
    };
    $scope.getEmailsCount = function() {
        alert($scope.emails.length);
    };

}]);

app.directive('emailsEditor', function() {
  var  isValid = function validateEmail(email) {
     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     return re.test(email);
  }

  return {
    restrict: 'E',
    template: `
	<p class="header">Share "Board name" with others</p>
	<ul style="margin: 0; padding: 0; list-style-type: none; border: 1px; display: inline-block;">
        <li ng-repeat="item in emails track by $index" style="float: left; border: 1px solid;" ng-class=\"getTagClass(item.isValid)\"">
            <span> {{item.email}} </span>
            <span ng-click="removeTag($index)"> X </span>
        </li>
        <li style="float: left;">
            <input placeholder="Add more people" style="border: 0;" ng-keydown="addTag($event)" ng-keyup="clr($event)" ng-blur="addTag($event)" ng-paste="addTag($event)" ng-model='value'>
        </li>
    </ul><br/>
	`,
    replace: false,
    transclude: true,
    scope: {
        emails: '=info'
    },
    link: function(scope, element, attrs, ngModelCtrl) {
        var KEYS = {
            enter: 13,
            comma: 188
        },
        hotkeys = [KEYS.enter, KEYS.comma];

        scope.removeTag = function(index) {
            scope.emails.splice(index, 1);
        };

        scope.addTag = function(event) {
            var key, item;

            switch (event.type) {
                case 'keydown':{
					key = event.keyCode;
                    if (hotkeys.indexOf(key) === -1) 
                        return;
                    scope.emails.push({
                        email: scope.value,
                        isValid: isValid(scope.value)
                    });
                    break;
				}                    
                case 'blur':{
					if (scope.value) {
                        scope.emails.push({
                            email: scope.value,
                            isValid: isValid(scope.value)
                        });
                        scope.value = '';
                    }
                    break;
				}                    
                case 'paste':{
					event.stopPropagation();
                    event.preventDefault();
                    data = event.clipboardData.getData('text/plain');
					scope.emails.push({
						email: data,
						isValid: isValid(data)
					});
					break;
				}                   
            }
        };

        scope.clr = function(event) {
            var key = event.keyCode;

            if (hotkeys.indexOf(key) === -1) {
                return;
            }
            scope.value = '';
        };

        scope.getTagClass = function(isValid) {
            return isValid ? 'tag-green' : 'tag-red';
        }
    }
  };
});