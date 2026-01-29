// course category interface
export interface ICourseCategory {
    id: string;
    name: string;
    status: 'Active' | 'Inactive';
    image?: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
