// let Sequelize = require('sequelize');
// let sequelize = require('../helpers/sequelize');
// let modelConfig = require('../customs/modelConfig');
//
// let FieldType = {
//     sync: false,
//     sequelize : sequelize.define('field_type', {
//         "name": {
//             type: Sequelize.STRING,
//             unique: false,
//             allowNull: false
//         }
//     }),
//
//     synchronize: function(options){
//         this.sequelize.drop({cascade: true});
//         if(!this.sync) {}
//         this.sync = true;
//         return this.sequelize.sync(options);
//     },
//
//     modelFormat: function (model) {
//         let excludedFields = [
//         ];
//        return modelConfig.returnExcludedModel(model,excludedFields);
//     },
// };
//
// module.exports = FieldType;