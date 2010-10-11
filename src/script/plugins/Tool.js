Ext.namespace("gxp.plugins");

gxp.plugins.Tool = Ext.extend(Ext.util.Observable, {
    
    /** api: ptype = gx_tool */
    ptype: "gx_tool",

    /** api: config[actionTarget]
     *  ``String`` Where to place the tool's actions (e.g. buttons or menus)?
     *  This can be any string that references an ``Ext.Container`` property on
     *  the portal. To reference one of the toolbars of an ``Ext.Panel``,
     *  ".tbar", ".bbar" or ".fbar" has to be appended. The default is
     *  "map.tbar". This config option is only relevant for subclasses that
     *  have actions. The viewer's main MapPanel can always be accessed with
     *  "map" as actionTarget.
     */
    actionTarget: "map.tbar",
    
    /** api: config[toggleGroup]
     *  ``String`` If this tool should be radio-button style toggled with other
     *  tools, this string is to identify the toggle group.
     */
    
    /** api: config[outputTarget]
     *  ``String`` Where to add the tool's output container? This can be any
     *  string that references an ``Ext.Container`` property on the portal. If
     *  not provided, the portal is assumed. 
     */
     
    /** api: config[outputConfig]
     *  ``Object`` Optional configuration for the output container. This may
     *  be useful to override the xtype (e.g. "window" instead of "gx_popup"),
     *  or to provide layout configurations when rendering to an
     *  ``outputTarget``.

    /** private: property[target]
     *  ``Object``
     *  The :class:`gxp.Viewer` that this plugin is plugged into.
     */
     
    /** private: method[constructor]
     */
    constructor: function(config) {
        this.initialConfig = config;
        Ext.apply(this, config);
        gxp.plugins.Tool.superclass.constructor.apply(this, arguments);
    },
    
    /** api: method[init]
     *  :arg target: ``Object`` The object initializing this plugin.
     */
    init: function(target) {
        this.target = target;
        var actions = this.actions;
        actions && (this.actions = this.addActions(actions));
    },
    
    /** api: method[addActions]
     */
    addActions: function(actions) {
        var actionTarget = this.actionTarget;
        var parts = actionTarget.split(".");
        var ref = parts[0], bar = parts.length > 1 && parts[1];
        var ct = ref ?
            ref == "map" ? this.target.mapPanel : this.target.portal[ref] :
            this.target.portal;
        var meth = bar && {
            "tbar": "getTopToolbar",
            "bbar": "getBottomToolbar",
            "fbar": "getFooterToolbar"
        }[bar];
        if (meth) {
            ct = ct[meth]();
        }
        actions = ct.add.apply(ct, actions);
        // call ct.show() in case the container was previously hidden (e.g.
        // the mapPanel's bbar or tbar which are initially hidden)
        ct.isVisible() ? ct.doLayout() : ct.show();
        return actions;
    },
    
    /** api: method[addOutput]
     */
    addOutput: function(config) {
        var ref = this.outputTarget;
        var ct = ref ?
            ref == "map" ? this.target.mapPanel : this.target.portal[ref] :
            this.target.portal;
        Ext.apply(config, this.outputConfig);
        var cmp = ct.add(config);
        cmp instanceof Ext.Window ? cmp.show() : ct.doLayout();
        return cmp;
    },
    
});

Ext.preg(gxp.plugins.Tool.prototype.ptype, gxp.plugins.Tool);
