"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class FileSystem {
    constructor() {
    }
    guardarImagen(file, userId, sexo) {
        return new Promise((resolve, reject) => {
            const path = this.crearCarpetaUsuario(userId);
            const nombreArchivo = this.generarNombre(file.name, sexo);
            file.mv(`${path}/${nombreArchivo}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(nombreArchivo);
                }
            });
        });
    }
    generarNombre(nombreOriginal, sexo) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1];
        return `${sexo}.${extension}`;
    }
    crearCarpetaUsuario(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads/users/', userId);
        const existe = fs_1.default.existsSync(pathUser);
        if (!existe) {
            fs_1.default.mkdirSync(pathUser);
        }
        return pathUser;
    }
    getFotoUrl(userId, img, sexo) {
        const pathFoto = path_1.default.resolve(__dirname, '../uploads/users', userId, img);
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            if (sexo == 'masculino') {
                return path_1.default.resolve(__dirname, '../../assets/masculino.png');
            }
            else {
                return path_1.default.resolve(__dirname, '../../assets/femenino.png');
            }
        }
        return pathFoto;
    }
    getFotoClase(imgClase) {
        var pathFoto = path_1.default.resolve(__dirname, '../../assets/img_clases/', imgClase);
        const existe = fs_1.default.existsSync(pathFoto);
        if (!existe) {
            pathFoto = path_1.default.resolve(__dirname, '../../assets/img_clases/default.jpg');
        }
        return pathFoto;
    }
}
exports.default = FileSystem;
