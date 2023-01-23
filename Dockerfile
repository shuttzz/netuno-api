FROM node:18.13.0-slim

CMD [ "sh", "-c", "curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add - echo 'deb https://dl.yarnpkg.com/debian/ stable main' | sudo tee /etc/apt/sources.list.d/yarn.list && sudo apt update && sudo apt install yarn && sudo apt install lsof" ]

RUN npm install -g @nestjs/cli@9.1.8

USER node

WORKDIR /home/node/app

CMD [ "sh", "-c", "yarn install && tail -f /dev/null" ]
