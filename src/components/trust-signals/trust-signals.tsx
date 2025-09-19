import { Truck, RotateCcw, Shield, Headphones, CreditCard, Award } from "lucide-react";

const trustSignals = [
  {
    icon: Truck,
    title: "Envío Gratis",
    description: "En compras mayores a S/500",
    color: "text-green-600"
  },
  // {
  //   icon: RotateCcw,
  //   title: "30 días devolución",
  //   description: "Sin preguntas",
  //   color: "text-blue-600"
  // },
  {
    icon: Shield,
    title: "Pago Seguro",
    description: "100% protegido",
    color: "text-purple-600"
  },
  {
    icon: Headphones,
    title: "Soporte 24/7",
    description: "Siempre disponible",
    color: "text-orange-600"
  },
  {
    icon: CreditCard,
    title: "Múltiples pagos",
    description: "Tarjetas y transferencias",
    color: "text-indigo-600"
  },
  {
    icon: Award,
    title: "Garantía de calidad",
    description: "Productos originales",
    color: "text-red-600"
  }
];

export default function TrustSignals() {
  return (
    <section className=" py-12 my-16">
      <div className="container mx-auto">
        <h2 className="text-center text-2xl font-bold  mb-8">
          ¿Por qué elegir nuestra tienda?
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trustSignals.map((signal, index) => {
            const IconComponent = signal.icon;
            return (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-4  rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className={`${signal.color} mb-3`}>
                  <IconComponent size={32} />
                </div>
                <h3 className="font-semibold  text-sm mb-1">
                  {signal.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {signal.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Estadísticas adicionales */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
            <div className="text-sm text-gray-600">Clientes satisfechos</div>
          </div>
          {/* <div className="p-4">
            <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-sm text-gray-600">Satisfacción del cliente</div>
          </div> */}
          <div className="p-4">
            <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
            <div className="text-sm text-gray-600">Tiempo de entrega
            </div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-bold text-orange-600 mb-2">5★</div>
            <div className="text-sm text-gray-600">Calificación promedio</div>
          </div>
        </div>
      </div>
    </section>
  );
}