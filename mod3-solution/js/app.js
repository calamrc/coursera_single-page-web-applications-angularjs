(function () {
'use strict';

  angular.module('NarrowItDown', [])
    .controller("NarrowItDownController", NarrowItDownController)
    .service('MenuCategoriesService', MenuCategoriesService)
    .directive("foundItems", FoundItemsDirective)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


  NarrowItDownController.$inject = ["MenuCategoriesService"];
  function NarrowItDownController (MenuCategoriesService) {
    var narrow = this;

    narrow.searchTerm = "";
    narrow.found = [];
    narrow.clicked = false;

    narrow.removeItem = function (itemIndex) {
      narrow.found.splice(itemIndex, 1);
    };

    narrow.getMenuItems = function () {
      narrow.found = [];
      narrow.clicked = true;
      if (narrow.searchTerm !== "") {
        var promise = MenuCategoriesService.getMenuCategories();

        promise
          .then(function (response) {
            var categories = response.data;
            for (var i in categories) {
              var shortName = categories[i].short_name;
              var new_promise = MenuCategoriesService.getMenuForCategory(shortName);
              new_promise
                .then(function (response) {
                  var menuForCategory = response.data.menu_items;
                  for (var j in menuForCategory) {
                    try {
                      var description = menuForCategory[j].description.toLowerCase();
                      if (description.indexOf(narrow.searchTerm.toLowerCase()) !== -1) {
                        var item = {
                          name: menuForCategory[j].name,
                          short_name: menuForCategory[j].short_name,
                          description: menuForCategory[j].description,
                        }
                        narrow.found.push(item);
                      }
                    }
                    catch {
                      console.log("no description");
                    }
                  }
                })
                .catch(function (error) {
                  console.log(error);
                })
            }
          })
          .catch(function (error) {
            console.log("Something went terribly wrong.");
          });
      }
    };
  }

  MenuCategoriesService.$inject = ['$http', 'ApiBasePath'];
  function MenuCategoriesService($http, ApiBasePath) {
    var service = this;

    service.getMenuCategories = function () {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/categories.json")
      });
      return response;
    };

    service.getMenuForCategory = function (shortName) {
      var response = $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json"),
        params: {
          category: shortName
        }
      });
      return response;
    };
  }

  function FoundItemsDirective() {
    var ddo = {
      restrict: "E",
      templateUrl: 'foundItems.html',
      scope: {
        foundItems: '<',
        clicked: "<",
        onRemove: '&'
      },
      controller: FoundItemsDirectiveController,
      controllerAs: 'found',
      bindToController: true,
      link: FoundItemsDirectiveLink
    };

    return ddo;
  }

  function FoundItemsDirectiveLink(scope, element, attrs, controller) {
    scope.$watch('found.checkFoundItems()', function (newValue, oldValue) {
      if (newValue === false) {
        displayCookieWarning();
      }
      else {
        removeCookieWarning();
      }

    });

    function displayCookieWarning() {
      var warningElem = element.find("div.error");
      warningElem.slideDown(900);
    }


    function removeCookieWarning() {
      var warningElem = element.find("div.error");
      warningElem.slideUp(900);
    }
  }

  function FoundItemsDirectiveController() {
    var found = this;

    found.checkFoundItems = function () {
      if (found.clicked) {
        return (found.foundItems.length > 0);
      }
      return true;
    }
  }


})();
