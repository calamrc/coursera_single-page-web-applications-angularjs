(function () {
  "use strict";

  angular.module("ShoppingListCheckOff", [])
    .controller("ToBuyController", ToBuyController)
    .controller("AlreadyBoughtController", AlreadyBoughtController)
    .service("ShoppingListCheckOffService", ShoppingListCheckOffService);

  ToBuyController.$inject(["ShoppingListCheckOffService"]);
  function ToBuyController(ShoppingListCheckOffService) {
    var tbc = this;
    tbc.name = "";
    tbc.quantity = "";
    tbc.to_buy = ShoppingListCheckOffService.to_buy;

    tbc.addItem = function() {
      ShoppingListCheckOffService.addItem({
        name: tbc.name,
        quantity: tbc.quantity
      });
    }

    tbc.alreadyBought = function(index) {
      ShoppingListCheckOffService.alreadyBought(index);
    }
  }



  AlreadyBoughtController.$inject(["ShoppingListCheckOffService"]);
  function AlreadyBoughtController(ShoppingListCheckOffService) {
    var abc = this;

    abc.bought = ShoppingListCheckOffService.bought;

  }

  function ShoppingListCheckOffService() {
    var service = this;

    service.to_buy = [
      {name: "eggs", quantity: 12},
      {name: "butter", quantity: 2},
      {name: "brown sugar", quantity: 1},
      {name: "white sugar", quantity: 1},
      {name: "flour", quantity: 3}
    ];
    service.bought = [];

    service.addItem = function(item) {
      service.to_buy.push(item);
    };

    service.alreadyBought = function(index) {
      var item = service.to_buy.pop(index);
      service.bought.push(item);
    };

  }

})();
