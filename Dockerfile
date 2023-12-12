FROM node:18.18.2-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
COPY vite.config.js ./
RUN npm install --silent
#RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

EXPOSE 5174

#RUN npm run dev
CMD ["npm", "run", "dev"]



#COPY package*.json ./





# Copia los archivos estáticos desde la carpeta local "dist"
#COPY dist ./dist/



#RUN npm install -g http-server

#WORKDIR /app/react-app/dist

#CMD ["http-server", "-p", "5174", "-a", "0.0.0.0", "--cors"]
