function enableFields(form) {
	var primeiraAtividade = 8;
	var corrigirSolicitacao = 12;
	var avaliarPeloGestor = 9;
	var avaliarGerarTitulo = 10;
	var validacaoFiscal = 11;
	var validacaoTesoura = 76;
	var programarPagamento = 13;
	var contabilizarImobilizado = 12;
	var aprovacaoSolicitante = 15;
	var solucaoInconsistencia = 16;
	var erroIntegracao = 95;
	var apuracaoImpostos = 160;
    var apuracaoImpostosFin = 168;
    var anexarSwift = 170;
    var aprovacaoImpostos = 184;

	var tipoPagamento = form.getValue("tipoLancamento");
	var tipoLancamento = form.getValue("zoomTipolancamento");

	var objForm = new objFormulario(form);

	bloqueiaCadastroEdicao(form);

	if (objForm.isAtividadeInicial(primeiraAtividade)) {} else if (objForm.isAtividadeAtual(corrigirSolicitacao)) {
		bloqueiaEdicaoAprovacao(form);

	} else if (objForm.isAtividadeAtual(avaliarPeloGestor)) {
		bloqueiaAprovacaoFiscalImposto(form);
		bloqueiaFormCadastro(form);
		bloquearDataVencimento(form);
		bloqueiaFornecedor(form);
		bloqueiapgtoGuiaTaxaBoletos(form);
		bloqueiaAprovacaoFiscal(form);
		bloquearRateio(form);
		bloqueiaAprovacaoTesoura(form);
		if (parseFloat(form.getValue("valorPagtoNum")) < 5000) {
			bloquearCampo(form, "dtDePgtoGuiaTaxaBoletos");
		}
	} else if (objForm.isAtividadeAtual(avaliarGerarTitulo)) {
		bloqueiaFormCadastro(form);
		bloquearDataVencimento(form);
		bloqueiaFornecedor(form);
		bloqueiapgtoGuiaTaxaBoletos(form);
		bloqueiaAprovacaoGestor(form);
		bloquearRateio(form);
		bloqueiaAprovacaoTesoura(form);

	} else if (objForm.isAtividadeAtual(validacaoFiscal)) {
		bloqueiaFormCadastro(form);
		bloquearDataVencimento(form);
		bloqueiaFornecedor(form);
		bloqueiapgtoGuiaTaxaBoletos(form);
		bloqueiaAprovacaoGestor(form);
		bloquearRateio(form);
		bloqueiaAprovacaoTesoura(form);

	} else if (objForm.isAtividadeAtual(programarPagamento)) {
		bloqueiaFormCadastro(form);
		bloqueiaFornecedor(form);
		bloqueiaEdicaoAprovacao(form);
		bloqueiapgtoGuiaTaxaBoletos(form);
		bloquearRateio(form);
		bloqueiaAprovacaoTesoura(form);

	} else if (objForm.isAtividadeAtual(aprovacaoSolicitante)) {
		bloqueiaFormCadastro(form);
		bloqueiaFornecedor(form);
		bloqueiaEdicaoAprovacao(form);
		bloqueiapgtoGuiaTaxaBoletos(form);
		bloquearCampoSolucaoInconsistencia(form);
		bloquearRateio(form);
		bloqueiaAprovacaoTesoura(form);
		bloquearDataVencimento(form); //nao tinha na ultima melhoria
		bloquearCampo(form, "dtDePgtoGuiaTaxaBoletos");
		bloquearCampo(form, "aprovDataPrevistaSolici");

	} else if (objForm.isAtividadeAtual(solucaoInconsistencia)) {
		bloqueiaFormCadastro(form);
		bloqueiaFornecedor(form);
		bloqueiaEdicaoAprovacao(form);
		bloqueiapgtoGuiaTaxaBoletos(form);
		bloquearCampoAprovacaoSolicitacao(form);
		bloquearRateio(form);
		bloqueiaAprovacaoTesoura(form);

	} else if (objForm.isAtividadeAtual(validacaoTesoura)) {
		bloqueiaFormCadastro(form);
		bloqueiaFornecedor(form);
		bloqueiapgtoGuiaTaxaBoletos(form);
		bloqueiaAprovacaoGestor(form);
		bloquearRateio(form);
		bloqueiaAprovacaoFiscal(form);

	} else if (objForm.isAtividadeAtual(erroIntegracao)) {
		bloqueiaFormCadastro(form);
		bloqueiaFornecedor(form);
		bloqueiaEdicaoAprovacao(form);
		bloqueiapgtoGuiaTaxaBoletos(form);
		bloquearCampoAprovacaoSolicitacao(form);
		bloquearRateio(form);
		bloqueiaAprovacaoTesoura(form);
	}else if (objForm.isAtividadeAtual(apuracaoImpostos)) {
		bloqueiaFormCadastro(form);
		bloqueiaFornecedor(form);
		bloqueiaEdicaoAprovacao(form);
		bloqueiapgtoGuiaTaxaBoletos(form);
		bloquearCampoAprovacaoSolicitacao(form);
		bloquearRateio(form);
		bloqueiaAprovacaoTesoura(form);
		bloquearDataVencimento(form);
		bloquearCampo(form, "dtDePgtoGuiaTaxaBoletos");
		bloquearCampo(form, "taxaMoeda");
		bloquearCampo(form, "decisaoAprovacaoTesoura");
		bloquearCampo(form, "motAprovacaoTesoura");
		
	}else if (objForm.isAtividadeAtual(apuracaoImpostosFin)) {
		bloquearImpostos(form)
		bloqueiaFormCadastro(form);
		bloqueiaFornecedor(form);
		bloqueiaEdicaoAprovacao(form);
		bloqueiapgtoGuiaTaxaBoletos(form);
		bloquearCampoAprovacaoSolicitacao(form);
		bloquearRateio(form);
		bloqueiaAprovacaoTesoura(form);
		bloquearDataVencimento(form);
		bloquearCampo(form, "dtDePgtoGuiaTaxaBoletos");
		bloquearCampo(form, "dataApuracaoImp");
		bloquearCampo(form, "cnpjContribuinte");
		bloquearCampo(form, "fechamento");
	}else if (objForm.isAtividadeAtual(anexarSwift)) {
		bloquearImpostos(form)
		bloqueiaFormCadastro(form);
		bloqueiaFornecedor(form);
		bloqueiaEdicaoAprovacao(form);
		bloqueiapgtoGuiaTaxaBoletos(form);
		bloquearCampoAprovacaoSolicitacao(form);
		bloquearRateio(form);
		bloqueiaAprovacaoTesoura(form);
		bloquearDataVencimento(form);
		bloquearCampo(form, "dtDePgtoGuiaTaxaBoletos");
		bloquearCampo(form, "dataApuracaoImp");
		bloquearCampo(form, "cnpjContribuinte");
		bloquearCampo(form, "fechamento");
	}else if (objForm.isAtividadeAtual(aprovacaoImpostos)) {
		bloqueiaFormCadastro(form);
		bloqueiaFornecedor(form);
		bloqueiaEdicaoAprovacao(form);
		bloqueiapgtoGuiaTaxaBoletos(form);
		bloquearCampoAprovacaoSolicitacao(form);
		bloquearRateio(form);
		bloqueiaAprovacaoTesoura(form);
		bloquearDataVencimento(form);
		bloquearCampo(form, "dtDePgtoGuiaTaxaBoletos");
		bloquearCampo(form, "taxaMoeda");
		bloquearCampo(form, "decisaoAprovacaoTesoura");
		bloquearCampo(form, "motAprovacaoTesoura");
		bloquearCampo(form, "tipoProdutoDP");
		bloquearCampo(form, "fechamento");
		
	}
}

