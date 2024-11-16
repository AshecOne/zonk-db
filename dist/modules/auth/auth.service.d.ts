import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { UserDocument } from '../../schemas/user.schema';
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<UserDocument>, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            username: any;
        };
    }>;
    register(userData: {
        email: string;
        password: string;
        username: string;
    }): Promise<{
        username: string;
        email: string;
        googleId?: string;
        points: number;
        gamesPlayed: number;
        gamesWon: number;
        _id: unknown;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
    }>;
    googleLogin(profile: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            username: any;
        };
    }>;
}
