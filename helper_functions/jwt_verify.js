const jwt = require('jsonwebtoken');

async function verify_auth(token) {
    const accessToken = token;
    if(!accessToken) {
        return false;
    }
    await jwt.verify(accessToken, process.env.JWT_SECRET_TOKEN, (err, uuid) => {
        if (err) return false;
        return uuid.uuid;
    });
}

module.exports = verify_auth;