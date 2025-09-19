# Icon Call Center Component

Este componente crea un icono flotante de call center que se posiciona en la parte inferior izquierda de la pantalla, similar al icono de WhatsApp pero con un diseño de persona de call center.

## Características

- 🎨 Diseño moderno con gradiente azul
- 📱 Responsive (se adapta a móvil y desktop)
- ⚡ Animación de ping para llamar la atención
- 🎯 Posicionamiento fijo en la pantalla
- 📞 Funcionalidad de llamada directa al hacer clic

## Uso

```tsx
import IconCallCenter from "@/components/icon-call-center/icon-call-center";

// Uso básico
<IconCallCenter phoneNumber="+51983478551" />
```

## Props

| Prop | Tipo | Descripción |
|------|------|-------------|
| `phoneNumber` | `string` | Número de teléfono al que se llamará (formato internacional recomendado) |

## Posicionamiento

El icono se posiciona automáticamente:
- **Móvil**: `bottom-28 left-4`
- **Desktop**: `bottom-[140px] left-16`

## Estilos

- Color principal: Azul (`#3B82F6`)
- Gradiente: De azul claro a azul oscuro
- Animación: Ping continuo para llamar la atención
- Tamaño: 50px en desktop, 30px en móvil

## Integración

El componente ya está integrado en el layout principal de la aplicación y aparecerá automáticamente en todas las páginas. 