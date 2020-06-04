import moongose from 'mongoose';

export default class DataBase {

    private port: number;
    private user: string;
    private password: string;
    private hostDB: string;

    constructor(port: number, user: string, password: string, hostDB: string) {
        this.port = port;
        this.user = user;
        this.password = password;
        this.hostDB = hostDB;
    }

    conectarDB() {
        const uri = `mongodb://${this.user}:${this.password}@${this.hostDB}:${this.port}/kitchenCourse`;
        console.log(uri)
        return new Promise(async (resolve, reject)=>{
            await moongose.connect(uri, { useNewUrlParser: true, useCreateIndex: true,useUnifiedTopology: true }, (error) => {
                if (error) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
            reject(false)
        })
        
        
    }

}