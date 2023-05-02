# Contributing

## Development

Install all the project dependencies with:

```
npm ci
```

Start the local development server with:

```
npm start
```

The plugin will be served from [http://localhost:3000/](http://localhost:3000/). Insert this URL as the plugin [Entry point URL](https://www.datocms.com/docs/plugins/creating-a-new-plugin/).

## Publishing

Before publishing this plugin, make sure:

* you've properly described any configuration parameters in this README file;
* you've updated the changelog with relevant information;
* you've properly compiled this project's `package.json` following the [official rules](https://www.datocms.com/docs/plugins/publishing/).

When everything's ready, just run:

```
npm publish
```
