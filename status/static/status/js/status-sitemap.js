/*
<?xml version="1.0" encoding="utf-8"?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>http://example.com/</loc>
        <lastmod>2006-11-18</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>
*/

(function($) {
    $(document).ready(function() {
        function makeSitemap(container) {
            var urlTemplate = _.template(
                '<url>\n' +
                '\t<loc><%= url %></loc>\n'+
                '\t<changefreq><%= changefreq %></<changefreq>\n'+
                '\t<priority><%= priority %></<priority>\n'+
                '</url>\n'
            );

            var xmlTemplate = _.template(
                '<?xml version="1.0" encoding="utf-8"?>\n' +
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
                '<% _.each(urls, function(url) {' +
                'print(url); \n' +
                '}) %>' +
                '</urlset>'
            );

            var textarea = container.find('textarea');
            var changefreq = container.find('select[name="changefreq"]').val();
            var priority = container.find('select[name="priority"]').val();
            var urls = window.STATUS.allPages.internals().map(function(page) {
                if (page.get('status') != 'success')
                    return;
                var url = new Uri(page.get('url'));
                url.setProtocol(window.STATUS.localhost.protocol());
                url.setHost(window.STATUS.localhost.host());
                url.setPort(window.STATUS.localhost.port());
                return urlTemplate({
                    url: url,
                    changefreq: changefreq,
                    priority: priority
                });
            });
            textarea.val(xmlTemplate({'urls': urls}));
        }

        $('[href="#sitemap"]').on('shown', function() {
            makeSitemap($('#sitemap'));
        });
        $('#sitemap select').on('change', function() {
            makeSitemap($('#sitemap'));
        });
    });
}(jQuery));
