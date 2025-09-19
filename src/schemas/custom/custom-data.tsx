import React from "react";
import { Box, TextInput } from "@sanity/ui";
import { PatchEvent, set, unset } from "sanity";

export const CustomDateInput = ({ value, onChange, readOnly }: any) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    // Si el valor está vacío, usa `unset`, de lo contrario usa `set`
    const patch = inputValue
      ? PatchEvent.from(set(inputValue))
      : PatchEvent.from(unset());

    onChange(patch); // Notifica a Sanity del cambio
  };

  // Formatea la fecha en español para mostrarla en el input
  const formattedValue = value
    ? new Date(value).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  return (
    <Box>
      <TextInput
        type="date" // Selector de fecha
        value={value || ""} // Muestra la fecha actual
        onChange={handleChange}
        readOnly={readOnly}
        lang="es-ES" // Configura el idioma a español
      />
    </Box>
  );
};

export default CustomDateInput;
