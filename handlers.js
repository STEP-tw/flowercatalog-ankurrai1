const Handlers=function () {
  this.GET={};
  this.POST={};
};

Handlers.prototype.addGet=function (url,handler) {
  this.GET[url] = handler;
}
Handlers.prototype.addPost=function (url,handler) {
  this.POST[url] = handler;
}

module.exports=Handlers;
