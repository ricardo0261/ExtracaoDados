function beforeCancelProcess(colleagueId, processId) {
//	var validarAtividade = getValue("WKNumState");
//
//	if (validarAtividade != 10 && validarAtividade != 14
//			&& validarAtividade != 34) {
//		throw "Essa atividade não pode ser cancelada, porque existe um adiantamento em aberto"
//	} else {
//		hAPI.setCardValue("solicitacaoAberta", "0");
//	}

	var dataAtual = new Date();
	var dataFormatada = formatarDataAnalytics(dataAtual.getDate(), (dataAtual.getMonth()+1), dataAtual.getFullYear(), dataAtual.getHours(), dataAtual.getMinutes(), dataAtual.getSeconds());
	
	
	hAPI.setCardValue("analyticsDtFim", dataFormatada.split(" ")[0]);
	hAPI.setCardValue("analyticsHrFim", dataFormatada.split(" ")[1]);
	
	//GLPI-143467-preenche-solicitacao-finalizado-cancelado
	hAPI.setCardValue("solicitacaoAberta", "0");
}