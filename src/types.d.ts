declare module 'jimp' {
  const Jimp: {
    read(path: string): Promise<Jimp>
    read(buffer: Buffer): Promise<Jimp>
    prototype: Jimp
  }
  interface Jimp {
    bitmap: { data: Buffer; width: number; height: number }
    getWidth(): number
    getHeight(): number
    resize(w: number, h: number): Jimp
    greyscale(): Jimp
    threshold(opts: { max: number; replace?: number; autoGreyscale?: boolean }): Jimp
    contrast(val: number): Jimp
    brightness(val: number): Jimp
    clone(): Jimp
  }
  export default Jimp
}

declare module 'jsqr' {
  interface QRCode {
    data: string
    binaryData: Uint8ClampedArray
    location: {
      topLeftCorner: { x: number; y: number }
      topRightCorner: { x: number; y: number }
      bottomLeftCorner: { x: number; y: number }
      bottomRightCorner: { x: number; y: number }
    }
    version: number
  }
  function jsQR(data: Uint8ClampedArray, width: number, height: number): QRCode | null
  export default jsQR
}

declare module '@zxing/library' {
  export class MultiFormatReader {
    decode(bitmap: BinaryBitmap, hints?: Map<DecodeHintType, unknown>): { text: string }
  }
  export const BarcodeFormat: {
    QR_CODE: unknown
    CODE_128: unknown
    EAN_13: unknown
    EAN_8: unknown
    UPC_A: unknown
    UPC_E: unknown
    CODE_39: unknown
    ITF: unknown
  }
  export const DecodeHintType: {
    POSSIBLE_FORMATS: unknown
  }
  export class RGBLuminanceSource {
    constructor(data: Uint8ClampedArray, width: number, height: number)
  }
  export class BinaryBitmap {
    constructor(binarizer: HybridBinarizer)
  }
  export class HybridBinarizer {
    constructor(source: RGBLuminanceSource)
  }
}
