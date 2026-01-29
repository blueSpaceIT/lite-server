import { Details } from 'express-useragent';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload;
            useragent: Details;
        }
    }
}
