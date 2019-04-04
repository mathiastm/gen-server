let mongoose = require('mongoose');
let BasicActionSchema = require('../models/basicAction'); // get our mongoose model
let User = require('../models/user'); // get our mongoose model
let RoleSchema = require('../models/role'); // get our mongoose model
let AppParamSchema = require('../models/appParam'); // get our mongoose model
let profileImg = require('../../setupConstants');

let Setup = {
    init: () => {
        return new Promise(async (resolve, reject) => {
            await AppParamSchema.remove({});
            await BasicActionSchema.remove({});
            await User.remove({});
            await RoleSchema.remove({});


            await Setup.createAppParameters();
            await Setup.createBasicActions();
            await Setup.createRoles();
            await Setup.createSuperAdminUser();

            resolve();
        });
    },

    createAppParameters: () =>{
        return new Promise(async function (resolve, reject) {
            /** ======================= */
            /** CREATE APP THEME PARAM */
            /** ======================= */
            const appTheme = {
                code: "APP_THEME",
                description: "Application theme",
                value: "skin-yellow-light",
            };

            const _at = new AppParamSchema(appTheme);
            _at.save();

            resolve()


        });
    },

    createRoles: function () {
        return new Promise(async function (resolve, reject) {
            /** ======================= */
            /** CREATE SUPER ADMIN ROLE */
            /** ======================= */
            const superAdmin = {
                label: "Super Admin",
                code: "SUADMIN",
                basicActions: [],
            };
            const basicActions = await BasicActionSchema.find().exec();
            basicActions.forEach((ba) => {
                superAdmin.basicActions.push(ba._id);
            });

            const _su = new RoleSchema(superAdmin);
            _su.save();

            /** ======================= */
            /** CREATE USER ROLE */
            /** ======================= */
            const userRole = {
                label: "User",
                code: "USER",
                basicActions: [],
            };
            const saBasicActions = [
                'SEE_DASHBOARD',
                'SEE_PROFILE',
            ];
            const userRoleBasicActions = await BasicActionSchema.find({code: {$in: saBasicActions}}).exec();
            userRole.basicActions = userRoleBasicActions.map(ba => ba._id);
            const _ur = new RoleSchema(userRole);
            _ur.save();


            resolve()


        });
    },

    createBasicActions: function () {
        return new Promise(function (resolve, reject) {
            const basicActions = [
                {
                    code: "SEE_DASHBOARD",
                    namespace: "app",
                    description: "See the dashboard",
                },{
                    code: "SEE_CONTROL_MENU",
                    namespace: "app",
                    description: "See control menu",
                },{
                    code: "CHANGE_APP_THEME",
                    namespace: "app",
                    description: "Change the application theme",
                },{
                    code: "SEE_PROFILE",
                    namespace: "profile",
                    description: "See his profile",
                },{
                    code: "UPDATE_PROFILE",
                    namespace: "profile",
                    description: "Update his profile",
                },{
                    code: "SEE_ENTITY_LIST",
                    namespace: "entity",
                    description: "See the entity list",
                },
            ];

            BasicActionSchema.insertMany(basicActions, function (error, docs) {
                if (error) reject(500);
                else resolve()
            });
        });
    },
    createSuperAdminUser: function () {
        return new Promise(async function (resolve, reject) {
            const passwordHash = require("password-hash");

            let sAdmin = {};
            sAdmin.firstName = 'Mathias';
            sAdmin.lastName = 'Martin';
            sAdmin.email = 'martinmathias66@gmail.com';
            sAdmin.gender = 'male';
            sAdmin.username = 'Sadmin';
            sAdmin.password = 'nimdaS!';
            sAdmin.profileImg = profileImg.sadmin;
            sAdmin.password = passwordHash.generate(sAdmin.password);
            sAdmin.profileColorClass = "bg-red";
            sAdmin.roles = [];
            const suRole = await RoleSchema.findOne({code: "SUADMIN"}).exec();
            sAdmin.roles.push(suRole._id);

            const _sa = new User(sAdmin);
            _sa.save();

            let user = {};
            user.firstName = 'Test';
            user.lastName = 'User';
            user.email = 'test.user@gmail.com';
            user.gender = 'male';
            user.username = 'user';
            user.password = 'user!';
            user.profileImg = profileImg.user;
            user.password = passwordHash.generate(user.password);
            user.profileColorClass = "bg-red";
            user.roles = [];
            const userRole = await RoleSchema.findOne({code: "USER"}).exec();
            user.roles.push(userRole._id);

            const _u = new User(user);
            _u.save();

            resolve();


        });
    },
};

module.exports = Setup;
