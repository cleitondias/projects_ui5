sap.ui.define([
	"./BaseController",
	"sap/ui/model/json/JSONModel",
	"../model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageToast"
], function (BaseController,
	JSONModel,
	formatter,
	Filter,
	FilterOperator,
	Sorter,
	MessageToast) {
	"use strict";

	return BaseController.extend("cliente.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit : function () {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay : 0
			});
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function(){
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* Begin - Custom Methods                                      */
		/* =========================================================== */
		onSortItems: function(oEvent) {

			var field='Name';
			var oSorter = new sap.ui.model.Sorter({
				path: field,
				desceding:false
			});

			var table = this.byId("table");
			var items = table.getBinding("items");
			items.sort(oSorter);

		},

		onSearch2 : function (oEvent) {

				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
				}
				//this._applySearch(aTableSearchState);
				var table = this.byId("table");
				var items = table.getBinding("items");
				items.filter(aTableSearchState);				
			
		},

		onRead: function() {

			var oModel = this.getView().getModel();

			oModel.read( "/ClientSet",
			{
				success: function(oDados, oResponse){
					debugger

				}.bind(this),
				
				error: function(oError){
					debugger

				}.bind(this)
			}

			);
			console.log("End method")
		},

		onRead2: function(){

			var aFilters = [];

			var table = this.byId("table");  
		    var bindingInfo = table.getBindingInfo('items');

			table.bindAggregation("items", 
			{
				model: bindingInfo.model,
				path: '/ClientSet',
				template: bindingInfo.template,
				sorter: [
					new sap.ui.model.Sorter({
						path: "ClientID",
						desceding:false
					})
				],
				filter: aFilters
			});



		},

		onDelete: function(oEvent){

			var oItems = oEvent.getParameter("listItem");
			var sPath = oItems.getBindingContext().getPath();

			var oModel = this.getView().getModel();

			oModel.remove(sPath, {

			   success: function(){
				   	sap.MessageToast.show("Entry deleted success");

			   }.bind(this), error: function(e){				
					console.error(e);
			   }.bind(this)

			});

		},

       onCreate: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("create", {});
	   },

	   onChangeStatus: function(oEvent){
			var oSource = oEvent.getSource();
			var oParent = oSource.getParent();
			var bc =  oParent.getBindingContext();

			//var path = bc.getPath();
			var obj = bc.getObject();

			var oModel = this.getView().getModel();

			oModel.callFunction(
				"/AlteraStatus_176", {
					method: "GET",
					urlParameters: {
						ID: obj.ClientID
					},
					success: function(){
						MessageToast.show("Status changed");
					}.bind(this),					
					error: function(e){
						console.error(e);
					}.bind(this)					
				}
			);

	   },

	onDelete2: function(oEvent){
		debugger;
		var oTable = this.byId("table");
		var oItems = oTable.getSelectedItems();
		var oModel = this.getView().getModel();

		//oModel.setDeferredGroups(["delete"]);

		var oItems = oTable.getSelectedContextPaths();

		for(var i = 0; i<oItems.length; i++){

			//var sPath = oItems[i].getBindingContext().getPath();

			//this._onDeleteEntry(sPath);
			/*oModel.remove(sPath, {
				groupId: "delete",
				changeSetId: "delete${i}",				
				success: function(data){
						sap.MessageToast.show("Entry deleted success");
	
				}.bind(this), error: function(e){				
					 console.error(e);
				}.bind(this)
	
			 });		
			 
			 oModel.submitChanges({
				 groupId: "delete"
			 });*/

			 this.getView().getModel().remove(oItems[i], {
				 success: function(){
				//	sap.MessageToast.show("Entry deleted success");
				 }.bind(this),
				 error: function(e){
				//	 console.error(e);
				 }.bind(this),
			 });

		}

	},




		/* =========================================================== */
		/* End - Custom Methods                                        */
		/* =========================================================== */
		

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished : function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress : function (oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler for navigating back.
		 * We navigate back in the browser history
		 * @public
		 */
		onNavBack : function() {
			// eslint-disable-next-line sap-no-history-manipulation
			history.go(-1);
		},


		onSearch : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("Name", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh : function () {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject : function (oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("ClientID")
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		}

	});
});