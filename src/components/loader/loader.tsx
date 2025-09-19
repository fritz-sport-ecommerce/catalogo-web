"use client";
import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-[999] h-full">
      <div
        style={{
          animation: "spin 1s linear infinite",
        }}
        className="w-16 h-16 border-4 border-t-white border-gray-400 rounded-full animate-spin"
      ></div>
    </div>
  );
};

export default Loader;
