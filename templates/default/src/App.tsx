import React from 'react';
import HelloWorld from './components/hello-world';
import { hot } from 'react-hot-loader/root';

function App() {
  return <HelloWorld name="World" />;
}

export default hot(App);
