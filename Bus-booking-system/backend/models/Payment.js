const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const Payment = sequelize.define(
    "Payment",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        amountPaid: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        paymentStatus: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "payments",
        timestamps: false
    }
);

module.exports = Payment;