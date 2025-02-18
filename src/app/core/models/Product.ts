import { Category } from "./Category";

export class Product  {
    id: number | null  = null;
    name: string | null = null;
    price: number | null = null;
    description: string | null = null;
    categoryId: number | null = null;
    category: Category | null = new Category;
    stock: number | null | undefined = null;
}
