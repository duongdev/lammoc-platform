# Prompt which branch to deploy and echo description on each command
set -e
set -x

# Checkout main branch and reset to origin
git fetch -p
git checkout main
git reset --hard origin/main
# Delete all local branches that have been deleted on remote
git fetch -p && for branch in $(git branch -vv | grep ': gone]' | awk '{print $1}'); do git branch -D $branch; done

# Pull latest changes
yarn
yarn prisma migrate deploy &
yarn prisma generate &
yarn build

# Restart pm2
pm2 reload ecosystem.config.js
