ARG PLAYWRIGHT_VERSION=1.50.1

FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/* && apt-get clean

WORKDIR /app

# Install dependencies
COPY package.json pnpm*.yaml ./
RUN corepack enable && corepack prepare --activate
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --prefer-offline

RUN pnpm --filter @josepmc/e2e run test:gen

ENTRYPOINT ["xvfb-run", "/bin/sh", "-c"]
CMD [ "pnpm --filter @josepmc/e2e run test" ]
