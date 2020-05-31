"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Token_1 = __importDefault(require("../Classes/Token"));
const Autentication_1 = require("../middlewares/Autentication");
const Usuario_model_1 = require("../models/Usuario.model");
const userRoutes = express_1.Router();
//Iniciar sesion de un usuario
userRoutes.post('login', (req, res) => {
    const body = req.body;
    Usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err || !userDB || !userDB.habilitado) {
            return res.status(401).json({
                ok: false,
                token: '',
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }
        if (userDB.compararPassword(body.password)) {
            const tokenUser = Token_1.default.getJwtToken({
                _id: userDB.id,
                nombre: userDB.nombre,
                avatar: userDB.avatar,
                email: userDB.email
            });
            res.status(200).json({
                ok: true,
                token: tokenUser,
                mensaje: ''
            });
        }
        else {
            return res.status(401).json({
                ok: false,
                token: '',
                mensaje: 'Usuario/contraseña no son correctos ***'
            });
        }
    });
});
//Registrar un usuario
userRoutes.post('/create', (req, res) => {
    const body = req.body;
    const user = {
        nombre: body.nombre,
        avatar: body.avatar,
        email: body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        celular: body.celular,
        sexo: body.sexo
    };
    Usuario_model_1.Usuario.create(user).then(userDB => {
        const tokenUser = Token_1.default.getJwtToken({
            nombre: userDB.nombre,
            _id: userDB._id,
            avatar: userDB.avatar,
            email: userDB.email
        });
        res.status(200).json({
            ok: true,
            token: tokenUser,
            mensaje: 'Usuario registrado correctamente'
        });
    }).catch(err => {
        res.status(200).json({
            ok: false,
            token: '',
            mensaje: 'Verifique la información ingresada'
        });
    });
});
//Actualizar información de un usuario
userRoutes.put('/update', Autentication_1.verificaToken, (req, res) => {
    const body = req.body;
    Usuario_model_1.Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err || !userDB) {
            return res.status(200).json({
                ok: false,
                token: '',
                mensaje: 'El usuario no se encuentra registrado, verifique los datos'
            });
        }
        userDB.nombre = body.nombre || userDB.nombre;
        userDB.avatar = body.avatar || userDB.avatar;
        userDB.password = bcrypt_1.default.hashSync(body.password, 10) || userDB.password;
        userDB.celular = body.celular || userDB.celular;
        userDB.save()
            .then(() => {
            const tokenUser = Token_1.default.getJwtToken({
                nombre: userDB.nombre,
                _id: userDB._id,
                avatar: userDB.avatar,
                email: userDB.email
            });
            res.status(200).json({
                ok: true,
                token: tokenUser,
                mensaje: 'La información se ha actualizado correctamente'
            });
        })
            .catch(() => {
            return res.status(400).json({
                ok: false,
                token: '',
                mensaje: 'Verifique los datos ingresados'
            });
        });
    });
});
userRoutes.delete('/delete', Autentication_1.verificaToken, (req, res) => {
    const body = req.body;
    Usuario_model_1.Usuario.update({ email: body.email }, { habilitado: false }, function (err, userDB) {
        if (err || !userDB) {
            return res.status(500).json({
                ok: false,
                token: '',
                mensaje: 'Error al eliminar al usuario'
            });
        }
        return res.status(200).json({
            ok: true,
            token: '',
            mensaje: 'El usuario se ha eliminado con exito'
        });
    });
});
