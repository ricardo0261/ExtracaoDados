var gestorResponsavelId = "";

function beforeTaskSave(colleagueId, nextSequenceId, userList) {
	GETSLA();
	if (hAPI.getCardValue("codigoAprovador")=='') {
		throw 'Ausência de cadastro de Gestor para aprovação do Centro de Custo selecionado. Favor entrar em contato com a Central de Atendimento.'
	}
	log.info("nextSequenceId: " + nextSequenceId);

	if (nextSequenceId == 57 || nextSequenceId == '57' && hAPI.getCardValue('aceite') != 'S') {
		notificacaoEncerramento(hAPI.getCardValue('emailSolicitante'), hAPI.getCardValue('solicitante'))
	}

	if (nextSequenceId == 10 || nextSequenceId == 37) {
		if (hAPI.getCardValue('codigoAprovador') == '') {
			throw 'Nao exitem gestores cadastrados para esse centro de custos/filial. Por favor entre em contato com a Gestao de melhorias'
		}
	}
	
	if (nextSequenceId == 5 ) {
		var anexos = hAPI.listAttachments();
		var qtdAnexos = anexos.size();
				
		if (hAPI.getCardValue('tpReembolso') != '') {
									
			if (qtdAnexos = 0) {
				throw "Favor anexar os comprovantes";
			}			
		}
	}
	

}

function notificacaoEncerramento(emailSolicitante, solicitante) {
	var filter = new Array()
	filter.push(DatasetFactory.createConstraint('SOLICITACAO', getValue("WKNumProces"), '', ConstraintType.MUST))
	filter.push(DatasetFactory.createConstraint('SOLICITANTE', solicitante, '', ConstraintType.MUST))
	filter.push(DatasetFactory.createConstraint('EMAIL_SOLICITANTE', emailSolicitante, '', ConstraintType.MUST))
	filter.push(DatasetFactory.createConstraint('PROCESSO', getValue("WKDef"), '', ConstraintType.MUST))
	var ds_envioEmailEncerramento = DatasetFactory.getDataset('ds_envioEmailEncerramento', null, filter, null);
}

function definirGestorResponsavel() {
	buscarGestorResponsavel();
	log.info("codigoDoAprovador: " + gestorResponsavelId)
	setWFParametro("codigoAprovador", gestorResponsavelId);
}

function buscarGestorResponsavel() {
	var dataSet = new objDataSet("dataSetResponsavelAprovacaoAdiantReembolso");

	// Parametro para consulta do responsavel do Centro de Custof
	var codFilial = getCodFilial();
	var codCentroCusto = getCodCentroCusto();
	var codFavorecido = getCodFavorecido();

	// realizacao do filtro
	dataSet.setFiltro("codFilial", codFilial);
	dataSet.setFiltro("codCentroCusto", codCentroCusto);
	dataSet.setFiltro("codFavorecido", codFavorecido);

	dataSet.buscar();

	// Retorno com todos os dados
	var dados = dataSet.getDados();

	if (dados !== null && dados !== undefined) {
		if (dados.getValue(0, "status") != false) {
			gestorResponsavelId = dados.getValue(0, "matricula");

			return true;
		} else {
			return false;
		}
	}
	return false;
}

function getCodFilial() {
	return getWFParametro("codigo_filial");
}

function getCodCentroCusto() {
	return getWFParametro("CTT_CUSTO");
}

function getCodFavorecido() { //mudar do nome para a matricula
	//return getWFParametro("cdSolicitante");
	return getWFParametro("A2_COD");
}