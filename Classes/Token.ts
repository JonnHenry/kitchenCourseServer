import jwt from 'jsonwebtoken';
import IUserPayload from '../interfaces/IUser.payload';


export default class Token {

    private static seed: string = 'kitchenCourse';
    private static caducidad: string = '2h';

    constructor() { }

    static getJwtToken( payload: IUserPayload): string {
        return jwt.sign({
            usuario: payload
        }, this.seed, { expiresIn: this.caducidad });

    }

    static comprobarToken( userToken: string ) {

        return new Promise( (resolve, reject ) => {

            jwt.verify( userToken, this.seed, ( err, decoded ) => {
    
                if ( err ) {
                    reject();
                } else {
                    resolve( decoded );
                }
    
    
            })

        });


    }


}
