import { Card, CardValue } from '../../../types/game.types';
export declare class CardValidator {
    static isSequential(values: CardValue[]): boolean;
    static validateDasar(cards: Card[]): boolean;
    static validateTriple(cards: Card[]): boolean;
    static validateConnection(existingCards: Card[], newCards: Card[]): boolean;
    static calculateCardValue(card: Card): number;
    static checkGameTangan(cards: Card[]): boolean;
}
