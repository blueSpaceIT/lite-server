export interface INewsCategory {
    id: string;
    name: string;
    status: 'Active' | 'Inactive';
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
