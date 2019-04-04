let AppParam = require('../models/appParam');
const mongoose = require('mongoose');
const EntitySchema = mongoose.model('Entity');

let entityController = {
    getEntityList: async function (req, res) {
        try {
            console.log("req", req.query)

            const entityQuery = req.filterBy ? EntitySchema.find(req.filterBy) : EntitySchema.find();
            const entityQueryCount = req.filterBy ? EntitySchema.find(req.filterBy) : EntitySchema.find();

            // order by
            if (req.orderBy && Object.keys(req.orderBy).length > 0) entityQuery.sort(req.orderBy);

            // Get total count of the query
            const totalCount = await entityQueryCount.count().exec();

            // Add limit and offset for pagination
            entityQuery.skip(Number(req.query.start))
                .limit(Number(req.query.length));

            // Get and return the query result
            const entityList = await entityQuery.exec();
            res.status(200).json({
                "draw": 1,
                "recordsTotal": totalCount,
                "recordsFiltered": totalCount,
                "data": entityList
            });
        } catch (err) {
            console.warn("ERROR:", err)
            res.status(500).json({
                error: err
            });
        }
    },

    getEntityById: function (req, res) {
        if (req.decoded) {
            EntitySchema.findOne({_id: req.id}).then((entity) => {
                if (!entity) {
                    res.status(200).json(
                        {
                            success: false,
                        }
                    );
                } else {
                    res.status(200).json(
                        {
                            // return the information including token as JSON
                            success: true,
                            entity: entity.modelFormat(entity)
                        }
                    );
                }
            })
        } else {
            res.status(200).json(
                {
                    success: false,
                }
            );
        }
    },
};

module.exports = entityController;
