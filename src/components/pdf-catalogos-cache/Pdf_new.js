// PDF_NEW
import React from "react";
import { Document, Page, Image, View, StyleSheet } from "@react-pdf/renderer";

import { urlForImage } from "@/sanity/lib/image";
import Card from "@/components/pdf-catalogos-cache/card";
// import { urlForImage } from "@/lib/image";

// Estilos para la página y los productos
const styles = StyleSheet.create({
  page: {
    // padding: 20,
    backgroundColor: "#f7fafc",
  },
  gridContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    // justifyContent: "space-between",
    // gap: "1px", // Añadir gap de 1px
  },
});

export default function PDF({ items = [], catalogo = [], cliente = false }) {
  const productosCantidad = items.map((el) => ({
    id: el.id,
    sku: el?.sku,
    tallascatalogo: el?.tallascatalogo,
    name: el?.name,
    images: el?.images,
    tipo: el?.tipo,
    razonsocial: el?.razonsocial,
    imagecatalogo: el?.imagescatalogo,
    fechaIngreso: el?.fechaIngreso,
    imgcatalogomain:
      el?.imgcatalogomain &&
      el?.imgcatalogomain?.asset &&
      el?.imgcatalogomain?.asset._ref &&
      urlForImage(el?.imgcatalogomain?.asset?._ref).url(),
    priceecommerce: el.priceecommerce,
    pricemayorista: el.pricemayorista,
    genero: el?.genero,

    subgenero:
      el?.genero === "niños"
        ? el?.subgenero_ninos
        : el?.subgenero,
    subgenero_ninos: el?.subgenero_ninos,
    marca: el?.marca,
    tipoprecio: el?.tipoprecio,
    categoria: el?.categories,
    _createdAt: el?._createdAt,
  }));
  console.log(productosCantidad);
  
  const dat = catalogo.map((el) => ({
    marca: el.marca,
    imgfondo: urlForImage(el.export_pdf_info.imgfondo?.asset?._ref).url(),
    img_fondo_principal: urlForImage(el.img_fondo_principal?.asset._ref).url(),

    fondo_precio_principal: urlForImage(
      el.export_pdf_info.fondo_precio_principal?.asset?._ref
    ).url(),
    fondo_tallas: urlForImage(
      el.export_pdf_info.fondo_tallas?.asset?._ref
    ).url(),
    fondo_marca: urlForImage(el.export_pdf_info.fondo_marca?.asset?._ref).url(),
    fondo_descuento: urlForImage(
      el.export_pdf_info.fondo_descuento?.asset?._ref
    ).url(),
    imagenPortada: el.imgmarca?.asset._ref,
    razonsocial: [
      {
        razon: "fritzsport",
        portada:
          el?.fritzsport && urlForImage(el.fritzsport?.asset?._ref).url(),
      },
      {
        razon: "fritzduran",
        portada: el.fritzduran && urlForImage(el.fritzduran?.asset?._ref).url(),
      },
    ],
    generos: [
      {
        imgPortadaGenero: el?.imghombre?.asset._ref,
        imgPortadaPromo: el?.imgPromoHombre?.asset?._ref,
        genero: "hombre",
        categorias: el.categorias,
      },
      {
        imgPortadaGenero: el?.imgmujer?.asset?._ref,
        imgPortadaPromo: el?.imgPromoMujer?.asset?._ref,
        genero: "mujer",
        categorias: el.categorias,
      },
      {
        imgPortadaGenero: el?.imgunisex?.asset?._ref,
        imgPortadaPromo: el?.imgPromoMujer?.asset?._ref,
        genero: "unisex",
        categorias: el.categorias,
      },
      {
        imgPortadaGenero: el?.imgninos?.asset?._ref,
        imgPortadaPromo: el?.imgPromoNinos?.asset?._ref,
        genero: "niños",
        categorias: el.categorias,
        subgeneros: [
          {
            imgPortadaSubgenero: el.imgjoven.asset._ref,
            genero: "joven",
            categorias: el.categorias,
          },
          {
            imgPortadaSubgenero: el.imgninonina.asset._ref,
            genero: "ninonina",
            categorias: el.categorias,
          },
          {
            imgPortadaSubgenero: el.imgbebes.asset._ref,
            genero: "bebe",
            categorias: el.categorias,
          },
        ],
      },
    ],
  }));

  const dataFiltros = { data: dat };

  return (
    <Document>
      {dataFiltros.data.map((marca) => {
        const productosMarca = productosCantidad.filter(
          (p) => p.marca === marca.marca
        );

        return productosMarca.length > 0 ? (
          <>
            {/* Portada de la Marca */}
            <Page key={`${marca.marca}-portada`} style={styles.page}>
              <Image
                src={urlForImage(marca.imagenPortada).url()}
                style={{ width: "100%", height: "100%" }}
              />
            </Page>

            {/* Iterar sobre cada razón social */}
            {marca.razonsocial.map((razon) => {
              const productosRazonsocial = productosMarca.filter(
                (p) => p.razonsocial === razon.razon
              );

              return productosRazonsocial.length > 0 ? (
                <>
                  {/* Portada de la Razón Social */}
                  <Page key={`${razon.razon}-portada`} style={styles.page}>
                    <Image
                      src={razon.portada}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Page>

                  {/* Iterar sobre géneros y categorías */}
                  {marca.generos.map((genero) => {
                    const productosGenero = productosRazonsocial.filter(
                      (p) => p.genero === genero.genero
                    );

                    return productosGenero.length > 0 ? (
                      <>
                        {/* portada promo  */}
                        {genero.imgPortadaPromo && (
                          <Page
                            key={`${genero.genero}-portada`}
                            style={styles.page}
                          >
                            <Image
                              src={urlForImage(genero.imgPortadaPromo).url()}
                              style={{ width: "100%", height: "100%" }}
                            />
                          </Page>
                        )}
                        {/* portada genero  */}

                        {genero.imgPortadaGenero && (
                          <Page
                            key={`${genero.genero}-portada`}
                            style={styles.page}
                          >
                            <Image
                              src={urlForImage(genero.imgPortadaGenero).url()}
                              style={{ width: "100%", height: "100%" }}
                            />
                          </Page>
                        )}

                        {genero.genero === "niños" ? (
                          <Page style={styles.page}>
                            <View style={styles.gridContainer}>
                              {genero.subgeneros &&
                                genero.subgeneros
                                  .sort((a, b) => {
                                    const order = ["bebe", "ninonina", "joven"];
                                    return (
                                      order.indexOf(a.genero) -
                                      order.indexOf(b.genero)
                                    );
                                  })
                                  .map((subgenero) => {
                                    const productosSubgenero =
                                      productosGenero.filter(
                                        (p) =>
                                          p.subgenero_ninos === subgenero.genero
                                      );

                                    return (
                                      <React.Fragment
                                        key={`${subgenero.genero}-portada`}
                                      >
                                        {productosSubgenero.length > 0 ? (
                                          <>
                                            <Card
                                              imgUrl={urlForImage(
                                                subgenero.imgPortadaSubgenero
                                              ).url()}
                                              catalogo={marca}
                                              cliente={cliente}
                                            />
                                            {genero.categorias &&
                                              genero.categorias.map(
                                                (categoria) => {
                                                  const productosCategoria =
                                                    productosSubgenero.filter(
                                                      (p) =>
                                                        p.categoria ===
                                                        categoria.category
                                                    );

                                                  return productosCategoria.length >
                                                    0 ? (
                                                    <>
                                                      <Card
                                                        imgUrl={urlForImage(
                                                          categoria
                                                            ?.imgcategoria.asset
                                                            ._ref
                                                        ).url()}
                                                        cliente={cliente}
                                                        catalogo={marca}
                                                      />
                                                      {productosCategoria.map(
                                                        (producto) => (
                                                          <Card
                                                            key={producto.id}
                                                            imgUrl={
                                                              producto?.imgcatalogomain
                                                            }
                                                            product={producto}
                                                            cliente={cliente}
                                                            catalogo={marca}
                                                          />
                                                        )
                                                      )}
                                                    </>
                                                  ) : null;
                                                }
                                              )}
                                          </>
                                        ) : null}
                                      </React.Fragment>
                                    );
                                  })}
                            </View>
                          </Page>
                        ) : (
                          <Page style={styles.page}>
                            {/* <Image
                              src={marca.img_fondo_principal}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                zIndex: -1,
                              }}
                            /> */}
                            <View style={styles.gridContainer}>
                              {genero.categorias &&
                                genero.categorias.map((categoria, i) => {
                                  const productosCategoria =
                                    productosGenero.filter(
                                      (p) => p.categoria === categoria.category
                                    );

                                  return productosCategoria.length > 0 ? (
                                    <React.Fragment
                                      key={`${genero.genero}-${i}`}
                                    >
                                      <Card
                                        imgUrl={urlForImage(
                                          categoria.imgcategoria.asset._ref
                                        ).url()}
                                        catalogo={marca}
                                        cliente={cliente}
                                      />
                                      {productosCategoria.map((producto) => (
                                        <Card
                                          key={producto.id}
                                          imgUrl={producto?.imgcatalogomain}
                                          product={producto}
                                          cliente={cliente}
                                          catalogo={marca}
                                        />
                                      ))}
                                    </React.Fragment>
                                  ) : null;
                                })}
                            </View>
                          </Page>
                        )}
                      </>
                    ) : null;
                  })}
                </>
              ) : null;
            })}
          </>
        ) : null;
      })}
    </Document>
  );
}
