import {User} from "../types/types.ts";

export const fetchUser = async (): Promise<User> => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 500));

    return {
        id: 1,
        username: "johndoe",
        imageUrl: "https://example.com/images/johndoe.jpg",
        email: "johndoe@example.com",
        phoneNumber: "+1-555-123-4567",
        address: "123 Main St, Springfield, IL 62704"
    };
};