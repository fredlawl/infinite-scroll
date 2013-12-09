(function ($) {

    $.infiniteScroll = function (element, options) {

        var $this = $(element),
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
                iteration: 1,
                loading: false,
                ajax: null
            },
            settings;

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

            properties.loading = false;
            properties.iteration++;
        }

        function getWidgets () {
            var request;

            if (properties.loading)
                return false;

            properties.loading = true;
            if ($.isFunction(settings.onBeforeLoad))
                settings.onBeforeLoad();

            request = $.ajax(properties.ajax);
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

            console.log('getWidgets called!')
        }

        function bindings () {
            var $scrollable = settings.scroller;

            $scrollable.scroll(function(e) {
                e.stopPropagation();

                if (properties.loading)
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
            properties.ajax = $.extend({}, properties.ajax, ajaxOptions);
        }

        function init () {
            settings = $.extend({}, defaults, options);

            if ($.isFunction(settings.onInit)) {
                settings.onInit(settings);
            }

            if (settings.loadOnInit) {
                getWidgets();
            }

            bindings();
        }

        init();

        return = {
            settings: settings,
            properties: $.extend({}, properties),
            setAjax: setAjaxObject
        };

    };

    $.fn.infiniteScroll = function(options) {
        return this.each(function() {
            // if plugin has not already been attached to the element
            if (undefined == $(this).data('pluginName')) {
                var plugin = new $.pluginName(this, options);
                $(this).data('infiniteScroll', plugin);
            }

        });
    }

})(jQuery);