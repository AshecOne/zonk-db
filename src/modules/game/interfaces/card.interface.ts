export enum CardType {
    SPADE = 'SPADE',
    HEART = 'HEART',
    DIAMOND = 'DIAMOND',
    CLUB = 'CLUB'
  }
  
  export enum CardValue {
    ACE = 'ACE',
    TWO = '2',
    THREE = '3',
    FOUR = '4',
    FIVE = '5',
    SIX = '6',
    SEVEN = '7',
    EIGHT = '8',
    NINE = '9',
    TEN = '10',
    JACK = 'JACK',
    QUEEN = 'QUEEN',
    KING = 'KING',
    JOKER = 'JOKER'
  }
  
  export interface Card {
    type?: CardType;
    value: CardValue;
    isJoker: boolean;
    isHidden?: boolean;
  }