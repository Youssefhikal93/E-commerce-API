export interface ProductBody {
    name: string,
    longDescription: string,
    shortDescription: string,
    main_image: string,
    // categoryId: number,
    // quantity: number,
    // price: number,
    categoryId: string,
    quantity: string,
    price: string,
    shopId: number
}


export interface queryString {
    page?: number,
    limit?: number,
    sortBy?: 'quantity' | 'name' | 'price' | 'categoryId',
    sortDir?: 'asc' | 'desc',
    filterCondition?: any
    filterBy?: 'price' | 'quantity' | 'longDescription' | 'shortDescription' | 'name' | 'categoryId'
    filterValue?: any
}

interface NumericFilterConditions {
    numericFilterConditions?: 'lt' | 'lte' | 'gt' | 'gte' | 'not' | 'equals'

}
interface StringFilterConditions {
    stringFilterConditions?: "contains" | 'startsWith' | 'endsWith' | 'not' | 'equals'
}