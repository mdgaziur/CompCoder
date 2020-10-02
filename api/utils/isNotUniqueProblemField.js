const problemModel = require('../models/problem');

const isNotUniqueProblemField = async (fieldData, fieldName) => {
    let query = {};
    query[fieldName] = fieldData;
    isNotUnique = await problemModel.findOne(query);
    return isNotUnique ? true : false;
}

module.exports = isNotUniqueProblemField;