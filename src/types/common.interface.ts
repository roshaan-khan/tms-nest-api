export interface IContext {
    offset: number;
    page: number;
}

export enum eS3AssetsFolder {
    DESIGNS = "designs",
    STOCKS = "stocks",
    USER_PROFILE = "user_profile",
}