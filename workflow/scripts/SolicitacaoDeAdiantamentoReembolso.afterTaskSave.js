var ativPosInicial = 97;
var ativPosCorrecao = 10;
var atividadePosCorrecao2 = 37;

function afterTaskSave(colleagueId, nextSequenceId, userList) {
	
	 var atv = getValue('WKNumState');
	 var user = getValue('WKReplacement') != null ? getValue('WKReplacement') : getValue('WKUser');
	 var processo = getValue("WKNumProces");
	    
	 var obs = '';
	 obs += '<span style="color:#3c763d">'; // aqui você coloca caso queira mostrar em uma cor diferente

	if (nextSequenceId == ativPosInicial || nextSequenceId == ativPosCorrecao ||
		nextSequenceId == atividadePosCorrecao2) {
		preencherIdentificador();
	}

	if ((nextSequenceId == 57 || nextSequenceId == '57') && hAPI.getCardValue("aceite") != "S") {

		notificacaoEncerramento(hAPI.getCardValue('emailSolicitante'), hAPI.getCardValue('Solicitante'));
	}
	
	if (atv == 14) {		    	
    	obs += 'Observação realizada na atividade Analisar solicitação de adiantamento pelo(a) '+hAPI.getCardValue("nomeaprovGestor")+' :<br> ' + hAPI.getCardValue("motivoaGestorReembolso")+'<br>';
    	hAPI.setTaskComments(user, processo, 0, obs);
    	obs += '</span>';
    }
	
	if (atv == 37) {		    	
    	obs += 'Observação realizada na atividade Analisar solicitação de reembolso CSO pelo (a) '+hAPI.getCardValue("nomeaprovGestorReembolso")+' :<br> ' + hAPI.getCardValue("motivoaGestorReembolso")+'<br>';
    	hAPI.setTaskComments(user, processo, 0, obs);
    	obs += '</span>';
    }
	
	if (atv == 124) {		    	
    	obs += 'Observação realizada na atividade Analisar solicitação de reembolso fora da politica pelo (a) '+hAPI.getCardValue("nomeaprovGestorCSOFP")+' :<br> ' + hAPI.getCardValue("motivoaGestorReembolso")+'<br>';
    	hAPI.setTaskComments(user, processo, 0, obs);
    	obs += '</span>';
    }
		
}

function preencherIdentificador() {
	var unidade = hAPI.getCardValue("filial");
	var dataInicial = hAPI.getCardValue("dataSolicitante");
	var tipoSolicitacao = hAPI.getCardValue("tipoSolicitacaoHidden");
	var valorCampoReembolso = "reembolso";
	var valorCampoAdiantamento = "adiantamento";
	var solicReembValExtraordinarios = hAPI.getCardValue("infoDentroPoliticaHidden");

	if (tipoSolicitacao == valorCampoAdiantamento) {
		var identificador = new objIdentificador("N", unidade, dataInicial, "Adiantamento");
	} else if (tipoSolicitacao == valorCampoReembolso) {
		if (solicReembValExtraordinarios == 0)
			var identificador = new objIdentificador("D", unidade, dataInicial, "Reembolso");
		else if (solicReembValExtraordinarios == 1)
			var identificador = new objIdentificador("F", unidade, dataInicial, "Reembolso");
		else
			var identificador = new objIdentificador("N", unidade, dataInicial, "Reembolso");
	} else {
		var identificador = new objIdentificador("N", unidade, dataInicial);
	}
	hAPI.setCardValue("E2_ZIDFLG", getValue("WKNumProces"));
}

function notificacaoEncerramento(emailSolicitante, solicitante) {
	var filter = new Array()
	filter.push(DatasetFactory.createConstraint('SOLICITACAO', getValue("WKNumProces"), '', ConstraintType.MUST))
	filter.push(DatasetFactory.createConstraint('SOLICITANTE', solicitante, '', ConstraintType.MUST))
	filter.push(DatasetFactory.createConstraint('EMAIL_SOLICITANTE', emailSolicitante, '', ConstraintType.MUST))
	filter.push(DatasetFactory.createConstraint('PROCESSO', getValue("WKDef"), '', ConstraintType.MUST))
	var ds_envioEmailEncerramento = DatasetFactory.getDataset('ds_envioEmailEncerramento', null, filter, null);
}
