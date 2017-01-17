import {
  OK, NOT_FOUND, LAST_MODIFIED, NOT_MODIFIED, BAD_REQUEST, ETAG,
  CONFLICT, METHOD_NOT_ALLOWED, NO_CONTENT, CREATED, setIssueRes
} from './utils';
import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import {getLogger} from './utils';

const log = getLogger('auth');

export const jwtConfig = {
  secret: 'my-secret'
}

export function createToken(user) {
  log(`create token for ${user.username}`);
  return jwt.sign({username: user.username, _id: user._id}, jwtConfig.secret, { expiresIn: 60*60*60 });
}

export function decodeToken(token) {
  let decoded = jwt.decode(token, jwtConfig.secret);
  log(`decoded token for ${decoded}`);
  return decoded;
}

export class AuthRouter extends Router {
  constructor(args) {
    super(args);
    this.userStore = args.userStore;
    this.post('/signup', async(ctx, next) => {
      let user = await this.userStore.insert(ctx.request.body);
      ctx.response.body = {token: createToken(user)};
      ctx.status = CREATED
      log(`signup - user ${user.username} created`);
    })
    this.post('/session', async (ctx, next) => {
      let reqBody = ctx.request.body;
      if (!reqBody.username || !reqBody.password) {
        log(`session - missing username and password`);
        setIssueRes(ctx.response, BAD_REQUEST, [{error: 'Both username and password must be set'}])
        return;
      }
      let username=reqBody.username;
      let password=reqBody.password;
      console.log('Trying to log user: '+username);
      let mysql = require('mysql');
      let connection = await mysql.createConnection({
          host     : 'localhost',
          user     : 'root',
          password : '',
          database : 'mobile'
      });
      connection.connect();
      let query  = 'select * from users where username = "'+username+'" and password="'+password+'"';
      console.log(query);
      let user;
      let wrongPass = false;
      let done = false;
      let q = await connection.query(query, async function (err, row, fields) {
          console.log("Retrieving results...");
          if (!err){
            if(row.length == 1){
              user = row[0];
              console.log("Login with success for user: "+JSON.stringify(user));
            } else {
              wrongPass = true;
            }
          } else {
            console.log(err);
            wrongPass = true;
          }
          done = true;
      });
        // ctx.status = CREATED;
        // ctx.response.body = {token: createToken(user)};
        console.log("aici");
        console.log(q.sql);
        while (!done){
        }
      if (user){
        ctx.status = CREATED;
        ctx.response.body = {token: createToken(user)};
        console.log("Login with success for user: "+JSON.stringify(user));
      }
      else {
        console.log("Login with unsuccess for user: "+JSON.stringify(user));
        if (wrongPass){
            log(`session - wrong password`);
            setIssueRes(ctx.response, BAD_REQUEST, [{error: 'Wrong password'}]);
        }
      }
      console.log(q.sql());
      connection.end();
      log(`session - token created`);
      // let user = await this.userStore.findOne({username: reqBody.username});
      // console.log("From file " + JSON.stringify(user));
      // if (user && user.password === reqBody.password) {
      //   ctx.status = CREATED;
      //   ctx.response.body = {token: createToken(user)};
      //   log(`session - token created`);
      // } else {
      //   log(`session - wrong password`);
      //   setIssueRes(ctx.response, BAD_REQUEST, [{error: 'Wrong password'}])
      // }
    })
  }
}