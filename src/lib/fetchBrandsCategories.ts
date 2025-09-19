import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// Type for the brand data from Sanity
export interface Brand {
  _id: string;
  name: string;
  logo: any;
  link: string;
  background: string;
}

// Type for the category data from Sanity
export interface Category {
  _id: string;
  name: string;
  image: any;
  link: string;
  background: string;
}

// Type for the brands categories data structure
export interface BrandsCategoriesData {
  brands_categories?: {
    active: boolean;
    title: string;
    brands: Brand[];
    categories: Category[];
  };
}

// Function to fetch brands categories data from Sanity
export async function getBrandsCategoriesData(): Promise<BrandsCategoriesData | null> {
  try {
    const data = await client.fetch<BrandsCategoriesData>(
      groq`*[_type == "home"][0] {
        brands_categories {
          active,
          title,
          brands[] {
            _id,
            name,
            logo,
            link,
            background
          },
          categories[] {
            _id,
            name,
            image,
            link,
            background
          }
        }
      }`
    );
    return data;
  } catch (error) {
    console.error("Error fetching brands categories data:", error);
    return null;
  }
} 