# DatoCMS plugin: Computed fields

**This DatoCMS plugin allows to compute and define a field value based on other fields. This allows pretty “preview” values in the CMS (used in model overviews and for linked models). And moves logic from clients to a central place: the API.**

![](https://github.com/voorhoede/datocms-plugin-computed-fields/raw/master/docs/plugin.png)

> Used code:
> ```JS
> const newDate = new Date(date)
> return `${title} | ${newDate.getFullYear()}
> ```

## Features

* Return specified values
* Use all javascript functionality
* Get a model and an upload with an ID
* Have access to all fields on the page

## Configuration

First add this plugin via DatoCMS Settings > Plugins > Add (`/admin/plugins/new`).

### Plugin settings

When adding the plugin you have to add a DatoCMS read only token in the general settings. This is necessary to be able to use two helper functions for returning uploads and models.

All code added in the plugin will be wrapped around an async function. This way you can use the two helper functions with an await.

Always return the value a field requires. For example:
* For a string it should be a string.
* For the JSON field it should be a JSON object.
* For a boolean it should be `true` or `false`

When you are not returning the value a field requires it will give a DatoCMS error.

#### Show debug code editor

> Only show this editor when you want to have a sandbox to help you make an usefull function.

![](https://github.com/voorhoede/datocms-plugin-computed-fields/raw/master/docs/plugin-debug-editor.png)

**Only for testing purposes:**
The value in this editor will not be saved. You copy this value and add it to the "Default function" option of this plugin.

#### Enter the default function

The value in this input will be wrapped around an async function. As soon as you add a return it will return that value.

All fields of the page you added will be automatically added as variable using the *field ID*.

When you have added the field *Title*, in the function you can use the variable `title` which would have the value of this field.

![](https://github.com/voorhoede/datocms-plugin-computed-fields/raw/master/docs/plugin-default-function.png)

#### Changed fields

When you change a field on the DatoCMS page there will be a variable available with the name of the field that changed.
The variable `changedField` can be used throughout the code.

Using `console.log(changedField)` will log the value of the field that has changed only if you use that field in your code. When you change a field that is not used in you code, the code will not be executed.

### Plugin helper functions

`getModel` and `getUpload` are functions to use in the plugin. When you have added the DatoCMS readonly token in the general settings of the plugin, you can use these two functions.

For example: When there is an `uploadId` you can use this function to get all data for this model.
```js
const model = await getModel(image.uploadId)
return model.title
```

## Plugin Fields

All fields in this list can be used together with the computed fields plugin. The checked values are designed to show data in a user friendly manner.

- [x] JSON (json)
- [x] Text (text)
- [x] Boolean (boolean)
- [ ] Float (float)
- [ ] Integer (integer)
- [x] String (string)
- [ ] Multiple links (links)
- [ ] Single link (link)
- [ ] Date (date)
- [ ] Date-time (date_time)
- [ ] Video (video)
- [ ] Color (color)
- [ ] Seo (seo)
- [ ] Geolocation (lat_lon)

## Contributing

See [contributing.md](https://github.com/voorhoede/datocms-plugin-computed-fields/blob/master/contributing.md).

## Credits

Scaffolded using [DatoCMS plugin Yeoman generator](https://github.com/datocms/generator-datocms-plugin).

## License

*MIT Licensed* by [De Voorhoede](https://www.voorhoede.nl).
