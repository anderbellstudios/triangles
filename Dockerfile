FROM node:24.22.1-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --non-interactive
COPY . .
RUN yarn build

FROM node:24.22.1-alpine
RUN apk --no-cache add curl
WORKDIR /app
COPY --from=builder /app .
RUN yarn install --frozen-lockfile --non-interactive --production && yarn cache clean
ENV NODE_ENV=production
CMD yarn server
EXPOSE 3000

HEALTHCHECK --start-period=1s --start-interval=1s \
  CMD curl -f http://localhost:3000/healthcheck || exit 1
