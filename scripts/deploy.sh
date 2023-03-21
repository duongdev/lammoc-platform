git fetch -p && git checkout main && git reset --hard origin/main && git fetch -p && for branch in $(git branch -vv | grep ': gone]' | awk '{print $1}'); do git branch -D $branch; done && yarn
yarn prisma migrate deploy & yarn build
