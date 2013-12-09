(function ($) {

    $.fn.infiniteScroll = function (options) {

        var plugin = this,
            $this = $(this),
            $window = $(window),
            $document = $(document),
            defaults = {
                loadOnInit: true,
                scroller: $(window),
                threshold: 200,
                targetScript: null,

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
                ajaxSettings: {
                    url: null,
                    cache: false
                }
            },
            returnplugin,
            settings;

        function queueData (data) {
            var queue = [],
                piece;

            for (var i = 0, len = data.length; i < len; i++) {
                piece = data[i];

                if ($.isFunction(plugin.settings.beforeQueueAjaxedItem))
                    piece = plugin.settings.beforeQueueAjaxedItem(piece);

                queue.push(piece);
            }

            if ($.isFunction(plugin.settings.afterItemsQueued))
                queue = plugin.settings.afterItemsQueued(queue);

            addData(queue);
        }

        function addData (queue) {
            var $widgets = $(queue.join(''));

            if ($.isFunction(plugin.settings.insert)) {
                plugin.settings.insert($this, $widgets);
            } else if (plugin.settings.prepend) {
                $this.prepend($widgets);
            } else if (plugin.settings.append) {
                $this.append($widgets);
            }

            if ($.isFunction(plugin.settings.afterWidgetsInserted))
                plugin.settings.afterWidgetsInserted();

            plugin.properties.loading = false;
            plugin.properties.iteration++;
        }

        function getWidgets () {
            var request;

            if (plugin.properties.loading)
                return false;

            plugin.properties.loading = true;
            if ($.isFunction(plugin.settings.onBeforeLoad))
                plugin.settings.onBeforeLoad();

            request = $.ajax(plugin.properties.ajaxSettings);
            request.done(function (data, status, xhr) {

                if (status == 'success') {
                    if ($.isFunction(plugin.settings.onSuccess)) {
                        plugin.settings.onSuccess({
                            data: data,
                            status: status,
                            xhr: xhr
                        }, plugin.properties);
                    }

                    queueData(data);
                }

            });

            console.log('getWidgets called!')
        }

        function bindings () {
            var $scrollable = plugin.settings.scroller;

            $scrollable.scroll(function(e) {
                e.stopPropagation();

                if (plugin.properties.loading)
                    return false;

                var offset = $this.height() - $scrollable.height();
                offset = offset - plugin.settings.threshold;

                if ($scrollable.scrollTop() >= offset) {
                    getWidgets();
                }

                return false;
            });

        }

        function setAjaxSettings (ajaxOptions) {
            plugin.properties.ajaxSettings = $.extend({}, plugin.properties.ajaxSettings, ajaxOptions);
        }

        if (typeof options !== 'undefined') {
            plugin.settings = $.extend({}, defaults, options);
            plugin.properties = properties;

            plugin.properties.ajaxSettings.url = plugin.settings.targetScript;

            if ($.isFunction(plugin.settings.onInit)) {
                plugin.settings.onInit(plugin.settings);
            }

            if (plugin.settings.loadOnInit) {
                getWidgets();
            }

            bindings();
        }

        return {
            settings: plugin.settings,
            properties: $.extend({}, plugin.properties),
            setAjaxSettings: setAjaxSettings
        }

    }

})(jQuery);