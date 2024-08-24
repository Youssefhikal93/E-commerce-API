import { queryString } from '~/interfaces/productInterface';
import { BadRequestException } from '../middleWares.ts/errorMiddleware';


export class APIFeatures {
    private page?: number;
    private limit?: number;
    private sortBy?: 'quantity' | 'name' | 'price' | 'categoryId';
    private sortDir?: 'asc' | 'desc';
    private filterBy?: 'price' | 'quantity' | 'longDescription' | 'shortDescription' | 'name' | 'categoryId';
    private filterValue?: any;
    private filterCondition?: any;

    constructor(query: queryString) {
        this.page = +query.page! || 1;
        this.limit = +query.limit! || 10;
        this.sortBy = query.sortBy || 'price';
        this.sortDir = (query.sortDir || 'asc') as 'asc' | 'desc';
        this.filterBy = query.filterBy;
        this.filterValue = query.filterValue;
        this.filterCondition = query.filterCondition;

        this.validate();
    }

    private validate() {
        const parsedPage = +this.page!
        const parsedlimit = +this.limit!
        if (isNaN(parsedPage) || parsedPage <= 0) {
            throw new BadRequestException(`Page:${parsedPage} must be a positive number`);
        }

        if (isNaN(parsedlimit) || parsedlimit <= 0) {
            throw new BadRequestException(`Limit:${parsedlimit} must be a positive number`);
        }

        const validSortByFields = ['quantity', 'name', 'price', 'categoryId'] as const;
        if (!validSortByFields.includes(this.sortBy!)) {
            throw new BadRequestException(`Invalid sortBy value: ${this.sortBy}. Valid options are ${validSortByFields.join(', ')}`);
        }

        const validSortDirections = ['asc', 'desc'] as const;
        if (!validSortDirections.includes(this.sortDir!)) {
            throw new BadRequestException(`Invalid sortDir value: ${this.sortDir}. Valid options are 'asc' or 'desc'`);
        }

        const stringFilterConditions = ['contains', 'startsWith', 'endsWith', 'equals', 'not'] as const;
        const numericFilterConditions = ['lt', 'lte', 'gt', 'gte', 'equals', 'not'] as const;


        if (this.filterCondition && this.filterBy) {
            const validStringFields = ['name', 'longDescription', 'shortDescription'];
            const validNumericFields = ['price', 'quantity', "categoryId"];

            if (validStringFields.includes(this.filterBy) && !stringFilterConditions.includes(this.filterCondition)) {
                throw new BadRequestException(`Invalid filterCondition for string field: ${this.filterCondition}. Valid options are '${stringFilterConditions.join(', ')}'`);
            }

            if (validNumericFields.includes(this.filterBy) && !numericFilterConditions.includes(this.filterCondition)) {
                throw new BadRequestException(`Invalid filterCondition for numeric field: ${this.filterCondition}. Valid options are '${numericFilterConditions.join(', ')}'`);
            }

            const validFilterValueFields = ['price', 'quantity', 'longDescription', 'shortDescription', 'name', 'categoryId'] as const;
            if (this.filterBy && !validFilterValueFields.includes(this.filterBy)) {
                throw new BadRequestException(`Invalid filterValue value: ${this.filterBy}. Valid options are '${validFilterValueFields.join(', ')}'`);
            }


        }
    }

    public getPaginationOptions() {
        return {
            skip: (this.page! - 1) * this.limit!,
            take: this.limit,
            orderBy: {
                [this.sortBy!]: this.sortDir,
            },
        };
    }

    public getWhereClause() {
        const whereClause: any = {};

        if (this.filterBy && this.filterCondition && this.filterValue) {
            if (this.filterBy === 'price' || this.filterBy === 'quantity' || this.filterBy === 'categoryId') {
                whereClause[this.filterBy] = {
                    [this.filterCondition]: +this.filterValue,
                };
            } else {
                whereClause[this.filterBy] = {
                    [this.filterCondition]: this.filterValue,
                    mode: 'insensitive',
                };
            }
        }

        return whereClause;
    }
}