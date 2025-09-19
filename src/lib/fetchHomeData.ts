import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// Combined types for all home data
export interface ProductCard {
  _id: string | null;
  image: any;
  alt: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  link: string;
}

export interface Brand {
  _id: string | null;
  name: string;
  logo: any;
  link: string;
  background: string | null;
}

export interface Category {
  _id: string | null;
  name: string;
  image: any;
  link: string;
  background: string | null;
}

export interface TrendItem {
  _id: string | null;
  title: string;
  subtitle: string;
  image: any;
  link: string;
}

export interface HomeData {
  promo?: any;
  activemodal?: boolean;
  bannergenero?: any[];
  bannerhome?: {
    bannerhome: {
      imgdeskt: any;
      imgmob: any;
      titulo: string;
      description: string;
      desc: string;
      urlbtn: string;
    };
  };
  product_cards?: {
    active: boolean;
    cards: ProductCard[];
  };
  brands_categories?: {
    active: boolean;
    title: string;
    brands: Brand[];
    categories: Category[];
  };
  trends?: {
    active: boolean;
    title: string;
    subtitle: string;
    trends_items: TrendItem[];
  };
}

// Function to fetch all home data in a single query
export async function getHomeData(): Promise<HomeData | null> {
  try {
    console.log("Fetching home data from Sanity...");
    const data = await client.fetch<HomeData>(
      groq`*[_type == "home"][0] {
        promo,
        activemodal,
        bannergenero,
        bannerhome {
          bannerhome {
            imgdeskt,
            imgmob,
            titulo,
            description,
            desc,
            urlbtn
          }
        },
        product_cards {
          active,
          cards[] {
            _id,
            image,
            alt,
            title,
            subtitle,
            description,
            buttonText,
            link
          }
        },
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
        },
        trends {
          active,
          title,
          subtitle,
          trends_items[] {
            _id,
            title,
            subtitle,
            image,
            link
          }
        }
      }`
    );
    console.log("Sanity data fetched:", data);
    console.log("Product cards from Sanity:", data?.product_cards);
    return data;
  } catch (error) {
    console.error("Error fetching home data:", error);
    return null;
  }
} 