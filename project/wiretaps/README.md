# Data Studio project template

#### Lede Program @ Columbia University
Data studio projects, Summer 2019

## Getting started

### How do I use this?

Every time you want to start a new project, you can **clone this repo**:

	git clone https://github.com/hilaryfung/data-studio-2019 your-project-name/

It's best to start with a fresh folder on your computer for each project. This will also keep you organized. Once you've cloned the folder to start a new project, you can reinitialize the git repo so you can link it up to your own github as its own separate project. Create a new repo for your project on Github, and follow the instructions for linking up your local project directory to the remote repo URL.

	git init
	git remote add origin REMOTE-URL

Then you make your inital commit and get started!

	git add .
	git commit -m "initial commit"
	git push -u origin master


### What's in here

You can use this template for your summer projects. It includes everything you need to lay out a story for the web – text styles, chart layouts, places to put photos, etc.

The `index.html` file contains examples of all of the options. The `simple.html` file is a simple version of a basic project layout.

Project folder structure
- `index.html`
- `simple.html`
- `README.md` (this file)
- `styles/` folder
	- `styles.css` (where all your CSS lives)
- `images/` folder
	- all of your images, including your chart exports, live in here


## Setting up a page

The `index.html` file has all of the available options. The template already includes pre-written default CSS styles so you can get a basic page up and running quickly. Most news organizations have a template they work with in a similar fashion – there will likely already be a set style guide in place and a simplified template to use for your projects to keep design consistent.


### Common HTML structure and CSS classes you'll use

Line by line from the `index.html`

#### Body themes: `.light-theme` vs `.dark-theme`:

LINE 18

Light theme is the default – a white background with black text:

	<body class="light-theme">

But you can flip it and give the page a dark background with white text:

	<body class="dark-theme">


#### The page header: using `.header` class:

LINE 20 - 26 

Includes all the options for styling the text making up the top of your story

	<div class="header">
      <p class="kicker">Optional kicker</p>
      <h1 class="headline">The graphic headline</h1>
      <h2 class="subhead">If you need a subhead, it can go here.</h2>
      <p class="byline">By Firstname Lastname</p>
      <p class="date">Published Month XX, 2019</p>
    </div>

#### Story text: `.story-body` sections and `.body-text` 

LINE 28

You can wrap all of the body text in your story inside a `.story-body` div. Each paragraph of body text can go inside a `<p class="body-text"></p>`.

	<div class="story-body">
		<p class="body-text">Here's a nice paragraph.</p>
		<p class="body-text">Here's a second paragraph.</p>
	</div>


#### Chart divs: `.chart-section` and putting charts into your page

LINE 33, LINE 48 & LINE 73

There are a few different layout options for charts. Here's the most basic chart HTML structure:

	<div class="chart-section">
        <p class="chart-title">Chart title</p>
        <p class="chart-subhead">This is a standard, single chart</p>
        <div class="chart-row">
          <div class="chart">
            <img src="path/to/chart.png"/>
          </div>
        </div>
        <p class="chart-source">Sources: One source; another source</p>
    </div>

All the charts you want to add can go inside the `.chart-row` div. You can have up to **four** `.chart` divs in a single `.chart-row`. There examples of this on line 51 and 76.

	<div class="chart-section">
        <p class="chart-title">Chart title</p>
        <p class="chart-subhead">This is a standard, single chart</p>
        <div class="chart-row">
          <div class="chart"> 
          <!-- One chart! -->
            <img src="path/to/chart.png"/>
          </div>
          <div class="chart">
           <!-- One chart! -->
            <img src="path/to/chart.png"/>
          </div>
        </div>
        <p class="chart-source">Sources: One source; another source</p>
    </div>

If you have multiple charts, you can give each of them individual labels by adding a `<p class="chart-label">Chart label</p>` inside the `.chart` div above the `<img>` tag.

If you want the `.chart-section` to be the same width as the body of your story, you can add the HTML _within_ the `.story-body` div, like so:

	<div class="story-body">
		<!-- story body text -->
		<div class="chart-section">
			<!-- chart stuff -->
		</div>
	</div>

If you want it to be wider than the body of the story, you can place the `.chart-section` div _outside_ the `.story-body` divs. It will have a maximum width of 1200px by default, but you can change this in the CSS.

	<div class="story-body">
		<!-- story body text -->
	</div>

	<div class="chart-section">
		<!-- chart stuff -->
	</div>

	<div class="story-body">
		<!-- story body text -->
	</div>


#### Adding in photos: `.photo-section` and adding other images to your page

LINE 123 and LINE 136

Adding photos works similarly to adding charts. You can add a `.photo-section` either within a `.story-body` div...

	<div class="story-body">
		<!-- story body text -->
	
		<div class="photo-section">
	      <div class="photo">
	        <img src="path/to/image.jpg" alt="Alt text for image for accessibility" />
	        <p class="caption">Photo caption (Firstname Lastname/AGENCYNAME)</p>
	      </div>
	    </div>
    </div>


... or you can break it out of the `.story-body` div...

	<div class="story-body">
		<!-- story body text -->
	</div>
	<div class="photo-section">
      <div class="photo">
        <img src="path/to/image.jpg" alt="Alt text for image for accessibility" />
        <p class="caption">Photo caption (Firstname Lastname/AGENCYNAME)</p>
      </div>
    </div>

You can have up to three `.photo` divs in the same `.photo-section` – similar to how `.chart` works within `.chart-row`. An example is on line 136.



#### Other helper classes

- `.serif` and `.sans-serif`
	- These classes make the font either the default serif font (Lora) or the default sans-serif font (Open Sans)
	- The page default is sans-serif
	- Usually story body text is in a serif font for readability, and graphics-related or sidebar-type content is in a sans-serif so there is a visual distinction between types of content
- `.text-center` will center your text


