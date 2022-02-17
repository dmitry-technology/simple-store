export enum ProductListFields {
    id = "id",
    title = "title",
    category = "categoty",
    picture = "picture",
    description = "description",
    basePrice =  "basePrice",
    options = "options",
    active = "active",
    actions = "actions"
    
}



export function getProductsListFields(): Map<string, ProductListFields[]> {
    return new Map<string, ProductListFields[]>([
        ["isMobile", [
            ProductListFields.id,
            ProductListFields.title,
            ProductListFields.actions,
        ]],
        ["isLaptop", [
            ProductListFields.id,
            ProductListFields.title,
            ProductListFields.category,
            ProductListFields.picture,
            ProductListFields.description,
            ProductListFields.actions
        ]],
        ["isDesktop", [
            ProductListFields.id,
            ProductListFields.title,
            ProductListFields.category,
            ProductListFields.picture,
            ProductListFields.description,
            ProductListFields.basePrice,
            ProductListFields.options,
            ProductListFields.active,
            ProductListFields.actions]],
    ]);
}
