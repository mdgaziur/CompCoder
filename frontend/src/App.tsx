import React from 'react';
import * as Chakra from '@chakra-ui/react';
import { Header } from './Components/Header';
import { Route } from 'react-router-dom';

function App() {
  return (
    <Chakra.Container>
      <Header/>
      <Route path="/about">
        <h1>Hello world!</h1>
      </Route>
    </Chakra.Container>
  );
}

export default App;
