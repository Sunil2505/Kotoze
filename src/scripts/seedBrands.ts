import "./bootstrap";

import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { connectDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";

const brands = [
  // Electronics
  "Apple",
  "Samsung",
  "Sony",
  "LG",
  "Dell",
  "HP",
  "Lenovo",
  "ASUS",
  "Acer",
  "MSI",
  "Boat",
  "JBL",
  "Logitech",
  "Canon",
  "Nikon",
  "Xiaomi",
  "OnePlus",
  "Realme",
  "Oppo",
  "Vivo",

  // Fashion
  "Nike",
  "Adidas",
  "Puma",
  "Reebok",
  "Levi's",
  "Allen Solly",
  "Peter England",
  "Van Heusen",
  "Louis Philippe",
  "Raymond",
  "US Polo",
  "Tommy Hilfiger",
  "Wrangler",
  "Pepe Jeans",
  "Woodland",

  // Grocery
  "Amul",
  "Britannia",
  "Nestlé",
  "Aashirvaad",
  "Tata Sampann",
  "Fortune",
  "India Gate",
  "Daawat",
  "Saffola",
  "Patanjali",
  "24 Mantra Organic",
  "Organic India",
  "MTR",
  "Catch",
  "Everest",
  "MDH",
  "Priya Foods",
  "Eastern",
  "Double Horse",
  "Brahmins",
  "Nirapara",
  "Elite",
  "Melam",
  "Kitchen Treasures",
  "Pavizham",
  "Milma",
  "Saras",

  // Beverages
  "Coca-Cola",
  "Pepsi",
  "Sprite",
  "Fanta",
  "7UP",
  "Red Bull",
  "Paper Boat",
  "Maaza",
  "Slice",
  "Minute Maid",

  // Home & Kitchen
  "Prestige",
  "Pigeon",
  "Butterfly",
  "Hawkins",
  "Cello",
  "Milton",
  "Borosil",
  "Wonderchef",
  "Kent",
  "Eureka Forbes",

  // Beauty
  "Dove",
  "Lux",
  "Pears",
  "Nivea",
  "Lakmé",
  "L'Oréal",
  "Himalaya",
  "Biotique",
  "Mamaearth",
  "Pond's",

  // Baby
  "Johnson's Baby",
  "Pampers",
  "Huggies",
  "Sebamed",
  "Mee Mee",

  // Cleaning
  "Surf Excel",
  "Ariel",
  "Wheel",
  "Rin",
  "Vim",
  "Harpic",
  "Lizol",
  "Colin",
  "Dettol",
  "Domex",

  // Stationery
  "Classmate",
  "Camlin",
  "Faber-Castell",
  "Cello Stationery",
  "Navneet",

  // Sports
  "Yonex",
  "Cosco",
  "Nivia",
  "Decathlon",
  "Vector X",

  // Automobile
  "Bosch",
  "Exide",
  "Amaron",
  "MRF",
  "CEAT",

  // Furniture
  "Godrej",
  "Nilkamal",
  "Durian",
  "IKEA",
  "Home Centre",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

async function seedBrands() {
  try {
    await connectDB();

    let created = 0;

    for (let i = 0; i < brands.length; i++) {
      const name = brands[i];

      await Brand.updateOne(
        { name },
        {
          $setOnInsert: {
            name,
            slug: slugify(name),
            description: "",
            logo: "",
            website: "",
            sortOrder: i + 1,
          },
        },
        {
          upsert: true,
        }
      );

      created++;
    }

    console.log("================================");
    console.log(`✅ ${created} Brands Seeded`);
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed brands:", error);
    process.exit(1);
  }
}

seedBrands();