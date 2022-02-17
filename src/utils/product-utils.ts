import { emptyProduct, Product } from "../models/product";
import { OptionData, ProductOption } from "../models/product-options";

export async function getProductsFromCSV(file: File): Promise<Product[]> {
    const strArr = await getStrArrFromFile(file!);
    const headers = strArr[0].split(';');

    const products: any[] = [];

    const corruptedLines: number[] = [];

    for (let i = 1; i < strArr.length; i++) {
        const prodFieldsArr = strArr[i].split(';');
        if (prodFieldsArr.length === headers.length) {
            const rawProd: any = {};
            for (let j = 0; j < prodFieldsArr.length; j++) {
                rawProd[headers[j]] = prodFieldsArr[j];
            }
            rawProd.basePrice = +rawProd.basePrice;
            rawProd.active = rawProd.active === 'true' ? true : false;
            const optionsStr = rawProd.options;
            if (optionsStr) {
                rawProd.options = strToOptions(optionsStr);
            }
            products.push(rawProd);
        } else {
            corruptedLines.push(i + 1);
        }
    }
    return products as Product[];
}

export function downloadProductsCsv(fileName: string, products: Product[]) {
    const header = `${getHeaderArr().join(';')}\r\n`;
    const productsCsv = productsToCsv(products);
    var universalBOM = "\uFEFF";
    const data = encodeURIComponent(universalBOM + header + productsCsv)
    let a = document.createElement("a");
    a.href = 'data:text/csv; charset=utf-8,' + data;
    a.download = fileName.replaceAll(/[\s]/g, '-');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function getStrArrFromFile(file: File): Promise<string[]> {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            if (reader.result) {
                const rawStr = reader.result.toString();
                const clearStr = rawStr.replaceAll(/[\r"]/g, '');
                const strArr = clearStr.split('\n').filter(s => s.length > 0);
                if (strArr.length < 2) {
                    reject('empty file');
                }
                resolve(strArr);
            } else {
                reject('error reading file')
            }
        }
    });
}

function strToOptions(str: string): ProductOption[] {
    if (str.length > 0) {
        const strArr = str.split('|').filter(s => s.length > 0);
        const options: ProductOption[] = [];
        strArr.forEach(s => {
            const rawOption = s.split(':');
            if (rawOption.length === 2) {
                const optionName: string = rawOption[0];
                const rawOptionItems = rawOption[1].split(',');
                const optionData: OptionData[] = [];
                if (rawOptionItems.length >= 1) {
                    rawOptionItems.forEach(item => {
                        const rawOptionData = item.split('=');
                        if (rawOptionData.length === 2) {
                            optionData.push({ name: rawOptionData[0], extraPay: +rawOptionData[1] });
                        } else {
                            throw new Error(`corupted option item`);
                        }
                    });
                    options.push({ optionTitle: optionName, optionData });
                } else {
                    throw new Error(`Number of option items must be 1 or more, you have - ${rawOptionItems.length}`);
                }
            } else {
                throw new Error('option from csv file is corupted');
            }
        });
        return (options);
    }
    throw new Error('string for options is empty');
}

function getHeaderArr() {
    let product: any = { ...emptyProduct };
    delete product.category;
    return Object.keys(product);
}

function productsToCsv(products: Product[]) {
    const headerArr = getHeaderArr();
    let productsArr = [...products];
    const productsCsv = productsArr.map((p: any) => {
        let fieldsArr: any[] = [];
        headerArr.forEach(h => {
            if (h === 'options') {
                fieldsArr.push(optionsToCsv(p[h]));
            } else {
                fieldsArr.push(p[h]);
            }
        });
        return fieldsArr.join(';');
    });
    return productsCsv.join('\r\n');
}

function optionsToCsv(option: ProductOption[]) {
    return option.map(option => {
        const optionItems = option.optionData.map(opItem => `${opItem.name}=${opItem.extraPay}`);
        return `${option.optionTitle}:${optionItems.join(',')}`
    }).join('|');
}