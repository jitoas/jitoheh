interface CardData {
  id: string;
  name: string;
  category: string;
  tags?: string[];
}

export function getCardImageUrl(card: CardData): string {
  if (card && card.id) {
    return `/cards/${card.id}.png`;
  }
  const isWeapon = card?.category === 'weapon';
  return isWeapon ? '/cards/w1.png' : '/cards/e1.png';
}
