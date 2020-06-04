"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Clases creadas
const Server_1 = __importDefault(require("./Classes/Server"));
//Dependencias externas de paquetes utilizadas
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const dotenv = __importStar(require("dotenv"));
const DataBase_1 = __importDefault(require("./Classes/DataBase"));
const Users_1 = __importDefault(require("./routes/Users"));
const Clases_1 = __importDefault(require("./routes/Clases"));
//Variables de configuracion global
dotenv.config();
//Midleware
const server = new Server_1.default(Number(process.env.PORT));
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(cors_1.default());
server.app.use(body_parser_1.default.json());
server.app.use(express_fileupload_1.default({ useTempFiles: false }));
//Rutas de mi aplicacion
server.app.use('/user', Users_1.default);
server.app.use('/curso', Clases_1.default);
//Conexión a la base de datos
const database = new DataBase_1.default(Number(process.env.DB_PORT) || 0, process.env.DB_USER || '', process.env.DB_PASS || '', process.env.DB_HOST || '');
database.conectarDB()
    .then((conexion) => {
    if (conexion == true) {
        console.log('Base de datos iniciada correctamente');
        server.startServer();
    }
    else {
        console.log('Error al iniciar a la base de datos');
    }
})
    .catch((err) => {
    console.log('Error el iniciar la base de datos');
});
