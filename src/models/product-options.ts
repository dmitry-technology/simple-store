export type ProductOptions = {
    optionTitle: string,
    optionData: OptionData[]
}

type OptionData = {
    name: string,
    extraPay: number
}

export type EditOptionData = {
    option: ProductOptions;
    index?: number;
}