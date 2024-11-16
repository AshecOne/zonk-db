import { Card, CardValue, CardType } from '../../../types/game.types';

export class CardValidator {
  // Mengecek apakah kartu berurutan (untuk dasar)
  static isSequential(values: CardValue[]): boolean {
    const valueOrder = [
      CardValue.ACE,
      CardValue.TWO,
      CardValue.THREE,
      CardValue.FOUR,
      CardValue.FIVE,
      CardValue.SIX,
      CardValue.SEVEN,
      CardValue.EIGHT,
      CardValue.NINE,
      CardValue.TEN,
      CardValue.JACK,
      CardValue.QUEEN,
      CardValue.KING,
    ];

    // Dapatkan index dari setiap nilai dalam urutan
    const indexes = values.map(value => valueOrder.indexOf(value));
    
    // Sort indexes
    indexes.sort((a, b) => a - b);
    
    // Cek apakah berurutan
    for (let i = 1; i < indexes.length; i++) {
      if (indexes[i] - indexes[i - 1] !== 1) {
        return false;
      }
    }
    
    return true;
  }

  // Validasi dasar (minimal 3 kartu berurutan dengan jenis sama)
  static validateDasar(cards: Card[]): boolean {
    // Minimal 3 kartu
    if (cards.length < 3) {
      return false;
    }

    // Tidak boleh ada joker di dasar
    if (cards.some(card => card.isJoker)) {
      return false;
    }

    // Semua kartu harus jenis yang sama
    const firstType = cards[0].type;
    if (!cards.every(card => card.type === firstType)) {
      return false;
    }

    // Kartu harus berurutan
    const values = cards.map(card => card.value);
    return this.isSequential(values);
  }

  // Validasi triple (3 kartu dengan nilai sama)
  static validateTriple(cards: Card[]): boolean {
    // Harus tepat 3 kartu
    if (cards.length !== 3) {
      return false;
    }

    // Hitung joker
    const jokerCount = cards.filter(card => card.isJoker).length;
    
    if (jokerCount > 2) {
      return false; // Tidak bisa semua joker
    }

    // Jika ada joker, sisanya harus nilai sama
    const nonJokerCards = cards.filter(card => !card.isJoker);
    if (jokerCount > 0) {
      return nonJokerCards.every(card => card.value === nonJokerCards[0].value);
    }

    // Jika tidak ada joker, semua nilai harus sama
    return cards.every(card => card.value === cards[0].value);
  }

  // Validasi sambungan ke dasar yang sudah ada
  static validateConnection(existingCards: Card[], newCards: Card[]): boolean {
    // Jenis harus sama
    if (existingCards[0].type !== newCards[0].type) {
      return false;
    }

    // Cek apakah bisa disambung di awal atau akhir
    const allValues = [...existingCards, ...newCards].map(card => card.value);
    return this.isSequential(allValues);
  }

  // Hitung nilai kartu untuk scoring
  static calculateCardValue(card: Card): number {
    if (card.isJoker) return 0;

    switch (card.value) {
      case CardValue.JACK:
      case CardValue.QUEEN:
      case CardValue.KING:
        return 10;
      case CardValue.ACE:
        return 15;
      default:
        return parseInt(card.value);
    }
  }

  // Cek kondisi game tangan
  static checkGameTangan(cards: Card[]): boolean {
    // Cek 4 joker
    const jokerCount = cards.filter(card => card.isJoker).length;
    if (jokerCount >= 4) return true;

    // Cek 8 kartu As
    const aceCount = cards.filter(card => card.value === CardValue.ACE).length;
    if (aceCount >= 8) return true;

    return false;
  }
}