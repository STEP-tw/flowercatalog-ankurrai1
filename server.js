const http = require('http');
const port = 3000;

const logAndStoreRequest=require('./utils.js').logAndStoreRequest;

const create= require('./frameWork.js').create;

const loadUser=require('./fileHandlers.js').loadUser;
const goToHome=require('./fileHandlers.js').goToHome;
const serveRegularFile=require('./fileHandlers.js').serveRegularFile;
const loginGuestBook=require('./fileHandlers.js').loginGuestBook;
const loginUser=require('./fileHandlers.js').loginUser;
const logoutUser=require('./fileHandlers.js').logoutUser;
const storeCommentsAndRedirect=require('./fileHandlers.js').storeCommentsAndRedirect;

const requestlistener = create();

let redirectLoggedInUserToHome = (req,resp)=>{
  if(req.urlIsOneOf(['/','/login']) && req.user) resp.redirect('/home');
}

// requestlistener.preProcessUse(loadUser);
requestlistener.preProcessUse(logAndStoreRequest);
requestlistener.get("/",goToHome);
requestlistener.post('/templates/login',loginUser);
requestlistener.post('/templates/feedBack',storeCommentsAndRedirect);
// requestlistener.get('/logout.html',logoutUser);
requestlistener.postProcessUse(serveRegularFile);


const server = http.createServer(requestlistener);
server.listen(port);
server.on('error', (e) => console.error(`Server Error :::: ${e.message}`));
console.log(`Listening to Port ${port}`);
