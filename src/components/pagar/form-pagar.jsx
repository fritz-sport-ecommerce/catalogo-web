"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import departamentos from "@/json/departamentos.json";
import distritos from "@/json/distritos.json";
import provincias from "@/json/provincias.json";
import { urlForImage } from "@/sanity/lib/image";
import { useCart } from "react-use-cart";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import newUser from "@/config/new-user";
import ModalDesk from "../modal/Modal";
import { X } from "lucide-react";

const formData = {
  title: "Detalles de Pago",
  subtitle: "Complete su pedido proporcionando sus datos de pago.",
  inputs: [
    {
      label: "Nombre",
      name: "nombre",
      placeholder: "Nombre",
      type: "text",
    },
    {
      label: "Apellido",
      name: "apellido",
      placeholder: "Apellido",
      type: "text",
    },
    {
      label: "Email",
      name: "email",
      placeholder: "Email",
      type: "email",
    },
    {
      label: "Documento de identidad",
      name: "documento",
      placeholder: "Documento de identidad",
      type: "text",
    },
    {
      label: "Teléfono",
      name: "telefono",
      placeholder: "Teléfono",
      type: "tel",
    },
    {
      label: "Dirección",
      name: "direccion",
      placeholder: "Dirección",
      type: "text",
    },
    {
      label: "Información Adicional",
      name: "adicional",
      placeholder: "Información Adicional",
      type: "text",
    },
  ],
};

function Loading({ disableLoadAddProduct = true }) {
  return (
    <div
      className={` absolute left-7 top-3  h-7 w-7  animate-spin inline-block  border-[3px] border-current border-t-transparent text-gray-800 rounded-full dark:text-white ${
        !disableLoadAddProduct ? "hidden" : "block"
      }`}
      role="status"
      aria-label="loading"
    >
      <span class="sr-only">Loading...</span>
    </div>
  );
}

