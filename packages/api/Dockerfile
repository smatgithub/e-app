FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/api/package.json ./packages/api/

# Need devDependencies (typescript) to compile
RUN npm ci --workspace=@efood/shared --workspace=@efood/api --include-workspace-root --include=dev

COPY packages/shared ./packages/shared
COPY packages/api ./packages/api

RUN npm run build -w @efood/shared \
  && npm run build -w @efood/api \
  && npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/shared ./packages/shared
COPY --from=build /app/packages/api/package.json ./packages/api/
COPY --from=build /app/packages/api/dist ./packages/api/dist
COPY packages/api/migrations ./packages/api/migrations

WORKDIR /app/packages/api
EXPOSE 4000
CMD ["node", "dist/index.js"]
