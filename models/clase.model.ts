import { Schema, model} from 'mongoose';
import IClase from '../interfaces/IClase';


const claseSchema = new Schema({
    
    nombre: {
        type: String,
        required: [ true, 'El nombre es necesario' ]
    },
    descripcion: {
        type: String,
        default: '',
        required: [ true, 'La descripcion es necesaria para la clase' ]
    },
    calificacion: {
        type: Number,
        unique: true,
        required: [ true, 'El correo es necesario' ]
    },
    urlVideo:{
        type: String,
        required: [ true, 'El video es necesario para la clase' ]
    },
    comentarios: [
        {
            usuario: {
                type: Schema.Types.ObjectId,
                ref: 'Usuario',
                required: [ true, 'Debe de existir una referencia a un usuario' ]
            },
            comentario: {
                type: String,
                default: ''
            }

    }]

});



export const Clase = model<IClase>('Clase',claseSchema)