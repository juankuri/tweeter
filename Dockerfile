FROM node:lts-alpine as builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build -- --configuration production

FROM nginx:alpine
COPY --from=builder /app/dist/tweeter /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
