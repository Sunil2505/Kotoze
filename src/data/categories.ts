import { LucideIcon, Laptop, Shirt, Sofa, ShoppingBasket, Car, Factory } from "lucide-react";

type Category = {
  id: number;
  name: string;
  icon: LucideIcon;
};

const categories: Category[] = [
  {
    id: 1,
    name: "Electronics",
    icon: Laptop,
  },
  {
    id: 2,
    name: "Fashion",
    icon: Shirt,
  },
  {
    id: 3,
    name: "Home",
    icon: Sofa,
  },
  {
    id: 4,
    name: "Groceries",
    icon: ShoppingBasket,
  },
  {
    id: 5,
    name: "Automobile",
    icon: Car,
  },
  {
    id: 6,
    name: "Industrial",
    icon: Factory,
  },
];

export default categories;