const postchain = artifacts.require("postchain");

module.exports = function(deployer) {
  deployer.deploy(postchain);
};