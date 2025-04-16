import { Coupon } from '../types/types';

export const fetchCoupons = async (): Promise<Coupon[]> => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 500));

    return [
        {
            id: 1,
            name: "Spring Sale",
            code: "SPRING20",
            discountRate: 0.20,
            startDate: "2025-03-01",
            endDate: "2025-03-31",
            productId: 1,
        },
        {
            id: 2,
            name: "Summer Bonanza",
            code: "SUMMER15",
            discountRate: 0.15,
            startDate: "2025-06-01",
            endDate: "2025-06-30",
            productId: 2,
        },
        {
            id: 3,
            name: "Winter Deal",
            code: "WINTER10",
            discountRate: 0.10,
            startDate: "2025-12-01",
            endDate: "2025-12-31",
            productId: 3,
        },
        {
            id: 4,
            name: "New User Offer",
            code: "WELCOME25",
            discountRate: 0.25,
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            productId: 4,
        },
        {
            id: 5,
            name: "Weekend Special",
            code: "WEEKEND5",
            discountRate: 0.05,
            startDate: "2025-04-05",
            endDate: "2025-04-07",
            productId: 5,
        },
        {
            id: 6,
            name: "Flash Deal",
            code: "FLASH30",
            discountRate: 0.30,
            startDate: "2025-07-15",
            endDate: "2025-07-16",
            productId: 6,
        },
        {
            id: 7,
            name: "Black Friday",
            code: "BLACK50",
            discountRate: 0.50,
            startDate: "2025-11-28",
            endDate: "2025-11-28",
            productId: 7,
        },
        {
            id: 8,
            name: "Cyber Monday",
            code: "CYBER40",
            discountRate: 0.40,
            startDate: "2025-12-01",
            endDate: "2025-12-01",
            productId: 8,
        },
        {
            id: 9,
            name: "Holiday Sale",
            code: "HOLIDAY20",
            discountRate: 0.20,
            startDate: "2025-12-20",
            endDate: "2025-12-31",
            productId: 9,
        },
        {
            id: 10,
            name: "Loyalty Bonus",
            code: "LOYAL10",
            discountRate: 0.10,
            startDate: "2025-02-01",
            endDate: "2025-12-31",
            productId: 10,
        },
        {
            id: 11,
            name: "Refer & Save",
            code: "REFER30",
            discountRate: 0.30,
            startDate: "2025-03-10",
            endDate: "2025-06-10",
            productId: 11,
        },
        {
            id: 12,
            name: "Autumn Vibes",
            code: "AUTUMN15",
            discountRate: 0.15,
            startDate: "2025-09-01",
            endDate: "2025-09-30",
            productId: 12,
        },
        {
            id: 13,
            name: "Daily Deal",
            code: "DAILY5",
            discountRate: 0.05,
            startDate: "2025-04-10",
            endDate: "2025-04-10",
            productId: 13,
        },
        {
            id: 14,
            name: "Exclusive Member",
            code: "MEMBER40",
            discountRate: 0.40,
            startDate: "2025-05-01",
            endDate: "2025-08-01",
            productId: 14,
        },
        {
            id: 15,
            name: "Limited Time",
            code: "LIMITED25",
            discountRate: 0.25,
            startDate: "2025-06-15",
            endDate: "2025-06-20",
            productId: 15,
        },
        {
            id: 16,
            name: "Festival Frenzy",
            code: "FEST20",
            discountRate: 0.20,
            startDate: "2025-10-01",
            endDate: "2025-10-10",
            productId: 16,
        },
        {
            id: 17,
            name: "Special Gift",
            code: "GIFT35",
            discountRate: 0.35,
            startDate: "2025-12-15",
            endDate: "2025-12-25",
            productId: 17,
        },
        {
            id: 18,
            name: "One Day Deal",
            code: "ONEDAY10",
            discountRate: 0.10,
            startDate: "2025-05-05",
            endDate: "2025-05-05",
            productId: 18,
        },
        {
            id: 19,
            name: "Birthday Treat",
            code: "BIRTHDAY50",
            discountRate: 0.50,
            startDate: "2025-01-01",
            endDate: "2025-12-31",
            productId: 19,
        },
        {
            id: 20,
            name: "Clearance Blowout",
            code: "CLEAR60",
            discountRate: 0.60,
            startDate: "2025-08-01",
            endDate: "2025-08-31",
            productId: 20,
        },
    ];
};
