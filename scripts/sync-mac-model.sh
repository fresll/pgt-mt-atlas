#!/bin/bash
# Creates a separate checkout; never replaces an existing Documents folder.
# Usage: bash sync-mac-model.sh [existing_repo] [new_folder] [optional_git_bundle]
set -euo pipefail

task_branch='model/uncertainty-2026-10-12'
task_repo="${1:-$HOME/Documents/pgt-mt-atlas-codex}"
task_target="${2:-$HOME/Documents/pgt-mt-atlas-math}"
task_bundle="${3:-}"

git -C "$task_repo" rev-parse --git-dir >/dev/null
if [ -e "$task_target" ] || [ -L "$task_target" ]; then
  printf 'Destination already exists; nothing was replaced: %s\n' "$task_target" >&2
  exit 1
fi

if [ -n "$task_bundle" ]; then
  # Requires the audited parent commit already present in the existing repo.
  git -C "$task_repo" bundle verify "$task_bundle"
  git -C "$task_repo" fetch "$task_bundle" "refs/heads/$task_branch"
  task_sha=$(git -C "$task_repo" rev-parse FETCH_HEAD)
else
  task_origin=$(git -C "$task_repo" remote get-url origin)
  case "$task_origin" in
    https://github.com/fresll/pgt-mt-atlas|https://github.com/fresll/pgt-mt-atlas.git|git@github.com:fresll/pgt-mt-atlas|git@github.com:fresll/pgt-mt-atlas.git) ;;
    *) printf 'Expected the fresll/pgt-mt-atlas origin; nothing was replaced.\n' >&2; exit 1 ;;
  esac
  git -C "$task_repo" fetch origin "$task_branch"
  task_sha=$(git -C "$task_repo" rev-parse FETCH_HEAD)
fi

git -C "$task_repo" worktree add --detach -- "$task_target" "$task_sha"
test "$(git -C "$task_target" rev-parse HEAD)" = "$task_sha"
printf 'Saved checkout: %s\nCommit: %s\nModel specification: %s/docs/mathematical_model.md\n' "$task_target" "$task_sha" "$task_target"
