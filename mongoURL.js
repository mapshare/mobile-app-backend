const MONGO_URL = 'mongodb://'+ process.env.DB_USER + ':' + process.env.DB_PASS + '@ds127978.mlab.com:27978/pinit';


module.exports = MONGO_URL;