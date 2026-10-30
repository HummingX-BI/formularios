# 05 · Flujos

La empresa publica una vacante y el candidato la ve en su búsqueda. Su postulación llega a la lista de postulantes
de la empresa. Los avisos de WhatsApp acompañan cada momento y el administrador vigila el piloto desde su tablero.

## Vista general

```mermaid
flowchart LR
  subgraph Candidato
    C1[Crea cuenta] --> C2[Arma CV por pasos] --> C3[Elige plantilla, paga y descarga] --> C4[Busca vacantes por sector] --> C5[Se postula en un clic]
  end
  subgraph Empresa
    E1[Registra su negocio] --> E2[Elige plan o prueba gratis] --> E3[Publica vacante con descarte] --> E4[Revisa postulantes] --> E5[Preselecciona o contacta]
    E2 -.-> E6[Solicita headhunting]
  end
  subgraph Sistema[Sistema · WhatsApp simulado]
    S1[Plan por vencer → empresa]
    S2[Vence en 5, 3, 0 días → empresa]
    S3[Vacante que coincide → candidato]
    S4[Candidato nuevo → empresa]
  end
  subgraph Administrador
    A1[Tablero del piloto] --- A2[Gestiona empresas, usuarios, vacantes] --- A3[Sectores y planes] --- A4[Solicitudes de headhunting]
  end
  E3 -. vacante visible .-> C4
  C5 == postulación ==> E4
  C5 --> S4
  E3 --> S3
  E6 --> A4
```

## Flujo del candidato

```mermaid
flowchart TD
  P01[P01 Inicio] -->|Busco trabajo| P02[P02 Registro candidato]
  P02 --> P03[P03 CV paso 1 de 5]
  P03 -->|Siguiente x5| P04[P04 Plantillas y vista previa]
  P04 -->|Descargar PDF| P05[P05 Pago]
  P05 -->|Pago aprobado| DL[(PDF descargado)]
  P04 -->|Buscar vacantes| P06[P06 Vacantes]
  P06 --> P07[P07 Detalle de vacante]
  P07 -->|¿CV completo?| Q{RD-01}
  Q -->|No| P03
  Q -->|Sí| PREG[Preguntas de descarte]
  PREG --> OK[Confirmación de postulación]
  OK --> P08[P08 Mis postulaciones]
```

## Flujo de la empresa

```mermaid
flowchart TD
  P01[P01 Inicio] -->|Busco talento| P02[P02 Registro empresa]
  P02 --> P09[P09 Planes]
  P09 -->|Probar gratis| P10[P10 Panel de la empresa]
  P09 -->|Contratar| PAGO[Pago simulado] --> P10
  P10 -->|Nueva vacante| P11[P11 Crear vacante: datos → preguntas → revisar]
  P11 -->|Publicar| P10
  P10 -->|Ver postulantes| P12[P12 Postulantes]
  P12 -->|Preseleccionar / Descartar / Contactar| P12
  P10 -->|Buscar perfiles| P13[P13 Perfiles]
  P10 -->|Headhunting| P14[P14 Solicitud de headhunting]
  P10 -->|Renovar vacante| P10
```

## Flujo del sistema (avisos)

```mermaid
sequenceDiagram
  participant Emp as Empresa
  participant Sis as Sistema
  participant WA as WhatsApp (P18)
  participant Can as Candidato
  Emp->>Sis: Publica vacante (Salud, Iztapalapa)
  Sis->>WA: RN-08 Vacante que coincide
  WA-->>Can: "Hay una vacante para ti…"
  Can->>Sis: Se postula
  Sis->>WA: RN-07 Candidato nuevo
  WA-->>Emp: "Tienes un nuevo postulante…"
  Note over Sis: Panel de demo → "Avanzar días"
  Sis->>WA: RN-06 Faltan 5 días / 3 días / vence hoy
  WA-->>Emp: Recordatorio con botón "Renovar"
  Sis->>WA: RN-09 Tu plan vence pronto
  WA-->>Emp: Recordatorio de suscripción
```

## Flujo del administrador

```mermaid
flowchart TD
  P02[P02 Acceso admin] --> P15[P15 Tablero del piloto]
  P15 --> P16[P16 Empresas, usuarios, vacantes]
  P15 --> P17[P17 Sectores, etiquetas, planes]
  P15 --> HH[Solicitudes de headhunting en P15]
  HH -->|Asignar a reclutador| HH
```
