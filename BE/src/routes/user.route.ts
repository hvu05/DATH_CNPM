import { Router } from 'express'
import * as userController from '../controllers/user.controller'
import * as userDto from '../dtos/users'
import { authenticateHandler } from '../middlewares/authenticate.middleware'
import { checkRole } from '../middlewares/check-role.middleware'
import { registry } from '../config/openapi.config'
import { ApiResponseSchema } from '../dtos/common/api-response'
const router = Router()

registry.registerPath({
  tags: ['User'],
  path: '/users',
  description: 'ADMIN tạo user mới',
  method: 'post',
  security: [
    { 
      bearerAuth: [] 
    }
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ApiResponseSchema(userDto.UserCreateSchema)
        }
      }
    }
  },
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: ApiResponseSchema(userDto.UserResponseSchema)
        }
      }
    }
  }
})
router.post('/', authenticateHandler, checkRole("ADMIN"), userController.createUserHandler)
registry.registerPath({
  tags: ['User'],
  path: '/users/profile',
  method: 'get',
  security: [
    { 
      bearerAuth: [] 
    }
  ],
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: ApiResponseSchema(userDto.UserResponseSchema)
        }
      }
    }
  }
})
router.get('/profile', authenticateHandler, userController.getProfileHandler)

registry.registerPath({
  tags: ['User'],
  path: '/users/profile',
  method: 'put',
  security: [
    { 
      bearerAuth: [] 
    }
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ApiResponseSchema(userDto.UserUpdateSchema)
        }
      }
    }
  },
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: ApiResponseSchema(userDto.UserResponseSchema)
        }
      }
    }
  }
})
router.put('/profile', authenticateHandler, userController.updateProfileHandler)

registry.registerPath({
  tags: ['User'],
  path: '/users/address',
  method: 'post',
  security: [
    { 
      bearerAuth: [] 
    }
  ],
  responses: {
    "200": {
      description: "OK",
      content: {
        "application/json": {
          schema: ApiResponseSchema(userDto.AddressListResponseSchema)
        }
      }
    }
  }
})
router.post('/address', authenticateHandler, userController.createAddressHandler)
export default router