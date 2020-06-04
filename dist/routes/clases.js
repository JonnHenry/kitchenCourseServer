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
const claseRoutes = express_1.Router();
claseRoutes.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clases = yield Clase_model_1.Clase.find()
            .select('nombre descripcion calificacion')
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
            clases: [],
            mensaje: 'Error al ejecutar la consulta'
        });
    }
}));
//Se envia el id de la clase que igual es el orden de cada clase
claseRoutes.get('/clase', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idClase = req.params.id;
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
claseRoutes.post('/:idClase/comentario', Autentication_1.verificaToken, (req, res) => {
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
claseRoutes.post('/create', (req, res) => {
    const body = req.body;
    const clase = {
        id: body.id,
        titulo: body.titulo,
        descripcion: body.descripcion,
        nombreVideo: body.nombreVideo,
        comentarios: []
    };
    console.log(clase);
    Clase_model_1.Clase.create(clase).then(clase => {
        res.status(200).json({
            ok: true,
            clase,
            mensaje: 'La clase se ha registrado correctamente'
        });
    })
        .catch(err => {
        res.status(200).json({
            ok: false,
            clase: {},
            mensaje: 'Verifique la información ingresada'
        });
    });
});
exports.default = claseRoutes;
