const jwt = require("jsonwebtoken");

const verifyTokenEmail = (req, res, next) => {
    // Must match created token name.
    const token = req.params.token;
    
    if (!token) { return res.status(401).send("Access Denied"); }

    try{
        const verified = jwt.verify(token, process.env.EMAIL_TOKEN);
        req.unverifiedUser = verified;
        
        next();
    } catch(err){
        res.status(400).send("Invalid Token"); 
    }
}

module.exports.verifyTokenEmail = verifyTokenEmail;