import { Realm } from "@realm/react";

class Notes extends Realm.Object<Notes> {
    _id!: Realm.BSON.ObjectId;
    title!: string;
    content!: string;
    createdAt?: string;
    updatedAt?: string;

    static schema: Realm.ObjectSchema = {
        name: "Notes",
        primaryKey: "_id",
        properties: {
            _id: { type: "objectId", default: () => new Realm.BSON.ObjectId() },
            title: "string",
            content: "string",
            createdAt: {type: "string", default: new Date().toISOString()},
            updatedAt: "string?"
        }
    };
}


export default Notes;