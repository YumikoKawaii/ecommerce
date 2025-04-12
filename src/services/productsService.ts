import { Product } from '../types/types';

export const fetchProducts = async (): Promise<Product[]> => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 500));

    return [
        {
            id: '1',
            name: 'Cool Shirt',
            description: 'A very cool shirt.',
            price: 29.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '2',
            name: 'Stylish Pants',
            description: 'Look great in these pants.',
            price: 49.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '3',
            name: 'Sneakers',
            description: 'Comfortable and trendy.',
            price: 59.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
        {
            id: '4',
            name: 'Watch',
            description: 'Elegant and functional.',
            price: 199.99,
            image: 'https://via.placeholder.com/300x200',
        },
    ];
};
