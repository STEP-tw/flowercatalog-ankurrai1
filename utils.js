const fs = require('fs');const AddBehaviour = function(req, resp) {
  resp.redirect = redirect.bind(resp);
  req.urlIsOneOf = urlIsOneOf.bind(req);
  resp.serve = serve.bind(resp);
  resp.writeError = writeError.bind(resp);
};
//there a problem with middleware function,I have to change and refactore it;
const middleware = function(req, resp, process) {
  debugger;
  if (resp.finished) return;
  console.log(resp.finished,process);
  process(req,resp);
};

const runProcessors = function(processors, req, resp) {
  if (processors.length==0) return;
  // middleware.bind(null,req,resp);
  processors.forEach((process)=>{
    if (resp.finished) return;
    process(req,resp);
  })
}

const serve = function(content) {
  this.write(content);
  this.end();
};

const urlIsOneOf = function(urls) {
  return urls.includes(this.url);
};

const getValidOne = function(validFiles, filePath) {
  if (validFiles.includes(filePath))
    return filePath;
};

const redirect = function(newLocation) {
  this.statusCode = 302;
  this.setHeader('location', newLocation);
  this.end();
};

const invoke = function(req, resp) {
  let handler = this.handlers[req.method][req.url];
  if (!handler) return;
  handler(req, resp);
};

const toKeyValue = function(keyValue) {
  let parts = keyValue.split('=');
  return {key:parts[0].trim(),value:parts[1].trim()}
};

const accumulate=function (keysAndValues,keyValue) {
  keysAndValues[keyValue.key]=keyValue.value;
  return keysAndValues;
};

const parseBody =function (text) {
  let keyAndValue={};
  if (!text) return keyAndValue;
  return text.split('&').map(toKeyValue).reduce(accumulate,{})
};

const writeError = function() {
  this.statusCode = 404;
  this.write('File not found!');
  this.end();
};

const timeStamp = () => {
  let today = new Date();
  return `${today.toDateString()} ${today.toLocaleTimeString()}`;
}

let logAndStoreRequest = (req, res) => {
  console.log(`${req.method} ${req.url}`);
  let text = ['------------------------------',
    `${timeStamp()}`,
    `${req.method} ${req.url}`,
    `HEADERS=> ${toString(req.headers)}`,
    `COOKIES=> ${toString(req.cookies)}`,
    `BODY=> ${toString(req.body)}`, ''
  ].join('\n');
  fs.appendFile('./dataBackup/request.log', text, () => {});
}

const getContentType = function(filePath) {
  let fileExt = filePath.split(".").slice(-1)[0];
  let headers = {
    "pdf": "application/pdf",
    "js": "text/js",
    "html": "text/html",
    "css": "text/css",
    "jpg": "image/jpg",
    "gif": "image/gif"
  };
  return headers[fileExt];
};

const toString = content => JSON.stringify(content, null, 2);

exports.invoke = invoke;
exports.toString = toString;
exports.parseBody = parseBody;
exports.getValidOne = getValidOne;
exports.runProcessors = runProcessors;
exports.AddBehaviour = AddBehaviour;
exports.getContentType = getContentType;
exports.logAndStoreRequest = logAndStoreRequest;
