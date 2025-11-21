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
          schema: (userDto.UserCreateSchema)
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
router.post('/', authenticateHandler, checkRole(["ADMIN"]), userController.createUserHandler)
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
          schema: (userDto.UserUpdateSchema)
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
  request: {
    body: {
      content: {
        "application/json": {
          schema: (userDto.AddressCreateSchema)
        }
      }
    }
  },
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

registry.registerPath({
  tags: ['User'],
  path: '/users/address',
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
          schema: ApiResponseSchema(userDto.AddressListResponseSchema)
        }
      }
    }
  }
})
router.get('/address', authenticateHandler, userController.getAddressListHandler)

registry.registerPath({
  tags: ['User'],
  path: '/users/address/{address_id}',
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
          schema: (userDto.AddressCreateSchema)
        }
      }
    }
  },
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
router.put('/address/:address_id', authenticateHandler, userController.updateAddressHandler)

registry.registerPath({
  tags: ['User'],
  path: '/users/address/{address_id}',
  method: 'delete',
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
router.delete('/address/:address_id', authenticateHandler, userController.deleteAddressHandler)
export default router