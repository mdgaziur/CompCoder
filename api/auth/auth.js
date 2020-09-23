const login = require('./login');
const register = require('./register');
const password_reset = require('./password_reset');

module.exports = {
    login: login,
    register: register,
    password_reset: password_reset
};