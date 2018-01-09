const fs = require('fs');
const getContentType = require('./utils.js').getContentType;
let validUsers=[];
let comments;


const servRegularFile=function (req,resp) {
  let filePath=req.url;
  console.log(filePath);
  resp.setHeader('Content-Type',getContentType(filePath))
  fs.readFile(`./public${filePath}`,(error,data)=>{
    if(error) return resp.writeError();
    resp.serve(data);
  });
};

const goToHome=function(req,resp){
  resp.redirect('index.html');
};

const loginGuestBook= function(req,resp) {
  let user = session[req.cookies.sessionid];
  if(!user) return resp.redirect('/login.html');
}

const loginUser = function(req,resp) {
  let username = req.body.username;
  if(!registeredUsers.includes(username)) return respondLoginFailed(resp);
  let sessionid = new Date().getTime();
  session[sessionid] = username;
  resp.setHeader('Set-Cookie',`sessionid=${sessionid}`);
  responseWithGuestBook(resp);
}

const registerUser = function(req,resp) {
  validUsers.push(req.body.username);
  resp.redirect('/guestBook.html');
}

const readComments = function(){
  fs.readFile('./dataBackup/userAndComment.json',(err,data) =>{
    if (err) console.log("dataBackup file not found");
    comments = JSON.parse(data);
  });
}

const logoutUser = function(req,resp) {
  let time = new Date().toUTCString();
  resp.setHeader('Set-Cookie',[`logInFailed=false; Expires=${time}`,`sessionid=0; Expires=${time}`]);
  resp.redirect('/login.html')
}

exports.goToHome=goToHome;
exports.loginGuestBook=loginGuestBook;
exports.servRegularFile=servRegularFile;
exports.loginGuestBook=loginGuestBook;
exports.loginUser=loginUser;
exports.registerUser=registerUser;
exports.logoutUser=logoutUser;
