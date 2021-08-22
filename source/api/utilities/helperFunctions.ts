export const trimObject = (obj: any) => {
    Object.keys(obj).forEach((key) => {
        // Allow true, false and off course 0
        if (obj[key] !== true && obj[key] !== false && obj[key] !== 0) {
            if (
                obj[key] == null ||
                obj[key] == undefined ||
                obj[key] == "" ||
                obj[key] == {} ||
                obj[key] == []
            ) {
                delete obj[key];
            }
        }
    });
    for (const key in obj) {
        obj[key] =
            typeof obj[key] == "string" ? obj?.[key]?.trim() : obj?.[key];
    }
    return obj;
};

export function getRandomOrderNumber(
    min: number = 100000,
    max: number = 10000000
): number {
    return Math.floor(Math.random() * (max - min)) + min;
}
export const getAverageReview = (reviews: number[]): number => {
    const sum = reviews.reduce((total, current) => total + current, 0);
    const num = reviews.length;
    return sum / num;
};
