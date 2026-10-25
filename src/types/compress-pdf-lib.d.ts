
declare module "compress-pdf-lib" {
  export function compressPDF(
    file: File,
    options?: {
      quality?: number;
      scale?: number;
    }
  ): Promise<{
    file: File;
  }>;
}
