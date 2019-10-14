type SvgrComponent = React.FC<React.SVGAttributes<SVGElement>>;

declare module '*.svg' {
  const value: string;
  export const ReactComponent: SvgrComponent;
  export default value;
}
