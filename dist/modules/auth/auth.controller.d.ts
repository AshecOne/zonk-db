import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
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
    login(loginDto: LoginDto, req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            username: any;
        };
    }>;
    googleAuth(): Promise<void>;
    googleAuthCallback(req: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            username: any;
        };
    }>;
    getProfile(req: any): any;
}
