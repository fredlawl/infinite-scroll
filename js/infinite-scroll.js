(function ($) {

    $.infiniteScroll = function (element, options) {

        var $this = $(element),
            plugin = this,
            $window = $(window),
            $document = $(document),
            defaults = {
                loadOnInit: true,
                scroller: $(window),
                threshold: 200,
                timeout: 200,

                append: true,
                prepend: false,
                insert: null,

                onInit: null,

                onBeforeLoad: null,
                onSuccess: null,    // Called on jQuery.ajax.done

                beforeQueueAjaxedItem: null,
                afterItemsQueued: null,

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
            initiated = false,
            returnOBJ,
            ajax,

            $scrollable;

        function queueData (data) {
            var queue = [],
                piece;

            for (var i = 0, len = data.length, piece; i < len, piece = data[i]; i++) {
                if ($.isFunction(settings.beforeQueueAjaxedItem))
                    piece = settings.beforeQueueAjaxedItem(piece);

                queue.push(piece);
            }

            if ($.isFunction(settings.afterItemsQueued))
                queue = settings.afterItemsQueued(queue);

            addData(queue);
        }

        function addData (queue) {
            var $widgets = $(queue.join(''));

            if (settings.timeout > 0) {
                setTimeout(function () {
                    initiateInsertion($widgets);
                }, settings.timeout);
            } else {
                initiateInsertion($widgets);
            }

            properties.iteration++;
        }

        function initiateInsertion ($widgets) {
            if ($.isFunction(settings.insert)) {
                settings.insert($this, $widgets);
            } else if (settings.prepend) {
                $this.prepend($widgets);
            } else if (settings.append) {
                $this.append($widgets);
            }

            if ($.isFunction(settings.afterWidgetsInserted))
                settings.afterWidgetsInserted();

            setOffset();
            $scrollable.on('scroll.infiniteScroll', whileScrolling);
            is.allowedToScroll = true;
        }

        function getWidgets () {
            var request;

            is.allowedToScroll = false;
            $window.off('scroll.infiniteScroll');

            if ($.isFunction(settings.onBeforeLoad))
                settings.onBeforeLoad(returnOBJ);

            request = $.ajax(ajax);
            request.done(function (data, status, xhr) {

                if (status == 'success') {
                    if ($.isFunction(settings.onSuccess)) {
                        settings.onSuccess({
                            data: data,
                            status: status,
                            xhr: xhr
                        }, properties);
                    }

                    queueData(data);
                }

            });
        }

        function bindings () {
            $scrollable.on('scroll.infiniteScroll', whileScrolling);
            $scrollable.on('resize.infiniteScroll', setOffset);
        }

        function whileScrolling (e) {
            e.preventDefault();

            if (!is.allowedToScroll)
                return false;

            if ($scrollable.scrollTop() >= properties.scrollOffset) {
                getWidgets();
            }
        }

        function setOffset () {
            properties.scrollOffset = $this.height() - $scrollable.height();
            properties.scrollOffset -= settings.threshold;
        }

        function setAjaxObject (ajaxOptions) {
            ajax = $.extend({}, ajax, ajaxOptions);
        }

        function init () {
            if (initiated === false) {
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
                initiated = true;
            }

            return returnOBJ;

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

})(jQuery);