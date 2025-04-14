export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

export interface Category {
    id: number,
    name: string,
    imageUrl: string,
}

export interface Supplier {
    id: number,
    name: string,
    address: string,
    imageUrl: string,
}