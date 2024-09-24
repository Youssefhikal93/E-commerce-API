export interface ReviewBodyUpdate {
    rating: number,
    comment: string
}

export interface ReviewBodyCreate extends ReviewBodyUpdate {
    productId: number,

}

