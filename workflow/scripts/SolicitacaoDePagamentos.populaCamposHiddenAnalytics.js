// function populaCamposHiddenAnalytics(sequenceId){
// 	var CURRENT_STATE = getValue("WKNumState");
// 	var expediente = "Default";
// 	var tipoSolicitacao = hAPI.getCardValue("analyticsTpSolicitacao");
	
// 	log.info("=================populaCamposHiddenAnalytics INICIO");
// 	log.info("=====populaCamposHiddenAnalytics CURRENT_STATE "+CURRENT_STATE);
// 	log.info("=====populaCamposHiddenAnalytics sequenceId "+sequenceId);
// 	log.info("=====populaCamposHiddenAnalytics tipoSolicitacao "+tipoSolicitacao);
	
// 	if( //sequenceId == SEPARACAO ||
// 		//sequenceId == AVALIACAO ||
// 		sequenceId == AVALIAR ||
// 		sequenceId == SOLUCAO_INC ||
// 		sequenceId == ATUALIZA_SLA_1 ||
// 		sequenceId == ATUALIZA_SLA_2){
// 		populaAnalytics(sequenceId, CURRENT_STATE);
// 	}else if(sequenceId == FIM){
// 		populaAnalytics(sequenceId, CURRENT_STATE);
// 		finalizarSolicitacao();
// 	}
	
// 	log.info("=================populaCamposHiddenAnalytics FIM");
// }

// function finalizarSolicitacao(){
	
// 		var dataAtual = new Date();
// 		var dataFormatada = formatarDataAnalytics(dataAtual.getDate(), (dataAtual.getMonth()+1), dataAtual.getFullYear(), dataAtual.getHours(), dataAtual.getMinutes(), dataAtual.getSeconds());
		
// 		hAPI.setCardValue("analyticsDtFim",dataFormatada.split(" ")[0]);
// 		hAPI.setCardValue("analyticsHrFim",dataFormatada.split(" ")[1]);
		
// }

// function populaAnalytics(sequenceId, CURRENT_STATE){
	
// 	if (CURRENT_STATE != INICIO) {

// 		var expediente = "Default";
// 		var tipoSolicitacao = hAPI.getCardValue("analyticsTpSolicitacao");
// 		/*if(tipoSolicitacao == ""){
// 			tipoSolicitacao = "Solicitação de Pagamentos/Repasse Médico/RPA";
// 			hAPI.setCardValue("analyticsTpSolicitacao",tipoSolicitacao);
// 		}*/
		
// 		var prazoSLA = hAPI.getCardValue("analyticsPrazoSLA");
// 		var codigoSLA;// = "lancamentoNfPagamento";//"solicitacaoPreNota";
				
// 		hAPI.setCardValue("analyticsTpSolicitacao","Solicitação Guia Taxas e Boletos");
// 		codigoSLA = "solicitacaoGuiaTaxasBoleto";
				
// 		log.info("===================populaCamposHiddenAnalytics populaAdiantamento ");
// 		var dataFormatada = buscaDataFormatada("analyticsDtInicio","analyticsHrInicio");
// 		log.info("=====populaCamposHiddenAnalytics populaAdiantamento dataFormatada "+dataFormatada);
		
// 		var sla;
		
// 		if(prazoSLA == ""){
// 			log.info("=====populaCamposHiddenAnalytics populaAdiantamento prazoSLAVazio "+prazoSLA);
// 			var prazosSLA = buscaDatasetPrazosSLA();
// 			sla = buscaSLA(codigoSLA, prazosSLA);
// 			hAPI.setCardValue("analyticsPrazoSLA",sla.prazo_sla);
// 			hAPI.setCardValue("analyticsMedidaPrazoSLA",sla.medida_prazo);
// 		}else{
// 			log.info("=====populaCamposHiddenAnalytics populaAdiantamento prazoSLAPreenchido "+prazoSLA);
// 			sla = {
// 					codigo_sla : codigoSLA,
// 					prazo_sla : prazoSLA,
// 					medida_prazo : hAPI.getCardValue("analyticsMedidaPrazoSLA")
// 			};
// 		}
		
// 		hAPI.setCardValue("analyticsDtInicio",dataFormatada.split(" ")[0]);
// 		hAPI.setCardValue("analyticsHrInicio",dataFormatada.split(" ")[1]);
		
// 		log.info("=====populaCamposHiddenAnalytics populaAdiantamento sla "+sla);
		
// 		if (sequenceId == AVALIAR || sequenceId == ATUALIZA_SLA_1 || sequenceId == ATUALIZA_SLA_2 || sequenceId == SOLUCAO_INC || sequenceId == FIM) {
			
// 			var atividadesDescartadas = new Array();
// 			atividadesDescartadas[0] = CORRECAO;
// 			atividadesDescartadas[1] = APROV_SOLIC;
		
// 			var primeirasAtividadesDescartadas = new Array();
			
// 			var prazoConclusao = buscaPrazoConclusao(sla, atividadesDescartadas, primeirasAtividadesDescartadas, dataFormatada.split(" ")[0], dataFormatada.split(" ")[1]);
// 			log.info("=====populaCamposHiddenAnalytics populaAdiantamento prazoConclusao "+prazoConclusao);
// 			hAPI.setCardValue("analyticsDtPrazo",prazoConclusao.split(" ")[0]);
// 			hAPI.setCardValue("analyticsHrPrazo",prazoConclusao.split(" ")[1]);	
			
// 		}
// 	}
// }

// function buscaPrazoConclusao(sla, atividadesDescartadas, primeirasAtividadesDescartadas, dataInicio, horaInicio){
// 	log.info("=====populaCamposHiddenAnalytics buscaPrazoConclusao sla |"+sla+"|");
// 	log.info("=====populaCamposHiddenAnalytics buscaPrazoConclusao atividadesDescartadas |"+atividadesDescartadas+"|");
// 	log.info("=====populaCamposHiddenAnalytics buscaPrazoConclusao dataInicio |"+dataInicio+"|");
// 	log.info("=====populaCamposHiddenAnalytics buscaPrazoConclusao horaInicio |"+horaInicio+"|");
// 	var expediente = "Default";
	
// 	var dataPrazoConclusao = calculaPrazoConclusao(sla, expediente, atividadesDescartadas, primeirasAtividadesDescartadas, dataInicio, horaInicio);
// 	log.info("=====populaCamposHiddenAnalytics buscaPrazoConclusao dataPrazoConclusao "+dataPrazoConclusao.getDate()+"/"+(dataPrazoConclusao.getMonth() + 1)+"/"+dataPrazoConclusao.getFullYear()+" "+dataPrazoConclusao.getHours()+":"+dataPrazoConclusao.getMinutes()+":"+dataPrazoConclusao.getSeconds());
// 	var dataFormatadaPrazo = formatarDataAnalytics(dataPrazoConclusao.getDate()+"", (dataPrazoConclusao.getMonth() + 1)+"", dataPrazoConclusao.getFullYear()+"", dataPrazoConclusao.getHours()+"",dataPrazoConclusao.getMinutes()+"",dataPrazoConclusao.getSeconds()+"")
// 	log.info("=====populaCamposHiddenAnalytics buscaPrazoConclusao dataFormatadaPrazo "+dataFormatadaPrazo);
	
// 	return dataFormatadaPrazo;
// }