#!/usr/bin/env bash

set -Eeuo pipefail

readonly APP_DIRECTORY="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly ENV_FILE="${APP_DIRECTORY}/env.production"
readonly RELEASE_FILE="${APP_DIRECTORY}/.release.env"
readonly CANDIDATE_FILE="${APP_DIRECTORY}/.candidate.env"
readonly SEED_MARKER="${APP_DIRECTORY}/.seeded"
readonly IMAGE_TAG="${1:-}"

if [[ ! "${IMAGE_TAG}" =~ ^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$ ]]; then
  echo "Usage: $0 IMAGE_TAG" >&2
  exit 64
fi

if [[ ! -f "${ENV_FILE}" ]]; then
  echo "Missing ${ENV_FILE}. Copy env.production.example and add production secrets." >&2
  exit 66
fi

cd "${APP_DIRECTORY}"

exec 9>"${APP_DIRECTORY}/.deploy.lock"
if ! flock -n 9; then
  echo "Another deployment is already running." >&2
  exit 75
fi

umask 077
printf 'IMAGE_TAG=%s\n' "${IMAGE_TAG}" > "${CANDIDATE_FILE}"
trap 'rm -f "${CANDIDATE_FILE}"' EXIT

compose=(
  docker compose
  --env-file "${ENV_FILE}"
  --env-file "${CANDIDATE_FILE}"
  -f "${APP_DIRECTORY}/compose.prod.yaml"
)

echo "Validating release ${IMAGE_TAG}..."
"${compose[@]}" config --quiet

echo "Pulling immutable application images..."
"${compose[@]}" pull api platform migrate seed

echo "Starting PostgreSQL and applying migrations..."
"${compose[@]}" up -d postgres
"${compose[@]}" run --rm migrate

if [[ ! -f "${SEED_MARKER}" ]]; then
  echo "Fresh deployment detected; seeding the production database once..."
  "${compose[@]}" run --rm seed
  touch "${SEED_MARKER}"
fi

echo "Starting application services..."
if ! "${compose[@]}" up -d --remove-orphans --wait --wait-timeout 180 api platform; then
  "${compose[@]}" ps
  "${compose[@]}" logs --tail=150 api platform
  echo "Deployment failed. Re-run this script with the previous commit SHA to roll back the images." >&2
  exit 1
fi

"${compose[@]}" ps
mv "${CANDIDATE_FILE}" "${RELEASE_FILE}"
trap - EXIT
echo "Release ${IMAGE_TAG} is healthy."
