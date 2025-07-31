"use client";

import { urlForImage } from "@/sanity/lib/image";
import { Button } from "../ui/button";

export default function PaginaEmprende({ emprende }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50   dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        {emprende.portadadeskt.asset._ref && (
          <img
            src={urlForImage(emprende.portadadeskt.asset._ref).url()}
            alt="Emprende con nosotros"
            className="hidden md:block w-full h-[70vh] object-cover"
          />
        )}
        {emprende.portadamob.asset._ref && (
          <img
            src={urlForImage(emprende.portadamob.asset._ref).url()}
            alt="Emprende con nosotros"
            className="block md:hidden w-full h-[50vh] object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg animate-slide-up">
              Emprende con Nosotros
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto drop-shadow-lg animate-slide-up-delayed">
              Construye tu futuro empresarial con las mejores herramientas y oportunidades
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-16 animate-fade-in">
            {emprende.titulobeneficios}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {emprende.benficiosgrid.map((el, i) => (
              <div
                key={i}
                className="group relative   rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 mb-6 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-4 shadow-lg">
                    <img
                      src={urlForImage(el.img.asset._ref).url()}
                      alt={el.titulo}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {el.titulo}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emprendedor y Mayorista Section */}
      <section className="py-20 px-4 bg-gradient-to-br    ">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-20 animate-fade-in">
            {emprende.tituloemprende}
          </h2>

          <div className="space-y-32">
            {emprende.emprendemayorista.map((el, i) => (
              <div
                key={el.titulo}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {/* Badge */}
                <div className="flex justify-center mb-12">
                  <div className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-full shadow-lg">
                    {i === 0 ? "EMPRENDEDOR" : "MAYORISTA"}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Image */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl transition-all duration-300 group-hover:scale-105"></div>
                    <img
                      src={urlForImage(el.img.asset._ref).url()}
                      alt={el.Requisitos}
                      className="relative z-10 w-full h-auto rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Content */}
                  <div className="space-y-8">
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white animate-slide-in-right">
                      {el.Requisitos}
                    </h3>

                    <div className="space-y-6 animate-slide-in-right-delayed">
                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                          Beneficios Principales
                        </h4>
                        <ul className="space-y-3">
                          {el.beneficios.map((elm, idx) => (
                            <li key={idx} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">
                                {elm}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                          {el.titulobeneficios}
                        </h4>
                        <ul className="space-y-3">
                          {el.beneficios.map((el, idx) => (
                            <li key={idx} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-gray-700 dark:text-gray-300 font-medium">
                                {el}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <div className="pt-6 animate-fade-in-up">
                      <a
                        href={`https://api.whatsapp.com/send/?phone=51${emprende.pasos.empiezaahora[0].urlbutton}&text&type=phone_number&app_absent=0`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        <span>EMPRENDE AHORA</span>
                        <svg
                          className="w-6 h-6 ml-3"
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_21_26)">
                            <circle cx="15.5" cy="15.5" r="11.5" fill="white" />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M15.2219 0.578953C7.26327 0.578953 0.789474 7.05455 0.789474 15.0155C0.789474 18.1727 1.80764 21.1007 3.53846 23.4773L1.73964 28.841L7.28864 27.0675C9.57093 28.5782 12.2945 29.4522 15.2303 29.4522C23.189 29.4522 29.6628 22.9764 29.6628 15.0157C29.6628 7.05481 23.189 0.579191 15.2303 0.579191L15.2219 0.578953ZM11.1916 7.91206C10.9117 7.24163 10.6995 7.21624 10.2754 7.199C10.131 7.19062 9.97011 7.18224 9.79171 7.18224C9.23999 7.18224 8.66314 7.34344 8.31521 7.69986C7.89112 8.13268 6.83893 9.14252 6.83893 11.2135C6.83893 13.2844 8.34921 15.2873 8.55275 15.5676C8.76491 15.8473 11.4971 20.1588 15.7394 21.916C19.0569 23.2909 20.0413 23.1635 20.7963 23.0023C21.8993 22.7647 23.2824 21.9496 23.6303 20.9653C23.9783 19.9806 23.9782 19.1404 23.8762 18.9622C23.7745 18.784 23.4943 18.6824 23.0702 18.4699C22.6461 18.2577 20.5841 17.2392 20.1938 17.1034C19.8119 16.9592 19.4472 17.0103 19.1589 17.4177C18.7516 17.9863 18.3529 18.5636 18.0303 18.9114C17.7758 19.183 17.3598 19.217 17.0121 19.0726C16.5454 18.8776 15.2389 18.4189 13.6267 16.9846C12.3793 15.873 11.5309 14.4897 11.285 14.0739C11.0388 13.6497 11.2596 13.4032 11.4545 13.1742C11.6667 12.911 11.8702 12.7244 12.0824 12.4782C12.2945 12.2322 12.4133 12.1047 12.5491 11.8161C12.6935 11.5361 12.5915 11.2475 12.4897 11.0353C12.3879 10.823 11.5395 8.75208 11.1916 7.91206Z"
                              fill="#67C15E"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_21_26">
                              <rect
                                width="28.8733"
                                height="28.8733"
                                transform="translate(0.789474 0.578953)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pasos Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-20 animate-fade-in">
            {emprende.pasos.titulo}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-in-left">
              <img
                src={urlForImage(emprende.pasos.img.asset._ref).url()}
                alt="Pasos para emprender"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>

            <div className="space-y-8 animate-slide-in-right">
              {emprende.pasos.afiliate.map((el, i) => (
                <div 
                  key={i} 
                  className="  rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {el.titulo}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {el.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 animate-fade-in">
            {emprende.pasos.title}
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up">
            {emprende.pasos.empiezaahora.map((el, i) => (
              <a
                key={i}
                href={`https://api.whatsapp.com/send/?phone=51${el.urlbutton}&text&type=phone_number&app_absent=0`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <span>{el.textbutton}</span>
                <svg
                  className="w-6 h-6 ml-3"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_21_26)">
                    <circle cx="15.5" cy="15.5" r="11.5" fill="#67C15E" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M15.2219 0.578953C7.26327 0.578953 0.789474 7.05455 0.789474 15.0155C0.789474 18.1727 1.80764 21.1007 3.53846 23.4773L1.73964 28.841L7.28864 27.0675C9.57093 28.5782 12.2945 29.4522 15.2303 29.4522C23.189 29.4522 29.6628 22.9764 29.6628 15.0157C29.6628 7.05481 23.189 0.579191 15.2303 0.579191L15.2219 0.578953ZM11.1916 7.91206C10.9117 7.24163 10.6995 7.21624 10.2754 7.199C10.131 7.19062 9.97011 7.18224 9.79171 7.18224C9.23999 7.18224 8.66314 7.34344 8.31521 7.69986C7.89112 8.13268 6.83893 9.14252 6.83893 11.2135C6.83893 13.2844 8.34921 15.2873 8.55275 15.5676C8.76491 15.8473 11.4971 20.1588 15.7394 21.916C19.0569 23.2909 20.0413 23.1635 20.7963 23.0023C21.8993 22.7647 23.2824 21.9496 23.6303 20.9653C23.9783 19.9806 23.9782 19.1404 23.8762 18.9622C23.7745 18.784 23.4943 18.6824 23.0702 18.4699C22.6461 18.2577 20.5841 17.2392 20.1938 17.1034C19.8119 16.9592 19.4472 17.0103 19.1589 17.4177C18.7516 17.9863 18.3529 18.5636 18.0303 18.9114C17.7758 19.183 17.3598 19.217 17.0121 19.0726C16.5454 18.8776 15.2389 18.4189 13.6267 16.9846C12.3793 15.873 11.5309 14.4897 11.285 14.0739C11.0388 13.6497 11.2596 13.4032 11.4545 13.1742C11.6667 12.911 11.8702 12.7244 12.0824 12.4782C12.2945 12.2322 12.4133 12.1047 12.5491 11.8161C12.6935 11.5361 12.5915 11.2475 12.4897 11.0353C12.3879 10.823 11.5395 8.75208 11.1916 7.91206Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_21_26">
                      <rect
                        width="28.8733"
                        height="28.8733"
                        transform="translate(0.789474 0.578953)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s ease-out;
        }
        
        .animate-slide-up-delayed {
          animation: slideUp 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-up {
          animation: slideUp 0.6s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out;
        }
        
        .animate-slide-in-right-delayed {
          animation: slideInRight 0.8s ease-out 0.2s both;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
