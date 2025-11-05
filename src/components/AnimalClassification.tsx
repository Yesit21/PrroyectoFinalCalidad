import { useState } from 'react';
import * as THREE from 'three';

interface Animal {
  name: string;
  type: 'mamifero' | 'ave' | 'reptil' | 'pez' | 'anfibio' | 'invertebrado';
  description: string;
  color: number;
  geometry: THREE.BufferGeometry;
}

const animals: Animal[] = [
  {
    name: 'León',
    type: 'mamifero',
    description: 'Mamífero carnívoro, rey de la selva',
    color: 0xD2691E,
    geometry: new THREE.BoxGeometry(1, 0.8, 1.5)
  },
  {
    name: 'Águila',
    type: 'ave',
    description: 'Ave rapaz con excelente visión',
    color: 0x8B4513,
    geometry: new THREE.ConeGeometry(0.5, 1.5, 8)
  },
  {
    name: 'Cocodrilo',
    type: 'reptil',
    description: 'Reptil semiacuático con mandíbulas poderosas',
    color: 0x228B22,
    geometry: new THREE.BoxGeometry(2, 0.5, 1)
  },
  {
    name: 'Salmón',
    type: 'pez',
    description: 'Pez migratorio que nada contra corriente',
    color: 0xFF6347,
    geometry: new THREE.CapsuleGeometry(0.3, 1.2, 4, 8)
  },
  {
    name: 'Rana',
    type: 'anfibio',
    description: 'Anfibio que vive en agua y tierra',
    color: 0x32CD32,
    geometry: new THREE.SphereGeometry(0.4, 8, 8)
  },
  {
    name: 'Mariposa',
    type: 'invertebrado',
    description: 'Insecto con alas coloridas',
    color: 0xFF69B4,
    geometry: new THREE.PlaneGeometry(1.5, 1.5)
  }
];

const animalTypes = {
  mamifero: { name: 'Mamíferos', color: '#8B4513', icon: '🦁' },
  ave: { name: 'Aves', color: '#87CEEB', icon: '🦅' },
  reptil: { name: 'Reptiles', color: '#228B22', icon: '🐊' },
  pez: { name: 'Peces', color: '#4169E1', icon: '🐠' },
  anfibio: { name: 'Anfibios', color: '#32CD32', icon: '🐸' },
  invertebrado: { name: 'Invertebrados', color: '#FF69B4', icon: '🦋' }
};

export default function AnimalClassification() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);

  const filteredAnimals = selectedType
    ? animals.filter(animal => animal.type === selectedType)
    : animals;

  return (
    <div className="h-full w-full p-6">
      <h1 className="text-2xl font-bold mb-6">Clasificación de Animales con Modelos 3D</h1>

      {/* Classification Types */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(animalTypes).map(([type, info]) => (
          <button
            key={type}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedType === type
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            style={{ borderColor: selectedType === type ? info.color : undefined }}
          >
            <div className="text-3xl mb-2">{info.icon}</div>
            <div className="font-semibold text-sm">{info.name}</div>
          </button>
        ))}
      </div>

      {/* Clear Filter Button */}
      {selectedType && (
        <div className="mb-6">
          <button
            onClick={() => setSelectedType(null)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Mostrar Todos
          </button>
        </div>
      )}

      {/* Animal Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnimals.map((animal) => (
          <div
            key={animal.name}
            className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => setSelectedAnimal(selectedAnimal?.name === animal.name ? null : animal)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{animal.name}</h3>
              <span className="text-2xl">
                {animalTypes[animal.type].icon}
              </span>
            </div>

            {/* 3D Model Placeholder */}
            <div
              className="w-full h-32 bg-gray-100 rounded-lg mb-4 flex items-center justify-center"
              style={{ backgroundColor: `#${animal.color.toString(16).padStart(6, '0')}20` }}
            >
              <div className="text-4xl opacity-50">
                {animal.type === 'mamifero' && '🦁'}
                {animal.type === 'ave' && '🦅'}
                {animal.type === 'reptil' && '🐊'}
                {animal.type === 'pez' && '🐠'}
                {animal.type === 'anfibio' && '🐸'}
                {animal.type === 'invertebrado' && '🦋'}
              </div>
            </div>

            <div className="mb-3">
              <span
                className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: animalTypes[animal.type].color + '20',
                  color: animalTypes[animal.type].color
                }}
              >
                {animalTypes[animal.type].name}
              </span>
            </div>

            <p className="text-gray-600 text-sm">{animal.description}</p>

            {selectedAnimal?.name === animal.name && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Características:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Tipo: {animalTypes[animal.type].name}</li>
                  <li>• Hábitat: {
                    animal.type === 'pez' ? 'Agua' :
                    animal.type === 'ave' ? 'Aire/Tierra' :
                    animal.type === 'anfibio' ? 'Agua/Tierra' :
                    'Tierra'
                  }</li>
                  <li>• Reproducción: {
                    animal.type === 'mamifero' ? 'Vivíparo' :
                    animal.type === 'ave' || animal.type === 'reptil' ? 'Ovíparo' :
                    'Varía según especie'
                  }</li>
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Clasificación Biológica</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Características principales:</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• <strong>Mamíferos:</strong> Pelo, glándulas mamarias, sangre caliente</li>
              <li>• <strong>Aves:</strong> Plumas, alas, pico córneo</li>
              <li>• <strong>Reptiles:</strong> Escamas, huevos amnióticos, sangre fría</li>
              <li>• <strong>Peces:</strong> Aletas, branquias, sangre fría</li>
              <li>• <strong>Anfibios:</strong> Piel permeable, metamorfosis</li>
              <li>• <strong>Invertebrados:</strong> Sin columna vertebral</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Ejemplos mostrados:</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(animalTypes).map(([type, info]) => (
                <div key={type} className="flex items-center gap-2">
                  <span>{info.icon}</span>
                  <span className="text-xs">{info.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}