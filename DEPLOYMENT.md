# Production Deployment

This application publishes two public GHCR images and deploys them to Tencent Lighthouse:

- `ghcr.io/azarnuzy/reseller-order-app-agent-api`
- `ghcr.io/azarnuzy/reseller-order-app-agent-platform`

The VPS runs one global Caddy instance. It proxies the public domains to unique aliases on the
external Docker network named `proxy`; PostgreSQL is reachable only through this application's
private network.

## Branch and release flow

1. Develop on a feature branch and open a pull request into `dev`.
2. The `dev` branch and pull requests run lint, type-check, and build validation.
3. Promote a tested release with a pull request from `dev` into `main`.
4. Every push to `main` validates the repository, publishes `api` and `platform` images tagged with
   both the commit SHA and `latest`, then deploys the immutable SHA to production.

Do not develop directly on `main`. Protect `main` and require the CI check before merging.

## One-time VPS bootstrap

The base VPS, Docker, shared `proxy` network, and global Caddy must already exist.

Create the application directory on the VPS:

```bash
sudo install -d -o "$USER" -g "$USER" -m 0750 /srv/apps/reseller-app
cd /srv/apps/reseller-app
```

From a local clone of this repository, copy the template to the VPS:

```bash
scp deploy/env.production.example \
  tencent-lighthouse:/srv/apps/reseller-app/env.production
```

Then replace every placeholder on the VPS. Generate a URL-safe database password with:

```bash
openssl rand -hex 32
```

Use that same value in `POSTGRES_PASSWORD` and the password portion of `DATABASE_URL`, then protect
the file:

```bash
chmod 600 /srv/apps/reseller-app/env.production
```

The deployment script applies committed Prisma migrations on every release. On the first successful
deployment only, it runs the fixture seed and creates `/srv/apps/reseller-app/.seeded`.
Do not remove that marker unless the PostgreSQL volume has been intentionally recreated and needs
fresh fixture data.

## Connect global Caddy

The global proxy should mount `/srv/proxy/apps` read-only and import its snippets. Its root
`/srv/proxy/Caddyfile` should contain:

```caddyfile
import /etc/caddy/apps/*.caddy
```

From a local clone of this repository, install this application's snippet:

```bash
scp deploy/reseller-app.caddy \
  tencent-lighthouse:/srv/proxy/apps/reseller-app.caddy
```

Then validate and reload it on the VPS:

```bash
cd /srv/proxy
docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile
```

The DNS `A` records for `reseller.azarnuzy.com` and `api.reseller.azarnuzy.com` must point to the
VPS public IP before Caddy can issue certificates.

## GitHub production configuration

Create a GitHub environment named `production`. Add these secrets:

| Name | Value |
|---|---|
| `VPS_HOST` | VPS public IP or resolvable hostname |
| `VPS_SSH_PRIVATE_KEY` | Private key dedicated to GitHub Actions deployment |
| `VPS_KNOWN_HOSTS` | Verified `known_hosts` line for the VPS |

Optional environment variables:

| Name | Default |
|---|---|
| `VPS_USER` | `ubuntu` |
| `VPS_PORT` | `22` |

Create a dedicated key locally, install only its public key on the VPS, and store the private key in
GitHub:

```bash
ssh-keygen -t ed25519 -f ./tencent-gh-actions -C "github-actions-reseller-app"
ssh-copy-id -i ./tencent-gh-actions.pub ubuntu@YOUR_VPS_IP
ssh-keyscan -H YOUR_VPS_IP
```

Compare the scanned host fingerprint with the key already trusted by your local SSH client or the
server console before saving it as `VPS_KNOWN_HOSTS`.

## First GHCR publication

GitHub creates a newly published container package as private by default, including packages from a
public repository. The first `main` workflow will publish both packages and then stop at the public
readability check.

For each package, open its package settings on GitHub, change visibility to **Public**, and rerun the
failed deploy job. Future deployments need no GHCR credentials on the VPS.

## Operations

Check the deployed release:

```bash
cd /srv/apps/reseller-app
docker compose --env-file env.production --env-file .release.env -f compose.prod.yaml ps
curl --fail https://api.reseller.azarnuzy.com/health
curl --fail --head https://reseller.azarnuzy.com
```

Roll back application images to an earlier commit SHA:

```bash
cd /srv/apps/reseller-app
./deploy.sh PREVIOUS_FULL_COMMIT_SHA
```

The rollback changes application images only. A database migration may require a separate,
explicitly designed backward migration.
