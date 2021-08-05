sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(Controller,
	History,
	UIComponent,
	MessageToast,
	MessageBox) {
	"use strict";
	return Controller.extend("customer.controller.Home", {
		/**
		 * @override
		 */
		onInit: function() {			
		
			this.Initialize();

		},

		Initialize: function (){

			this.byId("customer").setValue("");
			this.byId("name").setValue("");
			this.byId("address").setValue("");
			this.byId("country").setValue("");

		},

		onClick: function(oEvent) {		

			var oEntry = {};
			
			oEntry.CustomerId = this.byId("customer").getValue();
			oEntry.Name       = this.byId("name").getValue();
			oEntry.Address    = this.byId("address").getValue();
			oEntry.Country    = this.byId("country").getValue();

			if (oEntry.CustomerId == null ){
				MessageBox.alert("Cannot be save, data missing in the container!");
				return;
			}

			var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZCUSTOMER_INFO_SRV/", true);
			sap.ui.getCore().setModel(oModel);
			oModel.setSizeLimit(150);

		/*	oModel.read("/ZCUST_DATASet", {
				success: function(oData, oResponse){
					MessageToast.show("Connected oData successfully");
				}
			}); */

			//Disable Batch Request
			oModel.setUseBatch(false);

			oModel.create("/ZCUST_DATASet", oEntry, {

				success: function (oData, oResponse){

					var message = "Customer : " + oEntry.CustomerId + " created successfully on database";
			    
				    jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.show(message, {
							closeOnBrowserNavigation: false,
							duration: 2000,
							icon: sap.m.MessageBox.Icon.SUCCESS,
							width: "20rem"

						});	 



				},

				error: function (oError) {
					MessageToast.show("Failure to create entry in oData service");
				}

			});

			this.Initialize();
			
		}
	});
});