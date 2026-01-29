// article category interface
export interface IArticleCategory {
    id: string;
    name: string;
    description: string;
    status: 'Active' | 'Inactive';
    image?: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
