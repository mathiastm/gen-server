let parameters = {
    // db_type: 'postgres',
    db_type: 'mongodb',

    db_host: process.env.MONGO_HOST,
    db_port: process.env.MONGO_PORT,
    db_user: process.env.MONGO_USER,
    db_pass: process.env.MONGO_PASS,
    db_db: process.env.MONGO_DB,
    db_admin_db: process.env.MONGO_ADMIN_DB,

    //==============//
    // Token access //
    //==============//
    token_secret: '455754bf28768daa81bfcca95e77da83e42d5b41'
};

module.exports = parameters;
