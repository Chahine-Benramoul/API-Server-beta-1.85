import Controller from "./Controller.js";
import * as fs from "fs";

export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    }
    get(params = null) {
        console.log("LA CLASSE MATHS CONTROLLER ACTUEL");
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
                let b = parseInt(params.x) * parseInt(params.y);
                this.HttpContext.response.JSON({ ...params, value: b });
                break;
            case '/':
                let c = parseInt(params.x) / parseInt(params.y);
                this.HttpContext.response.JSON({ ...params, value: c });
                break;
            case '-':
                let d = parseInt(params.x) - parseInt(params.y);
                this.HttpContext.response.JSON({ ...params, value: d });
                break;
            case '%':
                let e = parseInt(params.x) % parseInt(params.y);
                this.HttpContext.response.JSON({ ...params, value: e });
                break;
            case '!':
                let f = 1;
                for (let x = 1;  x < parseInt(params.n); x++) {
                    f = f * (x+1);
                }
                this.HttpContext.response.JSON({ ...params, value: f });
                break;
            case 'p':
                let g = parseInt(params.n);
                let value = true;
                for (let x = 2;  x <= parseInt(params.n); x++) {
                    if(g % x == 0 && g != x)
                        value = false
                }
                this.HttpContext.response.JSON({ ...params, value: value });
                break;
            case 'np':
                //let h = parseInt(params.n);
                let valueH;
                let n = parseInt(params.n);
                for (let x = 1;  x <= n ; x++) {
                    for (let y = 1;  y <= x; y++) {
                        if(x % y != 0 && x != y)
                            valueH = x
                    }
                }
                this.HttpContext.response.JSON({ ...params, value: valueH });
                break;
            default:
                break;
        }

    }
}