export default function FormPagar({ tipoEntrega, userInfo, isPrimeraCompra, invalidItems, setInvalidItems }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const { items, cartTotal, updateItem, removeItem } = useCart();
  
  const [allValues, setAllValues] = useState({
    nombre: !userInfo.userInfo?.name ? "" : userInfo.userInfo?.name,
    apellido: !userInfo.userInfo?.apellidos ? "" : userInfo.userInfo?.apellidos,
    email: !userInfo.userInfo?.email ? "" : userInfo.userInfo?.email,
    documento: !userInfo.userInfo?.documento ? "" : userInfo.userInfo?.documento,
    telefono: !userInfo.userInfo?.telefono ? "" : userInfo.userInfo?.telefono,
    direccion: !userInfo.userInfo?.direccion ? "" : userInfo.userInfo?.direccion,
    comprobante: "Boleta",
    ruc: !userInfo.userInfo?.ruc ? "" : userInfo.userInfo?.ruc,
    departamento: !userInfo.userInfo?.departamento ? "" : userInfo.userInfo?.departamento,
    provincia: !userInfo.userInfo?.provincia ? "" : userInfo.userInfo?.provincia,
    distrito: !userInfo.userInfo?.distrito ? "" : userInfo.userInfo?.distrito,
    adicional: !userInfo.userInfo?.infadi ? "" : userInfo.userInfo?.infadi,
    checkTerminos: false,
    estado: "pendiente",
    razon: "Fritz Sport",
    userId: userInfo.userInfo?._id,
  });

  const changeHandler = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const [domLoaded, setDomLoaded] = useState(false);
  const [validate, setValidate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [precioDelibery, setPrecioDelibery] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  // Lógica de envío gratis por monto de compra
  useEffect(() => {
    if (tipoEntrega === "recojo") {
      setPrecioDelibery(0);
    } else {
      if (cartTotal >= 500) {
        setPrecioDelibery(0);
      } else {
        // Lógica normal de envío
        if (allValues.provincia === "3285" && allValues.departamento === "Lima") {
          setPrecioDelibery(10);
        } else {
          setPrecioDelibery(20);
        }
      }
    }
  }, [tipoEntrega, allValues.provincia, allValues.departamento]);

  // Función para obtener productos sugeridos para completar envío gratis
  const fetchSuggestedProducts = async () => {
    if (cartTotal >= 500 || tipoEntrega === "recojo") {
      setSuggestedProducts([]);
      setSuggestionsError(false);
      return;
    }

    const amountNeeded = 500 - cartTotal;
    if (amountNeeded <= 0) return;

    setLoadingSuggestions(true);
    setSuggestionsError(false);
    try {
      console.log("[SUGGESTIONS] Iniciando búsqueda de productos sugeridos...");
      console.log("[SUGGESTIONS] Monto necesario:", amountNeeded);
      
      // Crear un controller para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos de timeout
      
      // Obtener productos con stock y precio adecuado
      const response = await fetch(`/api/products?limit=8&gender=unisex`, {
        signal: controller.signal,
        cache: 'no-store' // Evitar caché
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const products = await response.json();
      console.log("[SUGGESTIONS] Productos obtenidos de API:", products.length);
      
      // Filtrar productos que tengan stock y precio adecuado para completar el envío gratis
      const filteredProducts = products.filter(product => {
        const hasStock = product.stock > 0;
        const hasPrice = product.priceecommerce > 0;
        const priceInRange = product.priceecommerce <= amountNeeded + 50;
        
        console.log(`[SUGGESTIONS] Producto ${product.name}: stock=${product.stock}, precio=${product.priceecommerce}, enRango=${priceInRange}`);
        
        return hasStock && hasPrice && priceInRange;
      });
      
      console.log("[SUGGESTIONS] Productos filtrados:", filteredProducts.length);
      
      setSuggestedProducts(filteredProducts.slice(0, 4)); // Mostrar máximo 4 productos
    } catch (error) {
      console.error("[SUGGESTIONS] Error fetching suggested products:", error);
      setSuggestionsError(true);
      
      // Estrategia de fallback: usar productos del carrito como base para sugerencias
      if (items.length > 0) {
        console.log("[SUGGESTIONS] Usando estrategia de fallback con productos del carrito");
        // Crear sugerencias basadas en productos similares del carrito
        const fallbackSuggestions = items.slice(0, 2).map(item => ({
          _id: `fallback-${item.id}`,
          name: `Producto similar a ${item.title}`,
          sku: `fallback-${item.objectID}`,
          slug: item.slug,
          images: [item.image],
          stock: 10,
          priceecommerce: Math.min(amountNeeded, 100),
          marca: item.marca,
          tipo: item.tipo
        }));
        setSuggestedProducts(fallbackSuggestions);
        setSuggestionsError(false); // Resetear error si el fallback funciona
      } else {
        // Último fallback: productos básicos de Sanity sin validación de stock
        try {
          console.log("[SUGGESTIONS] Intentando fallback con Sanity directo");
          const sanityResponse = await fetch('/api/sanity/products?limit=4&gender=unisex');
          if (sanityResponse.ok) {
            const sanityProducts = await sanityResponse.json();
            const basicSuggestions = sanityProducts.slice(0, 2).map(product => ({
              _id: product._id,
              name: product.name,
              sku: product.sku,
              slug: product.slug,
              images: product.images,
              stock: 5, // Asumir stock bajo
              priceecommerce: Math.min(amountNeeded, 150),
              marca: product.marca,
              tipo: product.tipo
            }));
            setSuggestedProducts(basicSuggestions);
            setSuggestionsError(false); // Resetear error si el fallback funciona
          } else {
            setSuggestedProducts([]);
          }
        } catch (sanityError) {
          console.error("[SUGGESTIONS] Error en fallback de Sanity:", sanityError);
          setSuggestedProducts([]);
        }
      }
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Obtener productos sugeridos cuando el carrito cambia
  useEffect(() => {
    if (domLoaded && cartTotal > 0 && cartTotal < 500 && tipoEntrega === "envio") {
      fetchSuggestedProducts();
    }
  }, [cartTotal, tipoEntrega, domLoaded]);


  let montoTotal = newUser(isPrimeraCompra, cartTotal, precioDelibery);
  let [totalActualizado, setTotalActualizado] = useState(montoTotal);
  const [itemsToRemove, setItemsToRemove] = useState([]);

  useEffect(() => {
    setDomLoaded(true);
  }, []);

  const [ubigeoDepartamento, setUbigeoDepartamento] = useState(0);
  const [departamento, setDepartamento] = useState([]);
  const [provincia, setProvincia] = useState([]);

  useEffect(() => {
    let resultDep = departamentos?.find(
      (el) => el.nombre_ubigeo === `${allValues.departamento}`
    );
    let ubig = Number(resultDep?.id_ubigeo) + 1;

    setProvincia(distritos[String(ubig)]);
    let resultDepartamento = departamentos?.find(
      (el) => el.nombre_ubigeo === `${allValues.departamento}`
    );
    setUbigeoDepartamento(resultDepartamento?.id_ubigeo);
    setDepartamento(provincias[resultDepartamento?.id_ubigeo]);
    setProvincia(distritos[allValues?.provincia]);
  }, [
    allValues.departamento,
    ubigeoDepartamento,
    departamento,
    allValues.provincia,
  ]);

  // Eliminar productos después del delay
  useEffect(() => {
    if (itemsToRemove.length > 0) {
      const timer = setTimeout(() => {
        itemsToRemove.forEach(({ id }) => {
          removeItem(id);
        });
        setItemsToRemove([]);
        setInvalidItems({});
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [itemsToRemove, removeItem]);

  const handlesubmit = async () => {
    // Validar stock y precio antes de pagar
    const skus = [...new Set(items.map((item) => item.objectID))];
    console.log("[DEBUG] SKUs a validar:", skus);
    const resValid = await fetch("/api/valid-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        products: skus.map((sku) => {
          const prod = items.find((i) => i.objectID === sku);
          return {
            sku,
            empresa: prod.empresa,
            genero: prod.genero,
            marca: prod.marca,
            tipo: prod.tipo,
          };
        }),
        ciudad: "LIMA",
      }),
    });
    const validProducts = await resValid.json();
    console.log("[DEBUG] Respuesta API:", validProducts);
    let valid = true;
    let nuevoTotal = 0;
    let eliminados = [];
    let preciosCambiados = [];
    let itemsInvalidos = {};
    let itemsParaEliminar = [];
    for (const item of items) {
      console.log("[DEBUG] Validando item:", item);
      const validProd = validProducts.find((p) => p.sku === item.objectID);
      if (!validProd) {
        console.log("[DEBUG] Producto no encontrado en API:", item.objectID);
        itemsInvalidos[item.id] = { reason: "eliminado" };
        itemsParaEliminar.push(item.id);
        eliminados.push({ ...item, motivo: "eliminado" });
        toast({
          title: "Producto eliminado",
          description: `${item.name} ya no está disponible y será eliminado del carrito en 4 segundos.`,
        });
        valid = false;
        continue;
      }
      const tallaApi = validProd.tallas.find((t) => t.talla === item.talla);
      console.log("[DEBUG] Talla encontrada:", tallaApi);
      if (!tallaApi) {
        console.log("[DEBUG] Talla no encontrada:", item.talla);
        itemsInvalidos[item.id] = { reason: "talla no disponible" };
        itemsParaEliminar.push(item.id);
        eliminados.push({ ...item, motivo: "talla no disponible" });
        toast({
          title: "Talla no disponible",
          description: `${item.name} (${item.talla}) ya no está disponible y será eliminado del carrito en 4 segundos.`,
        });
        valid = false;
        continue;
      }
      if (tallaApi.stock < item.quantity) {
        console.log("[DEBUG] Stock insuficiente:", tallaApi.stock, "<", item.quantity);
        itemsInvalidos[item.id] = { reason: "sin stock", stockDisponible: tallaApi.stock };
        itemsParaEliminar.push(item.id);
        eliminados.push({ ...item, motivo: "sin stock", stockDisponible: tallaApi.stock });
        toast({
          title: "Stock insuficiente",
          description: `${item.name} (${item.talla}) ya no tiene stock suficiente y será eliminado del carrito en 4 segundos.`,
        });
        valid = false;
        continue;
      }
      if (tallaApi.price && tallaApi.price !== item.price) {
        console.log("[DEBUG] Precio cambiado:", item.price, "->", tallaApi.price);
        updateItem(item.id, { price: tallaApi.price });
        itemsInvalidos[item.id] = { reason: "precio cambiado", newPrice: tallaApi.price };
        preciosCambiados.push({ ...item, nuevoPrecio: tallaApi.price });
        toast({
          title: "Precio actualizado",
          description: `${item.name} (${item.talla}) cambió de precio. Se actualizó en tu carrito.`,
        });
        valid = false;
      }
      nuevoTotal += (tallaApi.price || item.price) * item.quantity;
    }
    setInvalidItems(itemsInvalidos);
    if (itemsParaEliminar.length > 0) {
      setItemsToRemove(itemsParaEliminar.map(id => ({ id, delay: 4000 })));
    }
    setTotalActualizado(nuevoTotal > 0 ? nuevoTotal : montoTotal);
    console.log("[VALIDACIÓN ANTES DE PAGAR]", {
      eliminados,
      preciosCambiados,
      total: nuevoTotal > 0 ? nuevoTotal : montoTotal,
      items: items.map(i => ({ id: i.id, name: i.name, talla: i.talla, price: i.price, quantity: i.quantity }))
    });
    if (!valid) {
      toast({
        title: "Revisa tu carrito",
        description: "Algunos productos cambiaron de precio o ya no están disponibles. Corrige antes de pagar.",
      });
      return;
    }

    let productosCantidad = items.map((el, i) => {
      let productos = {
        id: el.idsanity,
        key_talla: el.id,
        category_id: el.talla,
        title: el.name,
        type: el.objectID,
        picture_url: el?.image && urlForImage(el?.image).url(),
        quantity: el.quantity,
        unit_price: el.price,
        // Incluir información de almacenes disponibles
        almacenes_disponibles: el.almacenes_disponibles || [],
      };

      return productos;
    });

    setValidate(false);
    setLoading(true);
    let dataPago = {
      productos: productosCantidad,
      tipoEntrega: tipoEntrega,
      id_mercado_pago: "01",
      razon: allValues.razon,
      estado: allValues.estado,
      nombres: allValues.nombre,
      apellido: allValues.apellido,
      email: allValues.email,
      documento: allValues.documento,
      telefono: allValues.telefono,
      comprobante: allValues.comprobante,
      direccion: allValues.direccion,
      ruc: allValues.ruc,
      departamento: allValues.departamento,
      distrito: allValues.distrito,
      provincia: allValues.provincia,
      adicional: allValues.adicional,
      cartTotal: Number(nuevoTotal > 0 ? nuevoTotal : montoTotal),
      userId: allValues.userId,
      deliveryPrice: precioDelibery,
      descuentoUser:  0, 
      isPrimeraCompra: isPrimeraCompra,
    };

    try {
      const res = await fetch(`/api/checkout`, {
        method: "POST",
        body: JSON.stringify(dataPago),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
          "Access-Control-Allow-Headers": "*",
        },
      });
      const data = await res.json();
      console.log(data);

      if (res.status === 200) {
        // Abrir modal con detalle del pedido
        setLastOrder({
          ...dataPago,
          createdAt: new Date().toISOString(),
          response: data,
        });
        setOrderModalOpen(true);
      }
      setLoading(false);

      if (res.status === 401) {
        alert("Ingrese los datos correctamente");
        setLoading(false);
      }
    } catch (error) {
      console.log(error.message);
      setLoading(true);
    }
  };

  useEffect(() => {
    if (
      allValues.nombre.length >= 1 &&
      allValues.apellido.length >= 1 &&
      allValues.email.length >= 4 &&
      allValues.documento.length >= 1 &&
      allValues.telefono.length >= 1 &&
      allValues.comprobante.length >= 2 &&
      allValues.direccion.length >= 4 &&
      allValues.departamento.length >= 2 &&
      allValues.provincia.length >= 2 &&
      allValues.distrito.length >= 1 &&
      allValues.checkTerminos &&
      items.length > 0
    ) {
      if (allValues.comprobante === "Factura" && allValues.ruc.length === 0) {
        setValidate(false);
      } else {
        setValidate(true);
      }
    } else {
      setValidate(false);
    }
  }, [allValues, session?.user]);

  const handlerDepartamento = (data, id) => {
    setDepartamento(data);
    setAllValues({
      ...allValues,
      departamento: departamentos?.find((el) => el.id_ubigeo === id)
        .nombre_ubigeo,
    });
  };

  const handlerProvincia = (data, value) => {
    setProvincia(data);
    setAllValues({
      ...allValues,
      provincia: value,
    });
  };

  // // Mostrar toast para usuarios no logueados
  // useEffect(() => {
  //   if (!session && domLoaded) {
  //     toast({
  //       title: "¡Inicia sesión y obtén promociones especiales!",
  //       description: "Inicia sesión para recibir descuentos exclusivos y envío gratis en compras desde S/500.",
  //       duration: 8000,
  //       action: (
  //         <Link href="/auth?form=pagar" className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
  //           Iniciar sesión
  //         </Link>
  //       ),
  //     });
  //   }
  // }, [session, domLoaded, toast]);

  return (
    <div className="mt-10  px-4 pt-8  lg:mt-0 ">
      <p className="text-xl font-medium">{formData.title}</p>
      <p className="">{formData.subtitle}</p>
      
      {/* Banner de promoción de delivery gratis */}
{/* Banner promocional de envío gratis - Versión mejorada */}
{tipoEntrega === "envio" && cartTotal < 500 && isPrimeraCompra ? (
  <div className="mt-4 p-4 bg-green-50 border-l-4 border-green-400 rounded-lg shadow-sm">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg 
          className="h-5 w-5 text-green-500" 
          viewBox="0 0 20 20" 
          fill="currentColor"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-semibold text-green-800">
          ¡Falta poco para tu envío gratis! 
          <span className="block sm:inline sm:ml-1 font-bold text-green-600">
            Solo S/{(500 - cartTotal).toFixed(2)} más.
          </span>
        </h3>
        <div className="mt-2">
          <div className="w-full bg-green-100 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${Math.min((cartTotal/500)*100, 100)}%` }}
              aria-valuenow={Math.min(cartTotal/500*100, 100)}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <p className="mt-2 text-xs text-green-600">
            {cartTotal >= 250 ? (
              <>Estás a {500 - cartTotal <= 100 ? "un paso" : "poco"} de conseguir envío gratis</>
            ) : (
              <>Agrega más productos para disfrutar de envío gratis desde S/500</>
            )}
          </p>
        </div>
      </div>
    </div>
  </div>
):<></>}

{/* Sugerencias de productos para completar envío gratis */}
{tipoEntrega === "envio" && cartTotal > 0 && cartTotal < 500 &&  isPrimeraCompra ? (
  <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-lg shadow-sm">
    <div className="flex items-center mb-2 sm:mb-3">
      <svg 
        className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 10V3L4 14h7v7l9-11h-7z" 
        />
      </svg>
      <h3 className="text-xs sm:text-sm font-semibold text-blue-800">
        ¡Completa tu envío gratis!
      </h3>
    </div>
    
    <p className="text-xs text-blue-700 mb-2 sm:mb-3">
      Solo te faltan <span className="font-bold">S/{(500 - cartTotal).toFixed(2)}</span> para conseguir envío gratis
    </p>
    
    {loadingSuggestions ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white rounded-lg p-2 sm:p-3 border border-blue-200">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded   "></div>
              </div>
              <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
                <div className="h-2 sm:h-3 bg-gray-200 rounded   "></div>
                <div className="h-2 sm:h-3 bg-gray-200 rounded w-3/4   "></div>
                <div className="h-1.5 sm:h-2 bg-gray-200 rounded w-1/2   "></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : suggestedProducts.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {suggestedProducts?.map((product) => (
          <div 
            key={product._id} 
            className="bg-white rounded-lg p-2 sm:p-3 border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => {
              window.open(`/products/${product.slug}/${product.sku}`, '_blank');
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="relative">
                <img 
                  src={urlForImage(product.images?.[0]).url()} 
                  alt={product.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded"
                />
                {product.stock <= 5 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
                    {product.stock}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate group-hover:text-blue-600">
                  {product.name}
                </p>
                <p className="text-xs text-green-600 font-bold">
                  S/{product.priceecommerce?.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : suggestionsError ? (
      <div className="text-center py-3 sm:py-4">
        <div className="flex items-center justify-center mb-2">
          <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-xs text-orange-600 font-medium">
            No pudimos cargar sugerencias
          </p>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Revisa tu conexión o intenta más tarde
        </p>
        <button
          onClick={fetchSuggestedProducts}
          disabled={loadingSuggestions}
          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reintentar
        </button>
      </div>
    ) : (
      <div className="text-center py-3 sm:py-4">
        <p className="text-xs text-gray-600 mb-2">
          No encontramos productos sugeridos en este momento
        </p>
      </div>
    )}
    
    <div className="mt-2 sm:mt-3 text-center">
      <Link 
        href="/tienda" 
        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium underline"
      >
        Ver más productos
        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  </div>
) : <></>}

      <div>
        <div className=" grid xl:grid-cols-2 xl:gap-4 gap-y-4 mt-5">
          {formData.inputs.map((el, i) => (
            <div key={i} className="flex flex-col gap-y-2">
              <div class="relative h-10 w-full min-w-[200px]">
                <input
                  name={el.name}
                  autocomplete="off"
                  value={allValues[`${el.name}`]}
                  onChange={(e) => changeHandler(e)}
                  className={`peer h-full w-full rounded-[7px] border ${
                    allValues[`${el.name}`].length < 4
                      ? "focus:border-red-300 placeholder-shown:border-red-300 placeholder-shown:border-t-red-300 border-red-300  "
                      : "focus:border-green-300 placeholder-shown:border-green-300 placeholder-shown:border-t-green-300 border-green-300   text-black dark:text-blue-gray-100 dark:bg-black"
                  } border-t-transparent  px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border  focus:border-2  focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50`}
                  placeholder=" "
                />
                <label
                  className={`before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight ${
                    allValues[`${el.name}`].length < 4
                      ? "text-red-300 before:border-red-300  after:border-red-300 peer-placeholder-shown:text-red-300 peer-focus:text-red-300 peer-focus:before:border-red-300 peer-focus:after:border-red-300"
                      : "text-green-300    peer-placeholder-shown:text-green-300 peer-focus:text-green-300 before:border-green-300 after:border-green-300 peer-focus:before:border-green-300 peer-focus:after:border-green-300"
                  }  transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l   before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r  after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight  peer-focus:before:border-t-2 peer-focus:before:border-l-2  peer-focus:after:border-t-2 peer-focus:after:border-r-2  peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent`}
                >
                  {el.label === "Información Adicional text-sm"
                    ? el.label
                    : el.label}
                </label>
              </div>
              <span className="validationFormRed ml-1 text-sm">
                {allValues[`${el.name}`].length < 4 &&
                  `${
                    el.name === "adicional"
                      ? ""
                      : `la propiedad ${el.name} es necesaria`
                  }`}
              </span>
            </div>
          ))}
        </div>

        {/* Comprobante */}
        <div className="flex flex-col sm:flex-row">
          <label
            htmlFor="card-holder"
            className="mb-2 block w-full text-sm  font-medium "
          >
            <div
              for="countries"
              class="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Comprobante
            </div>
            <select
              onChange={(e) =>
                setAllValues({ ...allValues, comprobante: e.target.value })
              }
              value={allValues.comprobante}
              name="comprobante"
              label="Comprobante"
              className={`border  ${
                allValues.comprobante.length < 4
                  ? " bg-transparent border-red-300  focus:ring-red-300 focus:border-red-300 dark:focus:ring-red-300 dark:focus:border-red-300 dark:placeholder-red-300 dark:text-red-300  text-red-300 dark:bg-black   dark:border-red-300"
                  : "bg-transparent border-green-300  focus:ring-green-300 focus:border-green-300 dark:focus:ring-green-300 dark:focus:border-green-300 dark:placeholder-green-300 dark:text-green-300  text-green-300 dark:bg-black dark:border-green-300"
              }  border   text-sm rounded-lg   block w-full p-2.5  bg-transparent  `}
            >
              <option value="Boleta">Boleta</option>
              <option value="Factura">Factura</option>
            </select>

            <span className="validationFormRed ml-1 text-sm">
              {allValues.comprobante.length < 4 &&
                `la propiedad Comprobante es necesaria`}
            </span>
          </label>
        </div>

        {/* RUC - Solo si es factura */}
        {allValues.comprobante === "Factura" && (
          <div className="flex flex-col sm:flex-row">
            <label
              htmlFor="card-holder"
              className="mb-2 block w-full text-sm  font-medium "
            >
              <div
                for="countries"
                class="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                RUC
              </div>
              <input
                type="text"
                name="ruc"
                value={allValues.ruc}
                onChange={(e) => changeHandler(e)}
                className={`border  ${
                  allValues.comprobante === "Factura" && allValues.ruc.length < 4
                    ? " bg-transparent border-red-300  focus:ring-red-300 focus:border-red-300 dark:focus:ring-red-300 dark:focus:border-red-300 dark:placeholder-red-300 dark:text-red-300  text-red-300 dark:bg-black   dark:border-red-300"
                    : "bg-transparent border-green-300  focus:ring-green-300 focus:border-green-300 dark:focus:ring-green-300 dark:focus:border-green-300 dark:placeholder-green-300 dark:text-green-300  text-green-300 dark:bg-black dark:border-green-300"
                }  border   text-sm rounded-lg   block w-full p-2.5  bg-transparent  `}
                placeholder="RUC"
              />

              <span className="validationFormRed ml-1 text-sm">
                {allValues.comprobante === "Factura" &&
                  allValues.ruc.length < 4 &&
                  `la propiedad RUC es necesaria`}
              </span>
            </label>
          </div>
        )}
        {/* Departamentos */}
        <div className="flex flex-col sm:flex-row">
          <label
            htmlFor="card-holder"
            className="mb-2 block w-full text-sm  font-medium "
          >
            <div
              for="countries"
              class="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-400"
            >
              Departamento
            </div>
            <select
              onChange={(e) =>
                handlerDepartamento(
                  provincias[e.target.value],
                  e.target.value
                )
              }
              value={
                departamentos?.find(
                  (el) => el.nombre_ubigeo === allValues?.departamento
                )?.id_ubigeo
              }
              name="departamento"
              label="Departamento"
              className={`border  ${
                allValues.departamento.length < 4
                  ? " bg-transparent border-red-300  focus:ring-red-300 focus:border-red-300 dark:focus:ring-red-300 dark:focus:border-red-300 dark:placeholder-red-300 dark:text-red-300  text-red-300 dark:bg-black   dark:border-red-300"
                  : "bg-transparent border-green-300  focus:ring-green-300 focus:border-green-300 dark:focus:ring-green-300 dark:focus:border-green-300 dark:placeholder-green-300 dark:text-green-300  text-green-300 dark:bg-black dark:border-green-300"
              }  border   text-sm rounded-lg   block w-full p-2.5  bg-transparent  `}
              onResize={undefined}
              onResizeCapture={undefined}
            >
              {departamentos?.map((el) => (
                <option key={el.id_ubigeo} value={el.id_ubigeo}>
                  {el.nombre_ubigeo}
                </option>
              ))}
            </select>

            <span className="validationFormRed ml-1 text-sm">
              {allValues.departamento.length < 4 &&
                `la propiedad Departamento es necesaria`}
            </span>
          </label>
        </div>

        {/* Provincias */}
        {allValues.departamento && (
          <div className="flex flex-col sm:flex-row">
            <label
              htmlFor="card-holder"
              className="mb-2 block w-full text-sm  font-medium "
            >
              <div
                for="countries"
                class="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Provincia
              </div>
              <select
                onChange={(e) =>
                  handlerProvincia(
                    distritos[e.target.value],
                    e.target.value
                  )
                }
                value={allValues?.provincia}
                name="provincia"
                label="Provincia"
                className={`border  ${
                  allValues.provincia.length < 4
                    ? " bg-transparent border-red-300  focus:ring-red-300 focus:border-red-300 dark:focus:ring-red-300 dark:focus:border-red-300 dark:placeholder-red-300 dark:text-red-300  text-red-300 dark:bg-black   dark:border-red-300"
                    : "bg-transparent border-green-300  focus:ring-green-300 focus:border-green-300 dark:focus:ring-green-300 dark:focus:border-green-300 dark:placeholder-green-300 dark:text-green-300  text-green-300 dark:bg-black dark:border-green-300"
                }  border   text-sm rounded-lg   block w-full p-2.5  bg-transparent  `}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                {departamento?.map((el) => (
                  <option key={el.id_ubigeo} value={el.id_ubigeo}>
                    {el.nombre_ubigeo}
                  </option>
                ))}
              </select>

              <span className="validationFormRed ml-1 text-sm">
                {allValues.provincia.length < 4 &&
                  `la propiedad Provincia es necesaria`}
              </span>
            </label>
          </div>
        )}

        {/* Distritos */}
        {allValues.provincia && (
          <div className="flex flex-col sm:flex-row">
            <label
              htmlFor="card-holder"
              className="mb-2 block w-full text-sm  font-medium "
            >
              <div
                for="countries"
                class="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Distrito
              </div>
              <select
                onChange={(e) =>
                  setAllValues({ ...allValues, distrito: e.target.value })
                }
                value={
                  departamento?.find(
                    (el) => el.id_ubigeo === String(allValues?.distrito)
                  )?.id_ubigeo
                }
                defaultValue={
                  departamento?.find(
                    (el) => el.id_ubigeo === String(allValues?.distrito)
                  )?.id_ubigeo
                }
                nonce={undefined}
                name="distrito"
                label="Distrito"
                className={`border  ${
                  allValues.distrito.length < 4
                    ? " bg-transparent border-red-300  focus:ring-red-300 focus:border-red-300 dark:focus:ring-red-300 dark:focus:border-red-300 dark:placeholder-red-300 dark:text-red-300  text-red-300 dark:bg-black   dark:border-red-300"
                    : "bg-transparent border-green-300  focus:ring-green-300 focus:border-green-300 dark:focus:ring-green-300 dark:focus:border-green-300 dark:placeholder-green-300 dark:text-green-300  text-green-300 dark:bg-black dark:border-green-300"
                }  border   text-sm rounded-lg   block w-full p-2.5  bg-transparent  `}
                onResize={undefined}
                onResizeCapture={undefined}
              >
                {provincia?.map((el) => (
                  <option key={el.id_ubigeo} value={el.id_ubigeo}>
                    {el.nombre_ubigeo}
                  </option>
                ))}
              </select>

              <span className="validationFormRed ml-1 text-sm">
                {allValues.distrito.length < 4 &&
                  `la propiedad Distrito es necesaria`}
              </span>
            </label>
          </div>
        )}

        {/* Total */}
        {domLoaded && (
          <div className="border-b-2 pb-2">
            <div className="mt-6 border-y py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium ">Subtotal</p>
                <p className="font-semibold ">S/{cartTotal?.toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between ">
              <p className="text-sm font-medium ">Precio de Envió</p>
              <p className="text-base font-semibold ">
                {isPrimeraCompra  ? (
                  <>  
                      {
                         cartTotal >= 500 || tipoEntrega == "recojo" ?   <span className="text-green-600">¡GRATIS!</span> :` S/${ precioDelibery}`
                      }
                     
                  
                  </>
                ) : (
                  <>
                  {precioDelibery === 0 ? <span className="text-green-600">¡GRATIS!</span>  : ` S/${ precioDelibery}` }
                  
                  </>
                )}
              </p>
            </div>
            {userInfo.userInfo?.newuser && descuentoUser > 0 ? (
              <div className="mt-6 flex items-center justify-between ">
                <p className="text-sm font-medium text-red-400">Descuento:</p>
                <p className="text-base font-semibold text-red-400">-{descuentoUser}%</p>
              </div>
            ) : (
              <></>
            )}
            <div className="mt-6 flex items-center justify-between ">
              <p className="text-sm font-medium">Total</p>
              <p className="text-2xl font-semibold ">S/{montoTotal}</p>
            </div>
          </div>
        )}
      </div>

      <div className="my-3  text-center text-[10px]  xl:block">
        Tus datos personales se utilizarán para procesar tu pedido, mejorar tu
        experiencia en esta web y otros propósitos descritos en nuestra
        <Link
          href="/pyp"
          target="_blank"
          className="mr-1 font-bold underline focus:outline-none "
        >
          <i className="mdi mdi-beer-outline mr-1 "></i>
          política de privacidad
        </Link>
        y nuestros
        <Link
          href="/tyc"
          target="_blank"
          className="mr-1  font-bold underline focus:outline-none "
        >
          <i className="mdi mdi-beer-outline mr-1 "></i>términos y condiciones.
        </Link>
      </div>

      <div className=" laptop:mt-0 z-10  mt-3  flex items-center justify-center xl:flex">
        <div className="inline-flex items-center ">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-3"
            htmlFor="checkbox-8"
            data-ripple-dark="true"
          >
            <input
              type="checkbox"
              className={`before:content[''] ${
                !allValues.checkTerminos ? "border-red-300" : "border-green-300"
              }  peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border  transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-green-300 checked:bg-transparent checked:before:bg-black hover:before:opacity-10`}
              id="checkbox-8"
              onChange={(e) =>
                setAllValues({ ...allValues, checkTerminos: e.target.checked })
              }
            />
            <div className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 text-green-300 border-green-300 opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </label>
        </div>
        <div className="">
          <span className="text-sm  "> Acepto los</span>

          <Link
            href="/tyc"
            target="_blank"
            className="ml-1 text-sm font-bold underline w-full focus:outline-none "
            rel="noreferrer"
          >
            Términos & Condiciones.
          </Link>
          <span className="text-sm  "> y</span>

          <Link
            href="/pyp"
            target="_blank"
            className="ml-1 text-sm font-bold underline w-full focus:outline-none "
            rel="noreferrer"
          >
            Políticas de Privacidad
          </Link>
        </div>
      </div>

      {domLoaded && (
        <button
          disabled={!validate || Object.keys(invalidItems).length > 0}
          onClick={handlesubmit}
          className={`mb-8 mt-4 w-full  uppercase rounded-none upe ${
            !validate
              ? " border-[1px] border-red-300 cursor-not-allowed"
              : " bg-black dark:bg-white  text-white dark:text-black  cursor-pointer"
          } b px-6 py-3  font-medium `}
        >
          {items.length === 0
            ? "No tienes Productos en el Carrito"
            : Object.keys(invalidItems).length > 0
            ? "Hay productos inválidos en tu carrito"
            : "Realizar pedido"}
          <Loading disableLoadAddProduct={loading} />
        </button>
      )}

      {/* Order confirmation modal */}
      <ModalDesk isOpen={orderModalOpen} onClose={() => setOrderModalOpen(false)}>
        <div className="bg-white dark:bg-black text-black dark:text-white rounded-xl p-0 overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-neutral-800  backdrop-blur">
            <div>
              <h3 className="text-lg sm:text-xl font-bold">¡Pedido creado con éxito!</h3>
              <p className="text-xs sm:text-sm text-neutral-300">
                Tu pedido ha sido recibido con estado <span className="font-semibold text-white">pendiente</span>.
              </p>
            </div>
            <button
              onClick={() => setOrderModalOpen(false)}
              aria-label="Cerrar"
              className="inline-flex items-center justify-center h-8 w-8 rounded-full border border-neutral-700 hover:bg-neutral-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-4 sm:px-6 py-4">

          {lastOrder && (
            <div className="space-y-5 text-sm">
              {/* Resumen principal */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-400">Fecha</div>
                  <div className="font-medium">{(lastOrder.createdAt || "").split("T")[0]}</div>
                </div>
                <div className="p-3 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-400">Hora</div>
                  <div className="font-medium">{(() => { try { const d = new Date(lastOrder.createdAt); return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }); } catch { return ""; } })()}</div>
                </div>
                <div className="p-3 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-400">Total</div>
                  <div className="font-semibold">S/{Number(lastOrder.cartTotal || 0).toFixed(2)}</div>
                </div>
                <div className="p-3 rounded-lg border border-neutral-800">
                  <div className="text-xs text-neutral-400">Entrega</div>
                  <div className="font-medium uppercase">{lastOrder.tipoEntrega}</div>
                </div>
              </div>

              {/* Cliente y Entrega */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-800">
                  <h4 className="font-semibold text-white mb-2">Cliente</h4>
                  <div className="space-y-1">
                    <div><span className="text-neutral-400">Nombre: </span>{lastOrder.nombres} {lastOrder.apellido}</div>
                    <div><span className="text-neutral-400">Email: </span>{lastOrder.email}</div>
                    <div><span className="text-neutral-400">Documento: </span>{lastOrder.documento}</div>
                    <div><span className="text-neutral-400">Teléfono: </span>{lastOrder.telefono}</div>
                    <div><span className="text-neutral-400">Comprobante: </span>{lastOrder.comprobante}</div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-neutral-800">
                  <h4 className="font-semibold text-white mb-2">Entrega</h4>
                  <div className="space-y-1">
                    <div><span className="text-neutral-400">Tipo: </span>{lastOrder.tipoEntrega}</div>
                    <div><span className="text-neutral-400">Dirección: </span>{lastOrder.direccion || '—'}</div>
                    <div><span className="text-neutral-400">Departamento: </span>{lastOrder.departamento}</div>
                    <div><span className="text-neutral-400">Provincia: </span>{lastOrder.provincia}</div>
                    <div><span className="text-neutral-400">Distrito: </span>{lastOrder.distrito}</div>
                    {lastOrder.adicional && <div><span className="text-neutral-400">Adicional: </span>{lastOrder.adicional}</div>}
                  </div>
                </div>
              </div>

              {/* Productos */}
              <div className="p-4 rounded-xl border border-neutral-800">
                <h4 className="font-semibold text-white mb-3">Productos ({Array.isArray(lastOrder.productos) ? lastOrder.productos.length : 0})</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b border-neutral-800">
                        <th className="py-2 pr-3">Producto</th>
                        <th className="py-2 pr-3">Talla</th>
                        <th className="py-2 pr-3">Cantidad</th>
                        <th className="py-2 pr-3">Precio</th>
                        <th className="py-2 pr-3">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {(lastOrder.productos || []).map((p, idx) => (
                        <tr key={idx}>
                          <td className="py-2 pr-3">
                            <div className="flex items-center gap-2">
                              {p.picture_url && (
                                <img src={p.picture_url} alt={p.title || ''} width={40} height={40} className="rounded-md shadow-sm" />
                              )}
                              <span className="font-medium">{p.title}</span>
                            </div>
                          </td>
                          <td className="py-2 pr-3">{p.category_id}</td>
                          <td className="py-2 pr-3">{p.quantity}</td>
                          <td className="py-2 pr-3">S/{Number(p.unit_price || 0).toFixed(2)}</td>
                          <td className="py-2 pr-3 font-semibold">S/{Number((p.quantity || 0) * (p.unit_price || 0)).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => { setOrderModalOpen(false); router.push(`/users/${session?.user?.id}`); }}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Ver todos los pedidos
                </button>
                <button
                  onClick={() => { setOrderModalOpen(false); router.push('/tienda'); }}
                  className="w-full sm:w-auto bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-black dark:text-white px-4 py-2 rounded"
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </ModalDesk>
      
    </div>
  );
}
