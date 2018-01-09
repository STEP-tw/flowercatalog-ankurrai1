const http = require('http');

// const logAndStoreRequest=require('./utils.js').logAndStoreRequest;

const create= require('./frameWork.js').create;

const goToHome=require('./fileHandlers.js').goToHome;
const servRegularFile=require('./fileHandlers.js').servRegularFile;
const loginGuestBook=require('./fileHandlers.js').loginGuestBook;
const loginUser=require('./fileHandlers.js').loginUser;
const registerUser=require('./fileHandlers.js').registerUser;
const logoutUser=require('./fileHandlers.js').logoutUser;

const port = 3000;

const requestlistener = create();

// requestlistener.preProcessUse(logAndStoreRequest);

requestlistener.get("/",goToHome);
// requestlistener.post('/registration',registerUser);
// requestlistener.post('/login',loginUser);
// requestlistener.get('/guestBook.html',loginUser);
// requestlistener.get('/logout.html',logoutUser);
// requestlistener.post('/feedBack',storeComments);
requestlistener.postProcessUse(servRegularFile);


const server = http.createServer(requestlistener);
server.listen(port);
server.on('error', (e) => console.error(`Server Error :::: ${e.message}`));
console.log(`Listening to Port ${port}`);
