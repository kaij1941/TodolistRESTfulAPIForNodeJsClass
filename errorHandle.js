function errorHandle(res,httpCode,message) {
    const header={
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    res.writeHead(httpCode, header);
    res.write(JSON.stringify({
        "status": "false",
        "message": message
    }));
    res.end();
}
module.exports=errorHandle;