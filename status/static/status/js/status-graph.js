(function($) {
    $(document).ready(function() {
        $('[href="#graph"]').on('shown', function() {
            var fd = new $jit.ForceDirected({
                //id of the visualization container
                injectInto: 'spatial',
                //Enable zooming and panning
                //by scrolling and DnD
                Navigation: {
                    enable: true,
                    //Enable panning events only if we're dragging the empty
                    //canvas (and not a node).
                    panning: 'avoid nodes',
                    zooming: 10 //zoom speed. higher is more sensible
                },
                // Change node and edge styles such as
                // color and width.
                // These properties are also set per node
                // with dollar prefixed data-properties in the
                // JSON structure.
                Node: {
                    overridable: true,
                    dim: 4
                },
                Edge: {
                    overridable: true,
                    color: '#23a4ff',
                    lineWidth: 0.3
                },
                //Native canvas text styling
                Label: {
                    type: 'Native', //Native or HTML
                    size: 12,
                    // style: 'bold',
                    color: '#333'
                },
                // //Add Tips
                // Tips: {
                //     enable: true,
                //     onShow: function(tip, node) {
                //         //count connections
                //         console.log(node);
                //         var count = 0;
                //         node.eachAdjacency(function() { count++; });
                //         //display node info in tooltip
                //         tip.innerHTML = "<div class=\"tip-title\">" + node.data.metaTitle + "</div>" + "<div class=\"tip-text\"><b>connections:</b> " + count + "</div>";
                //     }
                // },
                // Add node events
                Events: {
                    enable: true,
                    type: 'Native',
                    //Change cursor style when hovering a node
                    onMouseEnter: function() {
                        fd.canvas.getElement().style.cursor = 'move';
                    },
                    onMouseLeave: function() {
                        fd.canvas.getElement().style.cursor = '';
                    },
                    //Update node positions when dragged
                    onDragMove: function(node, eventInfo, e) {
                        var pos = eventInfo.getPos();
                        node.pos.setc(pos.x, pos.y);
                        fd.plot();
                    },
                    //Implement the same handler for touchscreens
                    onTouchMove: function(node, eventInfo, e) {
                        $jit.util.event.stop(e); //stop default touchmove event
                        this.onDragMove(node, eventInfo, e);
                    },
                    //Add also a click handler to nodes
                    onClick: function(node) {
                        if(!node) return;
                        //set final styles
                        fd.graph.eachNode(function(n) {
                            if(n.id != node.id) delete n.selected;
                            n.setData('dim', 4, 'end');
                            n.eachAdjacency(function(adj) {
                                adj.setDataset('end', {
                                    lineWidth: 0.4,
                                    color: '#23a4ff'
                                });
                            });
                        });
                        if(!node.selected) {
                            node.selected = true;
                            node.setData('dim', 17, 'end');
                            node.eachAdjacency(function(adj) {
                                adj.setDataset('end', {
                                    lineWidth: 3,
                                    color: '#36acfb'
                                });
                            });
                        } else {
                            delete node.selected;
                        }
                        //trigger animation to final styles
                        fd.fx.animate({
                            modes: ['node-property:dim',
                            'edge-property:lineWidth:color'],
                            duration: 500
                        });
                        // Build the right column relations list.
                        // This is done by traversing the clicked node connections.
                        var html = "<h4>" + (node.data.metaTitle || node.name) + "</h4><h5>Connections:</h5><ul><li>",
                        list = [];
                        node.eachAdjacency(function(adj){
                            list.push(adj.nodeTo.name);
                        });
                        //append connections information
                        $jit.id('inner-details').innerHTML = html + list.join("</li><li>") + "</li></ul>";
                    }
                },
                //Number of iterations for the FD algorithm
                iterations: 200,
                //Edge length
                levelDistance: 200,
                // Add text to the labels. This method is only triggered
                // on label creation and only for DOM labels (not native canvas ones).
                onCreateLabel: function(domElement, node){
                    domElement.innerHTML = node.name;
                    var style = domElement.style;
                    style.fontSize = "0.8em";
                    style.color = "#333";
                },
                // Change node styles when DOM labels are placed
                // or moved.
                onPlaceLabel: function(domElement, node){
                    var style = domElement.style;
                    var left = parseInt(style.left, 10);
                    var top = parseInt(style.top, 10);
                    var w = domElement.offsetWidth;
                    style.left = (left - w / 2) + 'px';
                    style.top = (top + 40) + 'px';
                    style.display = '';
                }
            });
            function pageToPlottableJson(page) {
                var json = {
                    id: page.get('UID'),
                    name: "" + page.get('url'),
                    data: {
                        metaTitle: page.get('metaTitle'),
                        $color: page.get('status') === 'error' ? '#ff0000' : '#00ff00'
                    },
                    adjacencies: page.get('linkedBy').internals().map(function(p) {
                        return p.get('UID');
                    })
                };
                return json;
            }
            var json = window.STATUS.allPages.internals().map(function(page) {
                return pageToPlottableJson(page);
            });
            fd.loadJSON(json);
            fd.computeIncremental({
                property: 'end',
                onComplete: function(){
                    fd.animate({
                        modes: ['linear'],
                        transition: $jit.Trans.Elastic.easeOut,
                        duration: 2500
                    });

                }
            });
        });
    });
}(jQuery));
