export interface RoomPlayer {
    id: string;
    username: string;
    isReady: boolean;
    position: number;
    joinedAt: Date;
}
export interface Room {
    id: string;
    name: string;
    hostId: string;
    password?: string;
    players: RoomPlayer[];
    status: 'WAITING' | 'FULL' | 'PLAYING' | 'FINISHED';
    createdAt: Date;
    updatedAt: Date;
    maxPlayers: number;
}
