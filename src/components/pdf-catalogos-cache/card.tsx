// components/Card.js
"use client";
import React, { useEffect, useState } from "react";
import { StyleSheet, Image, Text, View, Font } from "@react-pdf/renderer";
import { isNewProduct } from "@/sanity/product-functions";

function validateFecha(fechaStr: string): boolean {
  const fecha = new Date(fechaStr);
  const hoy = new Date();

  // Normalizar ambas fechas a medianoche para evitar problemas con horas
  hoy.setHours(0, 0, 0, 0);
  fecha.setHours(0, 0, 0, 0);

  return fecha >= hoy;
}

function formatearFecha(fechaStr: string): string {
  const meses: string[] = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];

  const fecha = new Date(fechaStr);
  const dia: number = fecha.getUTCDate();
  const mes: string = meses[fecha.getUTCMonth()];

  return `${dia} de ${mes}`;
}

// Registrar y cargar una fuente en negrita personalizada
Font.register({
  family: "RobotoBold",
  src: "https://fonts.gstatic.com/s/anton/v14/1Ptgg87LROyAm0K08i4gS7lu.ttf", // Cambia la URL si es necesario
});

// Estilos del componente, incluyendo el uso de la fuente negrita
const cardStyles = StyleSheet.create({
  card: {
    width: "50%",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    textAlign: "center",
    overflow: "hidden",
    position: "relative",
  },
  content: {
    position: "relative",
    padding: 0,
  },
  containerImg: {
    display: "flex",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "auto",
  },
  text: {
    fontSize: 9,
    fontFamily: "RobotoBold", // Aplicando fuente negrita
    color: "#000",
    textTransform: "uppercase",
  },
  textTallas: {
    fontSize: 8,
    fontFamily: "RobotoBold", // Aplicando fuente negrita
    color: "#000",
    textTransform: "uppercase",
  },
  textFooter: {
    fontSize: 8,
    fontFamily: "RobotoBold", // Aplicando fuente negrita
    color: "#fff",
    textTransform: "uppercase",
  },
  textMayorista: {
    textTransform: "uppercase",
    // marginTop: 4,
    fontSize: 14,
    color: "#FF5151",
    stroke: "black",
    strokeWhidth: "1px",
    fontFamily: "RobotoBold", // Aplicando fuente negrita aquí también
  },

  textMayorista2: {
    textTransform: "uppercase",
    // marginTop: 4,
    // marginLeft: "2px",
    stroke: "black",
    strokeWhidth: 1,
    fontSize: 14,
    color: "#FF5151",
    fontFamily: "RobotoBold", // Aplicando fuente negrita aquí también
  },
  textRetail: {
    textTransform: "uppercase",
    // marginTop: "1px",
    // marginLeft: "2px",
    stroke: "black",
    strokeWhidth: 1,
    fontSize: 12,
    color: "#fff",
    fontFamily: "RobotoBold", // Aplicando fuente negrita aquí también
  },
  textTallasPrincipal: {
    textTransform: "uppercase",
    marginTop: 2,

    // marginLeft: "2px",
    stroke: "black",
    strokeWhidth: 1,
    fontSize: 9,
    color: "#fff",
    fontFamily: "RobotoBold", // Aplicando fuente negrita aquí también
  },

  textLogo: {
    marginTop: 1,
    fontSize: 11,
    fontFamily: "RobotoBold", // Aplicando fuente negrita en el logo
    textTransform: "uppercase",
    color: "#000",
  },
  textSku: {
    color: "#000",
    fontSize: 10,
    fontFamily: "RobotoBold", // Aplicando fuente negrita al SKU
    textTransform: "uppercase",
  },
  textNew: {
    fontSize: 9,
    color: "#155724",
    fontFamily: "RobotoBold",
    textTransform: "uppercase",
  },
  textFecha: {
    fontSize: 9,
    color: "#232323",
    fontFamily: "RobotoBold",
    textTransform: "uppercase",
  },
  textDescuento: {
    fontSize: 15,
    color: "#f80000",
    fontFamily: "RobotoBold",
    textTransform: "uppercase",
  },
  logoContainer: {
    marginTop: "4px",
    width: "100%",
    height: "36px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px 10px",
  },
  detailsContainerPrincipal: {
    // width:"90%",

    display: "flex",
    flexDirection: "column",
    gap: "2px",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: "2px",
  },
  detailsContainerPrecioOferta: {
    position: "relative",

    width: "90%",
    // backgroundColor: "#000",
    paddingTop: "3px",

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    borderColor: "#e2e8f0",
    borderRadius: 4,
  },
  detailsContainerRetailTallas: {
    position: "relative",
    width: "85%",
    height: "40px",
    margin: "0px 5px",
    paddingTop: "4px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    borderColor: "#e2e8f0",
    borderRadius: 4,
  },

  detailColumn: {
    paddingBottom: "1px",

    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  brandImage: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    border: "2px solid #fff",
  },
});

