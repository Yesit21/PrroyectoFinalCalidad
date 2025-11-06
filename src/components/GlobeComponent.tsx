import React, { useState, useRef, useEffect } from "react";
import Globe from "react-globe.gl";

interface RegionInfo {
  lat: number;
  lng: number;
  region: string;
  info: string;
}

const GlobeComponent: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const globeRef = useRef<any>(null);

  // Datos de las regiones con información más completa
  const regions: RegionInfo[] = [
    { 
      lat: 4.570868, 
      lng: -74.297333, 
      region: 'Colombia', 
      info: 'Capital: Bogotá | Población: 52M | Continente: América del Sur | Curiosidad: Colombia es el mayor exportador de esmeraldas del mundo.' 
    },
    { 
      lat: -34.6037, 
      lng: -58.3816, 
      region: 'Argentina', 
      info: 'Capital: Buenos Aires | Población: 46M | Continente: América del Sur | Curiosidad: El tango se originó en Buenos Aires a finales del siglo XIX.' 
    },
    { 
      lat: -15.793889, 
      lng: -47.882778, 
      region: 'Brasil', 
      info: 'Capital: Brasília | Población: 214M | Continente: América del Sur | Curiosidad: Brasil tiene la mayor biodiversidad de especies animales y vegetales del planeta.' 
    },
    { 
      lat: 19.4326, 
      lng: -99.1332, 
      region: 'México', 
      info: 'Capital: Ciudad de México | Población: 126M | Continente: América del Norte | Curiosidad: México es el lugar de origen del chocolate.' 
    },
    { 
      lat: 37.9838, 
      lng: 23.7275, 
      region: 'Grecia', 
      info: 'Capital: Atenas | Población: 10.5M | Continente: Europa | Curiosidad: Grecia es la cuna de la democracia y los Juegos Olímpicos.' 
    },
    { 
      lat: 48.8566, 
      lng: 2.3522, 
      region: 'Francia', 
      info: 'Capital: París | Población: 68M | Continente: Europa | Curiosidad: La Torre Eiffel se construyó en 1889 y debía ser temporal.' 
    },
    { 
      lat: 51.1657, 
      lng: 10.4515, 
      region: 'Alemania', 
      info: 'Capital: Berlín | Población: 84M | Continente: Europa | Curiosidad: Alemania es conocida por tener más de 1,500 tipos de salchichas.' 
    },
    { 
      lat: 41.8719, 
      lng: 12.5674, 
      region: 'Italia', 
      info: 'Capital: Roma | Población: 59M | Continente: Europa | Curiosidad: Italia tiene más sitios declarados Patrimonio de la Humanidad por la UNESCO que cualquier otro país.' 
    },
    { 
      lat: 35.8617, 
      lng: 104.1954, 
      region: 'China', 
      info: 'Capital: Pekín | Población: 1.412B | Continente: Asia | Curiosidad: La Gran Muralla China tiene más de 21,000 km de longitud.' 
    },
    { 
      lat: 28.6139, 
      lng: 77.209, 
      region: 'India', 
      info: 'Capital: Nueva Delhi | Población: 1.43B | Continente: Asia | Curiosidad: India es el mayor productor mundial de películas, más que Hollywood.' 
    },
    { 
      lat: 35.6895, 
      lng: 139.6917, 
      region: 'Japón', 
      info: 'Capital: Tokio | Población: 125M | Continente: Asia | Curiosidad: Japón tiene más de 3,000 templos budistas y santuarios sintoístas.' 
    },
    { 
      lat: -25.2744, 
      lng: 133.7751, 
      region: 'Australia', 
      info: 'Capital: Canberra | Población: 26M | Continente: Oceanía | Curiosidad: Australia es hogar del animal más venenoso del mundo, la medusa Irukandji.' 
    },
    { 
      lat: 30.0444, 
      lng: 31.2357, 
      region: 'Egipto', 
      info: 'Capital: El Cairo | Población: 110M | Continente: África | Curiosidad: Las pirámides de Giza son las únicas de las 7 maravillas del mundo antiguo que todavía existen.' 
    },
    { 
      lat: -1.2921, 
      lng: 36.8219, 
      region: 'Kenia', 
      info: 'Capital: Nairobi | Población: 54M | Continente: África | Curiosidad: Kenia es famosa por sus corredores de larga distancia de élite.' 
    },
    { 
      lat: -33.9249, 
      lng: 18.4241, 
      region: 'Sudáfrica', 
      info: 'Capital: Ciudad del Cabo / Pretoria | Población: 60M | Continente: África | Curiosidad: Sudáfrica tiene tres capitales: Pretoria (administrativa), Ciudad del Cabo (legislativa), Bloemfontein (judicial).' 
    },
    { 
      lat: 55.7558, 
      lng: 37.6173, 
      region: 'Rusia', 
      info: 'Capital: Moscú | Población: 144M | Continente: Europa / Asia | Curiosidad: Rusia es el país más grande del mundo, con 17.1 millones de km².' 
    },
    { 
      lat: 38.9072, 
      lng: -77.0369, 
      region: 'Estados Unidos', 
      info: 'Capital: Washington D.C. | Población: 333M | Continente: América del Norte | Curiosidad: Estados Unidos es el país con más idiomas hablados, más de 350.' 
    },
    { 
      lat: 45.4215, 
      lng: -75.6992, 
      region: 'Canadá', 
      info: 'Capital: Ottawa | Población: 39M | Continente: América del Norte | Curiosidad: Canadá tiene más lagos que cualquier otro país, más de 31,000.' 
    },
    { 
      lat: -40.9006, 
      lng: 174.886, 
      region: 'Nueva Zelanda', 
      info: 'Capital: Wellington | Población: 5.1M | Continente: Oceanía | Curiosidad: Nueva Zelanda fue el primer país en permitir el voto femenino en 1893.' 
    },
    { 
      lat: 59.3293, 
      lng: 18.0686, 
      region: 'Suecia', 
      info: 'Capital: Estocolmo | Población: 10.6M | Continente: Europa | Curiosidad: Suecia es conocida por su sistema educativo gratuito y de alta calidad.' 
    },
  ];

  // Efecto para animar la rotación del globo
  useEffect(() => {
    if (!globeRef.current) return;
    const globe = globeRef.current;
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.4;
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,1)"
        pointsData={regions}
        pointLat={(d: RegionInfo) => d.lat}
        pointLng={(d: RegionInfo) => d.lng}
        pointColor={() => "orange"}
        pointAltitude={0.02}
        pointRadius={0.6}
        onPointClick={(point: RegionInfo) => setSelectedRegion(point.region)}
        showAtmosphere={true}
        atmosphereColor="lightskyblue"
        atmosphereAltitude={0.2}
      />

      {selectedRegion && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: 1000,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "12px 18px",
            borderRadius: "10px",
            maxWidth: "250px",
          }}
        >
          <h3 style={{ marginTop: 0, fontSize: "1.1rem" }}>Región seleccionada:</h3>
          <p style={{ margin: "5px 0" }}>
            <strong>{selectedRegion}</strong>
          </p>
          <p style={{ margin: "5px 0" }}>
            {regions.find((r) => r.region === selectedRegion)?.info}
          </p>
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;