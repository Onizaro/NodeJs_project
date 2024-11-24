declare module 'swagger-jsdoc' {
    interface Options {
        definition: object;
        apis: string[];
    }

    export default function swaggerJsdoc(options: Options): object;
}
