const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 9000,
        host: 'localhost',
        routes: {
            cors:{
                origin: ['*'],
            },
        },
    });
    
    await server.start();
    server.route(routes);

    console.log(`Server is running at ${server.info.uri}`);
}

init();
