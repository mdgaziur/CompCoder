const userModel = require('../models/user');

const isNotUniqueField = async ( field, fieldname ) => {
    let user = await userModel.findOne({
        fieldname: field
    });
    if(user) {
        return true;
    }
    else {
        return false;
    }
}

module.exports = isNotUniqueField;