import { IMAGE_DIR, dominantColor, lowResolutionPlaceholder } from '$utils/image';
import path from 'path';
const __dirname = path.resolve();
 
export const post = async (request) => {
  try {
    const { images } = request.body;
  
		const dominantColorPromises = images.map((element) => {
      const source = path.join(__dirname, IMAGE_DIR, element);
      return dominantColor({ source });
    });
  
    const placeholderPromises = images.map((element) => {
      const source = path.join(__dirname, IMAGE_DIR, element);
      return lowResolutionPlaceholder({ source });
    });
  
		const dominantColors = await Promise.all(dominantColorPromises);
    const placeholders = await Promise.all(placeholderPromises);
 
    return {
      body: JSON.stringify({ placeholders, dominantColors })
    };
  } catch (err) {
    console.log('Error: ', err);
    return {
      status: 500,
      error: 'Error retreiving data'
    };
  }
};