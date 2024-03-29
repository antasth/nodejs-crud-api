import http from 'http';
import { v4 as uuid } from 'uuid';
import { users } from '.';
import { API_ENDPOINT, requiredFields } from './constants';
import { getUserIdFromUrl, isProvidedUserIdValid } from './utils';

export const requestHandler = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
): void => {
  if (!req.url?.startsWith(API_ENDPOINT)) {
    res.writeHead(404, { 'Content-type': 'text/plain' });
    res.end('Error: Request to non-existing endpoint');
    return;
  }

  switch (req.method) {
    case 'GET':
      if (req.url === API_ENDPOINT) {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(JSON.stringify(users));
      } else if (
        req.url?.startsWith(API_ENDPOINT) &&
        req.url !== API_ENDPOINT
      ) {
        try {
          const userId = getUserIdFromUrl(req.url);
          if (isProvidedUserIdValid(userId)) {
            const user = users.filter((user) => user.id === userId);
            if (user.length) {
              res.writeHead(200, { 'Content-type': 'application/json' });
              res.end(JSON.stringify(user));
            } else {
              res.writeHead(404, { 'Content-type': 'text/plain' });
              res.end('User with provided id is not found');
            }
          } else {
            res.writeHead(400, { 'Content-type': 'text/plain' });
            res.end('Provided user Id is invalid');
          }
        } catch (error) {
          res.writeHead(500, { 'Content-type': 'text/plain' });
          res.end('Server error');
        }
      } else {
        res.writeHead(400, { 'Content-type': 'text/plain' });
        res.end('Incorrect request');
      }
      break;

    case 'POST':
      if (req.url === API_ENDPOINT) {
        const userId = uuid();

        req.on('data', (chunk) => {
          try {
            const record = JSON.parse(chunk.toString());
            if (requiredFields.filter((field) => !(field in record)).length) {
              res.writeHead(400, { 'Content-type': 'text/plain' });
              res.end('Body does not contain required fields');
            } else {
              record.id = userId;
              users.push(record);
            }
          } catch (error) {
            res.writeHead(500, { 'Content-type': 'text/plain' });
            res.end('Server error');
          }
        });

        req.on('end', () => {
          const user = users.filter((user) => user.id === userId);
          if (user.length) {
            res.writeHead(201, { 'Content-type': 'application/json' });
            res.end(JSON.stringify(user));
          }
        });
      } else {
        res.writeHead(400, { 'Content-type': 'text/plain' });
        res.end('Incorrect request');
      }
      break;

    case 'PUT':
      if (req.url?.startsWith(API_ENDPOINT) && req.url !== API_ENDPOINT) {
        const userId = getUserIdFromUrl(req.url);
        const targetUserIndex = users.findIndex((user) => user.id === userId);
        let isError = false;

        if (isProvidedUserIdValid(userId)) {
          req.on('data', (chunk) => {
            try {
              const record = JSON.parse(chunk.toString());

              if (targetUserIndex !== -1) {
                users[targetUserIndex] = {
                  ...users[targetUserIndex],
                  ...record,
                };
              } else {
                res.writeHead(404, { 'Content-type': 'text/plain' });
                res.end('User with provided id is not found');
              }
            } catch (error) {
              res.writeHead(500, { 'Content-type': 'text/plain' });
              res.end('Server error');
              isError = true;
            }
          });

          req.on('end', () => {
            if (targetUserIndex !== -1 && !isError) {
              res.writeHead(200, { 'Content-type': 'application/json' });
              res.end(JSON.stringify(users[targetUserIndex]));
            }
          });
        } else {
          res.writeHead(400, { 'Content-type': 'text/plain' });
          res.end('Provided user Id is invalid');
        }
      } else {
        res.writeHead(400, { 'Content-type': 'text/plain' });
        res.end('Incorrect request');
      }
      break;

    case 'DELETE':
      if (req.url?.startsWith(API_ENDPOINT) && req.url !== API_ENDPOINT) {
        const userId = getUserIdFromUrl(req.url);
        const targetUserIndex = users.findIndex((user) => user.id === userId);

        if (isProvidedUserIdValid(userId)) {
          if (targetUserIndex !== -1) {
            users.splice(targetUserIndex, 1);

            res.writeHead(204, { 'Content-type': 'text/plain' });
            res.end('Record was found and deleted');
          } else {
            res.writeHead(404, { 'Content-type': 'text/plain' });
            res.end('User with provided id is not found');
          }
        } else {
          res.writeHead(400, { 'Content-type': 'text/plain' });
          res.end('Provided user Id is invalid');
        }
      } else {
        res.writeHead(400, { 'Content-type': 'text/plain' });
        res.end('Incorrect request');
      }
      break;

    default:
      break;
  }
};
