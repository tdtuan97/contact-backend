# FROM means setting which image to base the image on. The FROM instruction must be the first instruction in the entire Dockerfile. If the specified image does not exist, it will be automatically downloaded from Docker Hub by default.
# Specify that our base image is node, and latest indicates that the version is the latest. If you require extreme space, you can choose lts-alpine
# Use as to name a stage
FROM node:lts-alpine as builder

ENV PROJECT_DIR=/app \
     MYSQL_HOST=mysql\
     SERVER_PORT=$SERVER_PORT\
     WS_PORT=$WS_PORT

# The WORKDIR command is used to set the working directory of the RUN, CMD and ENTRYPOINT commands in the Dockerfile (the default is / directory). This command can appear multiple times in the Dockerfile.
# If using a relative path, it is relative to the last value of WORKDIR,
# For example, WORKDIR /data, WORKDIR logs, the current directory of RUN pwd final output is /data/logs.
# cd to /app
WORKDIR $PROJECT_DIR

# set timezone
RUN ln -sf /usr/share/zoneinfo/Asia/Ho_Chi_Minh /etc/localtime\
     && echo 'Asia/Ho_Chi_Minh' > /etc/timezone

# mirror acceleration
# RUN npm config set registry https://registry.npmmirror.com
# RUN yarn config set registry https://registry.npmmirror.com
# RUN npm config rm proxy && npm config rm https-proxy

# install & build
COPY ./ $PROJECT_DIR
RUN chmod +x ./wait-for-it.sh \
     && apk update && apk add bash \
     && yarn install \
     && yarn build \
     # same as npm prune --production
     && yarn install --production \
     && yarn global add pm2

# EXPOSE port
EXPOSE $SERVER_PORT $WS_PORT

# The command executed when the container starts, similar to npm run start
# CMD ["yarn", "start:prod"]
CMD ["pm2-runtime", "ecosystem.config.js"]
# ENTRYPOINT ./wait-for-it.sh $MYSQL_HOST:$MYSQL_PORT -- pm2-runtime ecosystem.config.js