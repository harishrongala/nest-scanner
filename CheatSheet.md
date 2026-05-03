# NestJS Workshop Cheatsheet

A quick reference guide for building strict and scalable NestJS applications, CLI usage, and clarifying common concepts.

---

## 1. Essential Nest CLI Commands
The Nest CLI is your best friend for scaffolding files and keeping your project structure clean.

| Command | Alias | Description |
| :--- | :--- | :--- |
| `nest new <name>` | `nest n` | Creates a new NestJS application from scratch |
| `nest generate module <name>` | `nest g mo` | Generates a new Module declaration |
| `nest generate controller <name>` | `nest g co` | Generates a Controller (and its spec file) |
| `nest generate service <name>` | `nest g s` | Generates a Service (Provider) |
| `nest generate resource <name>` | `nest g res` | **Magic Command**: Generates a full CRUD boilerplate (Module, Controller, Service, DTOs, Entities) |
| `nest generate guard <name>` | `nest g gu` | Generates a Guard |
| `nest generate pipe <name>` | `nest g pi` | Generates a Pipe |
| `nest generate interceptor <name>` | `nest g in` | Generates an Interceptor |

> **Pro Tip**: Add `--no-spec` to any generate command if you don't want it to create `.spec.ts` test files.

---

## 2. Frequently Confused Concepts

### **Middleware vs. Guards vs. Interceptors**
These three often cause confusion because they all intercept the request in some way.
*   **Middleware**: Like Express middleware. It's the *first* thing to run. Great for global things like logging raw requests, parsing cookies, or legacy Express integrations. **It does not know which route handler will be executed.**
*   **Guards**: Run *after* middleware but *before* the route handler. Their *only* job is authorization (Should this request proceed? `true` or `false`). **They have access to the ExecutionContext** (they know exactly which Controller and Method are about to run).
*   **Interceptors**: Wrap the route handler (Aspect-Oriented Programming). They can mutate the incoming request, but more importantly, they can **mutate the outgoing response** or handle timeouts/caching via RxJS streams.

### **Pipes vs. Validation**
*   **Pipes**: Used for **Transformation** (e.g., parsing a string to an integer) and **Validation** (e.g., checking if a string is a valid UUID).
*   **`ValidationPipe`**: A specific, built-in global pipe that uses `class-validator` decorators (like `@IsString()`, `@IsInt()`) on your DTOs to automatically validate incoming JSON bodies.

### **Providers vs. Services**
*   **Providers**: The fundamental concept of NestJS Dependency Injection. Anything decorated with `@Injectable()` that is injected via the constructor is a provider (Services, Repositories, Factories, etc.).
*   **Services**: A specific *type* of Provider used to hold your core business logic, keeping Controllers thin.

---

## 3. Extending the Request Object
Safely attach custom data to the Express Request without losing type safety.

```typescript
import { Request } from 'express';

// 1. Define your domain object
export interface DeviceInterface { deviceId: string; licensed: boolean; }

// 2. Extend the Express Request
export interface DeviceRequest extends Request { device?: DeviceInterface; }
```

---

## 4. Guards (Context & Auth)
Use Guards to validate access and attach data to the request early.

```typescript
@Injectable()
export class DeviceAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<DeviceRequest>(); // Typed request
    
    // Auth logic here...
    request.device = { deviceId: '123', licensed: true }; // Attach data
    return true; // Proceed
  }
}
```

---

## 5. Custom Parameter Decorators
Keep controllers framework-agnostic by extracting attached data directly into a parameter.

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Device = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest<DeviceRequest>().device;
});

// Usage: myHandler(@Device() device: DeviceInterface) { ... }
```

---

## 6. Exception Filters
Centralize error handling to prevent internal stack traces from leaking.

```typescript
// Catch specific exceptions
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    
    response.status(exception.getStatus()).json({
      success: false,
      error: exception.message,
    });
  }
}
```
