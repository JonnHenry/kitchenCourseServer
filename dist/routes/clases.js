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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Clase_model_1 = require("../models/Clase.model");
const Autentication_1 = require("../middlewares/Autentication");
const ClaseRoutes = express_1.Router();
ClaseRoutes.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clases = yield Clase_model_1.Clase.find()
            .select('orden nombre descripcion calificacion')
            .sort({ id: 'asc' })
            .exec();
        res.status(200).json({
            ok: true,
            clases,
            mensaje: ''
        });
    }
    catch (error) {
        res.status(500).json({
            ok: true,
            clase: [],
            mensaje: 'Error al ejecutar la consulta'
        });
    }
}));
ClaseRoutes.get('/clase/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idClase = req.params.orden;
    try {
        const clase = yield Clase_model_1.Clase.find({ id: idClase })
            .populate('comentarios.usuario', '-password -email -celular -sexo -habilitado')
            .exec();
        res.status(200).json({
            ok: true,
            clase,
            mensaje: ''
        });
    }
    catch (error) {
        res.status(500).json({
            ok: true,
            clase: {},
            mensaje: 'Error al ejecutar la consulta'
        });
    }
}));
//Se debe de ingresar para esta llamada la siguiente informacion
//{
//  _id: id //Id del usuario
//  comentario: comentario
//  calificacion: calificacion Number !!Es la califcacion que el usuario ha dado    
//}
ClaseRoutes.post('/:idClase/comentario', Autentication_1.verificaToken, (req, res) => {
    const body = req.body;
    const idClase = req.params.idClase;
    const usuarioComentario = {
        usuario: req.usuario._id,
        comentario: body.comentario,
    };
    Clase_model_1.Clase.findOne({ id: idClase }, (err, claseDB) => {
        if (err || !claseDB) {
            return res.status(200).json({
                ok: false,
                token: '',
                mensaje: 'El clase no se encuentra registrado, verifique los datos'
            });
        }
        const calificacionActual = (claseDB.calificacion + body.calificacion) / 2;
        claseDB.calificacion = calificacionActual || claseDB.calificacion;
        claseDB.comentarios.push(usuarioComentario);
        claseDB.save()
            .then(() => {
            res.status(200).json({
                ok: true,
                mensaje: 'El comentario se ha registrado correctamente'
            });
        })
            .catch(() => {
            return res.status(400).json({
                ok: false,
                mensaje: 'Verifique los datos ingresados'
            });
        });
    });
});
