function displayFields(form, customHTML) {

	
	// inicio alteração 
	  var CURRENT_STATE = getValue('WKNumState');

	    var MODO_EDICAO = form.getFormMode();

	    customHTML.append('<script> var CURRENT_STATE = ' + CURRENT_STATE + '; </script>');

	    customHTML.append('<script> var MODO_EDICAO = "' + MODO_EDICAO + '";</script>');
	// fim alteração
	
	// PEGAR DATA ATUAL
	 var fullDate = new Date();
	 var date = fullDate.getDate().toString();
	         if(date.length == 1)
	         { date = 0+date;}
	 var mes = (fullDate.getMonth()+1).toString();
	         if(mes.length == 1)
	         { mes = 0+mes;}                                                                                                                
	 var data = date+"/"+mes+"/"+fullDate.getFullYear(); 
	 var nome_user = fluigAPI.getUserService().getCurrent().getFullName();

	var currentState = getValue('WKNumState');
    form.setValue("atvAtual", currentState);
	gravarCamposTraducao(customHTML);
	var process = getValue("WKNumProces");
    form.setValue('codSolicitacao', process);
	var primeiraAtividade = 5;
	var atividadeAprovadorGestor = 10;
	var atividadeAprovadorGestorCSO = 14;
	var atividadeAprovadorGestorCSOFP = 124;
	var atividadeCorrecao = 34;
	var atividadeCancelada = 24;
	var atividadeAprovadorGestorFinanceiro = 20;
	var atividadePreencheReembolso = 38;
	var atividadeAnalisarReembolso = 37;
	var atividadeCorrecaoReembolso = 54;
	var atividadeAvaliaAnexoPedidoReembolso = 50;
	var atividadeCanceladaReembolso = 88;
	//var atividadeInformarAoSolicitante = 94;
	var atividadeAprovacaoDaSolucao = 101;
	var atividadeSolucaoDaInconsistencia = 102;
	var atividadeInicio = 165;	
	var atividadeAprovCursos = 185;
	var atividadeErroTransfeera = 180;
	var atividadeAprovVCursos = 203;
 
	customHTML.append("<script>function buscarUsuarioLogado(){return " + "'" + getValue('WKUser') + "'" + ";}</script>");
	customHTML.append("<script>function buscaEmpresa(){return " + getValue('WKCompany') + ";}</script>");
	customHTML.append("<script>function buscarAtividadeAtual(){return " + getValue("WKNumState") + ";}</script>");
	customHTML.append("<script>function buscarDocumentoForm(){return " + form.getDocumentId() + ";}</script>");
	customHTML.append("<script> var FORM_MODE = '" + form.getFormMode() +"';</script>"); 
	
	/*
	 * customHTML.append("<script>function buscarProcessoAtual();{return " +
	 * getValue("WKNumProces") + ";}</script>");
	 */

	setarProcessoAtual(form, customHTML);

	// insereFuncaoJavascript(customHTML,"window.onload=buscarProcesso();");
	// chamando o objeto
	var objForm = new objFormulario(form);

	// rodarDataSetDespesas(form, customHTML);

	// // Função que converte em maiuscula os campos e retira os espa?os de
	// inicio
	// // e fim dos campos
	// converterValorDeCampos(form, customHTML);

	if (!objForm.isAtividadeInicial(primeiraAtividade) || !objForm.isAtividadeAtual(atividadeInicio)) {
	}
	if (objForm.isAtividadeInicial(primeiraAtividade) || objForm.isAtividadeAtual(atividadeInicio)) {
		var cdSolicitante = buscarUsuarioLogado();
		var userMail = buscarMailUsuarioLogado();
		gravarValorCampo(form, "cdSolicitante", cdSolicitante);
		gravarValorCampo(form, "emailSolicitante", userMail);
		controlarTela(form, customHTML);
		comecarTelaDesabilitado(form, customHTML);
		selecionarTelaPorTipo(form, customHTML);
		formularioCadastro(form, customHTML);
		setarValorDeDefault(form, customHTML);
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		notFormularioAprovadoresGestorReembolso(form, customHTML);
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		ocultarCampoAdiantamentoRecebido(form, customHTML);
		ocultarCampoSolucao(form, customHTML);
		
	}
	
	if (objForm.isAtividadeAtual(atividadeErroTransfeera)) {
		var cdSolicitante = buscarUsuarioLogado();
		var userMail = buscarMailUsuarioLogado();
		gravarValorCampo(form, "aprovadorFinanceiro", nome_user);
		gravarValorCampo(form, "dataAprovadorFIN", data);
	}
	
	if (objForm.isAtividadeAtual(atividadeAprovCursos)) {
		var cdSolicitante = buscarUsuarioLogado();
		var userMail = buscarMailUsuarioLogado();
		gravarValorCampo(form, "nomeaprovGestorCursos", nome_user);
		gravarValorCampo(form, "aprovdataGestorCursos", data);
	}
	
	if (objForm.isAtividadeAtual(atividadeAprovVCursos)) {
		var cdSolicitante = buscarUsuarioLogado();
		var userMail = buscarMailUsuarioLogado();
		gravarValorCampo(form, "nomeaprovValidaCursos", nome_user);
		gravarValorCampo(form, "aprovdataVCursos", data);
	}

	if (objForm.isAtividadeAtual(atividadeAprovadorGestor)) {
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		notFormularioAprovadoresGestorReembolso(form, customHTML);
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		notFormularioAprovadoresGestorReembolso(form, customHTML);
		dadosAprovacaoGestores(form, customHTML);
		controlarTela(form, customHTML);
		bloquearBotaoZoom(form, customHTML);
		fnOcultaLixeiraTableName(form);
		ocultarCampoAdiantamentoRecebido(form, customHTML);
		desapareceCampoFlagGestor(form, customHTML);
		ocultarCampoSolucao(form, customHTML);
	}
	
	if (objForm.isAtividadeAtual(atividadeAprovadorGestorCSO)) {
		
		if(form.getValue("analyticsTpSolicitacao") == "adiantamento");
			setNomeUsuarioLogado(form, "analyticsNmResponsavelSLA");
			
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		notFormularioAprovadoresGestorReembolso(form, customHTML);
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		dadosAprovacaoGestoresCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		controlarTela(form, customHTML);
		bloquearBotaoZoom(form, customHTML);
		fnOcultaLixeiraTableName(form);
		ocultarCampoAdiantamentoRecebido(form, customHTML);
		desapareceCampoFlagGestor(form, customHTML);
		ocultarCampoSolucao(form, customHTML);
	}
	
	if (objForm.isAtividadeAtual(atividadeAprovadorGestorCSOFP)) {
		
		if(form.getValue("analyticsTpSolicitacao") == "adiantamento");
			setNomeUsuarioLogado(form, "analyticsNmResponsavelSLA");
			
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		notFormularioAprovadoresGestorReembolso(form, customHTML);
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		notFormularioAprovadoresGestorCSO(form, customHTML);
		dadosAprovacaoGestoresCSOFP(form, customHTML);
		
		controlarTela(form, customHTML);
		bloquearBotaoZoom(form, customHTML);
		bloquearBotaoTableName(form, customHTML);
		fnOcultaLixeiraTableName(form);
		ocultarCampoAdiantamentoRecebido(form, customHTML);
		desapareceCampoFlagGestor(form, customHTML);
		ocultarCampoSolucao(form, customHTML);
	}

	if (objForm.isAtividadeAtual(atividadeCorrecao)) {
		controlarTelaAprovador(form, customHTML);
		dadosAprovacaoGestoresCSO(form, customHTML);
		dadosAprovacaoGestoresCSOFP(form, customHTML);
		controlarTela(form, customHTML);
		ocultarCampoAdiantamentoRecebido(form, customHTML);
		ocultarCampoSolucao(form, customHTML);
	}
	if (objForm.isAtividadeAtual(atividadeCancelada)) {
		controlarTelaAprovador(form, customHTML);
		dadosAprovacaoGestoresCSO(form, customHTML);
		dadosAprovacaoGestoresCSOFP(form, customHTML);
		controlarTela(form, customHTML);
		bloquearBotaoZoom(form, customHTML);
		fnOcultaLixeiraTableName(form);
		ocultarCampoAdiantamentoRecebido(form, customHTML);
		desapareceCampoFlagGestor(form, customHTML);
		ocultarCampoSolucao(form, customHTML);
	}
	if (objForm.isAtividadeAtual(atividadeAprovadorGestorFinanceiro)) {
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		notFormularioAprovadoresGestorReembolso(form, customHTML);
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		dadosAprovacaoGestoresFinanceiro(form, customHTML);
		controlarTela(form, customHTML);
		bloquearBotaoZoom(form, customHTML);
		fnOcultaLixeiraTableName(form);
		ocultarCampoAdiantamentoRecebido(form, customHTML);
		inserirFuncaoJavascript(customHTML, 'setarMensagemAlerta();');
		desapareceCampoFlagGestor(form, customHTML);
		ocultarCampoSolucao(form, customHTML);
	}

	if (objForm.isAtividadeAtual(atividadePreencheReembolso)) {
		controlarTelaReembolsoPassouAdiantamento(form, customHTML);
		desapareceCampoFlagGestor(form, customHTML);
		ocultarCampoSolucao(form, customHTML);
	}

	if (objForm.isAtividadeAtual(atividadeAnalisarReembolso)) {
		// insereFuncaoJavascript(customHTML,
		// "window.onload=setValorIntegracaoReembolso();");
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		dadosAprovacaoGestoresReembolso(form, customHTML);
		controlarTela(form, customHTML);
		bloquearBotaoZoom(form, customHTML);
		bloquearBotaoTableName(form, customHTML);
		fnOcultaLixeiraTableName(form);
		desapareceCampoFlagGestor(form, customHTML);
		ocultarCampoSolucao(form, customHTML);

	}
	if (objForm.isAtividadeAtual(atividadeCorrecaoReembolso)) {
		controlarTelaAprovador(form, customHTML);
		dadosAprovacaoGestoresCSO(form, customHTML);
		dadosAprovacaoGestoresCSOFP(form, customHTML);
		controlarTela(form, customHTML);
		comecarTelaDesabilitado(form, customHTML);
		selecionarTelaPorTipo(form, customHTML);
		setarValorDeDefault(form, customHTML);
		ocultarCampoAdiantamentoRecebido(form, customHTML);
		desapareceCampoFlagGestor(form, customHTML);
		ocultarCampoSolucao(form, customHTML);
	}

	if (objForm.isAtividadeAtual(atividadeAvaliaAnexoPedidoReembolso)) {
		
		if(form.getValue("analyticsTpSolicitacao") == "reembolso");
			setNomeUsuarioLogado(form, "analyticsNmResponsavelSLA");
		
		inserirFuncaoJavascript(customHTML, 'setarMensagemAlerta();');
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		notFormularioAprovadoresGestorReembolso(form, customHTML);
		controlarTelaAprovador(form, customHTML);
		dadosAprovacaoGestoresCSO(form, customHTML);
		dadosAprovacaoGestoresCSOFP(form, customHTML);
		controlarTela(form, customHTML);
		dadosAprovacaoReembolsoFinanceiro(form, customHTML);
		bloquearBotaoZoom(form, customHTML);
		bloquearBotaoTableName(form, customHTML);
		fnOcultaLixeiraTableName(form);
		desapareceCampoFlagGestor(form, customHTML);
		ocultarCampoSolucao(form, customHTML);
	}
	if (objForm.isAtividadeAtual(atividadeCanceladaReembolso)) {
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		dadosAprovacaoGestoresReembolso(form, customHTML);
		controlarTela(form, customHTML);
		bloquearBotaoZoom(form, customHTML);
		bloquearBotaoTableName(form, customHTML);
		fnOcultaLixeiraTableName(form);
		desapareceCampoFlagGestor(form, customHTML);
		ocultarCampoSolucao(form, customHTML);
	}
	/* Atividade deletada
	if (objForm.isAtividadeAtual(atividadeInformarAoSolicitante)) {
		notFormularioAprovadoresGestorReembolso(form, customHTML);
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		controlarTela(form, customHTML);
		bloquearBotaoZoom(form, customHTML);
		bloquearBotaoTableName(form, customHTML);
		fnOcultaLixeiraTableName(form);
		desapareceCampoFlagGestor(form, customHTML);
		ocultarCampoSolucao(form, customHTML);
	}*/
	if (objForm.isAtividadeAtual(atividadeAprovacaoDaSolucao)) {
		
		formularioAprovacaoDaSolucao(form, customHTML);
		notFormularioAprovadoresGestorReembolso(form, customHTML);
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		controlarTela(form, customHTML);
		bloquearBotaoZoom(form, customHTML);
		bloquearBotaoTableName(form, customHTML);
		fnOcultaLixeiraTableName(form);
		desapareceCampoFlagGestor(form, customHTML);
	}
	if (objForm.isAtividadeAtual(atividadeSolucaoDaInconsistencia)) {
		notFormularioAprovadoresGestorReembolso(form, customHTML);
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		controlarTela(form, customHTML);
		bloquearBotaoZoom(form, customHTML);
		bloquearBotaoTableName(form, customHTML);
		fnOcultaLixeiraTableName(form);
		desapareceCampoFlagGestor(form, customHTML);

	}
}
function fnOcultaLixeiraTableName(form) {
	form.setHideDeleteButton(true);
}
function controlarTelaReembolsoPassouAdiantamento(form, customHTML) {
	notFormularioAprovadoresGestorReembolso(form, customHTML);
	notFormularioAprovadoresGestor(form, customHTML);
	notFormularioAprovadoresGestorCSO(form, customHTML);
	notFormularioAprovadoresGestorCSOFP(form, customHTML);
	notFormularioAprovadoresGestorFinanceiro(form, customHTML);
	notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
	inserirFuncaoJavascript(customHTML, 'controlarTelaReembolsoPassouAdiantamento();');

}