//Fornecedor
function bloqueiaFornecedor(form) {
	bloquearCampo(form, "A2_COD");
	bloquearCampo(form, "cnpjFornecedor");
}

function bloqueiaEdicaoAprovacao(form) {
	// Gestor
	bloquearCampo(form, "decisaoGestor");
	bloquearCampo(form, "motivoAprovGestor");

	// Fiscal
	bloquearCampo(form, "decisaoFiscal");
	bloquearCampo(form, "motivoAprovFiscal");
}

function bloqueiaCadastroEdicao(form) {
	bloquearCampo(form, "solicitante");
	bloquearCampo(form, "dataSolicitante");

	bloquearCampo(form, "nomeAprovGestor");
	bloquearCampo(form, "aprovDataGestor");

	bloquearCampo(form, "nomeAprovFiscal");
	bloquearCampo(form, "aprovDataFiscal");

	bloquearCampo(form, "nomeAprovacaoFinanc");
	bloquearCampo(form, "dataAprovacaoFinanc");
	bloquearCampo(form, "dataemissaoPgtoGuiaTaxaBoletos");
	bloquearCampo(form, "aprovDataPrevista");

}

function bloqueiaFormCadastro(form) {
	bloquearCampo(form, "filial");
	bloquearCampo(form, "CTT_CUSTO");
	bloquearCampo(form, "numeroDocumento");
	bloquearCampo(form, "dataApuracao");
	bloquearCampo(form, "cbGeraDirf");
	bloquearCampo(form, "codTributoGPS");
	bloquearCampo(form, "cgcTributo");
	bloquearCampo(form, "historico");
	bloquearCampo(form, "prefixo");
	bloquearCampo(form, "vlrOutEntidades");
	bloquearCampo(form, "tipoTributo");
	//	bloquearCampo(form, "dtDeVencPgtoGuiaTaxaBoletos");
	//	bloquearCampo(form, "dtDePgtoGuiaTaxaBoletos");
}

