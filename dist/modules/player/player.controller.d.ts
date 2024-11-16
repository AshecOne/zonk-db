import { PlayerService } from './player.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    getProfile(req: any): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/user.schema").UserDocument> & import("../../schemas/user.schema").User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateProfile(req: any, updateProfileDto: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/user.schema").UserDocument> & import("../../schemas/user.schema").User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getStats(req: any): Promise<import("mongoose").Document<unknown, {}, import("../../schemas/user.schema").UserDocument> & import("../../schemas/user.schema").User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
