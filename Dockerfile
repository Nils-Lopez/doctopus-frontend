#dockerfile
# syntax=docker/dockerfile:1
FROM node:latest
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
#Either run in normally
CMD ["npm","start"] 

#or run in production
#RUN npm install -g serve
#CMD [ "serve", "-s", "build" ]