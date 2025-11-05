# Clase UCC - Aplicativo React con Vite

## Descripcion

Este proyecto es un aplicativo desarrollado en **React con Vite** para practicar **pruebas unitarias** con Jest y la integracion continua con GitHub Actions.

El aplicativo incluye:

* **Sidebar con acordeon** para navegacion.
* **Componentes de ejemplo** para revisar dependencias.
* **Ejercicios con pruebas unitarias**:

  * Tablas de Multiplicar (`TablasMul.tsx`)
  * Conversor de Unidades (`UnitConverter.tsx`)
  * Validador de Contrasenas (`PasswordValidator.tsx`)
  * Contador de Clics (`ClickCounter.tsx`)
  * Lista de Tareas (`TodoList.tsx`)

* **Modulo de Ciencias Naturales con Three.js**:

  * Sistema Solar Interactivo (`SolarSystem.tsx`)

* **Caso de estudio Construccion con Bloques**:

  * Editor sandbox con bloques voxel (`BlockBuilder.tsx`)

---

## Instalacion

Clonar el repositorio:

```bash
git clone https://github.com/guswill24/ucc_ing_web.git
cd clase-ucc
```

Instalar dependencias:

```bash
npm install
```

---

## Scripts disponibles

* **Iniciar servidor de desarrollo**

```bash
npm run dev
```

* **Compilar para produccion**

```bash
npm run build
```

* **Previsualizar build de produccion**

```bash
npm run preview
```

* **Ejecutar pruebas unitarias**

```bash
npm test
```

* **Revisar tipos TypeScript**

```bash
npm run type-check
```

* **Linting y formateo**

```bash
npm run lint
npm run format
```

---

## Estructura de carpetas

```
src/
  components/       # Componentes reutilizables (Sidebar, UnitConverter, etc.)
  views/            # Vistas de cada ejercicio y ejemplo
  routes/AppRoutes.tsx
  main.tsx          # Punto de entrada de React
```

---

## Componentes y funcionalidades

### Componentes de pruebas unitarias
1. **Sidebar.tsx**: Menu lateral con acordeon que agrupa ejercicios y ejemplos.
2. **UnitConverter.tsx**: Conversor Celsius <-> Fahrenheit con input controlado.
3. **PasswordValidator.tsx**: Validador de contrasenas dinamico con feedback visual.
4. **ClickCounter.tsx**: Contador de clics persistente usando `localStorage`.
5. **TodoList.tsx**: Lista de tareas con agregar y eliminar elementos.
6. **TablasMul.tsx**: Tabla de multiplicar interactiva.

### Componentes de ciencias naturales (Three.js)
7. **SolarSystem.tsx**: Sistema solar interactivo con planetas orbitando al Sol.

### Casos de estudio interactivos
8. **BlockBuilder.tsx**: Constructor de bloques estilo voxel para experimentar con mundos sandbox.

---

## Pruebas unitarias

Las pruebas unitarias utilizan **Jest** y **React Testing Library**.

* Validan la interaccion correcta de los componentes.
* Comprueban que `localStorage` persista valores en `ClickCounter`.
* Verifican la logica de validacion en `PasswordValidator`.
* Confirman el flujo de agregar y eliminar tareas en `TodoList`.
* Aseguran que los componentes principales rendericen correctamente.

Ejecutar todas las pruebas:

```bash
npm test
```

---

## Consideraciones

* Investiga, analiza e interpreta cada ejercicio antes de ejecutar pruebas unitarias.
* Las pruebas se evaluan de forma individual en clase, incluyendo la explicacion del proceso y la solucion.

---

## Tecnologias utilizadas

### Frameworks y librerias principales
* `react`, `react-dom`, `react-router-dom` - Framework web y enrutamiento.
* `three` - Biblioteca 3D para graficos WebGL.
* `tailwindcss` - Framework CSS utilitario.
* `framer-motion` - Animaciones y transiciones.
* `react-icons` - Iconos vectoriales.

### Testing y calidad
* `jest`, `@testing-library/react`, `@testing-library/jest-dom`, `@types/jest` - Stack de testing.
* `eslint`, `prettier` - Linting y formateo de codigo.
* `typescript` - Tipado estatico.

### Integracion continua
* GitHub Actions - CI/CD automatizado.
* Workflows configurados para multiples versiones de Node.js.
* Testing automatico en push y pull requests.

---

## Autor

**Gustavo Sanchez Rodriguez**
Asignatura: Ingenieria Web
Clase UCC
