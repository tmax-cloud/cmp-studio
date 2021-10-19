/* eslint-disable  @typescript-eslint/ban-types */
declare module 'viz.js/full.render.js' {
  export function Module(): any;
  export function render(instance: any, src: string, options: object): string;
}
