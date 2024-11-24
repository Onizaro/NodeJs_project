declare module 'swagger-ui-express' {
    import { RequestHandler } from 'express';
    const serve: RequestHandler;
    const setup: (swaggerDoc: object, options?: object) => RequestHandler;
    export { serve, setup };
}
