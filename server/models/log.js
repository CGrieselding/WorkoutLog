const { DataTypes } = require('sequelize');
const db = require('../db');

const WorkOutLog = db.define('workoutlog', {
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    definition: {
        type: DataTypes.STRING,
        allowNull: false
    },
    result: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner_id: {
        type: DataTypes.INTEGER
    }
});

module.exports = WorkOutLog;