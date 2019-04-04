let modelConfig = {
    returnExcludedModel: function(model,excludedFields){

        if(!Array.isArray(model)){
            excludedFields.forEach(function(field){
                model[field] = false;
            });
        }else{
            model.forEach(function(element,index){
                excludedFields.forEach(function(field){
                    model[index][field] = false;
                });
            })
        }

        return model;
    }
};

module.exports = modelConfig;
