function beforeStateEntry(sequenceId) {
	
	populaCamposHiddenAnalytics(sequenceId);
	
	var tipoSolicitacao = hAPI.getCardValue("tipoSolicitacaoHidden");
	var codigoFilial = hAPI.getCardValue("filial_protheus");
	var codigoCentroCusto = hAPI.getCardValue("CTT_CUSTO");
	var valorTotal = hAPI.getCardValue("E2_VALOR");

	if(sequenceId == 102 && sequenceId != buscarAtividadeAtual()){
		incrementaNrReprovacoes();
	}
	
	if (sequenceId == 111) {
		var users = new java.util.ArrayList();
		users.add(hAPI.getCardValue("cdSolicitante")); 		
		hAPI.setAutomaticDecision(34, users, "Tarefa movimentada atualizando o tempo que estÃ¡ sendo empenhado na atividade.");
	}
	
	if (sequenceId == 114) {
		var users = new java.util.ArrayList();
		users.add(hAPI.getCardValue("cdSolicitante")); 
		hAPI.setAutomaticDecision(101, users, "Tarefa movimentada atualizando o tempo que estÃ¡ sendo empenhado na atividade.");
	}
	
	if (sequenceId == 117) {
		var users = new java.util.ArrayList();
		users.add(hAPI.getCardValue("cdSolicitante")); 		
		hAPI.setAutomaticDecision(54, users, "Tarefa movimentada atualizando o tempo que esta sendo empenhado na atividade.");
	}
		
	if (sequenceId == ATIV_FIM  || sequenceId == ATIV_FIM2 || sequenceId == ATIV_FIM3) {
		hAPI.setCardValue("solicitacaoAberta", "0");
	}
	if (sequenceId == 97) {
		//var codigoDoAprovador = getCodigoAprovador();
		var codigoDoAprovador = getWFParametro("codigoAprovador");
		
		if (codigoDoAprovador == "") {
			//throw "NÃ£o existe responsÃ¡vel para esse centro de custo e filial";
			throw "";
		} else {
			hAPI.setCardValue("codigoAprovador", codigoDoAprovador);
		}

		var users = new java.util.ArrayList();
		users.add("System:auto");
		hAPI.setAutomaticDecision(6, users, "Decisao tomada automaticamente pelo Fluig");
	}
	

	if(sequenceId == CONFIRMAR_SOLICITACAO_ADIANTAMENTO) {
		//var vencto = hAPI.getCardValue("aprovDataPrevistaAdiant");
		//log.info("before_state_entry (venc adiant): " + vencto);
		//hAPI.setCardValue("E2_VENCTO", vencto);
	}
	if(sequenceId == AVALIAR_ANEXO_PEDIDO_REEMBOLSO){
		//var vencto = hAPI.getCardValue("aprovDataPrevista");
		//log.info("before_state_entry (venc reemb): " + vencto)
		//hAPI.setCardValue("E2_VENCTO", vencto);
	}

	log.info("passou antes do metodo");
	if (tipoSolicitacao == "reembolso") {
		verificarAnexo(tipoSolicitacao, sequenceId);
		// cadAdiReemb();
	}

	if (sequenceId == ATIV_PREENCHE_FORM_REEMBOLSO || 
		(sequenceId == ATIV_APROVACAO_SOLICITANTE && buscarAtividadeAtual() == EXCL_SOLICITACAO_APROVADA)) {
		if (valorTotal >= 0) {
			cadAdiReemb();
		}
	}
}

function redirectAuto(activity, user) {
	var users = new java.util.ArrayList();
	if(user == undefined) {
		log.info("REDIRECTAUTO: Atribuindo a System:auto");
		users.add("System:auto");
	} else {
		var usuario = hAPI.getCardValue(user);
		log.info("REDIRECTAUTO: Atribuindo a " + usuario);
		users.add(usuario);
	}
	hAPI.setAutomaticDecision(activity, users, "Decisao tomada automaticamente pelo Fluig");
}


function isGeneralFilial(datasetFilhosFilial) {
	return datasetFilhosFilial == null
		|| datasetFilhosFilial == undefined
		|| datasetFilhosFilial == ""
		|| datasetFilhosFilial == "00"
		|| datasetFilhosFilial == "00000";
}

function verificarAnexo(tipoSolicitacao, sequenceId) {
	var formId = getValue("WKCardId");
	var existeAnexo = false;
	var processConstraint = DatasetFactory.createConstraint("processAttachmentPK.processInstanceId", getValue("WKNumProces"), getValue("WKNumProces"), ConstraintType.MUST);
	var companyConstraint = DatasetFactory.createConstraint("processAttachmentPK.companyId", getValue("WKCompany"), getValue("WKCompany"), ConstraintType.MUST);
	var attachFields = new Array("documentId", "processAttachmentPK.attachmentSequence", "version");
	var attachConstList = new Array(processConstraint, companyConstraint);
	var attachDataset = DatasetFactory.getDataset("processAttachment", attachFields, attachConstList, new Array("processAttachmentPK.attachmentSequence"));
	log.info("Quantidade de anexos " + attachDataset.rowsCount);
	for (var x = 0; x < attachDataset.rowsCount; x++) {
		if (attachDataset.getValue(x, "documentId") != formId) {
			existeAnexo = true;
		}
	}
	if (tipoSolicitacao == "reembolso") {
		if (sequenceId == 37) {
			// if (verificarAnexo()) {
			if (existeAnexo == false) {
				throw "Favor anexar as notas fiscais de reembolso!!!";
			}
		}
	}
}