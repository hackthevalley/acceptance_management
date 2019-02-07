import dotenv           from 'dotenv';
import mongoose         from "mongoose";
import express          from 'express';
import * as controllers from './controllers';
import path             from 'path';
import session          from 'express-session';
import flash            from 'connect-flash';
import bodyParser       from 'body-parser';

dotenv.load();
const app = new express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    cookie: {maxAge: 60000},
    resave: true,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET || 'secret'
}));

app.use(flash());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

// Controller auto-mount magic :)
for (let controller of Object.values(controllers)) {
    for (let methodName of Object.getOwnPropertyNames(controller)) {
        if (controller[methodName].___path) {
            switch (controller[methodName].___method) {
                case 'post':
                    app.post(controller[methodName].___path, controller[methodName]);
                    break;
                default:
                    app.get(controller[methodName].___path, controller[methodName]);
            }
        }
    }
}

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true})
    .then(() => console.log("Mongoose connected..."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));