import {Cart} from "../types/types.ts";

export const fetchCarts = async (): Promise<Cart[]> => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 500));

    return [
        {
            id: 1,
            userId: 1,
            productId: 1,
            quantity: 2,
        },
        {
            id: 2,
            userId: 1,
            productId: 3,
            quantity: 1,
        },
        {
            id: 3,
            userId: 1,
            productId: 2,
            quantity: 3,
        },
        {
            id: 4,
            userId: 1,
            productId: 4,
            quantity: 10,
        },
    ];
};