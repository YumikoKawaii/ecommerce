import { Category } from '../types/types';

export const fetchCategories = async (): Promise<Category[]> => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 500));

    return [
        {
            id: 1,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Electronics',
            description: 'Devices, gadgets and home electronics.',
        },
        {
            id: 2,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Books',
            description: 'Explore a wide range of books across genres.',
        },
        {
            id: 3,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Clothing',
            description: 'Fashionable and comfortable clothing for all.',
        },
        {
            id: 4,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Home Decor',
            description: 'Modern and rustic decor for your home.',
        },
        {
            id: 5,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Toys',
            description: 'Toys and games for kids of all ages.',
        },
        {
            id: 6,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Kitchenware',
            description: 'Cooking tools, appliances, and utensils.',
        },
        {
            id: 7,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Fitness',
            description: 'Fitness equipment and accessories.',
        },
        {
            id: 8,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Beauty',
            description: 'Skincare, cosmetics, and grooming products.',
        },
        {
            id: 9,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Automotive',
            description: 'Car accessories, tools and parts.',
        },
        {
            id: 10,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Garden',
            description: 'Gardening tools and outdoor furniture.',
        },
        {
            id: 11,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Pet Supplies',
            description: 'Everything your furry friends need.',
        },
        {
            id: 12,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Office Supplies',
            description: 'Stationery, organizers and office tools.',
        },
        {
            id: 13,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Gaming',
            description: 'Consoles, games and accessories.',
        },
        {
            id: 14,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Footwear',
            description: 'Shoes and sandals for every occasion.',
        },
        {
            id: 15,
            imageUrl: 'https://res.cloudinary.com/dyc4xxmdw/image/upload/v1744778766/bamboo.png',
            name: 'Art & Crafts',
            description: 'Creative supplies for DIY projects.',
        },
    ];
};
