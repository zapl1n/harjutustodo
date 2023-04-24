// Add express
import express from 'express'
const app = express()

// Add bcrypt
import bcrypt from 'bcrypt'

// Add prisma
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Parse application/json
app.use(express.json())

// Add dotnev
import dotenv from 'dotenv'
dotenv.config()

// Add Swagger
import swaggerUi from 'swagger-ui-express'
import yamljs from 'yamljs'
const swaggerDocument = yamljs.load('./swagger.yaml')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Serve static files
app.use(express.static('public'))

// Set port
const port = process.env.Port || 3000

app.post('/users', async (req, res) => {

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

// Listen to port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}. Documentation at http://localhost:${port}/docs`)
})
