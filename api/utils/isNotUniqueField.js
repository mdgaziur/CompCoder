const userModel = require('../models/user');

const isNotUniqueField = async ( field, currentUser, fieldname ) => {
    let query = {};
    query[fieldname] = field;
    let user = await userModel.findOne(query);
    if(user) {
        if(user.uuid == currentUser.uuid) {
            return false;
        }
        return true;
    }
    else {
        return false;
    }
}

module.exports = isNotUniqueField;