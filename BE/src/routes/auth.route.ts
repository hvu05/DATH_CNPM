import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { registry } from '../config/openapi.config';
import * as authDto from '../dtos/auth';
import { email } from 'zod';
import { ApiResponseSchema } from '../dtos/common/api-response';

const router = Router();

registry.registerPath({
  tags: ['Auth'],
  path: '/auth/login',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authDto.loginSchema,
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: ApiResponseSchema(authDto.LoginResponseSchema),
        },
      },
    },
  },
});
router.post('/login', authController.loginHandler);

registry.registerPath({
  tags: ['Auth'],
  path: '/auth/send-otp',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
              },
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
              },
              message: {
                type: 'string',
                default: 'OTP sent successfully',
              },
            },
          },
        },
      },
    },
  },
});
router.post('/send-otp', authController.sendOtpForRegisterHandler);

registry.registerPath({
  tags: ['Auth'],
  path: '/auth/register',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: authDto.RegisterSchema,
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'OK',
      content: {
        'application/json': {
          schema: ApiResponseSchema(authDto.RegisterResponseSchema),
        },
      },
    },
  },
});
router.post('/register', authController.registerHandler);
export default router;