function selecionarTelaPorTipo(form, customHTML) {
	inserirFuncaoJavascript(customHTML, 'selecionarTelaPorTipo();');
}

function comecarTelaDesabilitado(form, customHTML) {
	inserirFuncaoJavascript(customHTML, 'comecarCamposDesabilitado();');
}

function controlarTelaAprovador(form, customHTML) {

	if (form.getValue("decisaoGestorHiddenCSO") == "nao"
			|| form.getValue("decisaoGestorHiddenCSO") == "cancelar") {
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		notFormularioAprovadoresGestorReembolso(form, customHTML);

	} else if (form.getValue("decisaoGestorHidden") == "nao"
			|| form.getValue("decisaoGestorHidden") == "cancelar") {
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		notFormularioAprovadoresGestorReembolso(form, customHTML);
	} else if (form.getValue("decisaoGestorFinanceiroHidden") == "nao"
			|| form.getValue("decisaoGestorFinanceiroHidden") == "cancelar") {
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
		notFormularioAprovadoresGestorReembolso(form, customHTML);
	} else if (form.getValue("decisaoGestorReembolsoHidden") == "nao"
			|| form.getValue("decisaoGestorReembolsoHidden") == "cancelar") {
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		notFormularioAprovadoresReembolsoFinanceiro(form, customHTML);
	} else if (form.getValue("decisaoReembolsoFinanceiro") == "nao"
			|| form.getValue("decisaoReembolsoFinanceiro") == "cancelar") {
		notFormularioAprovadoresGestor(form, customHTML);
		notFormularioAprovadoresGestorCSO(form, customHTML);
		notFormularioAprovadoresGestorCSOFP(form, customHTML);
		notFormularioAprovadoresGestorFinanceiro(form, customHTML);
		notFormularioAprovadoresGestorReembolso(form, customHTML);

	}

}

