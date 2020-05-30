import moongose from 'mongoose';

export default class DataBase {

    private port: number;
    private user: string;
    private password: string;
    private hostDB: string;

    constructor(port:number, user:string, password:string,hostDB:string) {
        this.port = port;
        this.user = user;
        this.password = password;
        this.hostDB = hostDB;
    }

    conectarDB() {
        const uri = `mongodb://${this.user}:${this.password}@${this.hostDB}:${this.port}/kitchenCourse`
        moongose.connect(uri, { useNewUrlParser: true, useCreateIndex: true }, (error) => {
            if (error) {
                return false
            } else {
                return true
            }
        });
    }

}