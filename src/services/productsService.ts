import { Product } from '../types/types';

export const fetchProducts = async (): Promise<Product[]> => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 500));

    return [
        { id: '1', name: 'Cool Shirt', description: 'A very cool shirt.', price: 29.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '2', name: 'Trendy Pants', description: 'Stylish and comfortable.', price: 49.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '3', name: 'Sporty Sneakers', description: 'Perfect for running.', price: 89.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '4', name: 'Classic Jacket', description: 'Timeless fashion.', price: 99.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '5', name: 'Denim Jeans', description: 'Everyday wear.', price: 59.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '6', name: 'Baseball Cap', description: 'Cool and casual.', price: 19.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '7', name: 'Leather Belt', description: 'Stylish accessory.', price: 24.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '8', name: 'Wool Sweater', description: 'Warm and cozy.', price: 74.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '9', name: 'Graphic Tee', description: 'Trendy designs.', price: 22.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '10', name: 'Running Shorts', description: 'Lightweight and cool.', price: 27.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '11', name: 'Stylish Scarf', description: 'Elegant and warm.', price: 34.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '12', name: 'Rain Jacket', description: 'Stay dry in style.', price: 89.49, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '13', name: 'Canvas Backpack', description: 'Perfect for travel.', price: 65.00, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '14', name: 'Comfy Hoodie', description: 'Casual and warm.', price: 44.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '15', name: 'Flip Flops', description: 'Beach essentials.', price: 15.49, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '16', name: 'Workout Tank', description: 'Breathe easy.', price: 21.00, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '17', name: 'Formal Shirt', description: 'Office-ready.', price: 55.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '18', name: 'Slim Fit Blazer', description: 'Sharp and sleek.', price: 120.00, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '19', name: 'Winter Gloves', description: 'Keep hands warm.', price: 18.75, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
        { id: '20', name: 'Cotton Socks', description: 'Everyday comfort.', price: 9.99, image: 'https://cdn.pnj.io/images/thumbnails/300/300/detailed/205/sp-wse00000202-dong-ho-seiko-prospex-nam-ssc935p-day-kim-loai-41-mm-1.png' },
    ];
};
