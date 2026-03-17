FROM node:14

WORKDIR /app

COPY ad_blocker.js .

CMD ["node", "-e", "console.log('YouTube Ad Blocker loaded')"]
