const http=require('http');
const { resolveSoa}=require('dns');
const {error } =require('console');
const { exit} =require('process');
const {v4:uuidv4}=require('uuid');
const errorHandle =require('./errorHandle');
const todos =[];

const requestlistener = (req,res)=>{
    const header={
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    var urlRoute =req.url.split('/');
    let body = "";
    req.on('data',chunk=>{
        body+=chunk;
    })
    let successResult={
        "status":"success",
        "data":[]
    }
    if (urlRoute[1]=='todos') {
        switch (req.method) {
            case "GET":
                SetDataSuccessRespond(res, header, successResult);
                return;
            case "POST":
                req.on('end',()=>{
                    try {
                        const title =JSON.parse(body).title;
                        if(title){
                            const todo ={
                                "title":title,
                                "id":uuidv4()
                            }   
                            todos.push(todo);
                        }
                        res.writeHead(200, header);
                        successResult.data = todos;
                        res.write(JSON.stringify(successResult));
                        res.end();
                        return;
                    } catch (error) {
                        errorHandle(res,400,"欄位未填寫正確");
                        return;
                    }
                })
                return;
            case "PATCH":
                req.on('end',()=>{
                    try {
                        const title =JSON.parse(body).title;
                        const id =urlRoute[2];
                        const index = todos.findIndex(element=>element.id == id);
                        if (title && index != -1 ){
                            todos[index].title=title;
                            SetDataSuccessRespond(res, header, successResult);
                            return;
                        } 
                        errorHandle(res,400,"欄位未填寫正確 或 id不存在")
                        return;
                    } catch (error) {
                        errorHandle(res,400,"欄位未填寫正確");
                    }
                    return;
                })
            case "DELETE":
                if(urlRoute[2]){
                    res.on('end',()=>{
                        const id =urlRoute[2];
                        const index =todos.findIndex(element=>element.id==id);
                        if (index !=-1) {
                            todos.splice(index,1);
                            SetDataSuccessRespond(res, header, successResult);
                            return;
                        }
                        errorHandle(res,400,"id不存在");
                        return;
                    })                  
                }

                todos.length=0;
                SetDataSuccessRespond(res, header, successResult);
                return;
        }
    }

    if (req.method =='Option'){
        res.writeHead(200,header);
        res.end();
        return;   
    }

    errorHandle(res,404,"無此網路路由");
    /**
     * 錯誤處理
     * @param {*} res 
     * @param {*} httpCode 
     * @param {*} message 
     */

}

const server =http.createServer(requestlistener);
server.listen(3005);

function SetDataSuccessRespond(res, header, successResult) {
    res.writeHead(200, header);
    successResult.data = todos;
    res.write(JSON.stringify(successResult));
    res.end();
}

