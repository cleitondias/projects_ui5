sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"../model/formatter",
	"sap/m/MessageToast",
	"sap/ui/core/UIComponent"    
], function(
	BaseController,
	JSONModel,
	History,
	formatter,
	MessageToast,
	UIComponent) {
	"use strict";

	return BaseController.extend("cliente.controller.Create", {

		formatter: formatter,

		/**
		 * @override
		 */
		onInit: function() {
			
			var oViewModel = new JSONModel({
				copies: 0
			});
			this.getView().setModel(oViewModel, "view");

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("create").attachPatternMatched(this._onCreateMatched, this);
		
		},
		_onCreateMatched: function(oEvent){

			this.getView().getModel("view").setProperty("/copies", 0);

			var m = this.getView().getModel();
			m.metadataLoaded().then(function() {
				var oContext = m.createEntry("/ClientSet",
				{
					properties: {
						Name: "",
						Telephone: "",
						District: "",
						Email: "",
						Status: "1"
					}
				});

				this.getView().bindElement({
					path: oContext.getPath()
				});
			}.bind(this))

		},

		onNavBack: function() {

			var m = this.getView().getModel(); 
			    m.resetChanges();

			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("worklist", {}, true)
			}

		},

		onGravar: function(oEvent){

			var oModel = this.getView().getModel();
			var data = {
				Name: this.byId("InpName").getValue(),
				Telephone: this.byId("InpTelephone").getValue(),
				District: this.byId("InpUF").getValue(),
				Email: this.byId("InpEmail").getValue(),
				Status: "1"
			};

			oModel.create("/ClientSet", data, {
				success: function(data, oResponse){
					MessageToast.show('Client create successfully');
					var mensagem = JSON.parse(oResponse.headers["sap-message"]);
				}.bind(this),

				error: function(e){
					console.error(e)
				}.bind(this)
			});

		},

		onGravar2: function(){

			var m = this.getView().getModel();
			this.getView().setBusy(true);

			var iCopies = this.getView().getModel("view").getProperty("/copies");
			var oNewClient = this.getView().getBindingContext().getObject();

			for (var i=0; i<iCopies; i++){

				m.createEntry("/ClientSet", {
					properties: {
						Name: oNewClient.Name + " (Copia "+(i+1)+")",
						Telephone: oNewClient.Telephone,
						District: oNewClient.District,
						Email: oNewClient.Email,
						Status: "1"						
					}
				});

			}

			m.submitChanges({
				success: function (oData) {
					this.getView().setBusy(false);
					MessageToast.show("Cliente criado com sucesso.");
					//var oRouter = sap.ui.core.UIComponent.getRouterFor(this); 
					//var sId = this.getView().getBindingContext().getObject().ClientID;
					//oRouter.navTo("object", { objectId: sId }, true);
				}.bind(this),

				error: function (oData) {
					MessageToast.show("Aconteceu um erro.");
					console.error(oData);
					this.getView().setBusy(false);
				}.bind(this),
			});

		},	

	});
});