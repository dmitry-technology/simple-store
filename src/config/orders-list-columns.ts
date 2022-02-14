export enum OrderListFields {
    id = "id",
    client = "client",
    address = "address",
    phone = "phone",
    products = "products",
    status = "status",
    date = "date",
    price = "price",
    actions = "actions"
}

export function getOrdersListFields(): Map<string, OrderListFields[]> {
    return new Map<string, OrderListFields[]>([
        ["isMobile", [
            OrderListFields.id,
            OrderListFields.client,
            OrderListFields.status,
            OrderListFields.actions
        ]],
        ["isLaptop", [
            OrderListFields.id,
            OrderListFields.client,
            OrderListFields.status,
            OrderListFields.price,
            OrderListFields.actions]],
        ["isDesktop", [
            OrderListFields.id,
            OrderListFields.client,
            OrderListFields.address,
            OrderListFields.phone,
            OrderListFields.products,
            OrderListFields.status,
            OrderListFields.date,
            OrderListFields.price,
            OrderListFields.actions]],
    ]);
}

