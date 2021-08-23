const { DataTypes } = require('sequelize');
const db = require('../db');

const User = db.define('user', {
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        require: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    }
});

module.exports = User;