export type TErrorMessages = {
    path: string | number;
    message: string;
}[];

export type TErrorResponse = {
    status: number;
    message: string;
    errorMessages: TErrorMessages;
};
