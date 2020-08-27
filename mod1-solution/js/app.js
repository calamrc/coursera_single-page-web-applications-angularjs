(function () {
  "use strict";

  angular.module('LunchChecker', [])
    .controller('LCController', LCController);

  LCController.$inject = ['$scope'];
  function LCController($scope) {
    $scope.message = "";
    $scope.messageStyle = "";
    $scope.inputStyle = "";
    $scope.lunch = "";
    $scope.checkLunch = function () {
      if($scope.lunch === "") {
        $scope.message = "Please enter data first!";
        $scope.messageStyle = "color: red;"
        $scope.inputStyle = "border-color: red;"
        return;
      }
      var lunch_list = $scope.lunch.split(",");
      var count = 0;
      for(var i in lunch_list) {
        var item = lunch_list[i].trim();
        if(item !== "") {
          count += 1;
        }
      }
      if(count <= 3) {
        $scope.message = "Enjoy!";
      }
      else {
        $scope.message = "Too much!";
      }
      $scope.messageStyle = "color: green;"
      $scope.inputStyle = "border-color: green;"
    };
  }

})();
