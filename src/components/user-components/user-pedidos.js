"use client";


import React, { useState,useEffect } from "react";
import ModalDesk from "../modal/Modal";
import distritos from "@/json/distritos.json";
import provincias from "@/json/provincias.json";
import departamentos from "@/json/departamentos.json";
export default function PedidosTabsUser({ dataPedidos }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [filterEstado, setFilterEstado] = useState("pendiente");
  const [sortBy, setSortBy] = useState("fecha"); // fecha | total
  const [sortOrder, setSortOrder] = useState("desc"); // asc | desc
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // Controles de productos en vista previa
  const [prodSortBy, setProdSortBy] = useState("nombre"); // nombre | talla | cantidad | subtotal
  const [prodSortOrder, setProdSortOrder] = useState("asc"); // asc | desc
  const [prodSearch, setProdSearch] = useState("");
// 
const [allValues, setAllValues] = useState({
  departamento: selectedPedido?.departamento,
  provincia: selectedPedido?.provincia,
  distrito: selectedPedido?.distrito,
});
const [departamento, setDepartamento] = useState([]);
const [provincia, setProvincia] = useState([]);

// Sincroniza los valores cuando cambia el pedido seleccionado
useEffect(() => {
  if (selectedPedido) {
    setAllValues({
      departamento: selectedPedido.departamento,
      provincia: selectedPedido.provincia,
      distrito: selectedPedido.distrito,
    });
  }
}, [selectedPedido]);

// Carga la lista de provincias y distritos según el departamento/provincia actual
useEffect(() => {
  // Provincias por departamento (allValues.departamento es nombre)
  const depSel = departamentos?.find(
    (el) => el.nombre_ubigeo === `${allValues?.departamento || ""}`
  );
  if (depSel && typeof depSel.id_ubigeo !== "undefined") {
    const provList = provincias?.[depSel.id_ubigeo] || [];
    setDepartamento(provList);
  } else {
    setDepartamento([]);
  }

  // Distritos por provincia (allValues.provincia es id)
  if (allValues?.provincia) {
    const distList = distritos?.[String(allValues.provincia)] || [];
    setProvincia(distList);
  } else {
    setProvincia([]);
  }
}, [allValues?.departamento, allValues?.provincia]);
  const calcularDiasTranscurridos = (fechaISO) => {
    try {
      const created = new Date(fechaISO);
      const now = new Date();
      const diffMs = now.getTime() - created.getTime();
      return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    } catch (e) {
      return 0;
    }
  };

  const pedidosFiltradosOrdenados = Array.isArray(dataPedidos)
    ? dataPedidos
        .filter((el) => (filterEstado === "pendiente" ? el?.estado === "pendiente" : true))
        .filter((el) => {
          if (!startDate && !endDate) return true;
          const created = new Date(el._createdAt);
          const from = startDate ? new Date(startDate + "T00:00:00") : null;
          const to = endDate ? new Date(endDate + "T23:59:59") : null;
          if (from && created < from) return false;
          if (to && created > to) return false;
          return true;
        })
        .sort((a, b) => {
          if (sortBy === "total") {
            const ta = Number(a.cart_total) || 0;
            const tb = Number(b.cart_total) || 0;
            return sortOrder === "desc" ? tb - ta : ta - tb;
          }
          const da = new Date(a._createdAt).getTime();
          const db = new Date(b._createdAt).getTime();
          return sortOrder === "desc" ? db - da : da - db;
        })
    : [];

  const totalPedidos = pedidosFiltradosOrdenados.length;
  const sumaTotal = pedidosFiltradosOrdenados.reduce((acc, p) => acc + (Number(p.cart_total) || 0), 0);

  const estadoBadgeClasses = (estado) => {
    switch ((estado || "").toLowerCase()) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "porentregar":
      case "en camino":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "entregado":
        return "bg-green-100 text-green-800 border border-green-200";
      case "devuelto":
      case "cancelado":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
    <div>
      {/* Controles y resumen */}
      <div className="p-4 border border-gray-200 rounded-lg  dark:bg-black">
        <div className="flex flex-wrap items-center gap-3">
          {/* Estado */}
          <div className="inline-flex rounded-md shadow-sm overflow-hidden border">
            <button
              className={`px-3 py-1.5 text-sm ${filterEstado === 'pendiente' ? 'bg-yellow-100 text-yellow-900' : ' '} hover:bg-yellow-50`}
              onClick={() => setFilterEstado('pendiente')}
            >Pendientes</button>
            <button
              className={`px-3 py-1.5 text-sm ${filterEstado === 'todos' ? 'bg-blue-100 text-blue-900' : ' '} hover:bg-blue-50 border-l`}
              onClick={() => setFilterEstado('todos')}
            >Todos</button>
          </div>

          {/* Ordenar por */}
          <div className="inline-flex rounded-md shadow-sm overflow-hidden border dark:border-neutral-700">
  <button
    className={`px-3 py-1.5 text-sm transition-colors
      ${sortBy === "fecha"
        ? "bg-gray-200 dark:bg-neutral-700 text-black dark:text-black"
        : "bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
      }`}
    onClick={() => setSortBy("fecha")}
  >
    Por fecha
  </button>
  <button
    className={`px-3 py-1.5 text-sm border-l transition-colors
      ${sortBy === "total"
        ? "bg-gray-200 dark:bg-neutral-700 text-black dark:text-black"
        : "bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
      }`}
    onClick={() => setSortBy("total")}
  >
    Por total
  </button>
</div>

{/* Dirección de orden */}
<div className="inline-flex rounded-md shadow-sm overflow-hidden border dark:border-neutral-700">
  <button
    className={`px-3 py-1.5 text-sm transition-colors
      ${sortOrder === "desc"
        ? "bg-gray-200 dark:bg-neutral-700 text-black dark:text-black"
        : "bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
      }`}
    onClick={() => setSortOrder("desc")}
  >
    Desc
  </button>
  <button
    className={`px-3 py-1.5 text-sm border-l transition-colors
      ${sortOrder === "asc"
        ? "bg-gray-200 dark:bg-neutral-700 text-black dark:text-black"
        : "bg-white dark:bg-neutral-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800"
      }`}
    onClick={() => setSortOrder("asc")}
  >
    Asc
  </button>
</div>


          {/* Rango de fechas */}
          <div className="flex items-center gap-2">
  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    className="text-sm border rounded px-2 py-1 
               bg-white text-black
               dark:bg-neutral-900 dark:text-black dark:border-neutral-700"
  />
  <span className="text-sm text-black dark:text-gray-300">a</span>
  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    className="text-sm border rounded px-2 py-1 
               bg-white text-black
               dark:bg-neutral-900 dark:text-black dark:border-neutral-700"
  />
  <button
    onClick={() => { setStartDate(''); setEndDate(''); }}
    className="text-xs px-3 py-1 border rounded 
               hover:bg-gray-100 dark:hover:bg-gray-800
               text-black dark:text-gray-200 dark:border-neutral-700"
  >
    Limpiar
  </button>
</div>

        </div>

        {/* Resumen */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border  ">
            <div className="text-xs text-gray-500">Pedidos</div>
            <div className="text-lg font-bold">{totalPedidos}</div>
          </div>
          <div className="p-3 rounded-lg border  ">
            <div className="text-xs text-gray-500">Suma total</div>
            <div className="text-lg font-bold">S/{sumaTotal.toFixed(2)}</div>
          </div>
          <div className="p-3 rounded-lg border  ">
            <div className="text-xs text-gray-500">Rango</div>
            <div className="text-sm">{startDate || '—'} a {endDate || '—'}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-flow-row gap-y-5 mt-4">
        <div className="px-5 py-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
          <span className="font-bold">{filterEstado === "pendiente" ? "Pedidos pendientes" : "Todos mis pedidos"}</span>
          <span className="ml-2 text-sm">(ordenados por fecha de creación)</span>
        </div>

        <div className="overflow-x-auto rounded-lg border dark:border-neutral-800">
          <table className="min-w-full text-sm">
            <thead className="  sticky top-0 z-10">
              <tr className="text-left border-b dark:border-neutral-800">
                <th className="py-2 pr-3">Producto</th>
                <th className="py-2 pr-3">Apellido</th>
                <th className="py-2 pr-3">Fecha</th>
                <th className="py-2 pr-3">Hora</th>
                <th className="py-2 pr-3">Días</th>
                <th className="py-2 pr-3">Total</th>
                <th className="py-2 pr-3">Estado</th>
                <th className="py-2 pr-3">Tipo entrega</th>
                <th className="py-2 pr-3">Dirección</th>
                <th className="py-2 pr-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-neutral-800">
              {pedidosFiltradosOrdenados.map((el, i) => {
                const firstProd = Array.isArray(el.productos) && el.productos.length > 0 ? el.productos[0] : null;
                const fecha = el._createdAt?.split("T")[0];
                const hora = (() => {
                  try {
                    const d = new Date(el._createdAt);
                    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
                  } catch {
                    return el._createdAt?.split("T")[1]?.slice(0,5) || "";
                  }
                })();
                return (
                  <tr key={i} className="">
                    <td className="py-2 pr-3">
                      {firstProd?.picture_url ? (
                        <img
                          src={firstProd.picture_url}
                          alt="Producto"
                          width={40}
                          height={40}
                          className="rounded-md shadow-sm"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">Sin imagen</span>
                      )}
                    </td>
                    <td className="py-2 pr-3">{el.apellidos || ""}</td>
                    <td className="py-2 pr-3">{fecha}</td>
                    <td className="py-2 pr-3">{hora}</td>
                    <td className="py-2 pr-3">{calcularDiasTranscurridos(el._createdAt)} días</td>
                    <td className="py-2 pr-3 font-semibold">S/{Number(el.cart_total || 0).toFixed(2)}</td>
                    <td className="py-2 pr-3"><span className={`px-2 py-0.5 rounded-full text-xs uppercase ${estadoBadgeClasses(el.estado)}`}>{el.estado}</span></td>
                    <td className="py-2 pr-3 uppercase">{el.tipoEntrega}</td>
                    <td className="py-2 pr-3">{el.tipoEntrega === 'envio' ? el.direccion : 'Recojo en tienda'}</td>
                    <td className="py-2 pr-3">
                      <button onClick={() => { setSelectedPedido(el); setIsPreviewOpen(true); }} className="text-white bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-xs">
                        Vista previa
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isPreviewOpen && selectedPedido && (
        <ModalDesk isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
     <div className="p-6 max-w-5xl w-full  bg-white dark:bg-black   text-black dark:text-white rounded-2xl shadow-lg space-y-6">
  {/* Encabezado del pedido */}
  <div className="flex items-center justify-between border-b pb-3 dark:border-neutral-800">
    <div>
      <h3 className="text-xl font-bold">
        Pedido {selectedPedido.id_payer ? `#${selectedPedido.id_payer}` : ''}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Creado: {selectedPedido._createdAt?.split('T')[0]} ·{" "}
        {calcularDiasTranscurridos(selectedPedido._createdAt)} días
      </p>
    </div>
    <span
      className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase shadow-sm ${estadoBadgeClasses(
        selectedPedido.estado
      )}`}
    >
      {selectedPedido.estado}
    </span>
  </div>

  {/* Información en columnas */}
  <div className="grid md:grid-cols-3 gap-5">
    {/* Pedido */}
    <div className="border dark:border-neutral-800 p-4 rounded-xl ">
      <h4 className="font-semibold text-sm uppercase text-gray-600 dark:text-gray-300 mb-2">
        Información del pedido
      </h4>
      <p className="text-sm">Fecha: {selectedPedido._createdAt?.split("T")[0]}</p>
      <p className="text-sm">
        Días transcurridos: {calcularDiasTranscurridos(selectedPedido._createdAt)} días
      </p>
      <p className="text-sm">Estado: {selectedPedido.estado}</p>
      {selectedPedido.id_payer && (
        <p className="text-sm">ID Pedido: {selectedPedido.id_payer}</p>
      )}
      <p className="text-sm font-bold mt-3">
        Total:{" "}
        <span className="text-green-600 dark:text-green-400">
          S/{Number(selectedPedido.cart_total || 0).toFixed(2)}
        </span>
      </p>
    </div>

    {/* Cliente */}
    <div className="border dark:border-neutral-800 p-4 rounded-xl ">
      <h4 className="font-semibold text-sm uppercase text-gray-600 dark:text-gray-300 mb-2">
        Cliente
      </h4>
      <p className="text-sm">
        Nombres: {selectedPedido.nombres} {selectedPedido.apellido}
      </p>
      <p className="text-sm">Email: {selectedPedido.email}</p>
      <p className="text-sm">Documento: {selectedPedido.documento}</p>
      <p className="text-sm">Teléfono: {selectedPedido.telefono}</p>
      {selectedPedido.ruc && <p className="text-sm">RUC: {selectedPedido.ruc}</p>}
      <p className="text-sm">Comprobante: {selectedPedido.comprobante}</p>
    </div>

    {/* Entrega */}
    <div className="border dark:border-neutral-800 p-4 rounded-xl ">
      <h4 className="font-semibold text-sm uppercase text-gray-600 dark:text-gray-300 mb-2">
        Entrega
      </h4>
      <p className="text-sm">Tipo: {selectedPedido.tipoEntrega}</p>
      <p className="text-sm">Dirección: {selectedPedido.direccion}</p>
      <p className="text-sm">Departamento: {selectedPedido.departamento}</p>
      <p className="text-sm">Provincia:       {departamento?.find((el) => el.id_ubigeo === selectedPedido.provincia)
            ?.nombre_ubigeo
            ? departamento?.find((el) => el.id_ubigeo === selectedPedido.provincia)
                ?.nombre_ubigeo
            : selectedPedido.provincia}</p>
      <p className="text-sm">Distrito:   {provincia?.find((el) => el.id_ubigeo === selectedPedido.distrito)
            ?.nombre_ubigeo
            ? provincia?.find((el) => el.id_ubigeo === selectedPedido.distrito)
                ?.nombre_ubigeo
            : selectedPedido.distrito}</p>
   
     
      {selectedPedido.adicional && (
        <p className="text-sm">Info adicional: {selectedPedido.adicional}</p>
      )}
    </div>
  </div>

  {/* Controles */}
  {/* <div className="flex flex-wrap items-center gap-3">
    <div className="inline-flex rounded-lg overflow-hidden border dark:border-neutral-800 shadow-sm">
      <button
        className={`px-3 py-1.5 text-xs font-medium transition ${
          prodSortBy === "nombre"
            ? "bg-gray-200 dark:bg-black"
            : "hover:bg-gray-300 dark:hover:bg-neutral-800"
        }`}
        onClick={() => setProdSortBy("nombre")}
      >
        Nombre
      </button>
      <button
        className={`px-3 py-1.5 text-xs border-l dark:border-neutral-800 font-medium transition ${
          prodSortBy === "talla"
            ? "bg-gray-200 dark:bg-black"
            : "hover:bg-gray-100 dark:hover:bg-neutral-800"
        }`}
        onClick={() => setProdSortBy("talla")}
      >
        Talla
      </button>
      <button
        className={`px-3 py-1.5 text-xs border-l dark:border-neutral-800 font-medium transition ${
          prodSortBy === "cantidad"
            ? "bg-gray-200 dark:bg-black"
            : "hover:bg-gray-100 dark:hover:bg-neutral-800"
        }`}
        onClick={() => setProdSortBy("cantidad")}
      >
        Cantidad
      </button>
      <button
        className={`px-3 py-1.5 text-xs border-l dark:border-neutral-800 font-medium transition ${
          prodSortBy === "subtotal"
            ? "bg-gray-200 dark:bg-black"
            : "hover:bg-gray-100 dark:hover:bg-neutral-800"
        }`}
        onClick={() => setProdSortBy("subtotal")}
      >
        Subtotal
      </button>
    </div>

    <div className="inline-flex rounded-lg overflow-hidden border dark:border-neutral-800 shadow-sm">
      <button
        className={`px-3 py-1.5 text-xs font-medium transition ${
          prodSortOrder === "asc"
            ? "bg-gray-200 dark:bg-black"
            : "hover:bg-gray-100 dark:hover:bg-neutral-800"
        }`}
        onClick={() => setProdSortOrder("asc")}
      >
        Asc
      </button>
      <button
        className={`px-3 py-1.5 text-xs border-l dark:border-neutral-800 font-medium transition ${
          prodSortOrder === "desc"
            ? "bg-gray-200 dark:bg-black"
            : "hover:bg-gray-100 dark:hover:bg-neutral-800"
        }`}
        onClick={() => setProdSortOrder("desc")}
      >
        Desc
      </button>
    </div>

    <input
      value={prodSearch}
      onChange={(e) => setProdSearch(e.target.value)}
      placeholder="Buscar producto..."
      className="text-xs px-3 py-2 border rounded-lg  dark:border-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none transition"
    />
  </div> */}

  {/* Tabla de productos */}
  <div className="border dark:border-neutral-800 p-4 rounded-xl ">
    <h4 className="font-semibold text-sm uppercase text-gray-600 dark:text-gray-300 mb-3">
      Productos
    </h4>
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="">
          <tr className="text-left">
            <th className="py-2 px-3">Producto</th>
            <th className="py-2 px-3">Talla</th>
            <th className="py-2 px-3">Cantidad</th>
            <th className="py-2 px-3">Precio unit.</th>
            <th className="py-2 px-3">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {selectedPedido.productos
            ?.filter((p) => {
              if (!prodSearch) return true;
              const name = (p.name || p.title || "").toString().toLowerCase();
              return name.includes(prodSearch.toLowerCase());
            })
            ?.sort((a, b) => {
              const getSubtotal = (x) =>
                (x.cantidad || x.quantity || 0) * (x.unit_price || 0);
              const map = {
                nombre: (x) => (x.name || x.title || "").toString().toLowerCase(),
                talla: (x) => (x.talla || x.category_id || "").toString().toLowerCase(),
                cantidad: (x) => Number(x.cantidad || x.quantity || 0),
                subtotal: (x) => Number(getSubtotal(x)),
              };
              const va = map[prodSortBy](a);
              const vb = map[prodSortBy](b);
              if (va < vb) return prodSortOrder === "asc" ? -1 : 1;
              if (va > vb) return prodSortOrder === "asc" ? 1 : -1;
              return 0;
            })
            ?.map((p, idx) => (
              <tr
                key={idx}
                className="border-b   transition"
              >
                <td className="py-2 px-3 flex items-center gap-2">
                  {p.picture_url && (
                    <img
                      src={p.picture_url}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-md shadow-sm"
                    />
                  )}
                  <span>{p.name || p.title}</span>
                </td>
                <td className="py-2 px-3">{p.talla || p.category_id}</td>
                <td className="py-2 px-3">{p.cantidad || p.quantity}</td>
                <td className="py-2 px-3">
                  S/
                  {p.unit_price?.toFixed
                    ? p.unit_price.toFixed(2)
                    : Number(p.unit_price || 0).toFixed(2)}
                </td>
                <td className="py-2 px-3 font-medium">
                  S/
                  {(((p.cantidad || p.quantity) || 0) * (p.unit_price || 0)).toFixed(
                    2
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

        </ModalDesk>
      )}
    </div>
  );
}
