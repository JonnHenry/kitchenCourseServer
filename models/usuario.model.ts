import { Schema, model} from 'mongoose';
import bcrypt from 'bcrypt';
import IUsuario from '../interfaces/IUsuarios';


const usuarioSchema = new Schema({
    
    nombre: {
        type: String,
        required: [ true, 'El nombre es necesario' ]
    },
    avatar: {
        type: String,
        default: 'user.png'
    },
    email: {
        type: String,
        unique: true,
        required: [ true, 'El correo es necesario' ]
    },
    password: {
        type: String,
        required: [ true, 'La contraseña es necesaria']
    },
    celular:{
        type: String
    },
    sexo: {
        type: String,
        required: [ true, 'El sexo del usuario es necesario']
    },
    habilitado: {
        type: Boolean,
        default: true
    }

});


usuarioSchema.method('compararPassword', function( password: string = ''): boolean {

    if (  bcrypt.compareSync( password, this.password ) ) {
        return true;
    } else {
        return false;
    }

});

export const Usuario = model<IUsuario>('Usuario',usuarioSchema)
