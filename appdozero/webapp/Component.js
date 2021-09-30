sap.ui.define([
	"sap/ui/core/UIComponent"
], function(
	UIComponent
) {
	"use strict";

	return UIComponent.extend("cgutech.template.Component",{

        metadata : {
             manifest : "json"
        },

        init: function(){
            //call superclass
            UIComponent.prototype.init.apply(this, arguments);
        },

	});
});