export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  appName: import.meta.env.VITE_APP_NAME || 'Lady B Designs and Handcraft',
  tagline: import.meta.env.VITE_APP_TAGLINE || 'Wearable Art, Crafted by Hand',
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
  cloudinaryCloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
  cloudinaryUploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '',
  defaultCurrency: import.meta.env.VITE_DEFAULT_CURRENCY || 'USD',
  brand: {
    email: 'Adebiyiblessing55@gmail.com',
    phone: '+1 (317) 333-1333',
    address: '731 Westbury West Dr, Indianapolis, IN 46224, USA',
    social: {
      instagram: 'https://instagram.com/ladybdesigns',
      facebook: 'https://facebook.com/ladybdesigns',
      pinterest: 'https://pinterest.com/ladybdesigns',
    },
  },
} as const;
