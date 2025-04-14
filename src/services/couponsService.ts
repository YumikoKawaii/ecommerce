import { Coupon } from '../types/types';

export const fetchCoupons = async (): Promise<Coupon[]> => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 500));

    return [
        { id: 1, name: 'Spring Sale', discountRate: 10, startDate: '2025-03-01', endDate: '2025-03-31' },
        { id: 2, name: 'Summer Blast', discountRate: 15, startDate: '2025-06-01', endDate: '2025-06-30' },
        { id: 3, name: 'Back to School', discountRate: 20, startDate: '2025-08-15', endDate: '2025-09-15' },
        { id: 4, name: 'Halloween Deal', discountRate: 25, startDate: '2025-10-01', endDate: '2025-10-31' },
        { id: 5, name: 'Black Friday', discountRate: 40, startDate: '2025-11-25', endDate: '2025-11-30' },
        { id: 6, name: 'Cyber Monday', discountRate: 35, startDate: '2025-12-01', endDate: '2025-12-03' },
        { id: 7, name: 'Christmas Special', discountRate: 30, startDate: '2025-12-20', endDate: '2025-12-27' },
        { id: 8, name: 'New Year Bonanza', discountRate: 20, startDate: '2025-12-31', endDate: '2026-01-05' },
        { id: 9, name: 'Valentine’s Discount', discountRate: 15, startDate: '2025-02-10', endDate: '2025-02-15' },
        { id: 10, name: 'Easter Treat', discountRate: 18, startDate: '2025-04-10', endDate: '2025-04-20' },
        { id: 11, name: 'Flash Friday', discountRate: 12, startDate: '2025-05-09', endDate: '2025-05-09' },
        { id: 12, name: 'Weekend Deal', discountRate: 10, startDate: '2025-07-05', endDate: '2025-07-06' },
        { id: 13, name: 'Birthday Bash', discountRate: 22, startDate: '2025-09-01', endDate: '2025-09-10' },
        { id: 14, name: 'Anniversary Special', discountRate: 28, startDate: '2025-04-01', endDate: '2025-04-07' },
        { id: 15, name: 'Student Discount', discountRate: 15, startDate: '2025-01-01', endDate: '2025-12-31' },
        { id: 16, name: 'First Order', discountRate: 10, startDate: '2025-01-01', endDate: '2025-12-31' },
        { id: 17, name: 'Weekend Saver', discountRate: 17, startDate: '2025-10-18', endDate: '2025-10-19' },
        { id: 18, name: 'Golden Hour', discountRate: 13, startDate: '2025-11-15', endDate: '2025-11-16' },
        { id: 19, name: 'Last Minute Deal', discountRate: 19, startDate: '2025-12-28', endDate: '2025-12-31' },
        { id: 20, name: 'Test Coupon', discountRate: 5, startDate: '2025-04-10', endDate: '2025-04-20' },
    ];
};
