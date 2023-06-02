module.exports = {
    apps: [
        {
            name: 'echarge-backend', // project name, the name after startup
            script: './dist/main.js', // executed file
            cwd: './', // root directory
            args: '', // Arguments passed to the script
            watch: true, // enable watch file change restart
            // eslint-disable-next-line @typescript-eslint/camelcase
            ignore_watch: ['node_modules', 'public', 'logs'], // files not to be monitored
            instances: '1', // max indicates the maximum number of application startup instances, only valid in cluster mode, default is fork
            autorestart: true, // default is true, auto restart in case of exception
            // eslint-disable-next-line @typescript-eslint/camelcase
            max_memory_restart: '1G',
            // eslint-disable-next-line @typescript-eslint/camelcase
            error_file: './logs/app-err.log', // error log file
            // eslint-disable-next-line @typescript-eslint/camelcase
            out_file: './logs/app-out.log', // normal log file
            // eslint-disable-next-line @typescript-eslint/camelcase
            merge_logs: true, // Set append logs instead of new logs
            // eslint-disable-next-line @typescript-eslint/camelcase
            log_date_format: 'YYYY-MM-DD HH:mm:ss', // Specify the time format of the log file
            // eslint-disable-next-line @typescript-eslint/camelcase
            min_uptime: '60s', // application running less than time is considered abnormal startup
            // eslint-disable-next-line @typescript-eslint/camelcase
            max_restarts: 30, // Maximum number of abnormal restarts
            // eslint-disable-next-line @typescript-eslint/camelcase
            restart_delay: 60, // Delayed restart time in case of abnormal restart
            env: {
                // Environment parameters, currently specified as the production environment
                NODE_ENV: 'production',
            },
            env_development: {
                NODE_ENV: 'development',
            },
            // eslint-disable-next-line @typescript-eslint/camelcase
            env_production: {
                // Environment parameters, currently specified as the production environment
                NODE_ENV: 'production',
            },
            // eslint-disable-next-line @typescript-eslint/camelcase
            env_test: {
                // Environment parameters, currently the test environment
                NODE_ENV: 'test',
            },
        },
    ],

    deploy: {
        production: {
            user: 'root',
            host: '127.0.0.1',
            ref: 'origin/master',
            repo: 'git@github.com:repo.git',
            path: '/var/www/biz-user',
            'post-deploy':
                'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
        },
    },
};
