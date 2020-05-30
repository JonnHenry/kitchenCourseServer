"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class DataBase {
    constructor(port, user, password, hostDB) {
        this.port = port;
        this.user = user;
        this.password = password;
        this.hostDB = hostDB;
    }
    conectarDB() {
        const uri = `mongodb://${this.user}:${this.password}@${this.hostDB}:${this.port}/kitchenCourse`;
        mongoose_1.default.connect(uri, { useNewUrlParser: true, useCreateIndex: true }, (error) => {
            if (error) {
                return false;
            }
            else {
                return true;
            }
        });
    }
}
exports.default = DataBase;
