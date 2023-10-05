import Controller from "./Controller.js";
import * as fs from "fs";

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    }
    get(rawParams = null) {

        let params = convertKeysToLowerCase(rawParams);
        let paramsLength = findNumberOfParams(rawParams);
        let response;

        console.log(params);
        switch (params.op) {
            case '':

                break;
            case undefined:
                if (paramsLength == 0) {
                    let url = './wwwroot/' + this.HttpContext.path.controllerName + '.html';
                    if (url) {
                        fs.readFile(url, (error, data) => {
                            if (error) throw error;
                            let pageHtml = Buffer.from(data).toString();
                            this.HttpContext.response.HTML(pageHtml);
                        });
                    } else {
                        this.HttpContext.response.notImplemented();
                    }
                } else {
                    this.HttpContext.response.JSON({ ...params, error: "'op' parameter is missing" });
                }
                break;
            case ' ':
                if (paramsLength == 3) {
                    response = { ...params, op: '+', value: parseInt(params.x) + parseInt(params.y) };

                } else {
                    response = { ...params, op: '+', error: 'too many parameters' };
                }
                this.HttpContext.response.JSON(response);
                break;
            case '*':
                if (paramsLength == 3) {
                    response = { ...params, op: '*', value: parseFloat(params.x) * parseFloat(params.y) };
                } else {
                    response = { ...params, op: '*', error: 'too many parameters' };
                }
                this.HttpContext.response.JSON(response);
                break;
            case '/':
                let c;
                if (paramsLength == 3) {
                    if (params.y == 0)
                        if (params.x > 0)
                            response = { ...params, value: 'Infinity' };
                        else if (params.x < 0)
                            response = { ...params, value: '-Infinity' };
                        else
                            response = { ...params, value: 'NaN' };
                    else {
                        c = parseFloat(params.x) / parseFloat(params.y);
                        response = { ...params, value: c };
                    }
                } else {
                    response = { ...params, op: '/', error: 'too many parameters' };
                }
                this.HttpContext.response.JSON(response);
                break;
            case '-':
                if (paramsLength == 3) {
                    response = { ...params, value: parseInt(params.x) - parseInt(params.y) };
                } else {
                    response = { ...params, op: '-', error: 'too many parameters' };
                }
                this.HttpContext.response.JSON(response);
                break;
            case '%':
                if (paramsLength == 3) {
                    if (params.y == 0)
                        response = { ...params, value: 'NaN' };
                    else {
                        response = { ...params, value: parseInt(params.x) % parseInt(params.y) };
                    }
                } else {
                    response = { ...params, error: 'too many parameters' }
                }
                this.HttpContext.response.JSON(response);
                break;
            case '!':
                if (paramsLength == 2) {
                    if ((parseInt(params.n) !== 0 && parseInt(params.n) !== 1) && !parseFloat(params.n)) {
                        response = { ...params, value: factorial(parseInt(params.n)) };
                    } else {
                        response = { ...params, error: 'n must be an integer > 0' };
                    }
                } else {
                    response = { ...params, error: 'too many parameters' };
                }
                this.HttpContext.response.JSON(response);
                break;
            case 'p':
                let g = parseFloat(params.n);
                let value = true;
                if (g == 1)
                    this.HttpContext.response.JSON({ ...params, value: false });
                else if (g <= 0 || isFloat(g)) {
                    value = 'n parameter must be an integer > 0';
                    this.HttpContext.response.JSON({ ...params, error: value });
                }
                else {
                    for (let x = 2; x <= parseInt(params.n); x++) {
                        if (g % x == 0 && g != x)
                            value = false
                    }
                    this.HttpContext.response.JSON({ ...params, value: value });
                }
                break;
            case 'np':
                //let h = parseInt(params.n);
                let n = parseInt(params.n);
                let valueH = findPrime(n);
                this.HttpContext.response.JSON({ ...params, value: valueH });
                break;
            default:
                break;
        }

        function factorial(n) {
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }
        function isFloat(n) {
            return Number(n) === n && n % 1 !== 0;
        }
        function isPrime(value) {
            for (var i = 2; i < value; i++) {
                if (value % i === 0) {
                    return false;
                }
            }
            return value > 1;
        }
        function findPrime(n) {
            let primeNumer = 0;
            for (let i = 0; i < n; i++) {
                primeNumer++;
                while (!isPrime(primeNumer)) {
                    primeNumer++;
                }
            }
            return primeNumer;
        }
        function convertKeysToLowerCase(n) {
            let output = {};
            for (const key in n) {
                output[key.toLocaleLowerCase()] = n[key];
            }
            return output;
        }
        function findNumberOfParams(n) {
            let compteur = 0;
            for (const key in n) {
                compteur++;
            }
            return compteur;
        }
    }
}