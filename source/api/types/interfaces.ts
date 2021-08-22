import { type } from "os";

type ErrorType = {
    status: boolean;
    message: string;
};

type StockCheck = {
    isSomeBookIsOutOfStock: boolean;
    bookName: string;
};

export type { ErrorType, StockCheck };
