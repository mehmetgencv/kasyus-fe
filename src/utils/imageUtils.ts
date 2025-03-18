export const minioBaseUrl = 'http://localhost:9000/kasyus-products';
export const defaultImage = '/images/empty_image_2.jpg';

export const getImageUrl = (url: string | null): string => {
    if (!url || url === 'empty_image_2.jpg') return defaultImage;
    return url.startsWith('http') ? url : `${minioBaseUrl}/${url}`;
};

export const handleImageError = (productId: number, imageId: number, setImageSources: React.Dispatch<React.SetStateAction<Record<string, string>>>) => {
    const key = `${productId}-${imageId}`;
    console.log(`Görsel yüklenemedi: ${getImageUrl(null)}, varsayılan kullanılıyor`);
    setImageSources((prev) => ({
        ...prev,
        [key]: defaultImage,
    }));
};