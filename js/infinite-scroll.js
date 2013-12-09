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
                iteration: 1
            },
            is = {
                loading: false
            },
            settings,
            initiated = false,
            returnOBJ,
            ajax;

        function queueData (data) {
            var queue = [],
                piece;

            for (var i = 0, len = data.length; i < len; i++) {
                piece = data[i];

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

            if ($.isFunction(settings.insert)) {
                settings.insert($this, $widgets);
            } else if (settings.prepend) {
                $this.prepend($widgets);
            } else if (settings.append) {
                $this.append($widgets);
            }

            if ($.isFunction(settings.afterWidgetsInserted))
                settings.afterWidgetsInserted();

            is.loading = false;
            properties.iteration++;
        }

        function getWidgets () {
            var request;

            if (is.loading)
                return false;

            is.loading = true;
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
            var $scrollable = settings.scroller;

            $scrollable.scroll(function(e) {
                e.stopPropagation();

                if (is.loading)
                    return false;

                var offset = $this.height() - $scrollable.height();
                offset = offset - settings.threshold;

                if ($scrollable.scrollTop() >= offset) {
                    getWidgets();
                }

                return false;
            });

        }

        function setAjaxObject (ajaxOptions) {
            ajax = $.extend({}, ajax, ajaxOptions);
        }

        function init () {
            if (initiated === false) {
                settings = $.extend({}, defaults, options);
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