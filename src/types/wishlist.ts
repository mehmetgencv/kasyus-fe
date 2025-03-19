// app/types/wishlist.ts
// app/types/wishlist.ts
export interface WishlistItemCreateRequest {
    productId: string;
    productName: string;
}

export interface WishlistItemResponse {
    id: string;
    productId: string;
    productName: string;
}