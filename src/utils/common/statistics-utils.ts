import _ from "lodash";

    
    
export function getStatistics(objects: object[], interval: number, field: string) {
    
    let objCnt = _.countBy(objects, e => {
      return Math.floor((e as any)[field] / interval) * interval;
    });

    return Object.entries(objCnt).map(([key, value]) => {
      let minInterval = +key;
      let maxInterval = +key + +interval - 1;
      let amount = value;
      return { minInterval: minInterval, maxInterval: maxInterval, amount: amount}
    });

}