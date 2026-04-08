export type ITariffCard = {
    name: string,
    description: string,
    pricing: {
        price: number,
        time: 'month' | 'year' | 'hour'
    },
    features: string[]
}