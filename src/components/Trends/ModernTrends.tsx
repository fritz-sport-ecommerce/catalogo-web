"use client"
import React from "react";
import { TrendItem } from "@/lib/fetchHomeData";
import TrendsClient from "./TrendsClient";

interface ModernTrendsProps {
  trends: TrendItem[];
  title: string;
  subtitle: string;
}

export function ModernTrends({ trends, title, subtitle }: ModernTrendsProps) {
  console.log("ModernTrends - trends:", trends);
  console.log("ModernTrends - title:", title);
  console.log("ModernTrends - subtitle:", subtitle);
  
  // Check if we have data to display
  if (!trends || trends.length === 0) {
    console.log("ModernTrends - No data to display");
    return (
      <section className="py-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 urban-text uppercase">
              {title || "TRENDS"}
            </h2>
            <p className="text-lg max-w-2xl mx-auto modern-text">
              {subtitle || "Descubre las tendencias más populares en deportes"}
            </p>
          </div>
          <div className="text-center text-gray-600">
            <p>No trends available</p>
          </div>
        </div>
      </section>
    );
  }

  console.log("ModernTrends - Rendering TrendsClient");
  return <TrendsClient trends={trends} title={title} subtitle={subtitle} />;
} 