function controlarTela(form, customHTML) {
	inserirFuncaoJavascript(customHTML, 'controlarTela();');
}

function bloquearBotaoTableName(form, customHTML) {
	ocultarCampo(customHTML, "addRegistro");
	ocultarCampo(customHTML, "addRegistroo");
}

function controlarTelaInicioReembolso(form, customHTML) {
	inserirFuncaoJavascript(customHTML,
			'controlarTelaReembolsoPassouAdiantamento();');
}

function dadosAprovacaoGestores(form, customHTML) {
	setNomeUsuarioLogado(form, "nomeaprovGestor");
	setDataAtual(form, "aprovdataGestor");
}

function dadosAprovacaoGestoresCSO(form, customHTML) {
	setNomeUsuarioLogado(form, "nomeaprovGestorCSO");
	setDataAtual(form, "aprovdataGestorCSO");
}

function dadosAprovacaoGestoresCSOFP(form, customHTML) {
	setNomeUsuarioLogado(form, "nomeaprovGestorCSOFP");
	setDataAtual(form, "aprovdataGestorCSOFP");
}

function dadosAprovacaoGestoresFinanceiro(form, customHTML) {
	setNomeUsuarioLogado(form, "nomeaprovGestorFinanceiro");
	setDataAtual(form, "aprovdataGestorFinanceiro");
}
function dadosAprovacaoGestoresReembolso(form, customHTML) {
	setNomeUsuarioLogado(form, "nomeaprovGestorReembolso");
	setDataAtual(form, "aprovdataGestorReembolso");
}
function dadosAprovacaoReembolsoFinanceiro(form, customHTML) {
	setNomeUsuarioLogado(form, "nomeaprovReembolsoFinanceiro");
	setDataAtual(form, "aprovdataReembolsoFinanceiro");
}

