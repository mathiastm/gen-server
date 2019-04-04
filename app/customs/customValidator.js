let validatorCustom = {
  containsSpecialChar: function(value){
      return !/^[a-zA-Z0-9- ]*$/.test(value);
  }
};

module.exports = validatorCustom;