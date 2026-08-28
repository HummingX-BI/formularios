# Tahara Café · Sistema de Diseño
*Menú Digital — Documento de referencia para desarrollo*

---

## 1. Paleta de Color

### Turquesa (Color Primario)
| Token | Hex | Uso |
|---|---|---|
| `--tq-500` | `#0FC3C9` | Principal: botones, acentos, íconos de marca |
| `--tq-600` | `#0DA8AD` | Hover de botones, estados activos |
| `--tq-300` | `#7DE0E4` | Fondos de pills/tags, bordes sutiles |
| `--tq-100` | `#DFF7F8` | Fondos de tarjetas activas, tints |

### Café / Madera Oscura (Color de Texto)
| Token | Hex | Uso |
|---|---|---|
| `--cf-900` | `#3A2922` | Texto principal, wordmark, headings |
| `--cf-700` | `#5C3E33` | Texto secundario, subtítulos |
| `--cf-500` | `#7A5548` | Texto muted, metadatos |
| `--cf-200` | `#C4A898` | Decorativo, bordes cálidos |

### Crema / Fondo Cálido (Fondos)
| Token | Hex | Uso |
|---|---|---|
| `--cr-50`  | `#FBF7F0` | Fondo principal (nunca blanco puro) |
| `--cr-100` | `#F3EBE0` | Fondo de tarjetas/secciones |
| `--cr-200` | `#E8DDD0` | Bordes, separadores, líneas |

### Dorado Ancestral (Acento Opcional)
| Token | Hex | Uso |
|---|---|---|
| `--gd-400` | `#C9A15A` | Precios "estrella", detalles ceremoniales |
| `--gd-300` | `#E4C98A` | Tints de dorado en fondos |
| `--gd-600` | `#A07030` | Versión oscura para texto sobre dorado |

---

## 2. Tipografía

### Headings — `Cormorant Garamond`
- Serif con alto contraste, trazo caligráfico, reminiscente del cacao tallado en códices
- Pesos: 400 italic (subtítulos), 500 (nombres), 600 (héroe)
- Uso: Nombre del café, secciones del menú, citas culturales

### Body / Precios — `DM Sans`
- Sans-serif geométrica, moderna pero amigable; legible a cualquier tamaño
- Pesos: 300 (descripciones), 400 (texto regular), 600 (precios en destaque)
- Uso: Descripciones, precios, etiquetas, ingredientes

### Monospace — `IBM Plex Mono`
- Uso: Etiquetas técnicas, textos de sistema, tablas

---

## 3. Motivo Gráfico — Triángulo & Espiral

### El Triángulo (de las "A" del wordmark)
- Forma: triángulo isósceles, vértice hacia arriba
- Uso: separadores de sección, decoración de precios, marcadores de categoría
- Implementación: `clip-path: polygon(50% 0%, 0% 100%, 100% 100%)` o SVG inline
- Colores: siempre `--tq-500` o `--gd-400`

### La Espiral (del isotipo)
- Forma: línea SVG tipo Archimediana, trazo único
- Uso: separadores de hero, backgrounds de sección "ancestral"
- Implementación: SVG path inline, stroke en `--cf-200`, fill none
- Solo decorativo, nunca funcional; opacity muy reducida en backgrounds

---

## 4. Textura de Fondo

- Técnica: SVG feTurbulence + feColorMatrix como data URI en background-image
- Intensidad: opacity 3-5% (que se sienta artesanal, no papel viejo)
- Base: siempre `--cr-50` (#FBF7F0), nunca blanco puro ni gradientes IA

---

## 5. Escala de Espaciado (base 4px)

4 · 8 · 12 · 16 · 24 · 32 · 48 · 64

---

## 6. Border-Radius — Orgánico

| Token | Valor | Uso |
|---|---|---|
| `--r-sm` | `3px` | Etiquetas, precios |
| `--r-md` | `6px` | Tarjetas de producto |
| `--r-lg` | `10px` | Modales, secciones |
| esquina cortada | `clip-path` | Tarjetas destacadas y botón primario |

Esquina cortada (remite al triángulo):
```
clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
```

---

## 7. Variables CSS Completas

```css
:root {
  --tq-100: #DFF7F8; --tq-300: #7DE0E4; --tq-500: #0FC3C9; --tq-600: #0DA8AD;
  --cf-200: #C4A898; --cf-500: #7A5548; --cf-700: #5C3E33; --cf-900: #3A2922;
  --cr-50:  #FBF7F0; --cr-100: #F3EBE0; --cr-200: #E8DDD0;
  --gd-300: #E4C98A; --gd-400: #C9A15A; --gd-600: #A07030;
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-sans:  'DM Sans', system-ui, sans-serif;
  --font-mono:  'IBM Plex Mono', monospace;
  --sp-1:4px; --sp-2:8px; --sp-3:12px; --sp-4:16px;
  --sp-5:24px; --sp-6:32px; --sp-7:48px; --sp-8:64px;
  --r-sm:3px; --r-md:6px; --r-lg:10px;
}
```
