FROM mhart/alpine-node:14.0.0 as build
ARG BASE_URL
ARG HASURA_URL
ARG HASURA_WS
ARG HASURA_GRAPHQL_ADMIN_SECRET
ARG CLIENTID
ARG DAILYOS_SERVER_URL
ARG DAILYKEY_URL
ARG MAPS_API_KEY
ARG PAYMENTS_API_URL
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
COPY . .
RUN echo "BASE_URL=${BASE_URL}" >> .env 
RUN echo "HASURA_URL=${HASURA_URL}" >> .env 
RUN echo "HASURA_WS=${HASURA_WS}" >> .env 
RUN echo "HASURA_GRAPHQL_ADMIN_SECRET=${HASURA_GRAPHQL_ADMIN_SECRET}" >> .env 
RUN echo "CLIENTID=${CLIENTID}" >> .env
RUN echo "DAILYOS_SERVER_URL=${DAILYOS_SERVER_URL}" >> .env
RUN echo "DAILYKEY_URL=${DAILYKEY_URL}" >> .env
RUN echo "MAPS_API_KEY=${MAPS_API_KEY}" >> .env
RUN echo "PAYMENTS_API_URL=${PAYMENTS_API_URL}" >> .env

ENV PATH /app/node_modules/.bin:$PATH

RUN npx expo-cli build:web --no-pwa

FROM nginx:1.15.2-alpine
COPY --from=build /usr/src/app/web-build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
