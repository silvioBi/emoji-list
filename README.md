# emoji-list

React app to search and copy emoji, developed using [create-react-app](https://github.com/facebook/create-react-app) and deployed with 💕 and [gh-pages](https://www.npmjs.com/package/gh-pages) on [Github Pages](https://pages.github.com/)
## Link to the project
[Emoji list](https://silviobi.github.io/emoji-list/)

## Build and deploy

I like to use [yarn](https://yarnpkg.com/lang/en/) but [npm](https://www.npmjs.com/) should do the job as well, just run the following commands in the project folder:

```
yarn install

yarn start
```

To deploy it to your site just change the homepage in `package.json` to:

```
"homepage": "http://[github-username].github.io/[github-repository-name]",
```

Follow the [gh-pages documentation](https://www.npmjs.com/package/gh-pages) for more info.