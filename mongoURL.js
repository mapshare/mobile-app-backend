const MONGO_URL = 'mongodb://'+ process.env.DB_USER + ':' + process.env.DB_PASS + '@ds127978.mlab.com:27978/pinit';
//const MONGO_URL = 'mongodb://temp:Pwd@myvmlab.senecacollege.ca:6557/temp';


module.exports = MONGO_URL;