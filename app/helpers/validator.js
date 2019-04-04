// import validatorjs from "validator";
const validatorjs = require("validator");

const validate = (function () {

    return async function validate(validator, value, model) {
        if (!validator) throw new Error("Must pass validator parameter");
        if (!validator.validate) throw new Error("Validator must have validate attribute");
        if (!Array.isArray(validator.validate)) throw new Error("Validator validate attribute must be an Array");

        let valid = true;
        const validate = validator.validate;
        const result = {
            valid: true,
            messages: []
        };

        for (let i = 0; i < validate.length; i++) {
            if (validate[i].validator === "undefined") {
                continue;
            }

            let args = validate[i].arguments;
            args = !Array.isArray(args) ? [args] : args;
            const clonedArgs = args.slice(0);
            clonedArgs.unshift(value || "");
            clonedArgs.push(model)

            let message = validate[i].message || "";
            const title = validator.title;

            if (title) {
                message = message.replace("{TITLE}", title);
            }
            message = message.replace(/{ARGS\[(\d+)\]}/g, function (replace, argIndex) {
                const val = args[argIndex];
                return val !== undefined ? val : "";
            });

            if (typeof validate[i].validator === "function") {

                valid = await validate[i].validator.apply(null, clonedArgs);
                if (!valid) {
                    result.valid = false;
                    result.messages.push(message);
                }
            } else {
                if (typeof validatorjs[validate[i].validator] === "undefined") {
                    console.warn("validate-model error: validator is not correct for: " + validator);
                    continue;
                }

                if (validate[i].validator === "isLength") {
                    if (typeof clonedArgs[0] === "string") {
                        clonedArgs[0] = clonedArgs[0].trim();
                    }
                }

                valid = await validatorjs[validate[i].validator].apply(null, clonedArgs);
                if (!valid) {
                    result.valid = false;
                    result.messages.push(message);
                }
            }
        }
        return result;
    };
})();

const validateAll = (function () {

    return async function validateAll(validators, model) {
        const result = {
            valid: true,
            messages: {}
        };
        await Promise.map(Object.keys(validators),async (attribute) => {
            const validation = await validate(validators[attribute], model[attribute], model);
            if (!validation.valid) {
                result.valid = false;
                result.messages[attribute] = validation.messages;
            }
        });
        return result;
    };

})();

const validateFunction = (function () {

    return function validateFunction(validators) {
        return function validate(values) {
            const validation = validateAll(validators, values);
            if (!validation.valid) return validation.messages;
            return {};
        };
    };

})();


module.exports =  {
    validate: validate,
    validateAll: validateAll,
    validateFunction: validateFunction
};
