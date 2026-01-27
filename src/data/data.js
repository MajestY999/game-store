// ...existing code...
const games = [
  {
    slug: "cs-2",
    name: "CS 2",
    price: 599,
    currency: "RUB",
    inStock: true,
    shortDescription: "Командный соревновательный шутер.",
    images: ["../../images/cs 2.jpg"],
    categories: ["Шутеры"],
    tags: ["multiplayer", "fps"]
  },
  {
    slug: "cyberpunk-2077",
    name: "Cyberpunk 2077",
    price: 2499,
    currency: "RUB",
    inStock: true,
    shortDescription: "Открытый мир, RPG с глубоким сюжетом.",
    images: ["../images/cyberpunk.jpg"],
    categories: ["RPG"],
    tags: ["open-world", "singleplayer"]
  },
  {
    slug: "doom-ages",
    name: "DOOM: The Ancient Gods",
    price: 799,
    currency: "RUB",
    inStock: true,
    shortDescription: "Быстрый экшен от первого лица.",
    images: ["../images/doom ages.jpg"],
    categories: ["Шутеры"],
    tags: ["singleplayer", "action"]
  },
  {
    slug: "ets2",
    name: "Euro Truck Simulator 2",
    price: 399,
    currency: "RUB",
    inStock: true,
    shortDescription: "Реалистичный симулятор грузоперевозок.",
    images: ["../images/ets2.jpg"],
    categories: ["Симуляторы"],
    tags: ["simulator", "driving"]
  },
  {
    slug: "tarkov",
    name: "Escape from Tarkov",
    price: 999,
    currency: "RUB",
    inStock: true,
    shortDescription: "Хардкорный шутер с лутом и выживанием.",
    images: ["../images/Tarkov.jpg"],
    categories: ["Шутеры", "Выживание"],
    tags: ["hardcore", "loot"]
  },
  {
    slug: "witcher-3",
    name: "The Witcher 3: Wild Hunt",
    price: 1299,
    currency: "RUB",
    inStock: true,
    shortDescription: "Эпическая RPG с большим миром и сюжетом.",
    images: ["../images/ведьмак 3.jpg"],
    categories: ["RPG"],
    tags: ["story", "open-world"]
  },
  // Новые записи, соответствующие вашим картинкам
  {
    slug: "dota-2",
    name: "Dota 2",
    price: 0,
    currency: "RUB",
    inStock: true,
    shortDescription: "Популярная командная MOBA.",
    images: ["../images/Dota_2_Steam_artwork.jpg"],
    categories: ["MOBA", "Multiplayer"],
    tags: ["free-to-play", "multiplayer"]
  },
  {
    slug: "gtav",
    name: "Grand Theft Auto V",
    price: 1299,
    currency: "RUB",
    inStock: true,
    shortDescription: "Открытый мир, криминальная эпопея.",
    images: ["../images/GTAV_Official_Cover_Art.jpg"],
    categories: ["Action", "Open-world"],
    tags: ["singleplayer", "multiplayer"]
  },
  {
    slug: "red-dead-2",
    name: "Red Dead Redemption 2",
    price: 1499,
    currency: "RUB",
    inStock: true,
    shortDescription: "Великолепная повествовательная вестерн-RPG.",
    images: ["../images/Red_Dead_Redemption_II.jpg"],
    categories: ["Action", "RPG"],
    tags: ["story", "open-world"]
  },
  {
    slug: "forza-5",
    name: "Forza Horizon 5",
    price: 1799,
    currency: "RUB",
    inStock: true,
    shortDescription: "Яркий аркадный гоночный симулятор.",
    images: ["../images/Forza_Horizon_5.jpg"],
    categories: ["Racing", "Simulator"],
    tags: ["driving", "open-world"]
  }
];

export default games;

export function cloneInitialGames() {
  return games.map(g => ({ ...g }));
}
// ...existing code...