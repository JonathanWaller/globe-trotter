import React from 'react';
import './App.css';

import styled from 'styled-components';

// import WorldMapAtlas from './components/WorldMapAtlast';
import WorldMap from './components/WorldMap';

const App = () => {

  const Container = styled.div`
    background-color: #ffffff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  `

  return(
    <div>
      <Container>
        <WorldMap />
      </Container>
    </div>
  )
}

export default App;
