import FollowsPage from "@/components/love-follow/follows-page";
import React from "react";
import { Metadata } from "next";
import { favoritesMetadata } from "@/config/seo-config";

export const metadata: Metadata = favoritesMetadata;

export default function page() {
  return (
    <div className="flex justify-center w-full mt-5 h-full overflow-x-hidden">
      <FollowsPage />
    </div>
  );
}
