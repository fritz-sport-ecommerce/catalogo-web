export default function determinarRazonSocial(
  precioRetail: number,
  precioMayorista: number,
  marca: string
): string {
  const porcentaje = (precioRetail / precioMayorista) * 100;

  if (marca === "adidas") {
    return porcentaje >= 40 ? "fritzduran" : "fritzsport";
  }
// traer commit
  return "fritzsport";
}
