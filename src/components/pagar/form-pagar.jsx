"use client";
import { v4 as uuidv4 } from 'uuid';
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import departamentos from "@/json/departamentos.json";
import distritos from "@/json/distritos.json";
import provincias from "@/json/provincias.json";
import { urlForImage } from "@/sanity/lib/image";
import { useCart } from "react-use-cart";

import { useSession } from "next-auth/react";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import RoleContext from "@/context/roleContext";

import ReusableModal from "../modal/reusable-modal";
import { AiOutlineShoppingCart } from "react-icons/ai";

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
    // <Spinner
    //   // color="black"
    //   className={` absolute left-7 top-3  h-7 w-7  ${
    //     !disableLoadAddProduct ? "hidden" : "block"
    //   }`}
    //   onResize={undefined}
    //   onResizeCapture={undefined}
    // />
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
export default function FormPagar({ tipoEntrega }) {
  const { userRole } = useContext(RoleContext);
  const uuid = uuidv4();

  const router = useRouter();
  const { data: session } = useSession();
  //   console.log(session?.user.id);
  {
    /* <div>{session.user.name}</div>  */
  }
  const [allValues, setAllValues] = useState({
    nombre: `${session?.user.name}`,
    apellido: "",
    email: `${session?.user.email}`,
    documento: "",
    telefono: "",
    direccion: "",
    comprobante: "Boleta",
    ruc: "",
    departamento: "",
    provincia: "",
    distrito: "",
    rol_compra:userRole,
    adicional: "",
    checkTerminos: false,
    estado: "pendiente",
    razon: "Fritz Sport",
    userId: session?.user.id,
  });

  const changeHandler = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };
  const { items, cartTotal } = useCart();
  const [domLoaded, setDomLoaded] = useState(false);
  const [validate, setValidate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [precioDelibery, setPrecioDelibery] = useState(0);

  // useEffect(() => {
  //   if (tipoEntrega === "recojo") {
  //     setPrecioDelibery(0);
  //   } else {
  //     if (allValues.provincia === "3285" && allValues.departamento === "Lima") {
  //       setPrecioDelibery(10);
  //     } else {
  //       setPrecioDelibery(20);
  //     }
  //   }
  // }, [tipoEntrega, allValues.provincia]);

  useEffect(() => {
    setDomLoaded(true);
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(items.length >= 3 && userRole === "emprendedor" || items.length >= 6 && userRole === "mayorista" ? false : true);
  const [ubigeoDepartamento, setUbigeoDepartamento] = useState(0);
  const [departamento, setDepartamento] = useState([]);
  const [provincia, setProvincia] = useState([]);
  // traer data usuario
  useEffect(() => {
    client
      .fetch(groq`*[_type == "user" && _id match "${session?.user.id}"  ] [0]`)
      .then((el) => {
        setAllValues({
          nombre: el?.name ? el?.name : "",
          apellido: el?.apellidos ? el?.apellidos : "",
          email: el?.email ? el?.email : "",
          documento: el?.documento ? el?.documento : "",
          telefono: el?.telefono ? el?.telefono : "",
          direccion: el?.direccion ? el?.direccion : "",
          comprobante: "Boleta",
          rol_compra:userRole,
          ruc: el?.factura ? el?.factura : "",
          departamento: el?.departamento ? el?.departamento : "",
          provincia: el?.provincia ? el?.provincia : "",
          distrito: el?.distrito ? el?.distrito : "",
          adicional: el?.infadi ? el?.infadi : "",
          checkTerminos: false,
          estado: "pendiente",
          razon: "CATALOGO",
          userId: session?.user.id,
        });
      });

    //
  }, [session?.user.id]);

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
  //

  // get data user

  const handlesubmit = async () => {
    let productosCantidad = items.map((el, i) => {
      let productos = {
        id: el.idsanity,
        category_id: el.talla,
        title: el.name,
        type: el.objectID,
        description: el.id,
        picture_url: urlForImage(el.image).url(),
        quantity: el.quantity,
        unit_price: Number(el.price.toFixed(1)),
      };

      return productos;
    });
    productosCantidad[0].unit_price += precioDelibery;
    setValidate(false);
    setLoading(true);
    let dataPago = {
      productos: productosCantidad,
      tipoEntrega: tipoEntrega,
      id_mercado_pago: "01",
      id_pago:uuid,
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
      rol_compra:allValues.rol_compra,

      departamento: allValues.departamento,
      distrito: allValues.distrito,
      provincia: allValues.provincia,
      adicional: allValues.adicional,
      cartTotal: cartTotal + precioDelibery,
      userId: allValues.userId,
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
      // if (res.status === 200) {
      //   let dataEnvioMongoUser = {
      //     tipoEntrega: tipoEntrega,
      //     razon: allValues.razon,
      //     id_payer: data.id_payer,
      //     id_mercado_pago: "01",
      //     estado: allValues.estado,
      //     nombres: allValues.nombre,
      //     apellidos: allValues.apellido,
      //     email: allValues.email,
      //     documento: allValues.documento,
      //     cart_total: cartTotal + precioDelibery,
      //     telefono: allValues.telefono,
      //     departamento: allValues.departamento,
      //     distrito: allValues.distrito,
      //     provincia: allValues.provincia,
      //     direccion: allValues.direccion,
      //     comprobante: allValues.comprobante,
      //     info_adicional: allValues.adicional,
      //     ruc: allValues.ruc,
      //     productos: productosCantidad,
      //   }

      //   const resp = await fetch(`/api/mongo`, {
      //     method: "POST",
      //     body: JSON.stringify(dataEnvioMongoUser),
      //     headers: {
      //       "Content-Type": "application/json",
      //       "Access-Control-Allow-Origin": "*",
      //       "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      //       "Access-Control-Allow-Headers": "*",
      //     },
      //   })

      if (res.status === 200) {
        router.push(data.url);
      }
      // const dato = await res.json()
      setLoading(false);

      // setLoadingMercadoPago(false)
      // router.refresh()
      //test
      // alert(data.msg)
      // }
      if (res.status === 401) {
        alert("Ingrese los datos correctamente");
        setLoading(false);

        // setLoadingMercadoPago(false)

        // router.refresh()
        // alert(data.msg)
      }
      // console.log(data);
    } catch (error) {
      console.log(error.message);
      setLoading(true);
    }
  };
  const [faltanProductos, setFaltanProductos] = useState("")
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
      // allValues.adicional.length >= 1 &&
      allValues.checkTerminos &&
      items.length > 0
    ) {
      if (allValues.comprobante === "Factura" && allValues.ruc.length === 0) {
        setValidate(false);
      } else {


switch (userRole) {
  case "emprendedor":
// emprendedor condicion para comprar

    if (items.length >= 3 && userRole === "emprendedor") {
      setValidate(true);
      setIsModalOpen(false)
      
    }else{
    
      setValidate(false);
      setIsModalOpen(true)
   
      setFaltanProductos("necesitas minimo 3 productos Para Comprar como emprendedor")
    }
    break;
    case "mayorista":
      // mayorista condicion para comprar
      if (items.length >= 6 && userRole === "mayorista") {
        setValidate(true);
        setIsModalOpen(false)
        
      }else{
        setFaltanProductos("necesitas minimo 6 pares seriados Para Comprar como Mayorista")
        setIsModalOpen(true)
        setValidate(false);

      }
    break;

  default:
    setValidate(false);
    setIsModalOpen(false)

    break;
}




      }
    } else {
      setValidate(false);
    }

    // if (allValues.provincia === "Lima") {
    //   setPrecioDelibery(10)
    // } else {
    //   setPrecioDelibery(20)
    // }
  }, [allValues,session?.user]);

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



  if(true){
    return (
    <>
        
    
          <ReusableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <div className="flex flex-col items-center justify-center">
            Por el momento no estamos aceptando Compras en Nuestra Tienda
              {/* <div className="flex  mb-3 items-center">
              <AiOutlineShoppingCart size={24} className="text-blue-500 mr-3" />
                <p> Necesitas mínimo <strong>{userRole === "mayorista"? "6 pares seriados":"3 pares" }</strong> para comprar como <span className="uppercase font-semibold"> {userRole}</span>.</p>

              </div>

                  <p>solo tienes {items.length} productos <span>en tu carrito</span></p> */}

            </div>
          </ReusableModal>
    </>
    )

  }else{
    return (
      <div className="mt-10  px-4 pt-8  lg:mt-0 dark:bg-black">
        <p className="text-xl font-medium">{formData.title}</p>
        <p className="">{formData.subtitle}</p>
        <div>
          <div className=" grid xl:grid-cols-2 xl:gap-4 gap-y-4 mt-5">
            {formData.inputs.map((el, i) => (
              <div key={i} className="flex flex-col gap-y-2">
                <div class="relative h-10 w-full min-w-[200px]">
                  <input
                    name={el.name}
                    // placeholder={el.placeholder}
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
          {/* <div key={i}>
                <label
                  htmlFor="card-no"
                  className="mb-2 mt-4 block text-sm font-medium"
                >
                  {el.label === "Información Adicional"
                    ? el.label + "  " + " *no obligatorio"
                    : el.label}
                </label>
                <div className="flex justify-between">
                  <div className="relative w-full shrink-0 px-1 xl:px-5">
                    <input
                      type={el.tipo}
                      name={el.name}
                      placeholder={el.placeholder}
                      onChange={(e) => changeHandler(e)}
                    />
                    <span className="validationFormRed ml-1 text-sm">
                      {allValues[`${el.name}`].length < 4 &&
                        `${
                          el.name === "adicional"
                            ? ""
                            : `la propiedad ${el.name} es necesaria`
                        }`}
                    </span>
                  </div>
                </div>
              </div> */}
  
          {/* boleta factura */}
          <div className="flex justify-center pt-5">
            <div className="flex gap-10">
              <div className="inline-flex items-center">
                <label
                  className="relative flex cursor-pointer items-center rounded-full p-3"
                  htmlFor="react"
                >
                  <input
                    onChange={(e) => changeHandler(e)}
                    name="comprobante"
                    checked={allValues.comprobante === "Boleta"}
                    value="Boleta"
                    type="radio"
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200  transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                    id="react"
                  />
                  <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4  opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </label>
                <label
                  className="mt-px cursor-pointer select-none font-light "
                  htmlFor="react"
                >
                  Boleta
                </label>
              </div>
              <div className="inline-flex items-center">
                <label
                  className="relative flex cursor-pointer items-center rounded-full p-3"
                  htmlFor="react"
                >
                  <input
                    onChange={(e) => changeHandler(e)}
                    name="comprobante"
                    checked={allValues.comprobante === "Factura"}
                    value="Factura"
                    type="radio"
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200  transition-all before:absolute before:left-2/4 before:top-2/4 before:block before:h-12 before:w-12 before:-translate-x-2/4 before:-translate-y-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:before:bg-gray-900 hover:before:opacity-10"
                    id="factura"
                  />
                  <span className="pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4  opacity-0 transition-opacity peer-checked:opacity-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                    >
                      <circle data-name="ellipse" cx="8" cy="8" r="8"></circle>
                    </svg>
                  </span>
                </label>
                <label
                  className="mt-px cursor-pointer select-none font-light "
                  htmlFor="react"
                >
                  Factura
                </label>
              </div>
            </div>
          </div>
          {allValues.comprobante === "Factura" && (
            <div className="flex flex-col gap-y-2 mb-2">
              <div class="relative h-10 w-full min-w-[200px]">
                <input
                  name="ruc"
                  // placeholder={el.placeholder}
                  onChange={(e) => changeHandler(e)}
                  className={`peer h-full w-full rounded-[7px] border ${
                    allValues.ruc === "null" || allValues.ruc.length === 0
                      ? "focus:border-red-300 placeholder-shown:border-red-300 placeholder-shown:border-t-red-300 border-red-300  "
                      : "focus:border-green-300 placeholder-shown:border-green-300 placeholder-shown:border-t-green-300 border-green-300  text-green-300 "
                  } border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border  focus:border-2  focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50`}
                  placeholder=" "
                />
                <label
                  className={`before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight ${
                    allValues.ruc === "null" || allValues.ruc.length === 0
                      ? "text-red-300 before:border-red-300  after:border-red-300 peer-placeholder-shown:text-red-300 peer-focus:text-red-300 peer-focus:before:border-red-300 peer-focus:after:border-red-300"
                      : "text-green-300    peer-placeholder-shown:text-green-300 peer-focus:text-green-300 before:border-green-300 after:border-green-300 peer-focus:before:border-green-300 peer-focus:after:border-green-300"
                  }  transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l   before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r  after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight  peer-focus:before:border-t-2 peer-focus:before:border-l-2  peer-focus:after:border-t-2 peer-focus:after:border-r-2  peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent`}
                >
                  RUC
                </label>
              </div>
              <span className="validationFormRed ml-1 text-sm">
                {allValues.ruc === "null" ||
                  (allValues.ruc.length === 0 && `la propiedad Ruc es necesaria`)}
              </span>
            </div>
          )}
          {/* <>
              <label
                htmlFor="billing-address"
                className="mb-2 mt-4 block text-sm font-medium"
              >
                RUC
              </label>
              <div className="mb-3 flex flex-col sm:flex-row ">
                <div className="relative w-full shrink-0 sm:w-full">
                  <input
                    type="text"
                    name="ruc"
                    placeholder="RUC"
                    onChange={(e) => changeHandler(e)}
                  />
                  <span className="validationFormRed ml-1 text-sm">
                    {allValues.ruc === "null" ||
                      (allValues.ruc.length === 0 &&
                        `la propiedad Ruc es necesaria`)}
                  </span>
                </div>
              </div>
            </> */}
          {/* Departamentos */}
          <div className="flex flex-col sm:flex-row">
            <label
              htmlFor="card-holder"
              className="mb-2  block w-full text-sm  font-medium "
            >
              <div
                for="countries"
                class="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Departamento
              </div>
  
              <select
                value={Number(ubigeoDepartamento)}
                defaultValue={Number(ubigeoDepartamento)}
                onChange={(e) =>
                  handlerDepartamento(provincias[e.target.value], e.target.value)
                }
                name="departamento"
                label="Departamento"
                className={`border  ${
                  allValues.departamento.length < 4
                    ? " bg-transparent border-red-300  focus:ring-red-300 focus:border-red-300 dark:focus:ring-red-300 dark:focus:border-red-300 dark:placeholder-red-300 dark:text-red-300  text-red-300 dark:bg-black  dark:border-red-300 "
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
                className="mb-2  block w-full text-sm  font-medium "
              >
                <div
                  for="countries"
                  class="block mb-2 ml-1 text-sm font-medium text-gray-900 dark:text-gray-400"
                >
                  Provincia
                </div>
                <select
                  value={
                    departamento?.find(
                      (el) => el.id_ubigeo === String(allValues?.provincia)
                    )?.id_ubigeo
                  }
                  defaultValue={
                    departamento?.find(
                      (el) => el.id_ubigeo === String(allValues?.provincia)
                    )?.id_ubigeo
                  }
                  onChange={(e) =>
                    handlerProvincia(distritos[e.target.value], e.target.value)
                  }
                  name="provincia"
                  label="Provincia"
                  className={`border  ${
                    allValues.provincia.length < 4
                      ? " bg-transparent border-red-300  focus:ring-red-300 focus:border-red-300 dark:focus:ring-red-300 dark:focus:border-red-300 dark:placeholder-red-300 dark:text-red-300  text-red-300 dark:bg-black  dark:border-red-300"
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
  
          {/* <!-- Total --> */}
          {domLoaded && (
            <div className="border-b-2 pb-2">
              <div className="mt-6 border-y py-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium ">Subtotal</p>
                  <p className="font-semibold ">S/{cartTotal.toFixed(0)}</p>
                </div>
              </div>
              {/* <div className="mt-6 flex items-center justify-between ">
                <p className="text-sm font-medium ">Precio de Envió</p>
                <p className="text-base font-semibold ">S/{precioDelibery}</p>
              </div> */}
              <div className="mt-6 flex items-center justify-between ">
                <p className="text-sm font-medium">Total</p>
                <p className="text-2xl font-semibold ">
                  S/{(cartTotal + precioDelibery).toFixed(0)}
                </p>
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
                // checked={checkoutPago}
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
   
        {/* ---- */}
        {domLoaded && (
          <button
            disabled={!validate}
            onClick={handlesubmit}
            className={`mb-1 mt-4 w-full  uppercase rounded-none upe ${
              !validate
                ? " border-[1px] border-red-300 cursor-not-allowed"
                : " bg-black dark:bg-white  text-white dark:text-black  cursor-pointer"
            } b px-6 py-3  font-medium `}
          >
            {items.length === 0
              ? "No tienes Productos en el Carrito"
              : "COMPRAR"}
            <Loading disableLoadAddProduct={loading} />
          </button>
        )}
               {/* condicion para comprar */}
        <div className="flex justify-center items-center uppercase font-semibold text-sm text-red-400 w-full">
        {faltanProductos}
  
  </div>
      </div>
    );

  }
}
