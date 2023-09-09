FROM node:lts-slim

RUN corepack enable

USER node

WORKDIR /home/node/app

CMD [ "tail", "-f", "/dev/null" ]