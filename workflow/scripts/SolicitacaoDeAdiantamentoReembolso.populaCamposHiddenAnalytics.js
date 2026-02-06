function populaCamposHiddenAnalytics(sequenceId){
	var CURRENT_STATE = getValue("WKNumState");
	var expediente = "Default";
	var tipoSolicitacao = hAPI.getCardValue("analyticsTpSolicitacao");
	
	log.info("=================populaCamposHiddenAnalytics INICIO");
	log.info("=====populaCamposHiddenAnalytics CURRENT_STATE "+CURRENT_STATE);
	log.info("=====populaCamposHiddenAnalytics sequenceId "+sequenceId);
	log.info("=====populaCamposHiddenAnalytics tipoSolicitacao "+tipoSolicitacao);
	log.info("=====populaCamposHiddenAnalytics decisaoGestor "+hAPI.getCardValue("decisaoGestorHidden"));
	log.info("=====populaCamposHiddenAnalytics decisaoGestor reembolso "+hAPI.getCardValue("decisaoGestorReembolsoHidden"));
		
	//Adiantamento
	
	if (sequenceId == 10 || sequenceId == 111 || sequenceId == 114 || sequenceId == 117|| sequenceId == 37 || sequenceId == 102) {
		populaAnalytics(sequenceId);
	}
	
	if((CURRENT_STATE == 10 && hAPI.getCardValue("decisaoGestorHidden") == "sim") || 
			(CURRENT_STATE == 14 && hAPI.getCardValue("decisaoGestorHiddenCSO") == "sim")){
		
		log.info("=====populaCamposHiddenAnalytics populaAdiantamento ");
		populaAnalytics(sequenceId);
		
	}else if(CURRENT_STATE == 10 && hAPI.getCardValue("decisaoGestorHidden") == "nao"){
		
		log.info("=====populaCamposHiddenAnalytics corrige adiantamento 1");
		populaAnalytics(sequenceId);	
		
	}else if(CURRENT_STATE == 10 && hAPI.getCardValue("decisaoGestorHidden") == "cancelar"){
		
		log.info("=====populaCamposHiddenAnalytics corrige cancela adiantamento 1");
		finalizarSolicitacao();
		
	}else if(CURRENT_STATE == 14 && hAPI.getCardValue("decisaoGestorHiddenCSO") == "nao"){
		
		log.info("=====populaCamposHiddenAnalytics corrige adiantamento 1");
		populaAnalytics(sequenceId);
		
	}else if(CURRENT_STATE == 14 && hAPI.getCardValue("decisaoGestorHiddenCSO") == "cancelar"){
		
		log.info("=====populaCamposHiddenAnalytics corrige cancela adiantamento 1");
		finalizarSolicitacao();
		
	}else if (CURRENT_STATE == 20 && hAPI.getCardValue("decisaoGestorFinanceiroHidden") == "sim"){
	
		log.info("=====populaCamposHiddenAnalytics corrige cancela adiantamento 2");
		finalizarSolicitacao();
	
	}else if (CURRENT_STATE == 20 && hAPI.getCardValue("decisaoGestorFinanceiroHidden") == "nao"){
	
		log.info("=====populaCamposHiddenAnalytics corrige adiantamento 2");
		populaAnalytics(sequenceId);
	
	}else if (CURRENT_STATE == 37 && hAPI.getCardValue("decisaoGestorReembolsoHidden") == "sim"){
		
		log.info("=====populaCamposHiddenAnalytics populaReembolso ");
		hAPI.setCardValue("analyticsDtFim","");
		hAPI.setCardValue("analyticsHrFim","");
		
		populaAnalytics(sequenceId);
		
	}else if(CURRENT_STATE == 37 && hAPI.getCardValue("decisaoGestorReembolsoHidden") == "cancelar"){
	
		log.info("=====populaCamposHiddenAnalytics corrige cancela reembolso 1");
		populaAnalytics(sequenceId);
		finalizarSolicitacao();
	
	}else if(CURRENT_STATE == 57 && hAPI.getCardValue("decisaoReembolsoFinHidden") == "sim"){
	
		log.info("=====populaCamposHiddenAnalytics corrige cancela reembolso 2");
		populaAnalytics(sequenceId);
		finalizarSolicitacao();
	
	}
	
	if (sequenceId == 57) {
		populaAnalytics(sequenceId);
		finalizarSolicitacao();
	}
//	else if(CURRENT_STATE == 50 && hAPI.getCardValue("decisaoReembolsoFinHidden") == "nao"){
//	
//		log.info("=====populaCamposHiddenAnalytics corrige reembolso 2");
//		limpaAnalytics(hAPI.getCardValue("decisaoReembolsoFinHidden"));
//	
//	}
	
	log.info("=================populaCamposHiddenAnalytics FIM");
}

