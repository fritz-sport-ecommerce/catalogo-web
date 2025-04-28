export function LimitarTexto(texto: string, maxCaracteres: number): string {
    if (texto.length <= maxCaracteres) {
      return texto;
    }
    return texto.substring(0, maxCaracteres) + '...';
  }