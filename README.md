Infinite Scroll jQuery/Zepto Plugin
====================

This is a highly-customizable infinite scroll plugin. The goal was to decouple
non-essential functionality from the core functionality of a infinite scroller.

Installation
-------------------
1. Download the minified file
2. Insert it into your page, after jQuery or Zepto has been loaded
3. Use the plugin

### Example
I setup a PHP script with the repository to generate content to be ajaxed in.

Clone the repository into a PHP/Apache ready folder and run the index.html file.

- Uses Twitter Bootstrap
- Uses jQuery
- Uses Isotope (for example implementation)

Useage
--------------------

```JavaScript
$('.content-container').infiniteScroll({
    threshold: 500,
    timeout: 800,
    scroller: $(window),
    beforeAjax: function (plugin) {
        plugin.setAjax({
            url: './article.php',
            cache: false,
            data: {
                posts_per_page: 6,
                page: plugin.properties.iteration
            }
        });
    }
});
```

Is all that is needed to get your content to scroll!

###ZeptoJS Quirks
In order for the plugin to work with ZeptoJS, the following Zepto modules are
needed:

- [callbacks](https://github.com/madrobby/zepto/blob/master/src/callbacks.js#files)
- [deferred](https://github.com/madrobby/zepto/blob/master/src/deferred.js#files)
- [data](https://github.com/madrobby/zepto/blob/master/src/data.js#files)


MIT License
--------------------
The MIT License

Copyright (c) 2013 FredLawl Development

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.