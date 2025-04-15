import { Supplier } from '../types/types';

export const fetchSuppliers = async (): Promise<Supplier[]> => {
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 500));

    return [
        { id: 1, name: 'Alpha Supplies Co.', phoneNumber: '123-456-7890', email: 'contact@alpha.com', address: '123 Main St, New York, NY' },
        { id: 2, name: 'Bravo Wholesale', phoneNumber: '321-654-0987', email: 'sales@bravo.com', address: '456 Oak Ave, Los Angeles, CA' },
        { id: 3, name: 'Charlie Distributors', phoneNumber: '234-567-8901', email: 'info@charlie.com', address: '789 Pine Rd, Chicago, IL' },
        { id: 4, name: 'Delta Goods Ltd.', phoneNumber: '345-678-9012', email: 'support@delta.com', address: '135 Maple Blvd, Houston, TX' },
        { id: 5, name: 'Echo Traders', phoneNumber: '456-789-0123', email: 'hello@echo.com', address: '246 Birch Ln, Phoenix, AZ' },
        { id: 6, name: 'Foxtrot Suppliers', phoneNumber: '567-890-1234', email: 'orders@foxtrot.com', address: '357 Cedar Ct, Philadelphia, PA' },
        { id: 7, name: 'Golf Importers', phoneNumber: '678-901-2345', email: 'contact@golf.com', address: '468 Spruce Dr, San Antonio, TX' },
        { id: 8, name: 'Hotel Export', phoneNumber: '789-012-3456', email: 'export@hotel.com', address: '579 Walnut St, San Diego, CA' },
        { id: 9, name: 'India Supply Hub', phoneNumber: '890-123-4567', email: 'hub@india.com', address: '681 Elm Ave, Dallas, TX' },
        { id: 10, name: 'Juliet Logistics', phoneNumber: '901-234-5678', email: 'logistics@juliet.com', address: '792 Poplar Blvd, San Jose, CA' },
        { id: 11, name: 'Kilo Partners', phoneNumber: '210-987-6543', email: 'partners@kilo.com', address: '103 Chestnut St, Austin, TX' },
        { id: 12, name: 'Lima Group', phoneNumber: '321-098-7654', email: 'group@lima.com', address: '214 Ash Ave, Jacksonville, FL' },
        { id: 13, name: 'Mike Enterprises', phoneNumber: '432-109-8765', email: 'info@mike.com', address: '325 Sycamore Ln, Columbus, OH' },
        { id: 14, name: 'November Market', phoneNumber: '543-210-9876', email: 'market@november.com', address: '436 Fir Ct, Fort Worth, TX' },
        { id: 15, name: 'Oscar Supply Co.', phoneNumber: '654-321-0987', email: 'supply@oscar.com', address: '547 Redwood Dr, Charlotte, NC' },
        { id: 16, name: 'Papa Wholesalers', phoneNumber: '765-432-1098', email: 'wholesale@papa.com', address: '658 Magnolia St, San Francisco, CA' },
        { id: 17, name: 'Quebec Providers', phoneNumber: '876-543-2109', email: 'providers@quebec.com', address: '769 Dogwood Blvd, Indianapolis, IN' },
        { id: 18, name: 'Romeo Distribution', phoneNumber: '987-654-3210', email: 'distribution@romeo.com', address: '870 Palm Ave, Seattle, WA' },
        { id: 19, name: 'Sierra Logistics', phoneNumber: '198-765-4321', email: 'logistics@sierra.com', address: '981 Alder Rd, Denver, CO' },
        { id: 20, name: 'Tango Supply Chain', phoneNumber: '219-876-5432', email: 'supply@tango.com', address: '192 Beech Ln, Washington, DC' },
    ];
};
