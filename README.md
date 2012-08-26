status-jquery-crawler
=====================

Check for broken links in yout website with jQuery

Version 0.2.0

(c) 2012 Riccardo Forina 
Status.js may be freely distributed under the MIT license. 
For details and documentation: 
http://www.codingnot.es 


# Status.js, a jQuery crawler

<img alt="Preview of Status.js" class="img-polaroid" src="http://www.codingnot.es/static/screens/status_beta_v01.png">

## Demo

[Demo: See it in action!](http://www.codingnot.es/status/)

## How does it work?

Status.js will scan the website it's hosted on from the root (/) for links.  
Internal links will be followed (fetched through Ajax) and scanned again. Yes, it's recursive.  
External links will be memorized and used for cross-referencies. You can't check if an external link is broken with Status.js because of the cross-domain limitation of Ajax calls.

A table with some nice data will be populated in real time while Status.js is working.

Sometimes something more graphic is better, so I implemented the Javascript InfoVis Toolkit ([Jit](https://github.com/philogb/jit)) in Status.js to plot the website as a graph you can interact with.

Last but not lest, there is a sitemap.xml generator that makes use of the crawler work. Nothing fancy, but if you can't generate a sitemap in a more correct way it can be useful.


## How is it done?

Status.js is a [Backbone](http://documentcloud.github.com/backbone/) application.  
For Ajax and DOM manipulation, there is [jQuery](jquery.com).  
The url manipulation is powered by [jsUri](https://github.com/derek-watson/jsUri). 
Plotting done with Javascript InfoVis Toolkit ([Jit](https://github.com/philogb/jit)). 
The GUI part is [Twitter Bootstrap](http://twitter.github.com/bootstrap/).

## What can I check with Status.js?

### Url

The url of the page. To avoid duplication, hashes will be removed.

### Title

Available for internal pages only, the <code>title</code> tag is fetched. If not present, you'll get a <code>{No title}</code> placeholder.

### Description

Available for internal pages only, the <code>meta name="description"</code> tag is fetched. If not present, you'll get a <code>{No description}</code> placeholder.

### Status

Because of the Javascript-in-a-browser limitations, we can handle only these statuses:
<dl class="dl-horizontal">
<dt>Success</dt>
<dd>Available for internal pages only, means a correctly fetched page.</dd>
<dt>External</dt>
<dd>Indicates an external link.</dd>
<dt>Redirect</dt>
<dd>Indicates that there is another page for the same url but with a trailing slash. It's an hack around the browser that does not return any 30x http code</dd>
<dt>Error</dt>
<dd>_Broken link!_</dd>
<dt>Unfetched</dt>
<dd>Page memorized but waiting to be crawled.</dd>
</dl>

### Out links

It's the number of internal and external links present in the page. Clicking on the number you'll get the full list.

### In links

It's the number of pages that link to the url. Clicking on the number you'll get the full list.

## TODO list

This is a list of some of the things I'll have to work on. Please feel free to contribute with suggestions!

* Warnings about duplicate/too long/missing titles/descriptions.
* Verify for the presence of Google Analytics.
* Check for broken images
* Warning about missing/bad alt tags for images.
* Pagination
* Performance tests
* Let's be honest... _do_ tests!
* Code cleaning, comments, etc.

