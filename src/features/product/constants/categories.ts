const CATEGORY_LABELS: Record<string, string> = {
  beauty: 'Красота',
  fragrances: 'Парфюмерия',
  furniture: 'Мебель',
  groceries: 'Продукты',
  'home-decoration': 'Декор для дома',
  'kitchen-accessories': 'Кухонные принадлежности',
  laptops: 'Ноутбуки',
  'mens-shirts': 'Мужские рубашки',
  'mens-shoes': 'Мужская обувь',
  'mens-watches': 'Мужские часы',
  'mobile-accessories': 'Аксессуары для телефонов',
  motorcycle: 'Мотоциклы',
  'skin-care': 'Уход за кожей',
  smartphones: 'Смартфоны',
  'sports-accessories': 'Спортивные аксессуары',
  sunglasses: 'Солнцезащитные очки',
  tablets: 'Планшеты',
  tops: 'Топы',
  vehicle: 'Транспорт',
  'womens-bags': 'Женские сумки',
  'womens-dresses': 'Женские платья',
  'womens-jewellery': 'Женские украшения',
  'womens-shoes': 'Женская обувь',
  'womens-watches': 'Женские часы',
};

export function getCategoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug.toLowerCase()] ?? slug;
}
