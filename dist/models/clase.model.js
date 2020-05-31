"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clases = void 0;
const mongoose_1 = require("mongoose");
const claseSchema = new mongoose_1.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    descripcion: {
        type: String,
        default: '',
        required: [true, 'La descripcion es necesaria para la clase']
    },
    calificacion: {
        type: Number,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    comentarios: [{
            usuario: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Usuario',
                required: [true, 'Debe de existir una referencia a un usuario']
            },
            comentario: {
                type: String,
                default: ''
            }
        }]
});
exports.Clases = mongoose_1.model('Clase', claseSchema);
