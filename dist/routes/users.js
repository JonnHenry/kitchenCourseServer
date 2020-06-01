"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Token_1 = __importDefault(require("../Classes/Token"));
const Autentication_1 = require("../middlewares/Autentication");
const Usuario_model_1 = require("../models/Usuario.model");
const FileSystem_1 = __importDefault(require("../Classes/FileSystem"));
const userRoutes = express_1.Router();
const fileSystem = new FileSystem_1.default();
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
                email: userDB.email,
                sexo: userDB.sexo
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
userRoutes.post('/upload', [Autentication_1.verificaToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            token: '',
            mensaje: 'No se subió ningun archivo'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            token: '',
            mensaje: 'No se subió ningun archivo'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            token: '',
            mensaje: 'Lo que subió no es una imagen'
        });
    }
    yield fileSystem.guardarImagen(file, req.usuario._id, req.usuario.sexo);
    Usuario_model_1.Usuario.findOne({ email: req.usuario.email }, (err, userDB) => {
        if (err || !userDB) {
            return res.status(200).json({
                ok: false,
                token: '',
                mensaje: 'El usuario no se encuentra registrado, verifique los datos'
            });
        }
        userDB.avatar = file.name || req.usuario.avatar;
        userDB.save()
            .then(() => {
            const tokenUser = Token_1.default.getJwtToken({
                nombre: userDB.nombre,
                _id: userDB._id,
                avatar: userDB.avatar,
                email: userDB.email,
                sexo: userDB.sexo
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
}));
//Registrar un usuario
userRoutes.post('/create', (req, res) => {
    const body = req.body;
    const user = {
        nombre: body.nombre,
        avatar: body.avatar || body.sexo + '.png',
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
            email: userDB.email,
            sexo: userDB.sexo
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
        userDB.password = bcrypt_1.default.hashSync(body.password, 10) || userDB.password;
        userDB.celular = body.celular || userDB.celular;
        userDB.save()
            .then(() => {
            const tokenUser = Token_1.default.getJwtToken({
                nombre: userDB.nombre,
                _id: userDB._id,
                avatar: userDB.avatar,
                email: userDB.email,
                sexo: userDB.sexo
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
userRoutes.get('/imagen/:userid/:img', Autentication_1.verificaToken, (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathFoto = fileSystem.getFotoUrl(userId, img, req.usuario.sexo);
    res.sendFile(pathFoto);
});
exports.default = userRoutes;
