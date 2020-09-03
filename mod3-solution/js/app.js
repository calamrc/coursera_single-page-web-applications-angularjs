(function () {
'use strict';

  angular.module('NarrowItDown', [])
    .controller("NarrowItDownController", NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive("foundItems", FoundItemsDirective)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");


  NarrowItDownController.$inject = ["MenuSearchService"];
  function NarrowItDownController (MenuSearchService) {
    var narrow = this;

    narrow.test = "<span>Test</span>"

    narrow.searchTerm = "";
    narrow.found = [];
    narrow.clicked = false;

    narrow.removeItem = function (itemIndex) {
      narrow.found.splice(itemIndex, 1);
    };

    narrow.getMatchedMenuItems = function () {
      narrow.clicked = true;
      if (narrow.searchTerm.trim() !== "" ) {
        narrow.found = MenuSearchService.getMatchedMenuItems(narrow.searchTerm);
      }
      else {
        narrow.found = [];
      }
    };
  }

  MenuSearchService.$inject = ['$http', 'ApiBasePath'];
  function MenuSearchService($http, ApiBasePath) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      var foundItems = [];
      var promise = service.getMenuForCategory();
      promise
        .then(function (response) {
          var menuItems = response.data.menu_items;
          for (var j in menuItems) {
            try {
              var description = menuItems[j].description;
              var findInDescription = description.toLowerCase().indexOf(searchTerm.toLowerCase().trim()) !== -1;
              var name = menuItems[j].name;
              var findInName = name.toLowerCase().indexOf(searchTerm.toLowerCase().trim()) !== -1;
              var short_name = menuItems[j].short_name;
              var findInShortName = short_name.toLowerCase().indexOf(searchTerm.toLowerCase().trim()) !== -1;

              if (findInDescription || findInName || findInShortName) {
                //var re = new RegExp(searchTerm, "gi");
                //var items = {
                  //name: name.replace(re, "<span>" + searchTerm + "</span>"),
                  //short_name: short_name.replace(re, "<span>" + searchTerm + "</span>"),
                  //description: description.replace(re, "<span>" + searchTerm + "</span>"),
                //}
                foundItems.push(menuItems[j]);
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
      return foundItems;
    }

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
      warningElem.slideDown(500);
    }


    function removeCookieWarning() {
      var warningElem = element.find("div.error");
      warningElem.slideUp(500);
    }
  }

  function FoundItemsDirectiveController() {
    var found = this;

    found.checkFoundItems = function () {
      return found.foundItems.length > 0;
    }
  }


})();
