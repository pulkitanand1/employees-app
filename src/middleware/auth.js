const jwt = require('jsonwebtoken');
const { verifyToken } = require('../utils/authentication');

const auth = async (req, res, next) => {
    const token = req.header('Authorization').replace("Bearer ", "");
    const data = await verifyToken(token);
    if(data){
        console.log(data)
        next();
    }
    else{
        res.status(401).send({error: 'Not authenticated!'})
    }
}

module.exports = auth;