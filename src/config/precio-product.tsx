export function precioProduct(
  descuento: number | string | undefined,
  precioEcommerce: number | string | undefined | null,
  precioManual: number | string | undefined,
  descuentos: any,
  descuentoSobreDescuento:  number  | undefined = 0,
  outlet: boolean = false,
  
) {
  let razonSocial;
  let resultado: Number;
  if (outlet) {
    razonSocial = descuentos.descuentooutlet;
  } else {
    razonSocial = descuentos?.descuentofritzsport;
  }

  if (precioManual) {
    if (Number(precioManual) < 20) {
      return (resultado = 999);
    } else {
      return (resultado = Number(precioManual));
    }
  } else {
    const precio = precioEcommerce;

    if (Number(precio) < 20 || precio === null || precio === undefined) {
      return (resultado = 999);
    } else {
      if (
        descuentos?.descuentofritzsport ||
        razonSocial === 0 ||
        descuentos?.descuentooutlet ||
        descuentoSobreDescuento > 0
      ) {
        if (razonSocial === 0) {
          if(descuentoSobreDescuento > 0){
            const operation = (Number(descuentoSobreDescuento) / 100) * Number(precio);
            resultado = Number(precio) - operation;
    
            if (Number(resultado) <= 20) {
              return 999;
            } else {
              return Number(resultado.toFixed(0));
            }
          }else{

            return precioEcommerce; 
          }
        } else {
          if(descuentoSobreDescuento > 0){
            const operation = (Number(descuentoSobreDescuento) / 100) * Number(precio);
            resultado = Number(precio) - operation;
    
            if (Number(resultado) <= 20) {
              return 999;
            } else {
              return Number(resultado.toFixed(0));
            }
          }else{

            if(outlet){
              const operation = (Number(razonSocial ) / 100) * Number(precio);
              resultado = Number(precio) - operation;
              if (Number(resultado) <= 20) {
                return 999;
              } else {
                return Number(resultado.toFixed(0));
              }
            }else{
              const operation = (Number(razonSocial) / 100) * Number(precio);
              resultado = Number(precio) - operation;
              if (Number(resultado) <= 20) {
                return 999;
              } else {
                return Number(resultado.toFixed(0));
              }
            }

        
          }
        }
      } else {
        const operation = (Number(descuento) / 100) * Number(precio);
        resultado = Number(precio) - operation;

        if (Number(resultado) <= 20) {
          return 999;
        } else {
          return Number(resultado.toFixed(0));
        }
      }
    }
  }
}

