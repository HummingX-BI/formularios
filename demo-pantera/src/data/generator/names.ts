import { RandomGenerator } from '../rng';

export const FIRST_NAMES = [
  'Alejandro', 'Daniel', 'David', 'Jorge', 'Luis', 'Carlos', 'José', 'Juan', 'Miguel', 'Francisco',
  'Eduardo', 'Roberto', 'Fernando', 'Ricardo', 'Arturo', 'Héctor', 'Pedro', 'Raúl', 'Jesús', 'Mario',
  'Óscar', 'Alberto', 'Javier', 'Hugo', 'Víctor', 'Gabriel', 'Guillermo', 'Enrique', 'Salvador', 'Antonio',
  'Diego', 'Emiliano', 'Santiago', 'Mateo', 'Sebastián', 'Leonardo', 'Matías', 'Iker', 'Nicolás', 'Maximiliano',
  'Samuel', 'Benjamín', 'Tomás', 'Joaquín', 'Martín', 'Lucas', 'Felipe', 'Pablo', 'Ignacio', 'Rodrigo',
  'Andrés', 'Manuel', 'Alonso', 'Rafael', 'Gerardo', 'Mauricio', 'René', 'Omar', 'Iván', 'Erick',
  'María', 'Guadalupe', 'Margarita', 'Juana', 'Carmen', 'Leticia', 'Rosa', 'Teresa', 'Josefina', 'Silvia',
  'Elena', 'Martha', 'Patricia', 'Adriana', 'Yolanda', 'Gabriela', 'Laura', 'Gloria', 'Alicia', 'Luz',
  'Alejandra', 'Verónica', 'Beatriz', 'Claudia', 'Ana', 'Susana', 'Norma', 'Lourdes', 'Blanca', 'Rosario',
  'Sofía', 'Camila', 'Valentina', 'Isabella', 'Ximena', 'Victoria', 'Valeria', 'Renata', 'Julieta', 'Daniela',
  'Regina', 'Mía', 'María José', 'Fernanda', 'Andrea', 'Samantha', 'Natalia', 'Mariana', 'Paula', 'Emilia',
  'Luciana', 'Romina', 'Sara', 'Diana', 'Carolina', 'Fabiola', 'Estefanía', 'Paola', 'Mónica', 'Karla'
];

export const LAST_NAMES = [
  'Hernández', 'García', 'Martínez', 'López', 'González', 'Pérez', 'Rodríguez', 'Sánchez', 'Ramírez', 'Cruz',
  'Flores', 'Gómez', 'Morales', 'Vázquez', 'Jiménez', 'Reyes', 'Díaz', 'Torres', 'Gutiérrez', 'Ruiz',
  'Mendoza', 'Aguilar', 'Ortiz', 'Álvarez', 'Castillo', 'Romero', 'Chávez', 'Rivera', 'Juárez', 'Ramos',
  'Domínguez', 'Herrera', 'Medina', 'Castro', 'Vargas', 'Guzmán', 'Velázquez', 'Rojas', 'Méndez', 'Muñoz',
  'Salazar', 'Garza', 'Soto', 'Fierro', 'Peña', 'Pineda', 'Lara', 'Trevino', 'Navarro', 'Salinas',
  'Delgado', 'Acosta', 'Cárdenas', 'Ríos', 'Rosas', 'Marín', 'Ríos', 'Pacheco', 'Ochoa', 'Bautista',
  'Villanueva', 'Cortes', 'Espinosa', 'Luna', 'Camacho', 'Maldonado', 'Vega', 'Guerrero', 'Escobar', 'Valdez',
  'Galván', 'Mora', 'Salgado', 'Valencia', 'Arias', 'Ríos', 'Osorio', 'Ríos', 'Nava', 'Ríos',
  'Rosales', 'Paredes', 'León', 'Mejía', 'Miranda', 'Ríos', 'Macías', 'Vallejo', 'Cisneros', 'Ríos',
  'Márquez', 'Padilla', 'Montes', 'Ponce', 'Ríos', 'Zavala', 'Gálvez', 'Ríos', 'Valderrama', 'Ríos'
];

export function generateFamilyName(rng: RandomGenerator): string {
  const ln1 = rng.choice(LAST_NAMES);
  let ln2 = rng.choice(LAST_NAMES);
  while (ln1 === ln2) ln2 = rng.choice(LAST_NAMES);
  return `${ln1} ${ln2}`;
}

export function generateStudentNames(rng: RandomGenerator, familyName: string, count: number): string[] {
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    let fn = rng.choice(FIRST_NAMES);
    while (names.some(n => n.startsWith(fn))) fn = rng.choice(FIRST_NAMES); // no repetición exacta
    names.push(`${fn} ${familyName}`);
  }
  return names;
}

export function generatePhone(rng: RandomGenerator): string {
  return `550000${rng.int(1000, 9999)}`;
}

export function generateEmail(rng: RandomGenerator, familyName: string): string {
  const clean = familyName.toLowerCase().replace(/[^a-z]/g, '').substring(0, 10);
  return `${clean}${rng.int(10, 99)}@ejemplo.mx`;
}
