export type ITariffCard = {
    name: string,
    description: string,
    pricing: {
        price: number,
        time: string
    },
    features: string[]
}