import React from "react";
import { Stack, Label, Select } from "@sanity/ui";
import { set, PatchEvent, useFormValue } from "sanity";
import { type StringInputProps } from "sanity";

const CATEGORY_OPTIONS: Record<string, { title: string; value: string }[]> = {
  calzado: [
    { title: "Chimpunes", value: "chimpunes" },
    { title: "Plataforma", value: "plataforma" },
    { title: "Tenis", value: "tenis" },
    { title: "Running", value: "running" },
    { title: "Trail Running", value: "trail-running" },
    { title: "Sandalias", value: "sandalias" },
    { title: "Básket", value: "basquet" },
    { title: "Training", value: "training" },
    { title: "Originals", value: "originals" },
    { title: "Hiking", value: "hiking" },
    { title: "Skateboarding", value: "skateboarding" },
    { title: "Sportswear", value: "sportswear" },
    { title: "Bicicleta", value: "bicicleta" },
    { title: "Senderismo", value: "senderismo" },
    { title: "Terrex", value: "terrex" },
    { title: "Urbano", value: "urbano" },
    { title: "Escolar", value: "escolar" },
  ],
  ropa: [
        { title: "Originals", value: "originals" },
    { title: "Polos", value: "polos" },
    { title: "Camisetas", value: "camisetas" },
    { title: "Casacas", value: "casacas" },
    { title: "Leggins", value: "leggins" },
    { title: "Tops", value: "tops" },
    { title: "Shorts", value: "shorts" },
    { title: "Falda", value: "falda" },
    { title: "Body", value: "body" },
    { title: "Pantalón", value: "pantalon" },
    { title: "Poleras", value: "poleras" },
    { title: "Buzos", value: "buzos" },
    { title: "Bvd", value: "bvd" },
    { title: "Medias", value: "medias" },
    { title: "Medias", value: "medias" },
    // new
    { title: "Chalecos", value: "chalecos" },
  ],
  accesorios: [
    { title: "Mochilas", value: "mochilas" },
        { title: "Muñequera", value: "munequera" },
    // new
    { title: "Maletín", value: "maletin" },
    { title: "Muñequera", value: "munequera" },
    { title: "Morral", value: "morral" },
    { title: "Canguro", value: "canguro" },

    { title: "Bolsos", value: "bolsos" },
    { title: "Toma todo", value: "tomatodos" },
    { title: "Vinchas", value: "vinchas" },
    { title: "Canillera", value: "canillera" },
    { title: "Pelotas", value: "pelotas" },
    { title: "Gorras", value: "gorras" },
    { title: "Guantes", value: "guantes" },
    { title: "Kik de Limpieza", value: "kik_limpieza" },
  ],
};
const CategorySelect: React.FC<StringInputProps> = (props) => {
  const { value, onChange, path } = props;

  // Obtener el valor del campo "tipo" a nivel raíz
  const tipo = useFormValue(["tipo"]) as string | undefined;
  const options = CATEGORY_OPTIONS[tipo ?? ""] || [];

  return (
    <Stack space={2}>
      <Label>Categoria ({tipo || "sin tipo"})</Label>
      <Select
        value={value || ""}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onChange(PatchEvent.from(set(e.target.value)))
        }
        disabled={options.length === 0}
      >
        <option value="">Selecciona una categoría</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.title}
          </option>
        ))}
      </Select>
    </Stack>
  );
};

export default CategorySelect;

