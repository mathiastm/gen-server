// let Sequelize = require('sequelize');
// let sequelize = require('../helpers/sequelize');
// let modelConfig = require('../customs/modelConfig');
// let FieldType = require('./fieldType');
// let Entity = require('./entity');
//
//
// let Field = {
//     sync: false,
//     sequelize : sequelize.define('field', {
//         "name": {
//             type: Sequelize.STRING,
//             unique: false,
//             allowNull: false
//         },
//     }),
//
//     synchronize: function(options){
//         this.sequelize.drop({cascade: true});
//         if(!this.sync) {this.sequelize.belongsTo(FieldType.sequelize);}
//         this.sync = true;
//         return this.sequelize.sync(options);
//     },
// };
//
// module.exports = Field;