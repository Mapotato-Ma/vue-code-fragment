declare module 'postprocessing' {
  interface ImageData {
    new (width?: number, height?: number, data?: Uint8ClampedArray): ImageData;
    data: Uint8ClampedArray;
  }
}
