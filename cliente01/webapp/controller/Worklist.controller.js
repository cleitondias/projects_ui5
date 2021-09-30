sap.ui.define([
	"sap/ui/core/mvc/Controller"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller) {
		"use strict";

		return Controller.extend("cliente01.controller.Worklist", {
			onInit: function () {

			}
			,

			onClientePress: function (oEvent) {
					var oRouter = this.getOwnerComponent().getRouter();
					//oRouter.navTo("detailPage");

					var oSource = oEvent.getSource();
					var oContext = oSource.getBindingContext();
					var sPath = oContext.getPath();

					var obj = oContext.getObject();
					oRouter.navTo("detailPage", {
						idPath: obj.ClientID
					});
					
			}
		});
	});
