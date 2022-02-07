
export function getRandomInteger(min:number, max:number) {
    if (min > max) {
        [min, max] = [max, min];
    }
    return Math.round(Math.random() * (max - min) + min);
}
export function getRandomElement<T>(array: T[]) {
    if (!Array.isArray(array) || array.length === 0) {
        throw Error();
    }
    return array[getRandomInteger(0, array.length - 1)];
}
export function getRandomDate(minYear:number, maxYear:number) {
    let date1 = `01-01-${minYear}`;
    let date2 = `12-31-${maxYear}`;
    let newDate1 = new Date(date1).getTime();
    let newDate2 = new Date(date2).getTime();
    if (date1 > date2) {
        return new Date(getRandomInteger(newDate2, newDate1));
    } else {
        return new Date(getRandomInteger(newDate1, newDate2));
    }
}