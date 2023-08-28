// Add express
import {NextFunction, Response, Request, Send} from 'express';

const express = require('express')
const app = express()
import * as https from 'https';
import * as fs from 'fs';
import bodyParser = require('body-parser');
import xml2js = require('xml2js');

const xmlBodyParser = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['content-type'] === 'application/xml' || req.headers['content-type'] === 'text/xml') {
        bodyParser.text({ type: 'application/xml' })(req, res, (err) => {
            if (err) return next(err);

            xml2js.parseString(req.body, { explicitArray: false }, (err, result) => {
                if (err) return next(err);

                req.body = result.root; // adapt this depending on your XML structure
                console.log(req.body);
                next();
            });
        });
    } else {
        next();
    }
};
app.use(xmlBodyParser)

const xmlConverterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;

    res.send = function (data) {
        const acceptHeader = req.headers['accept'];
        console.log('Accept Header:', acceptHeader); // Log the value of Accept header
        console.log('Data Type:', typeof data); // Log the type of data

        if (!acceptHeader) {
            return originalSend.call(res, data);
        }

        if (!acceptHeader.includes('application/xml')) {
            return originalSend.call(res, data);
        }

        let jsonData: any;
        if (typeof data === 'string') {
            try {
                console.log('Data:', data); // Log the data
                jsonData = JSON.parse(data);
            } catch (error) {
                //console.error('Error parsing JSON:', error);
                return originalSend.call(res, data);
            }
        } else {
            jsonData = data;
        }

        // @ts-ignore
        const xmlBuilder = new xml2js.Builder({rootName: 'root'});
        const xmlData = xmlBuilder.buildObject({items: jsonData});
        console.log('XML Data:', xmlData); // Log the generated XML data

        res.setHeader('Content-Type', 'text/xml');
        return originalSend.call(res, xmlData);

    }

    next();
}


app.use(xmlConverterMiddleware);

let httpsServer = https
  .createServer(
    // Provide the private and public key to the server by reading each
    // file's content with the readFileSync() method.
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("cert.pem"),
    },
    app
  )

  .listen(3000, () => {
    console.log("Server is running at port 3000 ");
  });

var expressWs = require('express-ws')(app, httpsServer);

app.ws('/', function () {

});

import { IRequestWithSession } from './custom'

// Add bcrypt
import * as bcrypt from 'bcrypt'

// Add prisma
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Parse application/json
app.use(express.json())

// Add dotnev
import * as dotenv from 'dotenv'
dotenv.config()

// Add Swagger
import * as swaggerUi from 'swagger-ui-express'
import * as yamljs from 'yamljs'

const swaggerDocument = yamljs.load('./swagger.yaml')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Serve static files
app.use(express.static('public'))
export interface PostUserRequest extends Request {
  email: string,
  password: string
}
interface PostUserResponse extends Response {

}

app.post('/users', async (req: PostUserRequest, res: PostUserResponse) => {

  // Validate email and password
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Email and password required')
  }

  // Validate that email is unique
  const userExists = await prisma.user.findUnique({
    where: {
      email: req.body.email
    }
  })

  if (userExists) {
    return res.status(409).send('Email already exists')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(req.body.password, 10)

  // Create user
  await prisma.user.create({
    data: {
      email: req.body.email,
      password: hashedPassword,
    }
  })

  // Return user
  res.status(201).end()
})
export interface PostSessionRequest extends Request {
  email: string,
  password: string
}

export interface PostSessionResponse extends Response {
  sessionToken: string
}

app.post('/sessions', async (req: PostSessionRequest, res: PostSessionResponse) => {

  // Validate email and password
  if (!req.body.email || !req.body.password) {
    return res.status(400).send('Email and password required')
  }

  // Validate that email exists
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email
    }
  })

  if (!user) {
    return res.status(401).send('Invalid email or password')
  }

  // Validate password
  const validPassword = await bcrypt.compare(req.body.password, user.password)

  if (!validPassword) {
    return res.status(401).send('Invalid email or password')
  }

  // Create session
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expires: new Date(),
    }
  });

  // Return session
  res.status(201).json({
    sessionToken: session.sessionToken
  })
})

