# Imagen para AWS App Runner (también sirve para cualquier otro host de contenedores).
# Compila con `NEXT_OUTPUT=standalone`, que genera un servidor mínimo con solo lo necesario.
FROM node:22-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_OUTPUT=standalone
RUN npm run build

FROM base AS run
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
EXPOSE 3000
# AWS App Runner pisa la variable HOSTNAME con el nombre interno de la máquina; hay que fijarla acá
# para que el servidor acepte conexiones desde afuera.
CMD ["sh", "-c", "HOSTNAME=0.0.0.0 exec node server.js"]
