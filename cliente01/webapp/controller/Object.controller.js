sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function(
	Controller,
	History
) {
	"use strict";

	return Controller.extend("cliente01.controller.Object", {

        /**
         * @override
         */
        onInit: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("detailPage").attachPatternMatched(this._onObjectMatched, this);
            
        
        },

        _onObjectMatched: function(oEvent){

            var oArgs = oEvent.getParameter("arguments");
            var sPath = oArgs.idPath;

            var spath2 = "/ClientSet('" + sPath + "')";

            var oView = this.getView();
            oView.bindElement(
                {
                    path: spath2
                }
            );

        },

        onNavBack: function(){

            var oHistory, sPreviousHash;

            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = UIComponent.getRouterFor(this);
                oRouter().navTo("appHome", {}, true /*no history*/);
            }            

        }

	});
});