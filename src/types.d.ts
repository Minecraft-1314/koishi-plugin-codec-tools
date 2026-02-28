declare module 'jimp' {
  const Jimp: any;
  export default Jimp;
}

declare module 'jsqr' {
  function jsQR(data: Uint8ClampedArray, width: number, height: number): { data: string } | null;
  export default jsQR;
}

declare module '@zxing/library' {
  export class MultiFormatReader {
    decode(bitmap: any, hints: Map<any, any>): { text: string };
  }
  export const BarcodeFormat: {
    QR_CODE: any;
    CODE_128: any;
    EAN_13: any;
    EAN_8: any;
    UPC_A: any;
    UPC_E: any;
    CODE_39: any;
    ITF: any;
  };
  export const DecodeHintType: {
    POSSIBLE_FORMATS: any;
  };
  export class RGBLuminanceSource {
    constructor(data: Uint8ClampedArray, width: number, height: number);
  }
  export class BinaryBitmap {
    constructor(binarizer: any);
  }
  export class HybridBinarizer {
    constructor(source: RGBLuminanceSource);
  }
}