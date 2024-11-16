import { CardType, CardValue } from '../interfaces/card.interface';
export declare class CardDto {
    type?: CardType;
    value: CardValue;
    isJoker: boolean;
    isHidden?: boolean;
}
export declare class GameActionDto {
    roomId: string;
    actionType: 'DASAR' | 'TRIPLE' | 'CONNECT';
    cards: CardDto[];
    dasarIndex?: number;
}
