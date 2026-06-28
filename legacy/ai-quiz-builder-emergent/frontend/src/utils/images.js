// Image helper using Unsplash API
export async function getImageForKeyword(keyword) {
  try {
    // Using Unsplash Source API (no key needed for basic usage)
    return `https://source.unsplash.com/400x300/?${encodeURIComponent(keyword)},cartoon,children,colorful`;
  } catch (error) {
    console.error('Error fetching image:', error);
    // Fallback to placeholder
    return `https://via.placeholder.com/400x300/9333EA/FFFFFF?text=${encodeURIComponent(keyword)}`;
  }
}

// Get multiple images for a list of keywords
export async function getImagesForKeywords(keywords) {
  const promises = keywords.map(keyword => getImageForKeyword(keyword));
  return Promise.all(promises);
}

// Get kid-friendly illustrations
export function getIllustration(topic) {
  const illustrations = {
    'cat': 'https://source.unsplash.com/400x300/?cat,cute,cartoon',
    'dog': 'https://source.unsplash.com/400x300/?dog,cute,puppy',
    'bird': 'https://source.unsplash.com/400x300/?bird,colorful',
    'fish': 'https://source.unsplash.com/400x300/?fish,aquarium,colorful',
    'rabbit': 'https://source.unsplash.com/400x300/?rabbit,cute,bunny',
    'apple': 'https://source.unsplash.com/400x300/?apple,fruit,red',
    'banana': 'https://source.unsplash.com/400x300/?banana,fruit,yellow',
    'orange': 'https://source.unsplash.com/400x300/?orange,fruit',
    'red': 'https://source.unsplash.com/400x300/?red,color,bright',
    'blue': 'https://source.unsplash.com/400x300/?blue,sky,ocean',
    'green': 'https://source.unsplash.com/400x300/?green,grass,nature',
    'yellow': 'https://source.unsplash.com/400x300/?yellow,sun,bright',
    'happy': 'https://source.unsplash.com/400x300/?happy,smile,child',
    'sad': 'https://source.unsplash.com/400x300/?sad,emotion',
    'family': 'https://source.unsplash.com/400x300/?family,together,happy',
    'school': 'https://source.unsplash.com/400x300/?school,classroom,children',
    'default': 'https://source.unsplash.com/400x300/?education,colorful,children'
  };
  
  return illustrations[topic.toLowerCase()] || illustrations['default'];
}
