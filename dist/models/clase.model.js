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
        default: '',
        required: [true, 'La descripcion es necesaria para la clase']
    },
    id: {
        type: Number,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    urlVideo: {
        type: String,
        required: [true, 'El video es necesario para la clase']
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