function notFormularioAprovadoresReembolsoFinanceiro(form, customHTML) {
	ocultarCampo(customHTML, "aprovadorReembolsoFinanceiro");
}

function notFormularioAprovadoresGestorReembolso(form, customHTML) {
	ocultarCampo(customHTML, "aprovadorGestorReembolso");
}

function notFormularioAprovadoresGestor(form, customHTML) {
	ocultarCampo(customHTML, "aprovadorGestor");
}

function notFormularioAprovadoresGestorCSO(form, customHTML) {
	ocultarCampo(customHTML, "aprovadorGestorCSO");
}

function notFormularioAprovadoresGestorCSOFP(form, customHTML) {
	ocultarCampo(customHTML, "aprovadorGestorCSOFP");
}

function notFormularioAprovadoresGestorFinanceiro(form, customHTML) {
	ocultarCampo(customHTML, "aprovadorGestorFinanceiro");
}

function bloquearBotaoZoom(form, customHTML) {
	inserirFuncaoJavascript(customHTML, 'bloquearBotaoZoom();');
}

// carrega os campos de solicitante
function formularioCadastro(form, customHTML) {
	setNomeUsuarioLogado(form, "solicitante");
	setDataAtual(form, "dataSolicitante");
}
function setarValorDeDefault(form, customHTML) {
	form.setValue("diasViagem", 0);
	form.setValue("valorTotal", 0);
}

