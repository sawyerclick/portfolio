# What do we have here?

Sawhorse is a work-in-progress templating system

# How to use sawhorse

You'll want to use the [sawhorse command-line interface](https://github.com/littlecolumns/sawhorse-cli) to set up a new sawhorse project.

First you'll install sawhorse globally.

```
npm install -g sawhorse
```

That will install the `sawhorse` command, which you can then use to create a new project. The command below will create a new `my-project` folder with a sawhorse template project inside.

```
sawhorse create my-project
```

Once you've done that, you can go into the directory, install the dependencies, and fire up a server.

```
cd my-project
npm install
npm run start
```

Visit `localhost:1234` and life should be good.

# How to customize sawhorse

> To see what's going on, it's best to just take a look at `src/index.hbs`, then poke around the other folders/files in `src`.

## The setup

* `/src` is for your [actual web pages](#making-new-pages)
* `/src/html` is for your [HTML partials](#using-partials)
* `/src/html/layouts` is for your [layout files](#using-layouts)
* `/src/data` is for your [data files](#using-data)
* `/src/scripts` is for your [JavaScript code](#using-javascript)
* `/src/images` is for your [images](#using-images)

## Things in the `src` folder

### Making new pages

By default, you have a file called `src/index.hbs`. This Handlebars file is turned into `index.html`, and shows up when you visit localhost:1234. 

If you only want one page on your web site, you can just edit `src/index.hbs`. If you want multiple pages, you can add them here - `src/about.hbs`, `src/homework-07.hbs`, etc.

### Using partials

Sometimes you have code you want to reuse on multiple pages - a navbar, for example. If you had the navbar on every single page, adding a link to it would mean editing every single page! Instead of repeating code, you can store the navbar in a separate file, and just say "hey Parcel! Just include the navbar here"

You might also want to keep code separate for organizational reasons - maybe each chart gets its own HTML file, or your header or footer.

These separate files are called **partials**. A partial just looks like normal HTML code.

```
<div class="story-body">
  <h1>Hello this is a file</p>
  <p>Quisque commodo, orci a varius rhoncus, diam magna consectetur lectus, tincidunt consectetur lectus ipsum vel leo. Mauris in augue eu ex euismod facilisis ac quis ipsum.</p>
</div>
```

Partials live in folders inside of `src/html`. For example, below we have two in `src/html/base/` and two in `src/html/story/`.

```
src/
  html/
    base/
      navbar.hbs
      footer.hbs
    story/
      basic.hbs
      illustrator.hbs
```

To use a partial, you add code to tell Handlebars to include it on a certain page. For example, if I wanted a navbar on my homepage, I would add the following code to `src/index.hbs`.

```
{{> base/navbar}}
```

This isn't anything magic, it just says "go get a partial called `navbar.hbs` from the `base` folder." See `src/index.hbs` for details.

Folder names aren't magic, either - if I made a folder called `homework-07` and put `bar-chart.hbs` inside of it, I could then start including it with `{{> homework-07/bar-chart }}`

### Using layouts

Inside of `src/html/layouts` you have templates for web pages. If you have different kinds of pages - some with bootstrap, some with the class template - you can make multiple layouts. If all of your pages look the same, you won't need to worry about it.

### Using data

You should put all of your data into `src/data` to keep it organized.

When you're writing a D3 script, you need to make sure you use `require` to find the file you're looking for. That code looks like this:

```js
d3.csv(require('../data/countries.csv')).then(ready)
```

### Using JavaScript

JavaScript files go into `src/scripts`. To make sure they're used, you need to add them from the page they're on using a `script` tag.

Even if they're being used in a partial you always include the JavaScript file as `scripts/filename.js`, like below.

```html
<script src="scripts/chart-01.js"></script>
```

### Using images

Images go into `src/images`.

Even if they're being used in a partial, you always include the image files as `images/filename.jpg`, like below.


```html
<img src="images/cat.jpg"></p>
```

## Using ai2html

If you have an Illustrator file you'd like to work on, move it into the `illustrator` folder. This folder has the `ai2hml` script, as well as a basic `ai2html-config.json` file you can use to [fix all of your font size/type issues](https://gist.github.com/jsoma/631621e0807b26d49f5aef5260f79162).

When ai2html runs, it exports several files. For example, let's say I run ai2html on `illustrator/illustrator_demo.ai`, I'll get this list:

```
ai2html-output/
  illustrator_demo.hbs
  images/
    illustrator_demo-laptop.png
    illustrator_demo-medium.png
    illustrator_demo-mobile.png
```

If yours exports the web page as a `.html` file instead of an `.hbs` file, no problem - just rename it. You can have it always export an `.hbs` file by changing the `html_output_extension` option in the actual Illustrator file (the text block on the left).

1. We're going to use this html/Handlebars file as a partial. Copy it to `src/html/story`. **You don't have to edit it at all!*
2. Copy the images to `src/images/`

Now you can include the partial on whatever page you'd like.

```
{{> story/illustrator_demo }}
```

Refresh your page, and the graphic should show up *and* be responsive *and* you didn't even have to edit any HTML!

**Please note** that yours won't be called `illustrator_demo`. The filename isn't special, it's just the default because my Illustrator file was `illustrator_demo.ai`.

# Publishing to GitHub Pages

## Generating the finished code

To generate a "finished" web page, you need to build your site.

```
npm run build
```

This command tells Parcel to bundle everything up for production. The finished code will be moved into the `/docs` folder. **Commit and push to GitHub**

## Setting up the web site

This part isn't so hard. Once you've pushed and your content is up on GitHub, follow these steps.

1. Visit your repository's page on GitHub
2. Click the **Settings** tab.
3. Scroll down to the **Github Pages** section.
4. Select **master branch /docs folder** as your source, and GitHub will start building your web site from the contents of that folder.

Please note that **you must run** `npm run build` before comitting/pushing. You'll definitely forget this (I do all the time!), so when your changes aren't showing up try running it again, then commit+push.