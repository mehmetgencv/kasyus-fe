export interface ImageDto {
    id: number;
    imageUrl: string;
}

export interface ProductDto {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    productType: string;
    sellerId: number;
    sku: string;
    coverImageUrl: string | null;
    imageUrls: ImageDto[];
}