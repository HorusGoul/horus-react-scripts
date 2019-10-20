import React from 'react';
import styles from './HelloWorld.module.scss';

export interface HelloWorldProps {
  name?: string;
}

function HelloWorld({ name = 'World' }: HelloWorldProps) {
  return <span className={styles.helloWorld}>Hello {name}!</span>;
}

export default HelloWorld;
