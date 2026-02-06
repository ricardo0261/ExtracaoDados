function enableFields(form) {
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
	//var atrividadeFinalVisualizar = 94;
	var atividadeCanceladaReembolso = 88;
	var atividadeAprovacaoDaSolucao = 101;
	var atividadeSolucaoDaInconsistencia = 102;
	var atividadeMicroDeposito = 173;
	var atividadeAprovVCursos = 203;
	var objForm = new objFormulario(form);
	bloquearCadastroEdicao(form);
	/*
	 * Atividade de Cadastro Inicial
	 */
	if (objForm.isAtividadeInicial(primeiraAtividade)) {

	}

	if (objForm.isAtividadeAtual(atividadeAprovadorGestor)) {
		bloquearCampoAdiantamento(form);
		bloquearCamposInicio(form);
		bloqueiaTabela(form);
	}
	if (objForm.isAtividadeAtual(atividadeAprovadorGestorCSO)) {
		bloquearCampoAdiantamento(form);
		bloquearCamposInicio(form);
		bloqueiaTabela(form);

	}
	
	if (objForm.isAtividadeAtual(atividadeMicroDeposito)) {
		bloquearCamposInicio(form);
		bloqueiaTabela(form);
		bloquearFornecedor(form);

	}
	
	if (objForm.isAtividadeAtual(atividadeAprovadorGestorCSOFP)) {
		bloquearCampoAdiantamento(form);
		bloquearCampoReembolso(form);
		bloquearCamposInicio(form);
		bloqueiaTabela(form);
	}
	
	if (objForm.isAtividadeAtual(atividadeAprovVCursos)) {
		bloquearCampoAdiantamento(form);
		bloquearCampoReembolso(form);
		bloquearCamposInicio(form);
		bloqueiaTabela(form);
	}
	
	if (objForm.isAtividadeAtual(atividadeAprovadorGestorFinanceiro)) {
		bloquearCampoAdiantamento(form);
		bloquearCamposInicio(form);
		bloqueiaTabela(form);

	}
	if (objForm.isAtividadeAtual(atividadeCancelada)) {
		bloquearCampoAdiantamento(form);
		bloquearCampoCorrecao(form);
		bloqueiaTabela(form);
	}
	if (objForm.isAtividadeAtual(atividadeCanceladaReembolso)) {
		bloquearCampoAdiantamento(form);
		bloquearCampoCorrecao(form);
		bloqueiaTabela(form);
	}
	if (objForm.isAtividadeAtual(atividadeCorrecao)) {
		bloquearCampoCorrecao(form);
		bloquearCampoDecisao(form);
		bloquearCamposInicio(form);
		

	}
	if (objForm.isAtividadeAtual(atividadePreencheReembolso)) {
		bloquearCampoAdiantamento(form);

	}
	if (objForm.isAtividadeAtual(atividadeAnalisarReembolso)) {
		bloquearCamposInicio(form);
		bloquearCampoAdiantamento(form);
		bloquearCampoReembolso(form);
		bloqueiaTabela(form);
	}
	if (objForm.isAtividadeAtual(atividadeAvaliaAnexoPedidoReembolso)) {
		bloquearCampoAdiantamento(form);
		bloquearCampoReembolso(form);
		bloquearCamposInicio(form);		
		bloqueiaTabela(form);
		
	}
	if (objForm.isAtividadeAtual(atividadeCorrecaoReembolso)) {
		bloquearCampoDecisao(form);
		bloquearCampoCorrecao(form);
		
	}/*
	if (objForm.isAtividadeAtual(atrividadeFinalVisualizar)) {
		bloquearCampoReembolso(form);
		bloquearCampoAdiantamento(form);
	}*/
	if (objForm.isAtividadeAtual(atividadeAprovacaoDaSolucao)) {
		
		bloquearCampoReembolso(form);
		bloquearCampoAdiantamento(form);
		bloquearCampoSolucaoInconsistencia(form);
		bloquearCamposInicio(form);
		bloqueiaTabela(form);
	}
	if (objForm.isAtividadeAtual(atividadeSolucaoDaInconsistencia)) {
		bloquearCampoReembolso(form);
		bloquearCampoAdiantamento(form);
		bloquearCampoAprovacaoSolicitacao(form);
		bloqueiaTabela(form);
	}
	
	
	

}

function bloquearCamposInicio(form) {
	bloquearCampo(form, "cpfFornecedor");
	bloquearCampo(form, "filialOrigem");
	bloquearCampo(form, "filial");
	bloquearCampo(form, "tipoDeColaborador");
	bloquearCampo(form, "area");
	
}

