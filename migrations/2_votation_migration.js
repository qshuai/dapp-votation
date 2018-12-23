var Votation = artifacts.require("Votation");

module.exports = function (deployer) {
    deployer.deploy(Votation);
};