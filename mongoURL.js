const MONGO_URL = 'mongodb://'+ process.env.DB_USER + ':' + process.env.DB_PASS + '@ds219078.mlab.com:19078/pinit';


module.exports = MONGO_URL;