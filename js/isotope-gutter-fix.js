(function ($) {
    // code found on this page: http://isotope.metafizzy.co/custom-layout-modes/masonry-gutters.html
    // modified Isotope methods for gutters in masonry
    $.Isotope.prototype._getMasonryGutterColumns = function() {
        var gutter = this.options.masonry && this.options.masonry.gutterWidth || 0;
        containerWidth = this.element.width();

        this.masonry.columnWidth = this.options.masonry && this.options.masonry.columnWidth ||
        // or use the size of the first item
        this.$filteredAtoms.outerWidth(true) ||
        // if there's no items, use size of container
        containerWidth;

        this.masonry.columnWidth += gutter;

        this.masonry.cols = Math.floor((containerWidth + gutter) / this.masonry.columnWidth);
        this.masonry.cols = Math.max(this.masonry.cols, 1);
    };

    $.Isotope.prototype._masonryReset = function() {
        // layout-specific props
        this.masonry = {};
        // FIXME shouldn't have to call this again
        this._getMasonryGutterColumns();
        var i = this.masonry.cols;
        this.masonry.colYs = [];
        while (i--) {
            this.masonry.colYs.push(0);
        }
    };

    $.Isotope.prototype._masonryResizeChanged = function() {
        var prevSegments = this.masonry.cols;
        // update cols/rows
        this._getMasonryGutterColumns();
        // return if updated cols/rows is not equal to previous
        return (this.masonry.cols !== prevSegments);
    };
    })(jQuery);