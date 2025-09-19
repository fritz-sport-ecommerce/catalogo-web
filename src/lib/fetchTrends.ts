import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";

// Type for the trend item data from Sanity
export interface TrendItem {
  _id: string;
  title: string;
  subtitle: string;
  image: any;
  link: string;
}

// Type for the trends data structure
export interface TrendsData {
  trends?: {
    active: boolean;
    title: string;
    subtitle: string;
    trends_items: TrendItem[];
  };
}

// Function to fetch trends data from Sanity
export async function getTrendsData(): Promise<TrendsData | null> {
  try {
    const data = await client.fetch<TrendsData>(
      groq`*[_type == "home"][0] {
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
    return data;
  } catch (error) {
    console.error("Error fetching trends data:", error);
    return null;
  }
} 