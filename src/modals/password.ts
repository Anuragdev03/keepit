import { Realm } from "@realm/react";

class PasswordRecord extends Realm.Object<PasswordRecord> {
    _id!: Realm.BSON.ObjectId;
    user_name!: string;
    password!: string;
    category?: string;
    note?: string;
    website!: string;
    createdAt?: string;
    updatedAt?: string;

    static schema: Realm.ObjectSchema = {
        name: "PasswordRecord",
        primaryKey: "_id",
        properties: {
            _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
            user_name: "string",
            password: "string",
            category: "string?",
            note: "string?",
            website: "string",
            createdAt: {type: "string", default: new Date().toISOString()},
            updatedAt: "string?"
        }
    };
}


export default PasswordRecord;