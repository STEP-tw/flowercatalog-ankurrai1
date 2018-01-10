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
const redirectLoggedInUserToHome=require('./fileHandlers.js').redirectLoggedInUserToHome;

const app = create();

app.preProcessUse(logAndStoreRequest);
app.preProcessUse(loadUser);
app.preProcessUse(redirectLoggedInUserToHome);

app.get("/",goToHome);
app.get('/templates/logout',logoutUser);

app.post('/templates/login',loginUser);
app.post('/templates/feedBack',storeCommentsAndRedirect);

app.postProcessUse(serveRegularFile);


const server = http.createServer(app);
server.listen(port);
server.on('error', (e) => console.error(`Server Error :::: ${e.message}`));
console.log(`Listening to Port ${port}`);
