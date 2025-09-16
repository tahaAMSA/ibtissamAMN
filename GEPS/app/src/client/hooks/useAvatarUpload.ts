import { useState } from 'react';

// Fonction simple qui simule l'upload d'avatar
export function useAvatarUpload(options: { onSuccess?: (url: string) => void; onError?: (error: string) => void } = {}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadAvatar = async (file: File): Promise<string | null> => {
    setUploading(true);
    
    // Créer un aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      // Simuler un délai d'upload
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Créer une URL fictive pour l'avatar
      const fakeUrl = `https://example.com/avatars/${Date.now()}-${file.name}`;
      
      options.onSuccess?.(fakeUrl);
      return fakeUrl;
    } catch (error) {
      options.onError?.('Erreur lors de l\'upload');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const removePreview = () => {
    setPreview(null);
  };

  return {
    uploading,
    preview,
    uploadAvatar,
    removePreview
  };
}


