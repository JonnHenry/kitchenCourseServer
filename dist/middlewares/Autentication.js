"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificaToken = void 0;
const Token_1 = __importDefault(require("../Classes/Token"));
exports.verificaToken = (req, res, next) => {
    const userToken = req.get('X-Token') || '';
    Token_1.default.comprobarToken(userToken)
        .then((decoded) => {
        req.usuario = decoded.usuario;
        next();
    })
        .catch(err => {
        res.json({
            ok: false,
            token: '',
            mensaje: 'El usuario no tiene acceso'
        });
    });
};
