sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function(
	Controller,
    MessageToast,
    JSONModel
) {
	"use strict";

	return Controller.extend("cgutech.template.controller.App", {
        //Begin - Implement Custom Methods

        onInit: function(){

            //define data object
            var oMsg = {
                MsgInicial : "Welcome!!!",
                Msg2 : "Good Night!!"
            };

            //define json model
            var oMsgModel = new JSONModel();
            oMsgModel.setData(oMsg);

            //data binding 
            //
            this.getView().setModel(oMsgModel,"messages");


            //New model 2
            var oPessoaModel = new JSONModel({
                nome: "Steven",
                sobrenome: "Job",
                habilitado: true,
                endereco: {
                    rua: "Av. Antero de Quental, 54",
                    cidade: "Lisbon",
                    cep: "2580-604",
                    pais: "Portugal"
                }
            });

            //set model in the view
            this.getView().setModel(oPessoaModel, "pessoa");

            //Array
            var oFuncionarios = {

                Funcionarios: [
                    {
                        nome: "Steven",
                        sobrenome: "Job",
                        habilitado: true
                    },
                    {
                        nome: "Burt",
                        sobrenome: "Preynolds",
                        habilitado: false
                    },
                    {
                        nome: "Maiqe",
                        sobrenome: "Taison",
                        habilitado: true
                    },
                    {
                        nome: "Jubileu",
                        sobrenome: "Machado",
                        habilitado: true
                    }                    

                ]

            };

            var oFunModel = new JSONModel(oFuncionarios);
            this.getView().setModel(oFunModel, "empregados");


        },


        //Similar - MODULE PBO - AT SELECTION SCREEN OUTPUT
        onBeforeRendering: function(){

        },
        
        //Similar - MODULE PAI - AT SELECTION SCREEN
        onAfterRendering: function(){
            //alert("onAfterRendering");
            //uso comum: validar dados e alterar UI de acordo com dados
        },

        //Similar - AT EXIT COMMAND       
        onExit: function(){
            alert("on Exit");
            //uso comum: limpar variaveis ao sair dessa view
        },        

        onClick: function(){
               // MessageToast.show("Test Clicked button");

               //get model on view
               var oModel = this.getView().getModel("messages");

               //get model data
               var oDados = oModel.getData();

               //Display model data as message
               MessageToast.show(oDados.MsgInicial);
        },

        onFuncionarioSelected: function(oEvent) {

           var oSource = oEvent.getSource();
           var oContext = oSource.getBindingContext("empregados");
           var sPath = oContext.getPath();

           var oPanel = this.byId("detalhePanel");

           oPanel.bindElement({
               path: sPath,
               model: "empregados"
           });

        },

        onClientSelected: function(oEvent){

            var oSource = oEvent.getSource();
            var oContext = oSource.getBindingContext();
            var sPath = oContext.getPath();
 
            var oPanel = this.byId("clientePanel");
 
            oPanel.bindElement({
                path: sPath
            });            
            

        }
        //End - Implement Custom Methods
	});
});