## nest-test-project

**A simple and efficient back-end system based on NestJs + TypeScript + TypeORM + Redis + MySql **

Demo environment account password:

| Account | Password |
|:-------:|:--------:|
|  admin  |   1234   |

## Quick experience

After successful startup, access it through http://localhost:7001/swagger-api/.

```bash
yarn docker:up
# or
docker compose --env-file .env.production up -d --no-build
```

stop and delete all containers

```bash
yarn docker:down
# or
docker compose --env-file .env.production down
```

View real-time log output

```bash
yarn docker:logs
# or
docker compose --env-file .env.production logs -f

```
