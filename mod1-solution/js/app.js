(function () {
  "use strict";

  angular.module('LunchChecker', [])
    .controller('LCController', LCController);

  LCController.$inject = ['$scope'];
  function LCController($scope) {
    $scope.message = "";
    $scope.lunch = "";
    $scope.checkLunch = function () {
      if($scope.lunch === "") {
        $scope.message = "Please enter data first!";
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

    }

  }

})();
