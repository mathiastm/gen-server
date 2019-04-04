let Parameter = require('../config/parameter');

let QueryBuilder = {
    queryParamsFormat: function(queryParams){
        let findParams = {};
        // set offset
        if (queryParams['offset']) {
            findParams.offset = Number(queryParams['offset']);
        }
        // set limit
        if (queryParams['limit']) {
            findParams.limit = Number(queryParams['limit']);
        }
        // set order
        if (queryParams['order']) {
            findParams.order = queryParams['order'];
        }
        // set where
        if (queryParams['where']) {
            findParams.where = {};
            let andArray = [];
            const whereObject = queryParams['where'];
            Object.keys(whereObject).forEach(function (key) {
                let orCondition = {};
                let orArray = [];
                whereObject[key].forEach(function (searchItem) {
                    let option = {};
                    switch (Parameter.db_type){
                        case 'postgres':
                            option[key] = {
                                [Op.iLike]: '%'+ searchItem.value +'%'
                            };
                            break;
                        default:
                            option[key] = {
                                [Op.like]: '%'+ searchItem.value +'%'
                            };
                            break;
                    }

                    orArray.push(option);
                    orCondition = {
                        [Op.or]: orArray
                    }
                });
                andArray.push(orCondition);
            });
            findParams.where = {
                [Op.and]: andArray
            };
        }
        return findParams
    }
};

module.exports = QueryBuilder;
