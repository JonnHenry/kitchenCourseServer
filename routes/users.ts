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
userRoutes.post('/login', (req: Request, res: Response) => {
    const body = req.body;
    Usuario.findOne({ email: body.email }, (err, userDB: IUsuario) => {

        if (err || !userDB || !userDB.habilitado) {
            return res.status(200).json({
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
            return res.status(200).json({
                ok: false,
                token: '',
                mensaje: 'Usuario/contraseña no son correctos'
            });

        }
    })

});

//Sube la foto de un usuario y se debe de actualiza el token
userRoutes.post('/upload', [verificaToken], async (req: any, res: Response) => {

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            token: '',
            mensaje: 'No se subió ningun archivo'
        });
    }

    const file: FileUpload = req.files.image;

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

    const nombreAvatar = await fileSystem.guardarImagen(file, req.usuario._id, req.usuario.sexo)

    Usuario.findOne({ email: req.usuario.email }, (err, userDB) => {
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

            .catch(() => {
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
        avatar: body.avatar || body.sexo + '.png',
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
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

            .catch(() => {
                return res.status(400).json({
                    ok: false,
                    token: '',
                    mensaje: 'Verifique los datos ingresados'
                });
            })

    })

})


userRoutes.get('/user/get', verificaToken, (req: any, res: Response) => {
    try {
        res.status(200).json({
            ok: true,
            usuario: req.usuario,
            mensaje: 'El usuario ha accedido correctamente'
        })
    } catch (error) {
        res.status(404).json({
            ok: false,
            usuario: {},
            mensaje: 'El usuario no se encuentra registrado'
        })
    }
})


userRoutes.delete('/delete', verificaToken, (req: Request, res: Response) => {
    const body = req.body;

    Usuario.update({ email: body.email }, { habilitado: false }, function (err, userDB) {
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
    })
});

userRoutes.post('/allow', verificaToken, (req: Request, res: Response) => {
    const body = req.body;

    Usuario.update({ email: body.email }, { habilitado: true }, function (err, userDB) {
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
    })
});




//Obtener una imagen de un usuario
userRoutes.get('/imagen/avatar/:id', (req: any, res: Response) => {

    const userId = req.params.id;

    try{
        Usuario.findOne({ _id: userId }, (err, userDB) => {
            if (err || !userDB) {
                return res.status(200).json({
                    ok: false,
                    mensaje: 'El usuario no se encuentra registrado, verifique los datos'
                });
            }
            const img: string = String(userDB.avatar);
            const sexo: string = String(userDB.sexo) 
            const pathFoto = fileSystem.getFotoUrl(userDB._id,img , sexo);
            res.sendFile(pathFoto);
        })

    }catch(error){
        return res.status(500).json({
            ok: false,
            mensaje: 'El usuario no se encuentra registrado, verifique los datos'
        });

    }
    
    

});

export default userRoutes;