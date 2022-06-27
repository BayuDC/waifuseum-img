import { Db, ObjectId } from 'mongodb';

declare module 'koa' {
    interface DefaultContext {
        db: Db;
        caches: Map<string, string>;
    }
    interface DefaultState {
        picture: {
            _id: ObjectId;
            url: string;
            path: string;
            name: string;
            type: string;
            width: number;
            height: number;
        };
    }
}
