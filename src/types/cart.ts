export interface CartItemDto {
    productId: number;
    quantity: number;
    price: string;
    name?: string;
    coverImageUrl?: string | null;
}

export interface CartData {
    items: CartItemDto[];
    totalPrice: string;
}