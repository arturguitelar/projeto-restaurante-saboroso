const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const formidable = require('formidable');
const socket = require('socket.io');
let http = require('http');

const app = express();

http = http.Server(app);
let io = socket(http);

io.on('connection', function(socket) {
    console.log('Novo usuário conectado.');    
});

const indexRouter = require('./routes/index')(io);
const adminRouter = require('./routes/admin')(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware para o formidable
app.use(function(req, res, next) {

    req.body = {};
    
    if (req.method === 'POST') {

        let form = formidable.IncomingForm({
            uploadDir: path.join(__dirname, '/public/images'),
            keepExtensions: true
        });
    
        form.parse(req, function (err, fields, files) {
           
            req.body = fields;
            req.fields = fields;
            req.files = files;
    
            next();
        });
    } else {
        next();
    }
});

// middleware
app.use(session({
    store: new RedisStore({
        host: 'localhost',
        port: 6379
    }),
    secret: 'p@ssw0rd', // para criptografia dos dados da sessão
    resave: true, // recria uma session caso ela expire
    saveUninitialized: true // já deixa a sessão salva no banco mesmo sem ter utilizado-a
}));

app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

http.listen(3000, function() {
    console.log('Servidor em execução na porta 3000...');
});