// Componente Card
const Card = ({ imgUrl, product, cliente = false, catalogo }: any) => {
  const [marca, setMarca] = useState(
    "https://cdn.sanity.io/images/ibvmpbc1/production/4a5cdee84967d0d4fa665fcde4263e8128a52909-196x196.png"
  );

  useEffect(() => {
    // Actualización de la imagen de marca según el producto
    switch (product?.marca) {
      case "adidas":
        setMarca(
          "https://cdn.sanity.io/images/ibvmpbc1/production/ee995528aa127d0552dd5316aa8847ffe79adc8b-196x196.png"
        );
        break;
      case "nike":
        setMarca(
          "https://cdn.sanity.io/images/ibvmpbc1/production/c4f4c571a1e591fa12e147037f7b4fcf33dea577-196x196.png"
        );
        break;
      // Agrega más casos según sea necesario
      default:
        setMarca(
          "https://cdn.sanity.io/images/ibvmpbc1/production/4a5cdee84967d0d4fa665fcde4263e8128a52909-196x196.png"
        );
        break;
    }
  }, [product?.marca]);

  return (
    <View style={cardStyles.card}>
      <Image
        style={{ position: "absolute", height: "100%", width: "100%" }}
        src={catalogo.imgfondo}
      />
      {product && (
        <View style={cardStyles.content}>
          <View style={cardStyles.logoContainer}>
            {!cliente && (
              <Image
                style={{ height: "36" }}
                src={
                  "https://cdn.sanity.io/images/ibvmpbc1/production/a1fb6fde2d9ceb5cc909ba12cc794708e5702b6e-1042x678.png"
                }
              />
            )}
            {/* <Text style={cardStyles.textLogo}>{product.name}</Text>} */}
          </View>
        </View>
      )}
      {/* fecha de ingreso  2*/}
      {/* {product && (
        <View>
          {validateFecha(product.fechaIngreso) && (
            <View
              style={{
                width: "100px",
                position: "absolute",
                top: "280px",
                right: "0px",
                backgroundColor: "#D7F0D9",
                padding: "2px 2px",
              }}
            >
              <Text style={cardStyles.textFecha}>
                !Ingreso el {formatearFecha(product.fechaIngreso)}
              </Text>
            </View>
          )}
        </View>
      )} */}
      <View style={cardStyles.containerImg}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Image src={imgUrl} style={cardStyles.image} />
            {/* ofert 
            {
              product && (
                <View style={{position:"absolute",padding:"0px" , top: "40px", left: "0"}}>
              
                      <View style={{position:"relative",display:"flex",flexDirection:"row", justifyContent:"flex-end", alignItems:"center", width: "70px", height: "35px" , padding: "2px 0px" }}>
                        <View style={{ width: "45px", height: "25px" , backgroundColor: "#fff", padding: "1px 1px" ,marginRight:"6px",borderRadius:"5px"}}>
                            <Text style={cardStyles.textDescuento}>-{calcularDescuentoProductPdf(product.priceecommerce,product.pricemayorista)}%</Text>

                        </View>
                   
                            <Image
                        style={{ height: "35px" ,width:"100%",position:"absolute", top:"0px",zIndex:10}}
                        src={catalogo.fondo_descuento}
                      />
                      </View>

               
                </View>

              )
            }
              */}
            {/* name */}
            {product && (
              <View
                style={{
                  width: "100%",
                  position: "absolute",
                  backgroundColor: "#fff",
                  top: "270px",
                  left: "0",
                  padding: "1px 1px",
                }}
              >
                <Text style={cardStyles.textLogo}>{product.name}</Text>
              </View>
            )}

            {/* fecha de ingreso */}
            {product && (
              <View>
                {validateFecha(product.fechaIngreso) && (
                  <View
                    style={{
                      width: "100px",
                      position: "absolute",
                      top: "250px",
                      right: "195px",
                      backgroundColor: "#D7F0D9",
                      padding: "2px 2px",
                    }}
                  >
                    <Text style={cardStyles.textFecha}>
                      !Ingreso el {formatearFecha(product.fechaIngreso)}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* content img and new ,sku , marca */}
            {product && (
              <View
                style={{
                  position: "absolute",
                  height: "80%",
                  right: 0,
                  marginTop: 30,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {isNewProduct(product._createdAt) && (
                  <View
                    style={{
                      width: "45px",
                      position: "absolute",
                      top: "40px",
                      right: "0px",
                      backgroundColor: "#D7F0D9",
                      padding: "2px 2px",
                    }}
                  >
                    <Text style={cardStyles.textNew}>!nuevo¡</Text>
                  </View>
                )}
                {/* logo marca */}
                {product.marca && (
                  <View
                    style={{
                      padding: "0px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <Image
                      style={{ width: "30px", height: "30px" }}
                      src={marca}
                    />
                    {/* fondo marca */}
                    <Image
                      style={{
                        height: "35px",
                        width: "100%",
                        position: "absolute",
                        top: "0px",
                        zIndex: 10,
                      }}
                      src={catalogo.fondo_marca}
                    />
                  </View>
                )}

                {/* sku */}
                <View
                  style={{
                    padding: "2px 5px",
                    backgroundColor: "white",
                    width: "55px",
                    fontFamily: "RobotoBold",
                    marginBottom: "5px",
                  }}
                >
                  <Text style={cardStyles.textSku}>{product.sku}</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
      {product && (
        <View style={cardStyles.detailsContainerPrincipal}>
          <View style={cardStyles.detailsContainerPrecioOferta}>
            <Text style={cardStyles.textMayorista}>
              Precio {product.tipoprecio ? "Emprendedor" : "Mayorista"}:
            </Text>
            <Text style={cardStyles.textMayorista2}>
              S/{product.pricemayorista?.toFixed(2)}
            </Text>
            {/* fondo precio principal */}
            <Image
              style={{
                height: "26px",
                width: "100%",
                position: "absolute",
                top: "0px",
                zIndex: 10,
              }}
              src={catalogo.fondo_precio_principal}
            />
          </View>
          {/* precio retail */}
          <View style={cardStyles.detailsContainerPrecioOferta} >
            <Text style={cardStyles.textRetail}>Precio Retail:</Text>
            <Text style={cardStyles.textRetail}>
              S/{product.priceecommerce?.toFixed(2)}
            </Text>
            {/* fondo precio principal */}
            <Image
              style={{
                height: "26px",
                width: "100%",
                position: "absolute",
                top: "0px",
                zIndex: 10,
              }}
              src={catalogo.fondo_precio_principal}
            />
          </View>
          {/* tallas */}
          <View style={cardStyles.detailsContainerPrecioOferta}>
            <Text style={cardStyles.textTallasPrincipal}>tallas:</Text>
            <Text style={cardStyles.textTallasPrincipal}>
              {product.tallascatalogo}
            </Text>
            {/* fondo precio principal */}
            <Image
              style={{
                height: "26px",
                width: "100%",
                position: "absolute",
                top: "0px",
                zIndex: 10,
              }}
              src={catalogo.fondo_precio_principal}
            />
          </View>
          {/* <View style={cardStyles.detailsContainerRetailTallas}>
            <View style={cardStyles.detailColumn}>
              <Text style={cardStyles.text}>Tallas:</Text>
              <Text style={cardStyles.textTallas}>
                {product.tallascatalogo}
              </Text>
            </View>
            <View style={cardStyles.detailColumn}>
              <Text style={cardStyles.text}>Precio Retail:</Text>
              <Text style={cardStyles.text}>
                S/{product.priceecommerce?.toFixed(2)}
              </Text>
            </View>
            <Image
              style={{
                height: "100%",
                width: "100%",
                position: "absolute",
                top: "0px",
                zIndex: 10,
              }}
              src={catalogo.fondo_tallas}
            />
          </View> */}
        </View>
      )}
      {/* footer */}
      {product && (
        <View
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "3px",
            padding: "0px 2px",
            alignItems: "center",
            textTransform: "uppercase",
          }}
        >
          {!cliente && <Text style={cardStyles.textFooter}>FRITZSPORT.PE</Text>}
          <Text style={cardStyles.textFooter}>
            {product?.genero === "niños"
              ? product?.subgenero === "ninonina"
                ? "Niño/Niña"
                : product?.subgenero
              : product?.genero}{" "}
            - {product.categoria}
          </Text>
        </View>
      )}
    </View>
  );
};

export default Card;
