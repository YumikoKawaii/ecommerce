export interface Product {
    id: number;
    name: string;
    imageUrl: string,
    description: string;
    price: number;
    stock: number;
    categoryId: number;
    supplierId: number;
}

export interface Category {
    id: number,
    imageUrl: string,
    name: string,
    description: string,
}

export interface Supplier {
    id: number,
    name: string,
    phoneNumber: string,
    email: string,
    address: string,
}

export interface Coupon {
    id: number,
    name: string,
    code: string,
    productId: number,
    discountRate: number,
    startDate: string,
    endDate: string,
}

export interface User {
    id: number,
    username: string,
    imageUrl: string,
    email: string,
    phoneNumber: string,
    address: string,
}