function bloquearFornecedor(form) {
	bloquearCampo(form, "tipoFornecedor");
	bloquearCampo(form, "cpf");
	bloquearCampo(form, "tipoCadastro");
	bloquearCampo(form, "fornecedor");	
	bloquearCampo(form, "ddd");
	bloquearCampo(form, "telefone");
	bloquearCampo(form, "telefoneFinanceiro");
	bloquearCampo(form, "emailForn");
	bloquearCampo(form, "tipoConta");
	bloquearCampo(form, "banco");
	bloquearCampo(form, "agencia");
	bloquearCampo(form, "digVAgencia");
	bloquearCampo(form, "contaCorrente");	
	bloquearCampo(form, "digVConta");	
	bloquearCampo(form, "bairro");
	bloquearCampo(form, "endereco");
	bloquearCampo(form, "complementoEnd");
	bloquearCampo(form, "pais");
	bloquearCampo(form, "zoomMunicipio");
	bloquearCampo(form, "cep");
	
	
}

function bloquearCampoDecisao(form) {
	bloquearCampo(form, "decisaoGestorReembolso");
	bloquearCampo(form, "motivoaGestorReembolso");
}

function bloquearCampoCorrecao(form) {
	bloquearCampo(form, "tipoSolicitacao");
	bloquearCampo(form, "decisaoGestor");
	bloquearCampo(form, "decisaoGestorCSO");
	bloquearCampo(form, "decisaoGestorFinanceiro");
	bloquearCampo(form, "decisaoGestorReembolso");
	bloquearCampo(form, "decisaoReembolsoFinanceiro");
	bloquearCampo(form, "motivoaReembolsoFinanceiro");
	bloquearCampo(form, "motivoaGestorReembolso");
	bloquearCampo(form, "motivoaGestorFinanceiro");
	bloquearCampo(form, "motivoaGestorCSO");
	bloquearCampo(form, "motivoaGestor");

}

function bloquearCampoReembolso(form) {
	bloquearCampo(form, "motivoaGestorCSO");
	bloquearCampo(form, "CENTRO_CUSTO_DESC");
	bloquearCampo(form, "diasViagem");
	bloquearCampo(form, "motivoJustificativa");
	bloquearCampo(form, "informacaoCidadeColaborador");
	bloquearCampo(form, "tipoDeColaborador");
	bloquearCampo(form, "alimentacao");
	bloquearCampo(form, "combustivel");
	bloquearCampo(form, "hospedagem");
	bloquearCampo(form, "onibus");
	bloquearCampo(form, "taxiReembolso");
	bloquearCampo(form, "diversos");
	bloquearCampo(form, "viagemDe");
	bloquearCampo(form, "viagemPara");
	bloquearCampo(form, "area");
	bloquearCampo(form, "tpReembolso");
	bloquearCampo(form, "valorDespesas");
	bloquearCampo(form, "descricaoDespesas");	
	bloquearCampo(form, "area");
	
	bloquearCampo(form, "infoDentroPolitica");
	
}

function bloquearCadastroEdicao(form) {
	bloquearCampo(form, "solicitante");
	bloquearCampo(form, "dataSolicitante");
	bloquearCampo(form, "integraValorBancarioProtheus");
}

function bloquearCampoAdiantamento(form) {
	bloquearCampo(form, "tipoSolicitacao");
	bloquearCampo(form, "CENTRO_CUSTO_DESC");
	bloquearCampo(form, "filial");
	bloquearCampo(form, "diasViagem");
	bloquearCampo(form, "motivoJustificativa");
	bloquearCampo(form, "despesaDinamica_0");
	bloquearCampo(form, "despesaDinamica_1");
	bloquearCampo(form, "despesaDinamica_2");
	bloquearCampo(form, "despesaDinamica_3");
	bloquearCampo(form, "flagValidaFDS");
	bloquearCampo(form, "viagemParaAdiantamento");
	bloquearCampo(form, "viagemDeAdiantamento");
	bloquearCampo(form, "area");
	
}
function bloquearCampoSolucaoInconsistencia(form) {
	bloquearCampo(form, "retorno");
}
function bloquearCampoAprovacaoSolicitacao(form) {
	bloquearCampo(form, "aceite");
	bloquearCampo(form, "compSolicitante");
}

function bloqueiaTabela(form){    	
	var indexes = form.getChildrenIndexes("tbVinculoDespesas");
	for (var i=0; i<indexes.length; ++i){ 
		form.setEnabled("valorDespesas___"+indexes[i], false); 
		form.setEnabled("descricaoDespesas___"+indexes[i], false);
	}	    	
}
