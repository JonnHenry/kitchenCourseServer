"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    constructor(port) {
        this.port = port;
        this.app = express_1.default();
    }
    startServer() {
        this.app.listen(this.port, () => {
            console.log(`Servidor funcionando en el puerto ${this.port}`);
        });
    }
}
exports.default = Server;
