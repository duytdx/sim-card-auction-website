import Compressor from "compressorjs";

export function compressImage(image, quality = 0.8) {
  return new Promise((resolve, reject) => {
    new Compressor(image, {
      quality,
      success: (result) => resolve(result),
      error: (error) => reject(error),
    });
  });
}

export function convertToBase64(image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);

    reader.readAsDataURL(image);
  });
}
