# Express + Prisma Structure (SOLID)

## Folder layout

```txt
src/
  app.ts
  server.ts
  config/
    env.ts
    prisma.ts
  routes/
    index.ts
  shared/
    errors/
      app-error.ts
    http/
      error-handler.ts
  modules/
    users/
      domain/
        user.ts
      dto/
        create-user.dto.ts
      repositories/
        user-repository.ts
        prisma-user.repository.ts
      services/
        create-user.service.ts
      controllers/
        create-user.controller.ts
      routes/
        user.routes.ts
```

## Why this follows SOLID

- **S**: Each class/file has one role (controller receives HTTP, service has business logic, repository handles DB).
- **O**: Add new repository implementations without changing service logic.
- **L**: Any `IUserRepository` implementation can be used by `CreateUserService`.
- **I**: Small interfaces (only repository methods needed by service).
- **D**: Service depends on `IUserRepository` abstraction, not Prisma directly.

## Request flow example

1. `POST /api/users` hits `user.routes.ts`.
2. Route calls `CreateUserController`.
3. Controller validates body using Zod DTO.
4. Service checks if email exists and applies business rules.
5. Repository writes to PostgreSQL via Prisma.
6. Response is returned as JSON.
