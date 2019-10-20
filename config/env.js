export function getReactAppVars() {
  const vars = {
    PUBLIC_URL: JSON.stringify(process.env.PUBLIC_URL || ''),
  };

  return Object.keys(process.env)
    .filter(name => name.startsWith('REACT_APP_'))
    .reduce((prev, key) => {
      return {
        ...prev,
        [key]: JSON.stringify(process.env[key]),
      };
    }, vars);
}
