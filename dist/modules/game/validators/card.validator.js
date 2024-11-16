"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardValidator = void 0;
const game_types_1 = require("../../../types/game.types");
class CardValidator {
    static isSequential(values) {
        const valueOrder = [
            game_types_1.CardValue.ACE,
            game_types_1.CardValue.TWO,
            game_types_1.CardValue.THREE,
            game_types_1.CardValue.FOUR,
            game_types_1.CardValue.FIVE,
            game_types_1.CardValue.SIX,
            game_types_1.CardValue.SEVEN,
            game_types_1.CardValue.EIGHT,
            game_types_1.CardValue.NINE,
            game_types_1.CardValue.TEN,
            game_types_1.CardValue.JACK,
            game_types_1.CardValue.QUEEN,
            game_types_1.CardValue.KING,
        ];
        const indexes = values.map(value => valueOrder.indexOf(value));
        indexes.sort((a, b) => a - b);
        for (let i = 1; i < indexes.length; i++) {
            if (indexes[i] - indexes[i - 1] !== 1) {
                return false;
            }
        }
        return true;
    }
    static validateDasar(cards) {
        if (cards.length < 3) {
            return false;
        }
        if (cards.some(card => card.isJoker)) {
            return false;
        }
        const firstType = cards[0].type;
        if (!cards.every(card => card.type === firstType)) {
            return false;
        }
        const values = cards.map(card => card.value);
        return this.isSequential(values);
    }
    static validateTriple(cards) {
        if (cards.length !== 3) {
            return false;
        }
        const jokerCount = cards.filter(card => card.isJoker).length;
        if (jokerCount > 2) {
            return false;
        }
        const nonJokerCards = cards.filter(card => !card.isJoker);
        if (jokerCount > 0) {
            return nonJokerCards.every(card => card.value === nonJokerCards[0].value);
        }
        return cards.every(card => card.value === cards[0].value);
    }
    static validateConnection(existingCards, newCards) {
        if (existingCards[0].type !== newCards[0].type) {
            return false;
        }
        const allValues = [...existingCards, ...newCards].map(card => card.value);
        return this.isSequential(allValues);
    }
    static calculateCardValue(card) {
        if (card.isJoker)
            return 0;
        switch (card.value) {
            case game_types_1.CardValue.JACK:
            case game_types_1.CardValue.QUEEN:
            case game_types_1.CardValue.KING:
                return 10;
            case game_types_1.CardValue.ACE:
                return 15;
            default:
                return parseInt(card.value);
        }
    }
    static checkGameTangan(cards) {
        const jokerCount = cards.filter(card => card.isJoker).length;
        if (jokerCount >= 4)
            return true;
        const aceCount = cards.filter(card => card.value === game_types_1.CardValue.ACE).length;
        if (aceCount >= 8)
            return true;
        return false;
    }
}
exports.CardValidator = CardValidator;
//# sourceMappingURL=card.validator.js.map