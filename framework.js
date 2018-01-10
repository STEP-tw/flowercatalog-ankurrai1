const Handlers = require('./handlers.js')
const AddBehaviour = require('./utils.js').AddBehaviour;
const parseBody = require('./utils.js').parseBody;
const invoke = require('./utils.js').invoke;
const respondError = require('./utils.js').respondError;
const runProcessors=require('./utils.js').runProcessors;
const qs=require('querystring');

const eventHandler = function(req, resp) {
  req.cookies = qs.parse(req.headers.cookie||'');
  console.log(req.cookies);
  let content = "";
  req.on('data', data => content += data.toString());
  req.on('end', () => {
    req.body = parseBody(content);
    content = "";
    runProcessors(this.preProcess,req,resp);
    if(resp.finished) return;
    invoke.call(this,req,resp);
    if(resp.finished) return;
    runProcessors(this.postProcess,req,resp);
  });
};

let initialize = function() {
  this.handlers = new Handlers();
  this.preProcess = [];
  this.postProcess=[];
};

const get=function (url,handler) {
  this.handlers.addGet(url,handler);
};

const post=function (url,handler) {
  this.handlers.addPost(url,handler);
}

const preProcessUse = function(handler) {
  this.preProcess.push(handler);
};

const postProcessUse=function (handler) {
  this.postProcess.push(handler);
}

const requestHandler = function(req, resp) {
  AddBehaviour(req,resp);
  eventHandler.call(this, req, resp);
};

const requestlistener = function(req, resp) {
  requestHandler.call(requestlistener, req, resp)
};

exports.create = function() {
  initialize.call(requestlistener);
  requestlistener.get = get;
  requestlistener.post = post;
  requestlistener.preProcessUse = preProcessUse;
  requestlistener.postProcessUse=postProcessUse;
  return requestlistener;
};
