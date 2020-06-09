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
userRoutes.post('/login', (req, res) => {
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
//Sube la foto de un usuario y se debe de actualiza el token
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
    const nombreAvatar = yield fileSystem.guardarImagen(file, req.usuario._id, req.usuario.sexo);
    Usuario_model_1.Usuario.findOne({ email: req.usuario.email }, (err, userDB) => {
        if (err || !userDB) {
            return res.status(200).json({
                ok: false,
                token: '',
                mensaje: 'El usuario no se encuentra registrado, verifique los datos'
            });
        }
        userDB.avatar = nombreAvatar || req.usuario.avatar;
        userDB.save()
            .then((user) => {
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
    const usuario = {
        nombre: body.nombre,
        avatar: body.avatar || body.sexo + '.png',
        email: body.email,
        password: bcrypt_1.default.hashSync(body.password, 10),
        celular: body.celular,
        sexo: body.sexo
    };
    Usuario_model_1.Usuario.create(usuario).then(userDB => {
        console.log(userDB);
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
userRoutes.get('/user/get', Autentication_1.verificaToken, (req, res) => {
    try {
        res.status(200).json({
            ok: true,
            usuario: req.usuario,
            mensaje: 'El usuario ha accedido correctamente'
        });
    }
    catch (error) {
        res.status(404).json({
            ok: false,
            usuario: {},
            mensaje: 'El usuario no se encuentra registrado'
        });
    }
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
userRoutes.post('/allow', Autentication_1.verificaToken, (req, res) => {
    const body = req.body;
    Usuario_model_1.Usuario.update({ email: body.email }, { habilitado: true }, function (err, userDB) {
        if (err || !userDB) {
            return res.status(500).json({
                ok: false,
                token: '',
                mensaje: 'Error al habilitar al usuario'
            });
        }
        return res.status(200).json({
            ok: true,
            token: '',
            mensaje: 'El usuario se ha habilitado con exito'
        });
    });
});
//Obtener una imagen de un usuario
userRoutes.get('/imagen/avatar/:id', (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    try {
        Usuario_model_1.Usuario.findOne({ _id: userId }, (err, userDB) => {
            console.log(userDB);
            if (err || !userDB) {
                return res.status(200).json({
                    ok: false,
                    mensaje: 'El usuario no se encuentra registrado, verifique los datos'
                });
            }
            const img = String(userDB.avatar);
            const sexo = String(userDB.sexo);
            const pathFoto = fileSystem.getFotoUrl(userDB._id, img, sexo);
            res.sendFile(pathFoto);
        });
    }
    catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'El usuario no se encuentra registrado, verifique los datos'
        });
    }
});
exports.default = userRoutes;