function gravarCamposTraducao(customHTML) {
	// Declara??o da variaveis globais
	var inicioScript = '';
	inicioScript += 'var msg_campo_vazio;';
	inicioScript += 'var objForm_exibicaoDeErros;';

	inicioScript += '$(function(){';
	var script = '';
	var fimScript = '});';

	// Preenchimento das variaveis
	script += 'msg_campo_vazio = "' + i18n.translate("msg.campo.vazio") + '";';
	script += 'objForm_exibicaoDeErros = "'
			+ i18n.translate("objForm.exibicaoDeErros") + '";';

	inserirFuncaoJavascript(customHTML, inicioScript + script + fimScript);
}

function ocultarCampoAdiantamentoRecebido(form, customHTML) {
	ocultarCampo(customHTML, "preencheFormularioDeReembolso");
}

function setarProcessoAtual(form, customHTML) {
	var idSolicitacao = buscarIdSolicitacao();
	form.setValue("E2_ZIDFLG", idSolicitacao);
}
function desapareceCampoFlagGestor(form, customHTML) {
	//if (form.getValue("labelFlagGestor") == false) {
	//	ocultarCampo(customHTML, "habilitaCampoFlagGestor");
	//}
}
function formularioAprovacaoDaSolucao(form, customHTML) {
	if(buscarValorCampo(form, "aceite") == "S"){
		ocultarCampo(customHTML, "complementoSolicitante");
	}
	if(buscarValorCampo(form, "retorno") == ""){
		ocultarCampo(customHTML, "complementoAnalista");
	}
}

function ocultarCampoAprovador(form, customHTML) {
	ocultarCampo(customHTML, "aprovador");
}

function ocultarCampoSolucao(form, customHTML) {
	ocultarCampo(customHTML, "solucao");
}