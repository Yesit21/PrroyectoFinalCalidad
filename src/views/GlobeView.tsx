import React from 'react';
import GlobeComponent from '../components/GlobeComponent';

const GlobeView: React.FC = () => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'black'
    }}>
      <h1
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: 'white',
          zIndex: 1000,
          fontSize: '1.5rem',
          fontWeight: 'bold'
        }}
      >
        Globo Terráqueo Interactivo
      </h1>

      <GlobeComponent />
    </div>
  );
};

export default GlobeView;
