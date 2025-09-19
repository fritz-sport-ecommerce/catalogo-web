"use client";
import React, { useEffect, useState } from "react";

interface InfoBannerProps {
  bannerTopInfo: {
    active_banner: boolean;
    banner_top: string[];
  };
}

const InfoBanner: React.FC<InfoBannerProps> = ({ bannerTopInfo }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % bannerTopInfo.banner_top.length
        );
        setVisible(true);
      }, 1000); // Duración de la desaparición
    }, 5000); // Tiempo que muestra cada mensaje

    return () => clearInterval(interval);
  }, [bannerTopInfo.banner_top.length]);

  return (
    <>
      {bannerTopInfo.active_banner && (
        <div className="dark:bg-white bg-black dark:text-black text-white py-2 text-center text-xs font-bold font-sans tracking-normal">
          <div
            className={`transition-opacity duration-1000 ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            {bannerTopInfo.banner_top[currentIndex]}
          </div>
        </div>
      )}
    </>
  );
};

export default InfoBanner;
