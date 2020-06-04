"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clase = void 0;
const mongoose_1 = require("mongoose");
const claseSchema = new mongoose_1.Schema({
    titulo: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
        default: ''
    },
    id: {
        type: Number,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    imagenClase: {
        type: String,
        required: [true, 'La imagen de la clase es necesaria para la clase']
    },
    nombreVideo: {
        type: String,
        required: [true, 'El video es necesario para la clase']
    },
    calificacion: {
        type: Number,
        default: 0
    },
    comentarios: [
        {
            usuario: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Usuario',
                required: [true, 'Debe de existir una referencia a un usuario']
            },
            comentario: {
                type: String,
                default: ''
            }
        }
    ]
});
exports.Clase = mongoose_1.model('Clase', claseSchema);
