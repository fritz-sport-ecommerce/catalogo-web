import React from "react";
import { TextInput } from "@sanity/ui";
import { PatchEvent, set, unset } from "sanity";

export const CustomNameInput = ({ value, onChange, readOnly }: any) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.slice(0, 50); // Limitar a 50 caracteres

    // Si el valor está vacío, usa `unset`, de lo contrario usa `set`
    const patch = inputValue
      ? PatchEvent.from(set(inputValue))
      : PatchEvent.from(unset());

    onChange(patch); // Notifica a Sanity del cambio
  };

  return (
    <TextInput
      value={value || ""}
      onChange={handleChange}
      readOnly={readOnly}
    />
  );
};

export default CustomNameInput;
