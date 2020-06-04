import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Token from '../Classes/Token';
import { verificaToken } from '../middlewares/Autentication';
import IUsuario from '../interfaces/IUsuarios';
import { Usuario } from '../models/Usuario.model';
import FileSystem from '../Classes/FileSystem';
import { FileUpload } from '../interfaces/FileUpload';


const userRoutes = Router();
const fileSystem = new FileSystem();

//Iniciar sesion de un usuario
userRoutes.post('login', (req: Request, res: Response) => {
    const body = req.body;
    Usuario.findOne({ email: body.email }, (err, userDB: IUsuario) => {

        if (err || !userDB ||!userDB.habilitado) {
            return res.status(401).json({
                ok: false,
                token: '',
                mensaje: 'Usuario/contraseña no son correctos'
            });
        }

        if (userDB.compararPassword(body.password)) {
            const tokenUser = Token.getJwtToken({
                _id: userDB.id,
                nombre: userDB.nombre,
                avatar: userDB.avatar,
                email: userDB.email,
                sexo: userDB.sexo
            })

            res.status(200).json({
                ok: true,
                token: tokenUser,
                mensaje: ''
            })
        } else {
            return res.status(401).json({
                ok: false,
                token: '',
                mensaje: 'Usuario/contraseña no son correctos ***'
            });

        }
    })

});

//Sube la foto de un usuario
userRoutes.post('/upload',[verificaToken],async (req: any, res: Response)=>{

    if (!req.files){
        return res.status(400).json({
            ok: false,
            token: '',
            mensaje: 'No se subió ningun archivo'
        });
    }

    const file: FileUpload=req.files.image;

    if (!file){
        return res.status(400).json({
            ok: false,
            token: '',
            mensaje: 'No se subió ningun archivo'
        });
    }

    if ( !file.mimetype.includes('image') ) {
        return res.status(400).json({
            ok: false,
            token: '',
            mensaje: 'Lo que subió no es una imagen'
        }); 
    }

    await fileSystem.guardarImagen(file, req.usuario._id, req.usuario.sexo)

    Usuario.findOne({ email: req.usuario.email }, (err, userDB) => {
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
                const tokenUser = Token.getJwtToken({
                    nombre: userDB.nombre,
                    _id: userDB._id,
                    avatar: userDB.avatar,
                    email: userDB.email,
                    sexo: userDB.sexo
                })
                res.status(200).json({
                    ok: true,
                    token: tokenUser,
                    mensaje: 'La información se ha actualizado correctamente'
                })

            })

            .catch(()=>{
                return res.status(400).json({
                    ok: false,
                    token: '',
                    mensaje: 'Verifique los datos ingresados'
                });
            })

    })

})


//Registrar un usuario
userRoutes.post('/create', (req: Request, res: Response) => {
    const body = req.body;

    const usuario = {
        nombre: body.nombre,
        avatar: body.avatar || body.sexo+'.png',
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        celular: body.celular,
        sexo: body.sexo
    };


    Usuario.create(usuario).then(userDB => {
        console.log(userDB)
        const tokenUser = Token.getJwtToken({
            nombre: userDB.nombre,
            _id: userDB._id,
            avatar: userDB.avatar,
            email: userDB.email,
            sexo: userDB.sexo
        })
        
        res.status(200).json({
            ok: true,
            token: tokenUser,
            mensaje: 'Usuario registrado correctamente'
        })
    }).catch(err => {
        res.status(200).json({
            ok: false,
            token: '',
            mensaje: 'Verifique la información ingresada'
        })
    })
})

//Actualizar información de un usuario
userRoutes.put('/update', verificaToken, (req: any, res: Response) => {
    const body = req.body;

    Usuario.findOne({ email: body.email }, (err, userDB) => {
        if (err || !userDB) {
            return res.status(200).json({
                ok: false,
                token: '',
                mensaje: 'El usuario no se encuentra registrado, verifique los datos'
            });
        }

        userDB.nombre = body.nombre || userDB.nombre;
        userDB.password = bcrypt.hashSync(body.password, 10) || userDB.password;
        userDB.celular = body.celular || userDB.celular;
        userDB.save()
            .then(() => {
                const tokenUser = Token.getJwtToken({
                    nombre: userDB.nombre,
                    _id: userDB._id,
                    avatar: userDB.avatar,
                    email: userDB.email,
                    sexo: userDB.sexo
                })
                res.status(200).json({
                    ok: true,
                    token: tokenUser,
                    mensaje: 'La información se ha actualizado correctamente'
                })

            })

            .catch(()=>{
                return res.status(400).json({
                    ok: false,
                    token: '',
                    mensaje: 'Verifique los datos ingresados'
                });
            })

    })

})



userRoutes.delete('/delete',verificaToken,(req: Request, res: Response)=>{
    const body = req.body;

    Usuario.update({email: body.email}, {habilitado: false}, function(err, userDB){
        if (err || !userDB){
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
    })
});



userRoutes.get('/imagen/:userid/:img', verificaToken,(req: any, res: Response) => {

    const userId = req.params.userid;
    const img    = req.params.img;

    const pathFoto = fileSystem.getFotoUrl( userId, img, req.usuario.sexo );

    res.sendFile( pathFoto );

});

export default userRoutes;