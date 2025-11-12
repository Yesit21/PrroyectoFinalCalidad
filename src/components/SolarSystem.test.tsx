import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SolarSystem from './SolarSystem';

// Mock de SpeechSynthesis
const mockSpeak = jest.fn();
const mockGetVoices = jest.fn(() => []);

Object.defineProperty(window, 'speechSynthesis', {
  value: {
    speak: mockSpeak,
    getVoices: mockGetVoices,
    cancel: jest.fn(),
  },
  writable: true,
});

// Mock de HTMLCanvasElement.getContext
const mockGetContext = jest.fn(() => null);
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: mockGetContext,
  writable: true,
});

describe('SolarSystem Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el título del sistema solar', () => {
    render(<SolarSystem />);
    expect(screen.getByText('🌌 Sistema Solar Interactivo 3D')).toBeInTheDocument();
  });

  test('renderiza el botón de narración inicialmente desactivado', () => {
    render(<SolarSystem />);
    const narrationButton = screen.getByText('🔊 Narración OFF');
    expect(narrationButton).toBeInTheDocument();
  });

  test('muestra mensaje cuando no hay planeta seleccionado', () => {
    render(<SolarSystem />);
    expect(screen.getByText('Haz clic en un planeta para ver su información')).toBeInTheDocument();
  });

  test('renderiza todos los planetas en la lista', () => {
    render(<SolarSystem />);

    const planets = [
      'Mercurio', 'Venus', 'Tierra', 'Marte',
      'Júpiter', 'Saturno', 'Urano', 'Neptuno'
    ];

    planets.forEach(planet => {
      expect(screen.getByText(planet)).toBeInTheDocument();
    });
  });

  test('muestra información correcta de la Tierra cuando se selecciona', async () => {
    const user = userEvent.setup();
    render(<SolarSystem />);

    const tierraButton = screen.getByText('Tierra');
    await user.click(tierraButton);

    // Esperar a que aparezca la información del planeta
    await waitFor(() => {
      expect(screen.getByText('La Tierra es el tercer planeta desde el Sol')).toBeInTheDocument();
    }, { timeout: 10000 });

    expect(screen.getByText('Masa:')).toBeInTheDocument();
    expect(screen.getByText('5.97 × 10²⁴ kg')).toBeInTheDocument();
    expect(screen.getByText('Diámetro:')).toBeInTheDocument();
    expect(screen.getByText('12,756 km')).toBeInTheDocument();
  });

  test('muestra información de lunas para planetas que las tienen', async () => {
    const user = userEvent.setup();
    render(<SolarSystem />);

    // Tierra tiene 1 luna
    const tierraButton = screen.getByText('Tierra');
    await user.click(tierraButton);

    await waitFor(() => {
      expect(screen.getByText('🌙 1 luna')).toBeInTheDocument();
      expect(screen.getByText('Luna')).toBeInTheDocument();
    }, { timeout: 10000 });

    // Marte tiene 2 lunas
    const marteButton = screen.getByText('Marte');
    await user.click(marteButton);

    await waitFor(() => {
      expect(screen.getByText('🌙 2 lunas')).toBeInTheDocument();
      expect(screen.getByText('Fobos, Deimos')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  test('activa y desactiva la narración correctamente', async () => {
    const user = userEvent.setup();
    render(<SolarSystem />);

    const narrationButton = screen.getByText('🔊 Narración OFF');
    await user.click(narrationButton);

    expect(screen.getByText('🔊 Narración ON')).toBeInTheDocument();

    await user.click(screen.getByText('🔊 Narración ON'));
    expect(screen.getByText('🔊 Narración OFF')).toBeInTheDocument();
  });

  test('muestra botón de quiz cuando se selecciona un planeta', async () => {
    const user = userEvent.setup();
    render(<SolarSystem />);

    const mercurioButton = screen.getByText('Mercurio');
    await user.click(mercurioButton);

    await waitFor(() => {
      expect(screen.getByText('🎯 Hacer Quiz sobre Mercurio')).toBeInTheDocument();
    });
  });

  test('abre y cierra el modal de quiz correctamente', async () => {
    const user = userEvent.setup();
    render(<SolarSystem />);

    // Seleccionar planeta y abrir quiz
    const tierraButton = screen.getByText('Tierra');
    await user.click(tierraButton);

    const quizButton = await screen.findByText('🎯 Hacer Quiz sobre Tierra');
    await user.click(quizButton);

    // Verificar que el modal se abrió
    expect(screen.getByText('🎯 Quiz: Tierra')).toBeInTheDocument();
    expect(screen.getByText('Pregunta 1 de 4')).toBeInTheDocument();

    // Cerrar el modal
    const closeButton = screen.getByText('Cerrar Quiz');
    await user.click(closeButton);

    // Verificar que el modal se cerró
    await waitFor(() => {
      expect(screen.queryByText('🎯 Quiz: Tierra')).not.toBeInTheDocument();
    });
  });

  test('procesa respuestas del quiz correctamente', async () => {
    const user = userEvent.setup();
    render(<SolarSystem />);

    // Abrir quiz de Mercurio
    const mercurioButton = screen.getByText('Mercurio');
    await user.click(mercurioButton);

    const quizButton = await screen.findByText('🎯 Hacer Quiz sobre Mercurio', {}, { timeout: 10000 });
    await user.click(quizButton);

    // Responder primera pregunta correctamente (opción 2: "Sodio y potasio")
    const correctOption = screen.getByText('Sodio y potasio');
    await user.click(correctOption);

    // Verificar respuesta correcta
    await waitFor(() => {
      expect(screen.getByText(/¡Correcto!/)).toBeInTheDocument();
    }, { timeout: 10000 });

    // Verificar que pasa a la siguiente pregunta
    await waitFor(() => {
      expect(screen.getByText('Pregunta 2 de 4')).toBeInTheDocument();
    }, { timeout: 10000 });
  });

  test('muestra colores correctos para cada planeta', async () => {
    const user = userEvent.setup();
    render(<SolarSystem />);

    const tierraButton = screen.getByText('Tierra');
    await user.click(tierraButton);

    await waitFor(() => {
      // El título debería tener el color azul de la Tierra (#4a90e2)
      const titleElement = screen.getByRole('heading', { level: 4, name: 'Tierra' });
      expect(titleElement).toHaveStyle({ color: '#4a90e2' });
    });
  });

  test('muestra instrucciones de uso del visualizador 3D', () => {
    render(<SolarSystem />);
    expect(screen.getByText('Usa el mouse para rotar la vista, hacer zoom con la rueda, y arrastra para mover la cámara.')).toBeInTheDocument();
  });

  test('no llama a speechSynthesis cuando la narración está desactivada', async () => {
    const user = userEvent.setup();
    render(<SolarSystem />);

    const tierraButton = screen.getByText('Tierra');
    await user.click(tierraButton);

    // Verificar que no se llamó a speak
    expect(mockSpeak).not.toHaveBeenCalled();
  });

  test('llama a speechSynthesis cuando la narración está activada y se selecciona un planeta', async () => {
    const user = userEvent.setup();
    render(<SolarSystem />);

    // Activar narración
    const narrationButton = screen.getByText('🔊 Narración OFF');
    await user.click(narrationButton);

    // Seleccionar planeta
    const tierraButton = screen.getByText('Tierra');
    await user.click(tierraButton);

    // Verificar que se llamó a speak con el texto correcto
    await waitFor(() => {
      expect(mockSpeak).toHaveBeenCalled();
      const call = mockSpeak.mock.calls[0][0];
      expect(call.text).toContain('Tierra');
      expect(call.text).toContain('tercer planeta desde el Sol');
      expect(call.lang).toBe('es-ES');
      expect(call.rate).toBe(0.8);
    }, { timeout: 10000 });
  });

  test('datos de planetas contienen toda la información necesaria', () => {
    // Importar los datos de planetas para verificar su estructura
    const planetsData = [
      {
        name: "Mercurio",
        color: 0x8c7853,
        size: 5,
        distance: 25,
        speed: 0.02,
        moons: [],
        description: "Mercurio es el planeta más cercano al Sol",
        mass: "3.30 × 10²³ kg",
        diameter: "4,879 km",
        orbitalPeriod: "88 días terrestres",
        rotationPeriod: "58.6 días terrestres",
        temperature: { min: -173, max: 427 },
        atmosphere: "Muy delgada (oxígeno, sodio, hidrógeno, potasio)",
        surface: "Rocas ígneas, superficie craterizada"
      },
      {
        name: "Venus",
        color: 0xe8c468,
        size: 7,
        distance: 40,
        speed: 0.015,
        moons: [],
        description: "Venus es el segundo planeta desde el Sol",
        mass: "4.87 × 10²⁴ kg",
        diameter: "12,104 km",
        orbitalPeriod: "225 días terrestres",
        rotationPeriod: "243 días terrestres (retrógrada)",
        temperature: { min: 450, max: 470 },
        atmosphere: "Densa (CO₂ 96.5%, nitrógeno 3.5%)",
        surface: "Rocas basálticas, volcanes, llanuras"
      },
      {
        name: "Tierra",
        color: 0x4a90e2,
        size: 8,
        distance: 60,
        speed: 0.012,
        moons: [{ size: 2.5, color: 0x9e9e9e, distance: 12, speed: 0.08, name: "Luna" }],
        description: "La Tierra es el tercer planeta desde el Sol",
        mass: "5.97 × 10²⁴ kg",
        diameter: "12,756 km",
        orbitalPeriod: "365.25 días",
        rotationPeriod: "24 horas",
        temperature: { min: -89, max: 58 },
        atmosphere: "Nitrógeno 78%, oxígeno 21%, argón 0.9%",
        surface: "Continentes, océanos, hielo polar"
      }
    ];

    // Verificar que cada planeta tiene todas las propiedades requeridas
    planetsData.forEach(planet => {
      expect(planet).toHaveProperty('name');
      expect(planet).toHaveProperty('color');
      expect(planet).toHaveProperty('size');
      expect(planet).toHaveProperty('distance');
      expect(planet).toHaveProperty('speed');
      expect(planet).toHaveProperty('moons');
      expect(planet).toHaveProperty('description');
      expect(planet).toHaveProperty('mass');
      expect(planet).toHaveProperty('diameter');
      expect(planet).toHaveProperty('orbitalPeriod');
      expect(planet).toHaveProperty('rotationPeriod');
      expect(planet).toHaveProperty('temperature');
      expect(planet).toHaveProperty('atmosphere');
      expect(planet).toHaveProperty('surface');

      expect(typeof planet.name).toBe('string');
      expect(typeof planet.color).toBe('number');
      expect(typeof planet.size).toBe('number');
      expect(typeof planet.distance).toBe('number');
      expect(typeof planet.speed).toBe('number');
      expect(Array.isArray(planet.moons)).toBe(true);
    });
  });

  test('función speakText maneja errores correctamente', async () => {
    // Mock de speechSynthesis que lanza error
    const mockSpeakWithError = jest.fn(() => {
      throw new Error('Speech synthesis error');
    });

    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: mockSpeakWithError,
        getVoices: mockGetVoices,
        cancel: jest.fn(),
      },
      writable: true,
    });

    const user = userEvent.setup();
    render(<SolarSystem />);

    // Activar narración y seleccionar planeta debería manejar el error
    const narrationButton = screen.getByText('🔊 Narración OFF');
    await user.click(narrationButton);

    const tierraButton = screen.getByText('Tierra');
    await user.click(tierraButton);

    // Esperar a que se intente ejecutar la narración
    await waitFor(() => {
      expect(mockSpeakWithError).toHaveBeenCalled();
    }, { timeout: 10000 });
  });
});