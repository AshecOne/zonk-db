export declare enum CardType {
    SPADE = "SPADE",
    HEART = "HEART",
    DIAMOND = "DIAMOND",
    CLUB = "CLUB"
}
export declare enum CardValue {
    ACE = "ACE",
    TWO = "2",
    THREE = "3",
    FOUR = "4",
    FIVE = "5",
    SIX = "6",
    SEVEN = "7",
    EIGHT = "8",
    NINE = "9",
    TEN = "10",
    JACK = "JACK",
    QUEEN = "QUEEN",
    KING = "KING",
    JOKER = "JOKER"
}
export interface Card {
    type?: CardType;
    value: CardValue;
    isJoker: boolean;
    isHidden?: boolean;
}
export interface Player {
    id: string;
    username: string;
    cards: Card[];
    isAlive: boolean;
    score: number;
    order: number;
}
export interface GameRoom {
    id: string;
    players: Player[];
    currentTurn: number;
    tableCards: Card[];
    status: 'WAITING' | 'PLAYING' | 'FINISHED';
    winner?: Player;
    baseCards: Card[][];
    tripleCards: Card[][];
}
