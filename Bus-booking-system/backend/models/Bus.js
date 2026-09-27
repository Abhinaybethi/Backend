const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Bus = sequelize.define(
    "Bus",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        busNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        totalSeats: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        availableSeats: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "buses",
        timestamps: false
    }
);

module.exports = Bus;