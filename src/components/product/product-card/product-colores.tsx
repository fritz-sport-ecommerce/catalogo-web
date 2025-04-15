import { client } from "@/sanity/lib/client";
import { FiltroProducts } from "@/utils/filtro-products";
import { groq } from "next-sanity";
import React, { useEffect, useState } from "react";

// Interfaz para los productos
interface Product {
  slug: string;
  sku: string;
  name: string;
  images: { asset: { _ref: string } }[];
}

// Props del componente
interface ColoresProductsProps {
  products: any;
  setSkuColor: any;
  skuColor: string;
  data: Product[] | []; // Cambiado para permitir que sea null mientras carga
  urlForImage: (ref: string) => { url: () => string };
}

const ColoresProducts: React.FC<ColoresProductsProps> = ({
  products,
  skuColor,
  urlForImage,
  setSkuColor,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>(
    {}
  ); // Estado para controlar las imágenes cargadas
  const [dataColores, setDataColores] = useState([]);
  const visibleItems = 3; // Número de productos visibles

  // Control de los botones (verificación de límites)
  const canScrollLeft = currentIndex > 0;
  const canScrollRight =
    dataColores && currentIndex < dataColores.length - visibleItems;

  // Funciones de navegación
  const handlePrev = () => {
    if (canScrollLeft) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (canScrollRight) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Solo mostrar los botones si hay más productos que los visibles
  const showButtons = dataColores && dataColores.length > visibleItems;

  const handleImageLoad = (index: number) => {
    setImageLoaded((prevState) => ({
      ...prevState,
      [index]: true,
    }));
  };
  const VerColores = () => {
    const filtroProduct = FiltroProducts(products);

    client
      .fetch(
        groq`*[${filtroProduct}] {
      _id, sku, images
    }[0..4]`
      )
      .then((data) => {
        setCurrentIndex(0);
        setDataColores(data);
      });
  };

  return (
    <>
      <div className="mt-2">
        {dataColores?.length === 0 ? (
          <>
            <div className="w-full flex justify-start items-center py-2 pl-5 ">
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 73 73"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <title>fundamentals/css/colors</title>{" "}
                  <desc>Created with Sketch.</desc> <defs> </defs>{" "}
                  <g
                    id="fundamentals/css/colors"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    {" "}
                    <rect
                      id="mask"
                      strokeWidth="2"
                      fillRule="nonzero"
                      x="1"
                      y="1"
                      width="71"
                      height="71"
                      rx="14"
                    >
                      {" "}
                    </rect>{" "}
                    <g
                      id="color-wheel"
                      transform="translate(37.000000, 37.000000) rotate(-255.000000) translate(-37.000000, -37.000000) translate(11.000000, 11.000000)"
                      fillRule="nonzero"
                    >
                      {" "}
                      <path
                        d="M26,0 L22.953125,5.05273438 L26,9.2421875 L37.8440156,14.1559844 L43.6623281,11.3845469 L44.3044063,7.69559375 C39.6149609,3.00594531 33.1403516,0 26,0 Z"
                        id="Shape"
                        fill="#FF4B00"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M44.3045078,7.69549219 L37.8440156,14.1559844 L42.7578125,26 L47.6138203,29.046875 L52,26 C52,18.8596484 48.9940547,12.3850391 44.3045078,7.69549219 Z"
                        id="Shape"
                        fill="#FF9F00"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M42.7578125,26 L37.8440156,37.8440156 L38.1398672,44.2336172 L44.3045078,44.3045078 C48.9940547,39.6149609 52,33.1403516 52,26 L42.7578125,26 Z"
                        id="Shape"
                        fill="#66BB00"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M37.8440156,37.8440156 L26,42.7578125 L22.953125,47.80425 L26,52 C33.1403516,52 39.6149609,48.9940547 44.3045078,44.3045078 L37.8440156,37.8440156 Z"
                        id="Shape"
                        fill="#00CC71"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M14.1559844,37.8440156 L8.14724219,37.7590078 L7.69549219,44.3045078 C12.3850391,48.9940547 18.8596484,52 26,52 L26,42.7578125 L14.1559844,37.8440156 Z"
                        id="Shape"
                        fill="#0095FF"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M9.2421875,26 L4.76703906,22.953125 L0,26 C0,33.1403516 3.00594531,39.6149609 7.69549219,44.3045078 L14.1559844,37.8440156 L9.2421875,26 Z"
                        id="Shape"
                        fill="#6B77E8"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M11.5751797,8.52810156 L7.69559375,7.69549219 C3.00594531,12.3850391 0,18.8596484 0,26 L9.2421875,26 L14.1559844,14.1559844 L11.5751797,8.52810156 Z"
                        id="Shape"
                        fill="#B760EA"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M26,9.2421875 L26,0 C18.8596484,0 12.3850391,3.00594531 7.69549219,7.69549219 L14.1559844,14.1559844 C17.1903672,11.1216016 21.3798203,9.2421875 26,9.2421875 Z"
                        id="Shape"
                        fill="#FF193D"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M26,9.2421875 L22.953125,13.8125 L26,18.3828125 L31.3835234,20.6164766 L37.4257812,17.6210938 L37.8440156,14.1559844 C34.8096328,11.1216016 30.6201797,9.2421875 26,9.2421875 Z"
                        id="Shape"
                        fill="#FF7816"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M37.8440156,14.1559844 L31.3835234,20.6164766 L33.6171875,26 L37.8440156,29.046875 L42.7578125,26 C42.7578125,21.3798203 40.8783984,17.1903672 37.8440156,14.1559844 Z"
                        id="Shape"
                        fill="#FDBF00"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M33.6171875,26 L31.3835234,31.3835234 L32.1052266,35.1521016 L37.8440156,37.8440156 C40.8783984,34.8096328 42.7578125,30.6201797 42.7578125,26 L33.6171875,26 Z"
                        id="Shape"
                        fill="#77DD00"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M31.3835234,31.3835234 L26,33.6171875 L22.953125,38.3779297 L26,42.7578125 C30.6201797,42.7578125 34.8096328,40.8783984 37.8440156,37.8440156 L31.3835234,31.3835234 Z"
                        id="Shape"
                        fill="#00DD7B"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M20.6164766,31.3835234 L14.1299844,31.7762656 L14.1559844,37.8440156 C17.1903672,40.8783984 21.3798203,42.7578125 26,42.7578125 L26,33.6171875 L20.6164766,31.3835234 Z"
                        id="Shape"
                        fill="#3AAAFF"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M18.3828125,26 L14.1299844,22.953125 L9.2421875,26 C9.2421875,30.6201797 11.1216016,34.8096328 14.1559844,37.8440156 L20.6164766,31.3835234 L18.3828125,26 Z"
                        id="Shape"
                        fill="#7984EB"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M20.2871094,14.1933594 L14.1559844,14.1559844 C11.1216016,17.1903672 9.2421875,21.3798203 9.2421875,26 L18.3828125,26 L20.6164766,20.6164766 L20.2871094,14.1933594 Z"
                        id="Shape"
                        fill="#CB75F6"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M14.1559844,14.1559844 L20.6164766,20.6164766 L26,18.3828125 L26,9.2421875 C21.3798203,9.2421875 17.1903672,11.1216016 14.1559844,14.1559844 Z"
                        id="Shape"
                        fill="#FF4949"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M31.3835234,20.6164766 C30.0042031,19.2371563 28.0999062,18.3828125 26,18.3828125 L22.953125,21.3820547 L26,26 L31.7386875,23.3081875 L31.3835234,20.6164766 Z"
                        id="Shape"
                        fill="#FF9F00"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M33.6171875,26 C33.6171875,23.9000938 32.7628438,21.9957969 31.3835234,20.6164766 L26,26 L30.8559063,29.046875 L33.6171875,26 Z"
                        id="Shape"
                        fill="#FFD400"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M31.3835234,31.3835234 C32.7628438,30.0042031 33.6171875,28.0999062 33.6171875,26 L26,26 L28.6918125,31.7386875 L31.3835234,31.3835234 Z"
                        id="Shape"
                        fill="#89F900"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M26,26 L22.953125,30.2846172 L26,33.6171875 C28.0999063,33.6171875 30.0042031,32.7628438 31.3835234,31.3835234 L26,26 Z"
                        id="Shape"
                        fill="#00EE84"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M26,26 L21.4296875,27.5234375 L20.6164766,31.3835234 C21.9957969,32.7628438 23.9000938,33.6171875 26,33.6171875 L26,26 Z"
                        id="Shape"
                        fill="#73BCFF"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M18.3828125,26 C18.3828125,28.0999063 19.2371563,30.0042031 20.6164766,31.3835234 L26,26 L21.5249531,24.4765625 L18.3828125,26 Z"
                        id="Shape"
                        fill="#979FEF"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M20.6164766,20.6164766 C19.2371563,21.9957969 18.3828125,23.9000938 18.3828125,26 L26,26 L24.4765625,21.4296875 L20.6164766,20.6164766 Z"
                        id="Shape"
                        fill="#DA90F8"
                      >
                        {" "}
                      </path>{" "}
                      <path
                        d="M26,18.3828125 C23.9000938,18.3828125 21.9957969,19.2371563 20.6164766,20.6164766 L26,26 L26,18.3828125 Z"
                        id="Shape"
                        fill="#FF6C6C"
                      >
                        {" "}
                      </path>{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>
              <button
                className="uppercase text-xs"
                onClick={() => VerColores()}
              >
                ver colores
              </button>
            </div>
          </>
        ) : (
          <div className="relative  flex justify-around">
            {/* Botón anterior */}
            {showButtons && (
              <button
                className={`absolute xl:left-14 left-8 top-1/2 transform -translate-y-1/2 px-1 py-1  rounded-full bg-white ${
                  !canScrollLeft ? "hidden opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePrev}
                disabled={!canScrollLeft}
              >
                <svg
                  viewBox="0 0 1024 1024"
                  className="icon h-3 w-3"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z"></path>
                  </g>
                </svg>
              </button>
            )}

            {/* Contenedor de productos */}
            <div className="overflow-hidden flex justify-center w-[14rem] mx-auto">
              <div
                className="flex gap-x-1 h-[4.6rem]  transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${
                    currentIndex * (100 / visibleItems)
                  }%)`,
                }}
              >
                {dataColores?.length > 0 &&
                  dataColores?.map((el: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSkuColor(el.sku)}
                      className={`${
                        skuColor === el.sku &&
                        "border-[1px] border-blue-gray-300 dark:border-0 dark:border-transparent"
                      } flex-none  `}
                      style={{ width: "32%" }}
                    >
                      {/* Loader mientras la imagen carga */}
                      {!imageLoaded[i] && (
                        <img
                          className="w-full h-auto  cursor-pointer"
                          src="https://cdn.sanity.io/images/ibvmpbc1/production/be784c6f7090a169e2af07696ba8c02cedbf272d-2000x2000.png"
                          alt="Cargando..."
                        />
                      )}

                      {/* Imagen del producto */}
                      {el.images && el.images[0] && el.images[0]?.asset ? (
                        <img
                          className={`w-full h-auto  cursor-pointer ${
                            !imageLoaded[i] ? "hidden" : ""
                          }`}
                          src={urlForImage(el.images[0]?.asset._ref).url()}
                          alt={`Producto relacionado: ${el.name}`}
                          onLoad={() => handleImageLoad(i)}
                        />
                      ) : (
                        <></>
                      )}
                    </button>
                  ))}
              </div>
            </div>

            {/* Botón siguiente */}
            {showButtons && (
              <button
                className={`absolute xl:right-14 right-8 top-1/2 transform -translate-y-1/2 px-1 py-1  rounded-full bg-white ${
                  !canScrollRight ? "hidden opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleNext}
                disabled={!canScrollRight}
              >
                <svg
                  viewBox="0 0 1024 1024"
                  className="icon h-3 w-3"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z"></path>
                  </g>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ColoresProducts;