// Add authorization middleware
const authorizeRequest = async (req: IRequestWithSession, res: Response, next: NextFunction) => {

  // Validate session
  if (!req.headers.authorization) {
    return res.status(401).send('Authorization header required')
  }

  // Validate extract session format
  if (!req.headers.authorization.startsWith('Bearer') || req.headers.authorization.split(' ').length !== 2) {
    return res.status(401).send('Invalid authorization header format')
  }

  // Extract sessionToken
  const sessionToken = req.headers.authorization.split(' ')[1]

  const session = await prisma.session.findUnique({
    where: {
      sessionToken: sessionToken
    }
  })

  if (!session) {
    return res.status(401).send('Invalid session token')
  }

  // Add user to request
  let user = await prisma.user.findUnique({
    where: {
      id: session.userId
    }
  })

  // Validate user
  if (!user) {
    return res.status(401).send('Invalid session token')
  }

  // Add user and sessionToken to request
  req.userId = user.id
  req.sessionToken = sessionToken

  next()
}

export interface DeleteSessionResponse extends Response {

}

app.delete('/sessions', authorizeRequest, async (req: IRequestWithSession, res: DeleteSessionResponse) => {

  // Delete session
  await prisma.session.delete({
    where: {
      sessionToken: req.sessionToken
    }
  })

  // Return session
  res.status(204).end()
})

// Get items
app.get('/items', authorizeRequest, async (req: IRequestWithSession, res: Response) => {

  // Get items for the signed-in user
  const items = await prisma.item.findMany({
    where: {
      userId: req.userId
    }
  })

  res.send(items);
});

app.post('/items', authorizeRequest, async (req: IRequestWithSession, res: Response) => {
  try {
    const { description } = req.body;
    const newDescription = String(description);
    const userId = req.userId;

    if (userId === undefined) {
      throw new Error('User ID is not defined');
    }

    if (!newDescription) {
      return res.status(400).send('Description required');
    }

    const newItem = await prisma.item.create({
      data: {
        description: newDescription,
        userId
      },
    });

    // emit a 'create' event with the new item data
    expressWs.getWss().clients.forEach((client: any) => client.send(JSON.stringify({
      type: 'create',
      item: newItem
    })));

        res.status(201).send({
            id: newItem.id,
            description: newItem.description
        });

    } catch (error) {
    res.status(500).send((error as Error).message || 'Something went wrong')
  }
});

app.delete('/items/:id', authorizeRequest, async (req: IRequestWithSession, res: Response) => {

  try {
    const { id } = req.params;

    const item = await prisma.item.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!item || item.userId !== req.userId) {
      return res.status(404).send('Item not found');
    }

    const deletedItem = await prisma.item.delete({
      where: {
        id: Number(id),
      },
    });

    expressWs.getWss().clients.forEach((client: any) => client.send(JSON.stringify({
      type: 'delete',
      id: deletedItem.id
    })));

    res.status(201).json(item);
  }

  catch (error) {
    res.status(500).send((error as Error).message || 'Something went wrong')
  }
});

app.put('/items/:id', authorizeRequest, async (req: IRequestWithSession, res: Response) => {

  try {
    console.log(req.body)
    // Get id from req.params
    const { id } = req.params;
    const { description, completed } = req.body;

    if (!description) {
      return res.status(400).send('Description required');
    }

    const item = await prisma.item.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!item || item.userId !== req.userId) {
      return res.status(404).send('Item not found');
    }


    const updatedItem = await prisma.item.update({
      where: {
        id: Number(id),
      },
      data: {
        description,
        completed: Boolean(completed),
      },

    });

    expressWs.getWss().clients.forEach((client: any) => client.send(JSON.stringify({
      type: 'update',
      id: updatedItem.id,
      description: updatedItem.description,

      completed: updatedItem.completed,

    })));

    res.status(200).json(updatedItem);
  }

  catch (error) {
    res.status(500).send((error as Error).message || 'Something went wrong')
  }
});