function finalizarSolicitacao(){
	
		var dataAtual = new Date();
		var dataFormatada = formatarDataAnalytics(dataAtual.getDate(), (dataAtual.getMonth()+1), dataAtual.getFullYear(), dataAtual.getHours(), dataAtual.getMinutes(), dataAtual.getSeconds());
		
		hAPI.setCardValue("analyticsDtFim",dataFormatada.split(" ")[0]);
		hAPI.setCardValue("analyticsHrFim",dataFormatada.split(" ")[1]);
		
}

function populaAnalytics(sequenceId){
	
	var expediente = "Default";
	
	log.info("===================populaCamposHiddenAnalytics populaAdiantamento ");
	var dataFormatada = buscaDataFormatada("analyticsDtInicio","analyticsHrInicio");
	log.info("=====populaCamposHiddenAnalytics populaAdiantamento dataFormatada "+dataFormatada);
	
	var prazoSLA = hAPI.getCardValue("analyticsPrazoSLA");
	var codigoSLA = "";
	var tipoSolicitacao = hAPI.getCardValue("analyticsTpSolicitacao");
	var nmTipoSolicitacao = "";
	
	if(tipoSolicitacao == "adiantamento"){
		nmTipoSolicitacao = "Solicitação de Adiantamento";
		codigoSLA = "solicitacaoAdiantamento";
	}else{
		nmTipoSolicitacao = "Solicitação de Reembolso";
		codigoSLA = "solicitacaoReembolso";
	}
	var sla;
	
	if(prazoSLA == ""){
		var prazosSLA = buscaDatasetPrazosSLA();
		sla = buscaSLA(codigoSLA, prazosSLA);
		
		hAPI.setCardValue("analyticsPrazoSLA",sla.prazo_sla);
		hAPI.setCardValue("analyticsMedidaPrazoSLA",sla.medida_prazo);
		
	}else{
		sla = {
				codigo_sla : codigoSLA,
				prazo_sla : prazoSLA,
				medida_prazo : hAPI.getCardValue("analyticsMedidaPrazoSLA")
		};
		
	}
		
	hAPI.setCardValue("analyticsTpSolicitacao",nmTipoSolicitacao);
	hAPI.setCardValue("analyticsDtInicio",dataFormatada.split(" ")[0]);
	hAPI.setCardValue("analyticsHrInicio",dataFormatada.split(" ")[1]);
	
	log.info("=====populaCamposHiddenAnalytics populaAdiantamento sla "+sla);
	
	if (sequenceId == 10 || sequenceId == 111 || sequenceId == 114 || sequenceId == 117 || sequenceId == 37 || sequenceId == 102 || sequenceId == 57) {
		
		var atividadesDescartadas = new Array();
		atividadesDescartadas[0] = 34;
		atividadesDescartadas[1] = 54;
		atividadesDescartadas[2] = 101;
	
		var primeirasAtividadesDescartadas = new Array();
		
		var prazoConclusao = buscaPrazoConclusao(sla, atividadesDescartadas, primeirasAtividadesDescartadas, dataFormatada.split(" ")[0], dataFormatada.split(" ")[1]);
		log.info("=====populaCamposHiddenAnalytics populaAdiantamento prazoConclusao "+prazoConclusao);
	
		hAPI.setCardValue("analyticsDtPrazo",prazoConclusao.split(" ")[0]);
		hAPI.setCardValue("analyticsHrPrazo",prazoConclusao.split(" ")[1]);
		
	}
}



function buscaPrazoConclusao(sla, atividadesDescartadas, primeirasAtividadesDescartadas, dataInicio, horaInicio){
	log.info("=====populaCamposHiddenAnalytics buscaPrazoConclusao sla |"+sla+"|");
	log.info("=====populaCamposHiddenAnalytics buscaPrazoConclusao atividadesDescartadas |"+atividadesDescartadas+"|");
	log.info("=====populaCamposHiddenAnalytics buscaPrazoConclusao dataInicio |"+dataInicio+"|");
	log.info("=====populaCamposHiddenAnalytics buscaPrazoConclusao horaInicio |"+horaInicio+"|");
	var expediente = "Default";
	
	var dataPrazoConclusao = calculaPrazoConclusao(sla, expediente, atividadesDescartadas, primeirasAtividadesDescartadas, dataInicio, horaInicio);
	log.info("=====populaCamposHiddenAnalytics buscaPrazoConclusao dataPrazoConclusao "+dataPrazoConclusao.getDate()+"/"+(dataPrazoConclusao.getMonth() + 1)+"/"+dataPrazoConclusao.getFullYear()+" "+dataPrazoConclusao.getHours()+":"+dataPrazoConclusao.getMinutes()+":"+dataPrazoConclusao.getSeconds());
	var dataFormatadaPrazo = formatarDataAnalytics(dataPrazoConclusao.getDate()+"", (dataPrazoConclusao.getMonth() + 1)+"", dataPrazoConclusao.getFullYear()+"", dataPrazoConclusao.getHours()+"",dataPrazoConclusao.getMinutes()+"",dataPrazoConclusao.getSeconds()+"")
	log.info("=====populaCamposHiddenAnalytics buscaPrazoConclusao dataFormatadaPrazo "+dataFormatadaPrazo);
	
	return dataFormatadaPrazo;
}



