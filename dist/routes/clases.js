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
const Clase_model_1 = require("../models/Clase.model");
const Autentication_1 = require("../middlewares/Autentication");
const FileSystem_1 = __importDefault(require("../Classes/FileSystem"));
const fs_1 = __importDefault(require("fs"));
const fileSystem = new FileSystem_1.default();
const claseRoutes = express_1.Router();
claseRoutes.get('/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clases = yield Clase_model_1.Clase.find()
            .select('imagenClase nombre descripcion titulo calificacion id -_id')
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
claseRoutes.get('/clase/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
claseRoutes.get('/get/video/:video', (req, res) => {
    try {
        const paramVideo = req.params.video;
        const path = fileSystem.getVideoClase(paramVideo);
        var start = 0;
        var end = 0;
        if (path != '') {
            const stat = fs_1.default.statSync(path);
            const fileSize = stat.size;
            const range = req.headers.range;
            if (range) {
                const parts = range.replace(/bytes=/, "").split("-");
                start = parseInt(parts[0], 10);
                end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                if (start >= fileSize) {
                    res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
                    return;
                }
                const chunksize = (end - start) + 1;
                const file = fs_1.default.createReadStream(path, { start, end });
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(206, head);
                file.pipe(res);
            }
            else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'video/mp4',
                };
                res.writeHead(200, head);
                var stream = fs_1.default.createReadStream(path)
                    .on("open", function () {
                    stream.pipe(res);
                }).on("error", function (err) {
                    res.status(404).end(err);
                });
            }
        }
        else {
            res.status(404).end();
        }
    }
    catch (error) {
        res.status(404).end(error);
    }
});
//Se envia en la url el nombre de la imagen de la clase
claseRoutes.get('/get/img/:imagen', (req, res) => {
    const paramImagen = req.params.imagen;
    const pathFotoClase = fileSystem.getFotoClase(paramImagen);
    res.sendFile(pathFotoClase);
});
exports.default = claseRoutes;
