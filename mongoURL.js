const MONGO_URL =
  'mongodb://' +
  process.env.DB_USER +
  ':' +
  process.env.DB_PASS +
  '@ds237389.mlab.com:37389/pin-it-db';
//const MONGO_URL = 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@localhost:10016/'+ process.env.DB_NAME;

// temp:Pwd
module.exports = MONGO_URL;
