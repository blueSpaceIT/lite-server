const createPurchaseID = (prefix: string) => {
    // prefix 'ODR' => Order
    // prefix 'PCS' => Purchase
    return prefix + String(Math.round(Math.random() * 9999999999));
};

export default createPurchaseID;
