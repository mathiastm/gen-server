let AppParam = require('../models/appParam');

let appController = {
    getDefaultConfiguration(req, res) {
        AppParam.find().then((params) => {
            const resultParams = {};
            console.log()
            params.forEach((param) => {
                switch (param.code) {
                    case 'APP_THEME':
                        resultParams.theme = param.value;
                        break;
                    default:
                        break;
                }
            });
            res.status(200).json({
                success: true,
                params: resultParams
            });
        })
    },

    changeAppTheme: (req, res) => {
        if (req.decoded) {
            AppParam.findOne({code: "APP_THEME"}).then((theme) => {
                if (!theme) {
                    res.status(200).json(
                        {
                            success: false,
                            message: "AppParam not found : " + "APP_THEME"
                        }
                    );
                } else {
                    theme.value = req.body.appTheme;
                    theme.save().then((theme) => {
                        res.status(200).json(
                            {
                                success: false,
                                appTheme: theme.value
                            }
                        );
                    })
                }
            })
        } else {
            res.status(200).json(
                {
                    success: false,
                    message: "No token provided"
                }
            );
        }
    },
};

module.exports = appController;
