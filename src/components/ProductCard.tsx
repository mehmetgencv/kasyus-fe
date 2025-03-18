'use client';

import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getImageUrl, handleImageError, defaultImage } from '@/utils/imageUtils';
import { defaultSliderSettings } from '@/utils/sliderSettings';
import { ProductDto } from '@/types/product';

interface ProductCardProps {
    product: ProductDto;
    imageSources: Record<string, string>;
    setImageSources: React.Dispatch<React.SetStateAction<Record<string, string>>>;
    onAddToCart: (productId: number, price: number) => void;
}

export default function ProductCard({ product, imageSources, setImageSources, onAddToCart }: ProductCardProps) {

    const allImages = [
        { id: 0, imageUrl: product.coverImageUrl || defaultImage },
        ...product.imageUrls,
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-semibold text-orange-800 mb-2">{product.name}</h2>
            <p
                className="text-gray-600 mb-2 cursor-pointer"
                onClick={() => (window.location.href = `/products/${product.id}`)}
            >
                High-quality {product.name.toLowerCase()} for your needs.
            </p>
            <p className="text-orange-600 font-bold mb-4">{product.price.toFixed(2)} TL</p>

            <div
                className="relative h-48 mb-4 cursor-pointer"
                onClick={() => (window.location.href = `/products/${product.id}`)}
            >
                <Slider {...defaultSliderSettings}>
                    {allImages.map((image) => {
                        const imageKey = `${product.id}-${image.id}`;
                        const imgSrc = imageSources[imageKey] || getImageUrl(image.imageUrl) || defaultImage;

                        return (
                            <div key={image.id} className="relative w-full h-48">
                                <Image
                                    src={imgSrc}
                                    alt={`${product.name} - ${image.id}`}
                                    fill
                                    className="object-cover rounded-lg"
                                    onError={() => handleImageError(product.id, image.id, setImageSources)}
                                />
                            </div>
                        );
                    })}
                </Slider>
            </div>

            <button
                onClick={() => onAddToCart(product.id, product.price)}
                className="block w-full text-center bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
            >
                Sepete Ekle
            </button>
        </div>
    );
}