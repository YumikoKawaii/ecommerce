import { Category } from '../types/types';

export const fetchCategories = async (): Promise<Category[]> => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 500));

    return [
        {
            id: 1,
            name: "Living Room",
            imageUrl: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGl2aW5nJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
            description: "Some desc about living room",
        },
        {
            id: 2,
            name: "Bedroom",
            imageUrl: "https://hips.hearstapps.com/hmg-prod/images/barfield-house-tour-gramercy-park-bedroom-jpg-1618419012.jpg?crop=0.668xw:1.00xh;0.167xw,0&resize=1200:*",
            description: "Some desc about bedroom",
        },
        {
            id: 3,
            name: "Kitchen",
            imageUrl: "https://media.houseandgarden.co.uk/photos/67ddc624be78bcf26cfc17ad/master/w_1600%2Cc_limit/edit-24.09.10_JESSICA_SUMMER_005.jpg",
            description: "Some desc about kitchen",
        },
        {
            id: 4,
            name: "Workplace",
            imageUrl: "https://convene.com/wp-content/uploads/2024/11/HEADER-IMAGE.png",
            description: "Some desc about workplace",
        },
    ];
};
