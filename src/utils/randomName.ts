const colors = [
  "Rot",
  "Blau",
  "Grün",
  "Gelb",
  "Lila",
  "Orange",
  "Rosa",
  "Braun",
  "Türkis",
  "Magenta",
  "Lindgrün",
  "Indigo",
  "Violett",
  "Gold",
  "Silber",
  "Purpur",
  "Bernstein",
  "Jade",
  "Koralle",
];

const animals = [
  "Löwe",
  "Tiger",
  "Bär",
  "Wolf",
  "Fuchs",
  "Adler",
  "Falke",
  "Eule",
  "Delfin",
  "Wal",
  "Hai",
  "Panda",
  "Koala",
  "Zebra",
  "Giraffe",
  "Elefant",
  "Nashorn",
  "Nilpferd",
  "Pinguin",
  "Otter",
  "Biber",
  "Hase",
  "Hirsch",
  "Elch",
  "Luchs",
  "Jaguar",
  "Leopard",
  "Gepard",
  "Panther",
];

export function generateRandomName(): string {
  const color = colors[Math.floor(Math.random() * colors.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${color}${animal}`;
}
