var Votation = artifacts.require("./Votation.sol");

contract("Votation", function (accounts) {
  var votationInstance;

  it("votation start with zero candidate", function () {
      return Votation.deployed().then(function (instance) {
          return instance.candidateCount();
      }).then(function (count) {
          assert.equal(count, 0);
      });
  });
});