function bloquearDataVencimento(form) {
	bloquearCampo(form, "dtDeVencPgtoGuiaTaxaBoletos");
}

function bloqueiapgtoGuiaTaxaBoletos(form) {
	bloquearCampo(form, "numSolLancNfPgtoGuiaTxBoletos");
	bloquearCampo(form, "numeronfPgtoGuiaTaxaBoletos");
	bloquearCampo(form, "valorPgtoGuiaTaxaBoletos");
	bloquearCampo(form, "input-group-addon");
	bloquearCampo(form, "vlMulta");
	bloquearCampo(form, "vlJuros");
	bloquearCampo(form, "numeroTitulo");
	bloquearCampo(form, "vlAutonomo");
}

function bloqueiaAprovacaoGestor(form) {
	bloquearCampo(form, "decisaoGestor");
	bloquearCampo(form, "motivoAprovGestor");
}

function bloqueiaAprovacaoFiscal(form) {
	bloquearCampo(form, "decisaoFiscal");
	bloquearCampo(form, "motivoAprovFiscal");
}

function bloqueiaAprovacaoFiscalImposto(form) {
	bloquearCampo(form, "decisaoFiscalImposto");
	bloquearCampo(form, "motivoFiscalImposto");
}

function bloqueiaAprovacaoTesoura(form) {
	bloquearCampo(form, "decisaoTesoura");
	bloquearCampo(form, "motivoAprovTesoura");
}

function bloquearCampoSolucaoInconsistencia(form) {
	bloquearCampo(form, "retorno");
}

function bloquearCampoAprovacaoSolicitacao(form) {
	bloquearCampo(form, "aceite");
	bloquearCampo(form, "compSolicitante");
}

function bloquearRateio(form) {
	bloquearCampo(form, 'existeRateio');

	//busca os indices do pai filho
	var indexes = form.getChildrenIndexes("tbBeneficios");
	//percorre os campos do pai
	for (var i = 0; i < indexes.length; i++) {
		var index = indexes[i];
		//Objeto com todos os campos de da linha atual
		var rowTable = {
			codCentroCusto: 'codCentroCustoBeneficio___' + index,
			centroCusto: 'centroCustoBeneficio___' + index,
			valorMovimento: 'valorBeneficio___' + index,
			percentual: 'percentualBeneficio___' + index
		}
		bloquearCampo(form, rowTable.codCentroCusto);
		bloquearCampo(form, rowTable.valorMovimento);
		bloquearCampo(form, rowTable.percentual);
	}
}

function bloquearImpostos(form){
	
	var indexes = form.getChildrenIndexes("tbImpostos");

	for (var i=0; i<indexes.length; ++i){ 
		form.setEnabled("base___"+indexes[i], false); 
		form.setEnabled("venc___"+indexes[i], false);		
		form.setEnabled("integra___"+indexes[i], false);
		form.setEnabled("trib___"+indexes[i], false);
		form.setEnabled("forn___"+indexes[i], false);	
	} 	
	
}