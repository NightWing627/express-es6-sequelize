import dbConfig from '../config/db.config.js';
import Sequelize from 'sequelize';
import Log from './log.model.js'
// import { Sequelize } from "sequelize/dist";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    operatorAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

export default {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Log: Log(sequelize, Sequelize)
};