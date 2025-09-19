// components/ProductSearch.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ProductSearchCard from "./product-search-card";
import Descuentos from "@/config/descuentos";
import { SanityProduct } from "@/config/inventory";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { Search, X, TrendingUp, Sparkles, Flame, Clock, Star } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  imageUrl: string;
  descuentos: [];
}

interface ModalProps {
  onClose: () => void;
}

// Colecciones populares basadas en los filtros existentes
const popularCollections = [
  { label: "Air Force 1", value: "air-force-1", icon: "✈️", category: "Nike Air Force 1" },
  { label: "Air Jordan", value: "air-jordan", icon: "🏀", category: "Nike Air Jordan" },
  { label: "Dunk Low", value: "dunk-low", icon: "🏀", category: "Nike Dunk" },
  { label: "Air Max", value: "air-max", icon: "💨", category: "Nike Air Max" },


];

// Categorías destacadas
const featuredCategories = [
  { label: "Deportivas", value: "deportivas", icon: "🏃‍♂️" },
  { label: "Urbano", value: "urbano", icon: "👕" },
  { label: "Running", value: "running", icon: "🏃‍♀️" },
  { label: "Basketball", value: "basquet", icon: "🏀" },
];

// Sugerencias por defecto
const defaultSuggestions = [
  "Nike Air Force 1",
  "Nike Dunk Low",
  "Nike Air Jordan 1",
  "Nike Air Max",

];

interface ProductSearchProps {
  onClose?: () => void;
  isOpen?: boolean;
}

export default function ProductSearch({ onClose, isOpen = false }: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fz_recent_searches");
    if (saved) {
      try {
        const searches = JSON.parse(saved);
        setRecentSearches(searches.slice(0, 5)); // Máximo 5 búsquedas recientes
      } catch (error) {
        console.error("Error loading recent searches:", error);
      }
    }
  }, []);

  // Guardar búsqueda en localStorage
  const saveSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)];
    const limited = updated.slice(0, 5);
    setRecentSearches(limited);
    localStorage.setItem("fz_recent_searches", JSON.stringify(limited));
  };

  // Manejar búsqueda
  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    saveSearch(searchTerm);
    
    try {
      // Navegar a la tienda con el término de búsqueda
      const searchParams = new URLSearchParams();
      searchParams.set("search", searchTerm);
      router.push(`/tienda?${searchParams.toString()}`);
      
      // Cerrar el modal de búsqueda si existe
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error en búsqueda:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Búsqueda rápida para colecciones
  const handleQuickSearch = (searchTerm: string) => {
    handleSearch(searchTerm);
  };

  // Eliminar búsqueda reciente
  const removeRecentSearch = (searchTerm: string) => {
    const updated = recentSearches.filter(s => s !== searchTerm);
    setRecentSearches(updated);
    localStorage.setItem("fz_recent_searches", JSON.stringify(updated));
  };

  // Limpiar todas las búsquedas recientes
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("fz_recent_searches");
  };

  // Enfoque en el input cuando se abre el modal
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Buscar productos
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          {/* Barra de búsqueda */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Buscar productos, marcas, categorías..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          </form>
        {/* presiona enter */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Presiona <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Enter</kbd> para buscar
          </p>
        </div>
          {/* Colecciones populares */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Colecciones populares
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {popularCollections.map((collection) => (
                <button
                  key={collection.value}
                  onClick={() => handleQuickSearch(collection.value)}
                  className="flex items-center justify-center px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors text-left border border-gray-200 dark:border-gray-700 group"
                >
                  <span className="font-medium truncate">{collection.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Categorías destacadas */}
          {/* <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Categorías destacadas
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {featuredCategories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => handleQuickSearch(category.value)}
                  className="flex items-center justify-center px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors text-left border border-gray-200 dark:border-gray-700 group"
                >
                  <span className="font-medium">{category.label}</span>
                </button>
              ))}
            </div>
          </div> */}

          {/* Búsquedas recientes */}
          {recentSearches.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Búsquedas recientes
                  </h3>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  Limpiar
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                  >
                    <button
                      onClick={() => handleSearch(search)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {search}
                      </span>
                    </button>
                    <button
                      onClick={() => removeRecentSearch(search)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all"
                    >
                      <X className="h-3 w-3 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sugerencias por defecto */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sugerencias populares
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {defaultSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(suggestion)}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left border border-gray-200 dark:border-gray-700 group"
                >
                  <Star className="h-4 w-4 text-yellow-500 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
