const MONGO_URL = 'mongodb://'+ process.env.DB_USER + ':' + process.env.DB_PASS + '@ds127978.mlab.com:27978/pinit';
//const MONGO_URL = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@localhost:10016/'+ process.env.DB_NAME;

// temp:Pwd
module.exports = MONGO_URL;
