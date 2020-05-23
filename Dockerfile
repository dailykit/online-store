FROM mhart/alpine-node:14.0.0 as build
ARG BASE_URL
ARG HASURA_URL
ARG HASURA_GRAPHQL_ADMIN_SECRET
ARG CLIENTID

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN echo "BASE_URL=${BASE_URL}" >> .env 
RUN echo "HASURA_URL=${HASURA_URL}" >> .env 
RUN echo "HASURA_GRAPHQL_ADMIN_SECRET=${HASURA_GRAPHQL_ADMIN_SECRET}" >> .env 
RUN echo "CLIENTID=${CLIENTID}" >> .env

ENV PATH /app/node_modules/.bin:$PATH

RUN npm i -g expo-cli 
RUN expo build:web --no-pwa

FROM nginx:1.15.2-alpine
COPY --from=build /usr/src/app/web-build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]