const fs = require('fs');
const getContentType = require('./utils.js').getContentType;

let validUsers = [{
  userName: 'ankurrai',
  password: 'ankur'
}, {
  userName: 'yogi',
  password: 'none'
}];

let comments;
let session={};

let redirectLoggedInUserToHome = function (req,resp){
  if(req.urlIsOneOf(['./comments.html']) && req.user) resp.redirect('guestBook.html');
};

const loadUser = (req, res) => {
  let sessionid = req.cookies.sessionid;
  if(!sessionid) return;
  if (session.sessionid==sessionid) {
    req.user = session;
  }
};

const redirectInvalidUser = function(resp) {
  resp.setHeader('Set-Cookie', 'logInFailed=true');
  resp.redirect('/templates/comments.html');
}

const serveRegularFile = function(req, resp) {
  let filePath = req.url;
  fs.readFile(`./public${filePath}`, (error, data) => {
    if (error) return resp.writeError();
    resp.setHeader('Content-Type', getContentType(filePath))
    resp.serve(data);
  });
};



const goToHome = function(req, resp) {
  resp.redirect('index.html');
};

const loginGuestBook = function(req, resp) {
  let user = session[req.cookies.sessionid];
  if (!user) return resp.redirect('/login.html');
};

const getValidUser = function(req) {
  let userName = req.body.userName;
  let password = req.body.password;
  return validUsers.find(ValidUser => {
    return ValidUser.userName == userName && ValidUser.password == password;
  });
};

const SetCookie = function(resp,user) {
  let sessionid = new Date().getTime();
  user.sessionid = sessionid;
  session=user;
  resp.setHeader('Set-Cookie', `sessionid=${sessionid}`);
}

const loginUser = function(req, resp) {
  let user = getValidUser(req);
  if (!user) return redirectInvalidUser(resp);
  SetCookie(resp,user);
  resp.redirect(`guestBook.html`)
};

const readComments = function(filePath) {
  let fileContent = fs.readFileSync(filePath, 'utf8');
  console.log(filePath);
  console.log(fileContent);
  comments = JSON.parse(fileContent);
};

const logoutUser = function(req, resp) {
  let time = new Date(1).toUTCString();
  resp.setHeader('Set-Cookie', [`logInFailed=false; Expires=${time}`, `sessionid=0; Expires=${time}`]);
  session={};
  resp.redirect('comments.html')
};

const storeToBackup = function() {
  fs.writeFile("./dataBackup/userAndComment.json", JSON.stringify(comments, null, 1), (err) => {
    if (err) console.log('failed to store data to backup file');
  });
};

const storeToScript = function() {
  fs.writeFile("./public/script/data.js", `var data=${JSON.stringify(comments, null, 1)}`, (err) => {
    if (!err) console.log('data stored');
  });
};

const getCurrentTime = () => {
  let currentDateTime = new Date();
  return currentDateTime.toLocaleString();
};

const storeFeedback = function(req) {
  let nameAndComment = req.body;
  nameAndComment.dateTime = getCurrentTime();
  comments.unshift(nameAndComment);
  storeToBackup();
  storeToScript();
}

const storeCommentsAndRedirect = function(req, resp) {
  readComments('./dataBackup/userAndComment.json');
  storeFeedback(req);
  resp.redirect(`guestBook.html`);
};

exports.redirectLoggedInUserToHome=redirectLoggedInUserToHome
exports.storeCommentsAndRedirect = storeCommentsAndRedirect;
exports.goToHome = goToHome;
exports.loginGuestBook = loginGuestBook;
exports.serveRegularFile = serveRegularFile;
exports.loginGuestBook = loginGuestBook;
exports.loginUser = loginUser;
exports.logoutUser = logoutUser;
exports.loadUser = loadUser;
