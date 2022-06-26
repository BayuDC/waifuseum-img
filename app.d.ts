import { Db, ObjectId } from 'mongodb';

declare module 'koa' {
    interface DefaultContext {
        db: Db;
    }
    interface DefaultState {
        picture: {
            _id: ObjectId;
            url: string;
        };
    }
}
