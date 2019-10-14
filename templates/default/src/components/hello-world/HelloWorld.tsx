import React from 'react';

export interface HelloWorldProps {
  name?: string;
}

function HelloWorld({ name = 'World' }: HelloWorldProps) {
  return <span>Hello {name}!</span>;
}

export default HelloWorld;
