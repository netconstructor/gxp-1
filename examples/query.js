/**
 * Copyright (c) 2009 The Open Planning Project
 * 
 * Published under the BSD license.
 * See http://svn.opengeo.org/gxp/trunk/license.txt for the full text
 * of the license.
 */

OpenLayers.ProxyHost = "/proxy/?url=";

var panel, map;
Ext.onReady(function() {
    
    var map = new OpenLayers.Map("map");
    var layer = new OpenLayers.Layer.WMS(
        "Global Imagery",
        "http://demo.opengeo.org/geoserver/wms",
        {layers: 'bluemarble'}
    );
    map.addLayer(layer);
    map.setCenter(new OpenLayers.LonLat(5, 45), 3);

    panel = new gxp.QueryPanel({
        title: "Query Panel",
        renderTo: "query",
        width: 380,
        bodyStyle: "padding: 10px",
        map: map,
        layerStore: new Ext.data.JsonStore({
            data: {
                layers: [{
                    title: "US States",
                    name: "states",
                    namespace: "http://www.openplans.org/topp",
                    url: "http://demo.opengeo.org/geoserver/wfs",
                    schema: "http://demo.opengeo.org/geoserver/wfs?version=1.1.0&request=DescribeFeatureType&typeName=topp:states"
                }, {
                    title: "Archaeological Sites",
                    name: "archsites",
                    namespace: "http://opengeo.org",
                    url: "http://demo.opengeo.org/geoserver/wfs",
                    schema: "http://demo.opengeo.org/geoserver/wfs?version=1.1.0&request=DescribeFeatureType&typeName=og:archsites"
                }]
            },
            root: "layers",
            fields: ["title", "name", "namespace", "url", "schema"]
        }),
        bbar: ["->", {
            text: "Query",
            handler: function() {
                panel.query();
            }
        }]
    });

});
