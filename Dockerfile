FROM mhart/alpine-node:11 as build
ARG BASE_URL
ARG HASURA_URL
ARG HASURA_GRAPHQL_ADMIN_SECRET

WORKDIR /usr/src/app
COPY package.json ./
RUN yarn
COPY . .
ADD .env .
RUN echo "BASE_URL=${BASE_URL} \n HASURA_URL=${HASURA_URL} \n HASURA_GRAPHQL_ADMIN_SECRET=${HASURA_GRAPHQL_ADMIN_SECRET}" >> /usr/scr/app/.env 

ENV PATH /app/node_modules/.bin:$PATH

RUN npm i -g expo-cli 
RUN expo build:web --no-pwa

FROM nginx:1.15.2-alpine
COPY --from=build /usr/src/app/web-build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
