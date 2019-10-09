const jwt = require("jsonwebtoken");

const verifyLoginToken = (req, res, next) => {
    // Must match created token name.
    const token = req.header("authentication");
    if (!token) { return res.status(401).send("Access Denied"); }

    try{
        const verified = jwt.verify(token, process.env.LOGIN_TOKEN);
        req.user = verified;
        
        next();
    } catch(err){
        res.status(400).send("Invalid Token"); 
    }
}

module.exports.verifyLoginToken = verifyLoginToken;