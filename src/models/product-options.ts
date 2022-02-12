export type ProductOption = {
    optionTitle: string,
    optionData: OptionData[]
}

export type ProductOptionConfigured = {
    optionTitle: string,
    optionData: OptionData
}

export type OptionData = {
    name: string,
    extraPay: number
}

export type EditOptionData = {
    option: ProductOption;
    index?: number;
}