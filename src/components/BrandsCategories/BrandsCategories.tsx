import React from "react";
import { Brand, Category } from "@/lib/fetchHomeData";
import BrandsCategoriesClient from "./BrandsCategoriesClient";

interface BrandsCategoriesProps {
  brands: Brand[];
  categories: Category[];
  title: string;
}

const BrandsCategories: React.FC<BrandsCategoriesProps> = ({ brands, categories, title }) => {

  
  // Check if we have data to display
  if ((!brands || brands.length === 0) && (!categories || categories.length === 0)) {
    console.log("BrandsCategories - No data to display");
    return (
      <section className="w-full py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-12">
            {title || "Brands & Categories"}
          </h2>
          <div className="text-center text-gray-600">
            <p>No brands or categories available</p>
          </div>
        </div>
      </section>
    );
  }

  console.log("BrandsCategories - Rendering BrandsCategoriesClient");
  return <BrandsCategoriesClient brands={brands} categories={categories} title={title} />;
};

export default BrandsCategories; 