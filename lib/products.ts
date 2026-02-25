export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
}

export const PRODUCTS: Product[] = [
  {
    id: 'analisi-lampo',
    name: 'Analisi Lampo',
    description: 'La radiografia veloce della tua impresa digitale',
    priceInCents: 14700, // €147.00
  },
  {
    id: 'diagnosi-strategica',
    name: 'Diagnosi Strategica',
    description: 'Analisi approfondita e roadmap per la crescita digitale',
    priceInCents: 49700, // €497.00
  },
]
