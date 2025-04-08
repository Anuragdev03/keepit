import { Realm } from "@realm/react";

class Authenticator extends Realm.Object<Authenticator> {
    _id!: Realm.BSON.ObjectId;
    type?: string;
    secret!: string;
    issuer?: string;
    account?: string;
    algorithm?: string;
    digits?:number;
    period?:number;
    createdAt?: string;
    updatedAt?: string;

    static schema: Realm.ObjectSchema = {
        name: "Authenticator",
        primaryKey: "_id",
        properties: {
            _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
            type: "string?",
            secret: "string",
            issuer: "string?",
            account: "string?",
            algorithm: "string?",
            digits: "int?",
            period: "int?",
            createdAt: {type: "string", default: new Date().toISOString()},
            updatedAt: "string?"
        }
    };
}


export default Authenticator;