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
            case null:
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
                let f = !parseInt(params.n);
                this.HttpContext.response.JSON({ ...params, value: f });
                break;
            default:
                break;
        }

    }
}