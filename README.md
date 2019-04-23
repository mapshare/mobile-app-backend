# map-share-backend

Uses:
- NodeJs, Express
- MongoDB, Mongoose

Ensure you have heroku CLI installed.

- https://map-share-dev-api.herokuapp.com is for branch 'develop'
- https://map-share-api.herokuapp.com is for branch 'master'
Run `heroku git:remote -a map-share-dev-api` to set heroku remote for develop.
Run `heroku git:remote -a map-share-api` to set heroku remote for master.

Will NOT automatically deploy to heroku in order to avoid publicising MongoURL.
How to deploy?

create new local branch (`deploy-api`), and DO NOT PUSH this branch to GitHub!
Whenever there are changes to another branch that you want to deploy,
use `git pull branch_with_changes` to apply those changes to your local `deploy-api` branch.
Then, run `git push heroku deploy-api:master`, to deploy to heroku.

Remember to change the API url used in the frontend when merging from 'develop' to 'master'
