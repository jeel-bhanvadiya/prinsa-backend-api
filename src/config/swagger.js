const spec = {
    openapi: '3.0.0',
    info: {
      title: 'Prinsa Backend API',
      version: '1.0.0',
      description: 'Super Admin & Employee management APIs for Prinsa Demo',
    },
    servers: [
      { url: process.env.SERVER_URL || 'http://localhost:8000', description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token from login or signup',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        SignupBody: {
          type: 'object',
          required: ['name', 'email', 'password', 'age', 'gender'],
          properties: {
            name: { type: 'string', example: 'Admin User' },
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            age: { type: 'integer', example: 30 },
            gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'male' },
            hobby: { type: 'array', items: { type: 'string' }, example: ['reading', 'coding'] },
          },
        },
        LoginBody: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'admin@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
                age: { type: 'integer' },
                gender: { type: 'string' },
                hobby: { type: 'array', items: { type: 'string' } },
                token: { type: 'string', description: 'JWT token' },
              },
            },
          },
        },
        EmployeeBody: {
          type: 'object',
          required: ['name', 'email', 'password', 'age', 'gender', 'salary', 'joiningDate'],
          properties: {
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            age: { type: 'integer', example: 28 },
            gender: { type: 'string', enum: ['male', 'female', 'other'], example: 'male' },
            salary: { type: 'number', example: 50000 },
            joiningDate: { type: 'string', format: 'date', example: '2024-01-15' },
          },
        },
        EmployeeUpdateBody: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            age: { type: 'integer' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] },
            salary: { type: 'number' },
            joiningDate: { type: 'string', format: 'date' },
          },
        },
        Employee: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            age: { type: 'integer' },
            gender: { type: 'string' },
            salary: { type: 'number' },
            joiningDate: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        EmployeeListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array', items: { $ref: '#/components/schemas/Employee' } },
            count: { type: 'integer' },
          },
        },
        SalaryListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  age: { type: 'integer' },
                  gender: { type: 'string' },
                  salary: { type: 'number' },
                  joiningDate: { type: 'string' },
                },
              },
            },
            count: { type: 'integer' },
            totalSalary: { type: 'number' },
          },
        },
      },
    },
    tags: [
      { name: 'Health', description: 'Health check' },
      { name: 'Auth', description: 'Super Admin signup and login' },
      { name: 'Employees', description: 'Employee CRUD (requires auth)' },
    ],
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          description: 'Check if the API is running',
          responses: {
            200: {
              description: 'API is running',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      ok: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'API is running' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/auth/signup': {
        post: {
          tags: ['Auth'],
          summary: 'Signup (Super Admin)',
          description: 'Register a new Super Admin',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SignupBody' },
              },
            },
          },
          responses: {
            201: {
              description: 'Super admin created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          description: 'Login as Super Admin, returns JWT token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginBody' },
              },
            },
          },
          responses: {
            200: {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' },
                },
              },
            },
            400: { description: 'Missing email or password', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/employees': {
        get: {
          tags: ['Employees'],
          summary: 'List employees',
          description: 'Get all employees for the logged-in Super Admin',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'List of employees',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/EmployeeListResponse' },
                },
              },
            },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        post: {
          tags: ['Employees'],
          summary: 'Create employee',
          description: 'Create a new employee (requires Super Admin token)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EmployeeBody' },
              },
            },
          },
          responses: {
            201: {
              description: 'Employee created',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Employee' },
                    },
                  },
                },
              },
            },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/employees/salary-list': {
        get: {
          tags: ['Employees'],
          summary: 'Salary list',
          description: 'Get employees with salary info, count and totalSalary',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Salary list',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SalaryListResponse' },
                },
              },
            },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
      '/api/employees/{id}': {
        put: {
          tags: ['Employees'],
          summary: 'Update employee',
          description: 'Update an employee by ID (all body fields optional)',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Employee MongoDB _id' },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EmployeeUpdateBody' },
              },
            },
          },
          responses: {
            200: {
              description: 'Employee updated',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Employee' },
                    },
                  },
                },
              },
            },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Employee not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
        delete: {
          tags: ['Employees'],
          summary: 'Delete employee',
          description: 'Delete an employee by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Employee MongoDB _id' },
          ],
          responses: {
            200: {
              description: 'Employee deleted',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            404: { description: 'Employee not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
            500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },
    },
};

module.exports = spec;
