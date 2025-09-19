// custom-sku.tsx
import React from "react";
import { TextInput } from "@sanity/ui";
import { PatchEvent, set } from "sanity";

export const CustomSkuInput = ({ value, onChange, readOnly }: any) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Solo eliminar espacios al principio y al final (trim)
    const inputValue = event.target.value.trim();

    // Crear el PatchEvent para actualizar el valor
    const patch = inputValue
      ? PatchEvent.from(set(inputValue)) // Si hay un valor, actualizarlo
      : PatchEvent.from(set("")); // Si está vacío, ponerlo como una cadena vacía

    // Enviar el cambio a Sanity
    onChange(patch);
  };

  return (
    <TextInput
      value={value || ""}
      onChange={handleChange}
      readOnly={readOnly}
    />
  );
};

export default CustomSkuInput;
