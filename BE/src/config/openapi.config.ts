import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from '@asteasolutions/zod-to-openapi';

export const registry = new OpenAPIRegistry();

export const generateOpenApi = () => {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const document = generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'HCMUT - FPT Clone API Documentation',
      version: '1.0.0',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 8888}` }],
  });

  document.components = {
    ...document.components,
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  };

  // document.security = [{ bearerAuth: [] }]; // nếu muốn áp dụng mặc định
  return document;
};
