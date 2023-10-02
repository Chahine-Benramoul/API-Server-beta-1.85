import Controller from "./Controller.js";
import * as fs from "fs";

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    }
    get(rawParams = null) {
        console.log("LA CLASSE MATHS CONTROLLER ACTUEL");
        let params = convertKeysToLowerCase(rawParams);
        if (findNumberOfParams(rawParams) > 3) {
            console.log(findNumberOfParams(rawParams));
            this.HttpContext.response.JSON({ ...params, error: 'too many parameters' });
        }
        else {
            console.log(params);
            switch (params.op) {
                case undefined:
                    let url = './wwwroot/' + this.HttpContext.path.controllerName + '.html';
                    if (url) {
                        fs.readFile(url, (error, data) => {
                            if (error) throw error;
                            let pageHtml = Buffer.from(data).toString();
                            //console.log(pageHtml);
                            this.HttpContext.response.HTML(pageHtml);
                        });
                    } else {
                        this.HttpContext.response.notImplemented();
                    }
                    break;
                case ' ':
                    let a = parseInt(params.x) + parseInt(params.y);
                    this.HttpContext.response.JSON({ ...params, op: '+', value: a });
                    break;
                case '*':
                    let b = parseFloat(params.x) * parseFloat(params.y);
                    this.HttpContext.response.JSON({ ...params, value: b });
                    break;
                case '/':
                    if (params.y == 0)
                        if (params.x > 0)
                            this.HttpContext.response.JSON({ ...params, value: 'Infinity' });
                        else if (params.x < 0)
                            this.HttpContext.response.JSON({ ...params, value: '-Infinity' });
                        else
                            this.HttpContext.response.JSON({ ...params, value: 'NaN' });
                    else {
                        let c = parseFloat(params.x) / parseFloat(params.y);
                        this.HttpContext.response.JSON({ ...params, value: c });
                    }
                    break;
                case '-':
                    let d = parseInt(params.x) - parseInt(params.y);
                    this.HttpContext.response.JSON({ ...params, value: d });
                    break;
                case '%':
                    if (params.y == 0)
                        this.HttpContext.response.JSON({ ...params, value: 'NaN' });
                    else {
                        let e = parseInt(params.x) % parseInt(params.y);
                        this.HttpContext.response.JSON({ ...params, value: e });
                    }
                    break;
                case '!':
                    let f = 1;
                    if (parseInt(params.n) !== 0 && parseInt(params.n) !== 1) {
                        f = factorial(parseInt(params.n));
                        this.HttpContext.response.JSON({ ...params, value: f });
                    } else {
                        this.HttpContext.response.JSON({ ...params, error: 'n must be an integer > 0' });
                    }
                    break;
                case 'p':
                    let g = parseInt(params.n);
                    let value = true;
                    if (isFloat(g) || g == 1)
                        value = false;
                    else if (g == 0){
                        value = 'n parameter must be an integer';
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