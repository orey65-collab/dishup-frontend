/**
 * Simple image resize using canvas - no complex compression
 * @param {string} base64Image - Base64 encoded image (with or without data URL prefix)
 * @param {number} maxWidth - Maximum width (default 1920)
 * @param {number} maxHeight - Maximum height (default 1080)
 * @returns {Promise<string>} Resized base64 image without prefix
 */
export async function resizeImage(base64Image, maxWidth = 1920, maxHeight = 1080) {
  return new Promise((resolve, reject) => {
    try {
      // Extract base64 data
      const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
      
      // Get MIME type, default to image/jpeg if octet-stream or unknown
      let mimeType = 'image/jpeg';
      if (base64Image.includes(',')) {
        const dataUrlPrefix = base64Image.split(',')[0];
        const extractedMime = dataUrlPrefix.split(':')[1].split(';')[0].toLowerCase();
        
        // If octet-stream or unknown, treat as JPEG
        if (extractedMime !== 'application/octet-stream' && extractedMime.startsWith('image/')) {
          mimeType = extractedMime;
        }
      }
      
      console.log(`Resizing image, MIME type: ${mimeType}`);
      
      // Check if HEIC (not supported)
      if (mimeType.toLowerCase().includes('heic') || mimeType.toLowerCase().includes('heif')) {
        reject(new Error('HEIC_NOT_SUPPORTED'));
        return;
      }
      
      // Create image element
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions
          let width = img.width;
          let height = img.height;
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
            console.log(`Image resized from ${img.width}x${img.height} to ${width}x${height}`);
          } else {
            console.log(`Image size OK: ${width}x${height}, no resize needed`);
          }
          
          // Create canvas and draw resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to JPEG with good quality (0.85)
          const resized = canvas.toDataURL('image/jpeg', 0.85);
          
          // Remove data URL prefix
          const result = resized.split(',')[1];
          
          const sizeKB = (result.length * 0.75 / 1024).toFixed(2);
          console.log(`Final image size: ${sizeKB}KB`);
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = `data:${mimeType};base64,${base64Data}`;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Check if file type is supported
 * @param {string} base64Image - Base64 encoded image with data URL prefix
 * @returns {boolean} True if supported
 */
export function isSupportedImageType(base64Image) {
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!base64Image.includes(',')) return true; // Assume supported if no prefix
  
  const mimeType = base64Image.split(',')[0].split(':')[1].split(';')[0].toLowerCase();
  
  // Treat octet-stream as supported (will be converted to JPEG)
  if (mimeType === 'application/octet-stream') return true;
  
  return supportedTypes.includes(mimeType);
}

/**
 * Get readable file type from base64
 * @param {string} base64Image - Base64 encoded image with data URL prefix
 * @returns {string} File type (e.g., "JPEG", "PNG", "HEIC")
 */
export function getImageType(base64Image) {
  if (!base64Image.includes(',')) return 'JPEG'; // Default to JPEG
  
  const mimeType = base64Image.split(',')[0].split(':')[1].split(';')[0].toLowerCase();
  
  // Treat octet-stream as JPEG (will be converted)
  if (mimeType === 'application/octet-stream') return 'JPEG';
  
  if (mimeType.includes('jpeg') || mimeType.includes('jpg')) return 'JPEG';
  if (mimeType.includes('png')) return 'PNG';
  if (mimeType.includes('webp')) return 'WebP';
  if (mimeType.includes('heic') || mimeType.includes('heif')) return 'HEIC';
  
  return 'JPEG'; // Default to JPEG for unknown types
}
