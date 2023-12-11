FROM node:18-alpine
WORKDIR /app/react-app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
WORKDIR /app/react-app/dist
EXPOSE 5173
RUN npm install -g http-server
CMD ["http-server", "-p", "5174"]