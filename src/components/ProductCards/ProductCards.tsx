"use client"

import ProductCardsClient from "./ProductCardsClient";

interface ProductCard {
  _id: string;
  image: any;
  alt: string;
  title: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  link: string;
}

interface ProductCardsProps {
  cards: ProductCard[];
}

// Error Boundary para capturar errores de stack overflow
// class ProductCardsErrorBoundary extends Component<
//   { children: ReactNode },
//   { hasError: boolean }
// > {
//   constructor(props: { children: ReactNode }) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error) {
//     console.error("ProductCards Error Boundary caught an error:", error);
//     return { hasError: true };
//   }

//   componentDidCatch(error: Error, errorInfo: ErrorInfo) {
//     console.error("ProductCards Error Boundary error details:", error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return <ProductCardsSkeleton />;
//     }

//     return this.props.children;
//   }
// }

// Componente de carga
const ProductCardsSkeleton = () => (
  <section className="w-full">
    <div className="hidden lg:grid grid-cols-3 gap-6 w-full h-[80vh] p-6">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-200 " />
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-200 " />
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-200 " />
    </div>
    <div className="lg:hidden w-full h-[80vh] bg-gray-200 " />
  </section>
);

const ProductCards: React.FC<ProductCardsProps> = ({ cards }) => {
  console.log(cards,"cards");
  
  // Validar que cards sea un array válido y tenga elementos
  // if (!Array.isArray(cards) || cards.length === 0) {
  //   console.log("ProductCards - No cards to display or invalid cards array:", cards);
  //   return <ProductCardsSkeleton />;
  // }

  // Validar que cada card tenga los campos requeridos
  // const validCards = cards.filter(card => {
  //   if (!card || typeof card !== 'object') {
  //     console.warn("ProductCards - Invalid card object:", card);
  //     return false;
  //   }
    
  //   if (!card._id || !card.title || !card.image || !card.link) {
  //     console.warn("ProductCards - Card missing required fields:", card);
  //     return false;
  //   }
    
  //   return true;
  // });

  // if (validCards.length === 0) {
  //   console.log("ProductCards - No valid cards after filtering");
  //   return <ProductCardsSkeleton />;
  // }

  return (
    
        <ProductCardsClient cards={cards} />
 
 
  );
};

export default ProductCards; 