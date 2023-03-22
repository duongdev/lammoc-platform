# Prompt which branch to deploy and echo description on each command
set -e
set -x

# Read branch name from user, defaults to main. Allow to select from list of branches
branches=$(git branch -r | sed 's/origin\///g')
if [[ -z $branch ]]; then
  echo "Please select a branch to deploy:"
  select branch in $branches; do
    if [[ -z $branch ]]; then
      echo "Invalid branch, please try again"
    else
      break
    fi
  done
fi

git fetch -p
git checkout $branch
git reset --hard origin/$branch
git fetch -p && for branch in $(git branch -vv | grep ': gone]' | awk '{print $1}'); do git branch -D $branch; done
yarn
yarn prisma migrate deploy &
yarn build
pm2 delete all
pm2 start ecosystem.config.js
