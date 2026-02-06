function servicetask69(attempt, message) {

	var periodicService = ServiceManager.getService("OncoclinicasMatrizFiscal");
	var serviceHelper = periodicService.getBean();
	var serviceLocator = serviceHelper.instantiate("br.com.oncoclinicas.webservices.wsmatrizfiscal_apw.WSMATRIZFISCAL");
	var service = serviceLocator.getWSMATRIZFISCALSOAP();

	var prenota = serviceHelper.instantiate("br.com.oncoclinicas.webservices.wsmatrizfiscal.WSDADOSPRENOTA");
	prenota.setFORNECEDOR(hAPI.getCardValue("cpCodFornecedor"))
	prenota.setFILIAL(hAPI.getCardValue("cpCodFilial"))
	prenota.setLOJA(hAPI.getCardValue("cpLojaFornecedor"))
	prenota.setNUMERO(hAPI.getCardValue('cpNumNota'))
	prenota.setSERIE(normalizeString(hAPI.getCardValue('cpSerie')))

	var integracao = service.wsclassificamatrizfiscal(prenota);

	var retorno = integracao.getWSRETMATRIZFISCAL().get(0)

	SetCamposInformativos(retorno);

	if (retorno.getSUCESSO() != true &&
		retorno.getSUCESSO() != 'true') {
		throw 'Não Foi possivel classificar automaticamente essa nota, favor verificar a Matriz fiscal!!!\n' + retorno.getMENSAGEM()
	}

}

function SetCamposInformativos(retorno) {
	hAPI.setCardValue('cpLogMatriz', retorno.getMENSAGEM())
	hAPI.setCardValue('cpMatriz', retorno.getSUCESSO())
}