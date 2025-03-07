type Producto = {
  talla: string;
  stockDisponible: number;
};

type TallaStock = 
  string;

;

export default function filtrarTallasConStock (data: { talla: string; stock: number }[]): string[]{
   let arrayTallasConStock = data
      ?.filter(item => item.stock > 10) // Filtra solo los que tienen stock > 10
      ?.map(item => item.talla.trim()); // Retorna solo las tallas sin espacios extra

      console.log(arrayTallasConStock);
      return arrayTallasConStock
      
};

