export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
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
    discountRate: number,
    startDate: string,
    endDate: string,
}