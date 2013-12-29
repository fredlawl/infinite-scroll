(function ($) {

    /**
     * $.infiniteScroll
     *
     * @author Frederick Lawler
     * @license MIT
     */

    $.infiniteScroll = function (element, options) {

        var $this = $(element),
            plugin = this,
            $window = $(window),
            $document = $(document),
            defaults = {
                // Make first ajax call on plugin intialization
                loadOnInit: true,

                // Element that contains the view
                scroller: $(window),

                // Pixels from bottom of "scroller" to insert widgets
                threshold: 200,

                // Delay from ajax call to insert widgets
                timeout: 200,

                // Callback function to define custom insert function
                insert: null,

                // Callback function during the plugin initation process
                onInit: null,

                // Callback before the ajax function makes a request to server
                beforeAjax: null,

                // Callback if ajax status == 'success'
                onAjaxSuccess: null,

                // Callback after widgets have been inserted into DOM
                afterInsert: null
            },
            properties = {
                iteration: 1,
                scrollOffset: 0
            },
            is = {
                allowedToScroll: true
            },
            settings,
            returnOBJ,
            ajax,

            $scrollable;


        /**
         * addData
         * Takes the response from ajax and preps it for insertion. Calls
         * initiateInsertion function.
         */

        function addData (data) {
            var $widgets = $(data);

            if (settings.timeout > 0) {
                setTimeout(function () {
                    initiateInsertion($widgets);
                }, settings.timeout);
            } else {
                initiateInsertion($widgets);
            }

            properties.iteration++;
        }


        /**
         * initiateInsertion
         * Inserts the widgets into the view
         */

        function initiateInsertion ($widgets) {

            if ($.isFunction(settings.insert)) {
                settings.insert($this, $widgets);
            } else {
                $this.append($widgets);
            }

            if ($.isFunction(settings.afterInsert))
                settings.afterInsert();

            setOffset();
            $scrollable.on('scroll.infiniteScroll', whileScrolling);
            is.allowedToScroll = true;
        }


        /**
         * getWidgets
         * Makes ajax request to pull in widgets
         *
         * @precondition setAjax needs to be defined for ajax to work.
         */

        function getWidgets () {
            var request;

            is.allowedToScroll = false;
            $window.off('scroll.infiniteScroll');

            if ($.isFunction(settings.beforeAjax))
                settings.beforeAjax(returnOBJ);

            if (typeof ajax === 'undefined')
                throw new Error('Please define ajax by calling "setAjax()"');

            request = $.ajax(ajax);
            request.done(function (data, status, xhr) {
                if (status == 'success') {
                    if ($.isFunction(settings.onAjaxSuccess)) {
                        settings.onAjaxSuccess(returnOBJ);
                    }

                    addData(data);
                }
            });
        }


        /**
         * bindings
         * Called during init to set the bindings
         */

        function bindings () {
            $scrollable.on('scroll.infiniteScroll', whileScrolling);
            $scrollable.on('resize.infiniteScroll', setOffset);
        }


        /**
         * whileScrolling
         * Called when the $.scroll event is fired.
         *
         * @param Event e
         * @return Boolean false if scroll is not allowed
         */

        function whileScrolling (e) {
            if (!is.allowedToScroll)
                return false;

            if ($scrollable.scrollTop() >= properties.scrollOffset) {
                getWidgets();
            }
        }


        /**
         * setOffset
         */

        function setOffset () {
            properties.scrollOffset = $this.height() - $scrollable.height();
            properties.scrollOffset -= settings.threshold;
        }


        /**
         * setAjaxObject
         *
         * @param Plain Object ajaxOptions
         */

        function setAjaxObject (ajaxOptions) {
            ajax = ajaxOptions;
        }


        /**
         * init
         * Initates plugin
         */

        var init = function () {

            settings = $.extend({}, defaults, options);
            $scrollable = settings.scroller;
            setOffset();

            returnOBJ = {
                settings: settings,
                properties: properties,
                setAjax: setAjaxObject
            };

            if ($.isFunction(settings.onInit)) {
                settings.onInit(settings);
            }

            if (settings.loadOnInit) {
                getWidgets();
            }

            bindings();

            init = function () {
                return returnOBJ;
            }

        }

        return init();
    };

    $.fn.infiniteScroll = function (options) {
        return this.each(function() {
            if (typeof $(this).data('infiniteScroll') === 'undefined') {
                var plugin = new $.infiniteScroll(this, options);
                $(this).data('infiniteScroll', plugin);
            }
        });
    }

})(window.jQuery || window.Zepto || window.$);