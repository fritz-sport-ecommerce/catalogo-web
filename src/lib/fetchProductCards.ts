import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlForImage } from "@/sanity/lib/image";

// Type for the product card data from Sanity
export interface ProductCard {
  _key?: string; // Sanity generates this automatically for array items
  image: any;
  alt: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  link: string;
}

// Type for the home data structure
export interface HomeData {
  product_cards?: {
    active: boolean;
    cards: ProductCard[];
  };
}

// Function to fetch product cards data from Sanity
export async function getProductCardsData(): Promise<HomeData | null> {
  try {
    console.log("Fetching product cards data from Sanity...");
    
    const data = await client.fetch<HomeData>(
      groq`*[_type == "home"][0] {
        product_cards {
          active,
          cards[] {
            _key,
            image,
            alt,
            title,
            subtitle,
            description,
            buttonText,
            link
          }
        }
      }`
    );

    // Validar que los datos sean válidos
    if (!data || !data.product_cards) {
      console.warn("getProductCardsData: No product_cards data found");
      return {
        product_cards: {
          active: false,
          cards: []
        }
      };
    }

    // Validar que cards sea un array
    if (!Array.isArray(data.product_cards.cards)) {
      console.warn("getProductCardsData: cards is not an array", data.product_cards.cards);
      data.product_cards.cards = [];
    }

    // Filtrar cards inválidos y procesar imágenes
    if (data.product_cards.cards.length > 0) {
      data.product_cards.cards = data.product_cards.cards.filter(card => 
        card && 
        typeof card === 'object' && 
        card.title && 
        card.image && 
        card.link && 
        card.buttonText
      ).map(card => ({
        ...card,
        image: urlForImage(card.image?.asset?._ref).url()
      }));
    }

    console.log("Product cards data fetched successfully:", {
      active: data.product_cards.active,
      cardsCount: data.product_cards.cards.length
    });

    return data;
  } catch (error) {
    console.error("Error fetching product cards data:", error);
    return {
      product_cards: {
        active: false,
        cards: []
      }
    };
  }
} 