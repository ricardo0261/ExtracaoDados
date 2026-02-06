function validateForm(form) {

	// chamando o objeto
	var objForm = new objFormulario(form);
	
	if (objForm.isAtividadeInicial(primeiraAtividade) || 
		objForm.isAtividadeAtual(preencheFormularioDeReembolso) || 
		objForm.isAtividadeAtual(corrigirSolicitacaoReembolso) || objForm.isAtividadeAtual(atividadeInicio)) {
		// var cadastraF = form.getValue('fornCadastrado');
		// if(cadastraF == "1"){
			validarRegrasECampos(objForm, form); 
			validarAdiantamentoAberto(objForm, form);
		// }else if(cadastraF == "2"){
			// validarCadastroFornecedor(objForm,form);
		// }
		// validaRateio(form)
			if (form.getValue("tpReembolso") == "4") {
				var despesas = form.getChildrenIndexes("tbVinculoDespesas");
									
					for (var i = 1; i <= despesas.length; i++) {
							
						var codigo = form.getValue("codtipoDeDespesas___"+i);
						log.info("codigo"+codigo);
						if (codigo == "23"){
							validaCampo('descricaoDespesas___' + i, 'Favor justificar a despesa quando for Outros ' + i, form);
						}	
					}
			}
			
			if (form.getValue("excecaoCC") != "sim"){
			
				// dentro da politica
				if (form.getValue("infoDentroPoliticaHidden") == "0" && (form.getValue("filialOrigem_protheus") == "00101" || form.getValue("filialOrigem_protheus") == "00104")) {
					validaCampo('gestorArea', 'Não possui um gestor da area para essa filial. Favor revisar o cadastro no fichário de areas x aprovadores ', form);				
				}
				
				// dentro da politica
				if (form.getValue("infoDentroPoliticaHidden") == "0" && (form.getValue("filialOrigem_protheus") != "00101" && form.getValue("filialOrigem_protheus") != "00104")) {				
					validaCampo('aprovadorGO', 'Não possui um aprovador GO da area para essa filial. Favor revisar o cadastro no fichário de Cadastro de Responsável por Filial ', form);				
				}
				
				// fora da politica
				if (form.getValue("infoDentroPoliticaHidden") == "1" && (form.getValue("filialOrigem_protheus") == "00101" || form.getValue("filialOrigem_protheus") == "00104")) {				
					validaCampo('diretorArea', 'Não possui um diretor da area para essa filial. Favor revisar o cadastro no fichário de areas x aprovadores ', form);				
				}
				
				// fora da politica
				if (form.getValue("infoDentroPoliticaHidden") == "1" && (form.getValue("filialOrigem_protheus") != "00101" && form.getValue("filialOrigem_protheus") != "00104")) {				
					validaCampo('aprovadorRegional', 'Não possui um aprovador regional para essa filial. Favor revisar o cadastro no fichário de Cadastro de Responsável por Filial ', form);				
				}
									
				// adiantamento
				if (form.getValue("tipoSolicitacao") == "adiantamento" && (form.getValue("filialOrigem_protheus") == "00101" || form.getValue("filialOrigem_protheus") == "00104") && parseFloat(form.getValue('valorTotal')) > 5000) {				
					validaCampo('codigoAprovador2', 'Não possui um segundo aprovador de centro de custo. Favor revisar o cadastro no fichário de Cadastro de Centro de Custo', form);				
				}
			}	
			
		var novoFornecedor = form.getValue('cpf');
		var valTransfeera = form.getValue('valTransfeera_01');
			if(novoFornecedor != ""){
				//validarCadastroFornecedor(objForm,form);				
				if(valTransfeera != "sim"){
					throw "Favor realizar a validação da 1 etapa do transfeera para continuar com o cadastro do novo fornecedor.";
				}				
			}	
			
		var tipo = form.getValue('tpReembolso');
		var foraPolitica = form.getValue('checkbox_foradapolitica');
			if(tipo == "4"){										
				if(foraPolitica == ""){
					throw "Favor validar a informação de fora da política.";
				}				
			}
				
		var validaCurso = form.getValue('checkbox_curso');
			if(tipo == "3"){										
				if(validaCurso == ""){
					throw "Favor validar o check do curso.";
				}				
			}
			
			
	} else if (objForm.isAtividadeAtual(atividadeCorrecao)) {
		validarRegrasECampos(objForm, form);
	} else if (objForm.isAtividadeAtual(analisarSolicitacaoDeReembolso)) {
		validarRegrasECampos(objForm, form);
		validarCampoAprovadorGestorReembolso(objForm);
		
		if (form.getValue("aceite_solicitacao") == ""){			
			throw "Favor dar o aceite no campo Confirmar solicitação adiantamento/reembolso";			
		}
		
	} else if (objForm.isAtividadeAtual(avaliarAnexoPedidoDeReembolso)) {
		validarRegrasECampos(objForm, form);
		validarCampoAprovadorFinanceiro(objForm);

	} else if (objForm.isAtividadeAtual(analisarSolicitacaoDeAdiantamento)) {
		validarRegrasECampos(objForm, form);
		validarCampoAprovadorGestorArea(objForm);

	} else if (objForm.isAtividadeAtual(atividadeAprovadorGestorCSO)) {
		validarRegrasECampos(objForm, form);
		validarCampoAprovadorCSO(objForm);
		
	} else if (objForm.isAtividadeAtual(atividadeAprovadorGestorCSOFP)) {
		validarRegrasECampos(objForm, form);
		validarCampoAprovadorCSOFP(objForm);

	} else if (objForm.isAtividadeAtual(atividadeAprovadorGestorFinanceiro)) {
		validarRegrasECampos(objForm, form);
		validarCampoAprovadorFinanceiroAdiantmanento(objForm);

	}else if(objForm.isAtividadeAtual(atividadeAprovacaoDaSolucao)) {
		validarRegrasECamposAprovacaoDaSolicitacao(objForm);
	}else if(objForm.isAtividadeAtual(atividadeSolucaoDaInconsistencia)) {
		validarRegrasECamposSolucaoDaInconsistencia(objForm);
	}

	/*
	 * Metodo que liga todas as validações
	 */
	objForm.validar();
	
	
	
	
	function validaCampo(campo, mensagem) {
        var valorCampo = form.getValue(campo);
        if (valorCampo == '' || valorCampo == null ||
            valorCampo.trim().length() < 10 || typeof valorCampo === "undefined") {
            throw "\n" + ' <strong>' + mensagem + '</strong>!';
        }
    }
}

function lerDataSetAtividadeAberta(objForm, form) {
	// Monta as constraints para consulta
	var valorFornecedorSelecionado = form.getValue("codigoFilialAberto");
	var c1 = DatasetFactory.createConstraint("codigoFilialAberto",
			valorFornecedorSelecionado, valorFornecedorSelecionado,
			ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("metadata#active", "true", "true",
			ConstraintType.MUST);
	var c3 = DatasetFactory.createConstraint("documentid", form.getDocumentId(), 
			form.getDocumentId(),
			ConstraintType.MUST_NOT);
	var constraints = new Array(c1, c2, c3);

	// Busca o dataset
	var dataset = DatasetFactory.getDataset(
			"solicitacaoDeAdiantamentoReembolso4", null, constraints, null);

	for (var i = 0; i < dataset.rowsCount; i++) {
		var varrendoValorAtivo = dataset.getValue(i, "solicitacaoAberta");
		var varrendoValorFilial = dataset.getValue(i, "codigoFilialAberto");
		var valorAtivo1 = 1;
	}
	if (varrendoValorAtivo == valorAtivo1
			&& varrendoValorFilial == valorFornecedorSelecionado) {

		throw "Não foi possível atender a sua solicitação pois existem adiantamentos em aberto";
		//form.setValue("tipoSolicitacao", "");
		// desabilitarCampoQuandoHaSolicAberta();
	}
}

function validarRegrasECampos(objForm, form) {
	/*
	 * Chamando a função populada dos Labels.
	 */
	popularObjetoLabel(objForm);

	/*
	 * Validação da condição caso não seja selecionado "Adiantamento" ou
	 * "Reembolso"
	 */
	validarCamposSemSelecao(objForm);

	/*
	 * Regra da tela quando for selecionado as opções de: "Adiantamento" ou
	 * "Reembolso"
	 */
	regraTelaSelecao(objForm, form);
	/*
	 * Regra da tela aprovadores
	 * 
	 */
	
	//valida filial de origem
	// objForm.isCampoVazio("filialOrigem", true);
}

function validarAdiantamentoAberto(objForm, form) {

	if (objForm.isCampoIgual("tipoSolicitacao", [ "adiantamento" ], false)) {
		lerDataSetAtividadeAberta(objForm, form);
	}
}

function validarCamposSemSelecao(objForm) {
	/*
	 * Passando os campos que terão ser válidos sem nenhuma seleção de
	 * "Adiantamento" ou "Reembolso".
	 */
	if (objForm.isCampoIgual("fornCadastrado", [ "1" ], false)) {
	objForm.isCampoVazio("FORNECEDOR_BANCO_DESC", true);
	objForm.isCampoVazio("E2_FILIAL", true);
	objForm.isCampoVazio("tipoSolicitacao", true);
	}else if(objForm.isCampoIgual("fornCadastrado", [ "2" ], false)){
		objForm.isCampoVazio("fornecedor", true);
		objForm.isCampoVazio("tipoFornecedor", true);
		objForm.isCampoVazio("ddiC", true);
		objForm.isCampoVazio("ddd", true);
		objForm.isCampoVazio("telefone", true);
		objForm.isCampoVazio("tipoConta", true);
		objForm.isCampoVazio("cep", true);
		objForm.isCampoVazio("uf", true);
		objForm.isCampoVazio("zoomMunicipio", true);
		objForm.isCampoVazio("bairro", true);
		objForm.isCampoVazio("pais", true);
		objForm.isCampoVazio("endereco", true);
		objForm.isCampoVazio("codPais", true);
		if (objForm.isCampoIgual("tipoConta", [ "1" ], false)){
			objForm.isCampoVazio("agencia", true);
			objForm.isCampoVazio("digVConta", true);
			objForm.isCampoVazio("contaCorrente", true);
			objForm.isCampoVazio("codBanco", true);
		}
	}
}
function validarSelecaoAdiantamento(objForm) {
	/*
	 * Campos válidos caso selecione a opção de Adiantamento.
	 */
	objForm.isCampoVazio("CENTRO_CUSTO_DESC", true);
	objForm.isCampoVazio("viagemDeAdiantamento", true);
	objForm.isCampoVazio("viagemParaAdiantamento", true);
	// objForm.isCampoMaior("diasViagem", [ 0 ], true);
	objForm.isCampoVazio("motivoJustificativa", true);
	objForm.isCampoVazio("codigoFilialOrigem", true);
	objForm.isCampoVazio("codigo", true);

}
function validarSelecaoReembolso(objForm, form) {
	/*
	 * Campos válidos caso selecione a opção de Reembolso.
	 */
	//objForm.isCampoVazio("informacaoCidadeColaborador", true); andre
	objForm.isCampoVazio("tipoDeColaborador", true);
	objForm.isCampoVazio("viagemDe", true);
	objForm.isCampoVazio("viagemPara", true);
	objForm.isCampoVazio("motivoJustificativa", true);
	objForm.isCampoVazio("codigoFilialOrigem", true);
	objForm.isCampoVazio("codigo", true);
	var valorTotal = form.getValue("E2_VALOR_TOTAL");
	log.info("Valor total: " + valorTotal);
	if (valorTotal == "0"){
		objForm.setMensagemErro("E2_VALOR_TOTAL", i18n.translate("msg.campo.vazio"));
	}
	//objForm.isCampoIgual("E2_VALOR_TOTAL", [0], true);
}

function validarCadastroFornecedor(objForm){
	objForm.setFields("tipoFornecedor", i18n.translate("label.tpFornecedor"));
	objForm.setFields("fornecedor", i18n.translate("label.nomeRazao"));
	objForm.setFields("ddiC", i18n.translate("label.ddi"));
	objForm.setFields("ddd", i18n.translate("label.ddd"));
	objForm.setFields("telefone", i18n.translate("label.tel"));
	objForm.setFields("telefoneFinanceiro", i18n.translate("label.telFinanceiro"));
	objForm.setFields("emailForn", i18n.translate("label.emailC"));
	objForm.setFields("tipoConta", i18n.translate("label.formaPag"));
	objForm.setFields("uf", i18n.translate("label.uf"));
	objForm.setFields("cep", i18n.translate("label.cep"));
	objForm.setFields("zoomMunicipio", i18n.translate("label.municipio"));
	objForm.setFields("bairro", i18n.translate("label.bairro"));
	objForm.setFields("endereco", i18n.translate("label.endereco"));
	objForm.setFields("codPais", i18n.translate("label.codPais"));
	objForm.setFields("pais", i18n.translate("label.paisF"));
	objForm.setFields("fornCadastrado", i18n.translate("label.cadasFornec"));
	objForm.setFields("agencia", i18n.translate("label.codAC"));
	objForm.setFields("digVConta", i18n.translate("label.digCC"));
	objForm.setFields("contaCorrente", i18n.translate("label.contaCC"));
	objForm.setFields("codBanco", i18n.translate("label.bancoC"));
}

function validarCampoBanco(objForm) {
	/*
	 * Campos válidos Bancos
	 */
	if (!objForm.isCampoVazio("FORNECEDOR_BANCO_DESC", false)
			&& (objForm.isCampoVazio("A2_BANCO", false)
					|| objForm.isCampoVazio("A2_AGENCIA", false)
					/* || objForm.isCampoVazio("A2_DVAGE", false) */
					|| objForm.isCampoVazio("A2_NUMCON", false) || objForm
					.isCampoVazio("A2_DVCTA", false))) {
		objForm.setMensagemErro("A2_BANCO_MSG", i18n.translate("label.mensagemCentralDeCadastros"));

	}
}

function validarCampoAprovadorGestorReembolso(objForm) {
	if(!objForm.isCampoVazio("decisaoGestorReembolso", true)){
		objForm.isCampoVazio("decisaoGestorReembolsoHidden", true);
	}
	if (objForm.isCampoIgual("decisaoGestorReembolso", [ "nao" ], false)
			|| objForm.isCampoIgual("decisaoGestorReembolso", [ "cancelar" ],
					false)) {
		objForm.isCampoVazio("motivoaGestorReembolso", true);
	}
	
	
	
	

}

function validarCampoAprovadorCSO(objForm) {
	objForm.isCampoVazio("decisaoGestorCSO", true);
	if (objForm.isCampoIgual("decisaoGestorCSO", [ "nao" ], false)
			|| objForm.isCampoIgual("decisaoGestorCSO", [ "cancelar" ], false)) {
		objForm.isCampoVazio("motivoaGestorCSO", true);
	}

}

function validarCampoAprovadorCSOFP(objForm) {
	objForm.isCampoVazio("decisaoGestorHiddenCSOFP", true);
	if (objForm.isCampoIgual("decisaoGestorHiddenCSOFP", [ "nao" ], false)) {
		objForm.isCampoVazio("motivoaGestorCSOFP", true);
	}

}

function validarCampoAprovadorFinanceiro(objForm) {
	objForm.isCampoVazio("decisaoReembolsoFinanceiro", true);
	if (objForm.isCampoIgual("decisaoReembolsoFinanceiro", [ "nao" ], false)) {
		objForm.isCampoVazio("motivoaReembolsoFinanceiro", true);
	} else if (objForm.isCampoIgual("decisaoReembolsoFinanceiro", [ "sim" ], false)) {
		objForm.isCampoVazio("aprovDataPrevista", true);
	}

}
function validarCampoAprovadorFinanceiroAdiantmanento(objForm) {
	objForm.isCampoVazio("decisaoGestorFinanceiro", true);
	if (objForm.isCampoIgual("decisaoGestorFinanceiro", [ "nao" ], false)) {
		objForm.isCampoVazio("motivoaGestorFinanceiro", true);
	} else if (objForm.isCampoIgual("decisaoGestorFinanceiro", [ "sim" ], false)) {
		objForm.isCampoVazio("aprovDataPrevistaAdiant", true);
	}
}

function validarCampoAprovadorGestorArea(objForm) {
	objForm.isCampoVazio("decisaoGestor", true);
	
	if (objForm.isCampoIgual("decisaoGestor", [ "nao" ], false)
			|| objForm.isCampoIgual("decisaoGestor", [ "cancelar" ], false)) {
		objForm.isCampoVazio("motivoaGestor", true);
	}

}

function popularObjetoLabel(objForm) {

	/*
	 * Criando os campos para o contrutor conseguir validar.
	 */
	objForm.setFields("motivoaGestor", i18n.translate("label.motivo"));
	objForm.setFields("decisaoGestor", i18n.translate("label.decisao"));
	objForm.setFields("filialOrigem", i18n.translate("label.filialOrigem"));
	objForm.setFields("tipoSolicitacao", i18n.translate("label.acesso"));
	objForm.setFields("FORNECEDOR_BANCO_DESC", i18n.translate("label.fornecedor"));
	objForm.setFields("CENTRO_CUSTO_DESC", i18n.translate("label.centroCusto"));
	objForm.setFields("diasViagem", i18n.translate("label.diasViagem"));
	objForm.setFields("motivoJustificativa", i18n.translate("label.motivoJustificativa"));
	objForm.setFields("E2_VALOR_TOTAL", i18n.translate("label.saldoTotalReembolso"));
	objForm.setFields("A2_BANCO", i18n.translate("label.A2_BANCO"));
	objForm.setFields("A2_AGENCIA", i18n.translate("label.A2_AGENCIA"));
	objForm.setFields("A2_DVAGE", i18n.translate("label.A2_DVAGE"));
	objForm.setFields("A2_NUMCON", i18n.translate("label.A2_NUMCON"));
	objForm.setFields("A2_DVCTA", i18n.translate("label.codigoVerificador"));
	//objForm.setFields("informacaoCidadeColaborador", i18n.translate("label.destino")); destino
	objForm.setFields("tipoDeColaborador", i18n.translate("label.tipoDeColaborador"));
	objForm.setFields("viagemDe", i18n.translate("label.periodoDeViagemDe"));
	objForm.setFields("viagemPara", i18n.translate("label.periodoDeViagemAte"));
	objForm.setFields("A2_BANCO_MSG", i18n.translate("label.prezadoUsuario"));
	objForm.setFields("E2_FILIAL", i18n.translate("label.filialReembolso"));

	objForm.setFields("motivoaGestorReembolso", i18n.translate("label.motivo"));
	objForm.setFields("decisaoGestorReembolso", i18n.translate("label.decisao"));
	objForm.setFields("decisaoGestorReembolsoHidden", i18n.translate("label.decisao"));

	objForm.setFields("motivoaReembolsoFinanceiro", i18n.translate("label.motivo"));
	objForm.setFields("aprovDataPrevista", i18n.translate("label.dataPrevista"));
	objForm.setFields("decisaoReembolsoFinanceiro", i18n.translate("label.decisao"));
	
	objForm.setFields("motivoaGestorCSO", i18n.translate("label.motivo"));
	objForm.setFields("motivoaGestorCSOFP", i18n.translate("label.motivo"));
	objForm.setFields("decisaoGestorCSO", i18n.translate("label.decisao"));
	//objForm.setFields("decisaoGestorCSOFP", i18n.translate("label.decisao"));
	objForm.setFields("motivoaGestorFinanceiro", i18n.translate("label.motivo"));
	objForm.setFields("decisaoGestorFinanceiro", i18n.translate("label.decisao"));
	objForm.setFields("aprovDataPrevistaAdiant", i18n.translate("label.dataPrevista"));
	objForm.setFields("decisaoGestorHiddenCSOFP", i18n.translate("label.decisao"));
	

	objForm.setFields("viagemDeAdiantamento", i18n.translate("label.periodoDeViagemDe"));
	objForm.setFields("viagemParaAdiantamento", i18n.translate("label.periodoDeViagemAte"));
	//objForm.setFields("infoDentroPolitica", i18n.translate("label.politicaReembolso")); andre


	objForm.setFields("tipoFornecedor", i18n.translate("label.tpFornecedor"));
	objForm.setFields("fornecedor", i18n.translate("label.nomeRazao"));
	objForm.setFields("ddiC", i18n.translate("label.ddi"));
	objForm.setFields("ddd", i18n.translate("label.ddd"));
	objForm.setFields("telefone", i18n.translate("label.tel"));
	objForm.setFields("telefoneFinanceiro", i18n.translate("label.telFinanceiro"));
	objForm.setFields("emailForn", i18n.translate("label.emailC"));
	objForm.setFields("tipoConta", i18n.translate("label.formaPag"));
	objForm.setFields("uf", i18n.translate("label.uf"));
	objForm.setFields("cep", i18n.translate("label.cep"));
	objForm.setFields("zoomMunicipio", i18n.translate("label.municipio"));
	objForm.setFields("bairro", i18n.translate("label.bairro"));
	objForm.setFields("endereco", i18n.translate("label.endereco"));
	objForm.setFields("codPais", i18n.translate("label.codPais"));
	objForm.setFields("pais", i18n.translate("label.paisF"));
	objForm.setFields("fornCadastrado", i18n.translate("label.cadasFornec"));
	objForm.setFields("agencia", i18n.translate("label.codAC"));
	objForm.setFields("digVConta", i18n.translate("label.digCC"));
	objForm.setFields("contaCorrente", i18n.translate("label.contaCC"));
	objForm.setFields("codBanco", i18n.translate("label.bancoC"));
	objForm.setFields("codigoFilialOrigem", i18n.translate("label.codigoFilialOrigem"));
	objForm.setFields("codigo", i18n.translate("label.codigo"));
	objForm.setFields("area", i18n.translate("label.area"));
	
}
function regraTelaSelecao(objForm, form) {

	/*
	 * Validação da condição caso seja selecionado o Adiantamento
	 */
	if (objForm.isCampoIgual("tipoSolicitacao", [ "adiantamento" ], false) && !objForm.isAtividadeAtual(preencheFormularioDeReembolso)) {
		validarSelecaoAdiantamento(objForm, form);

		validarCampoBanco(objForm, form);
	}

	/*
	 * Validação da condição caso seja selecionado o Reembolso
	 */

	if (objForm.isCampoIgual("tipoSolicitacao", [ "reembolso" ], false) || 
		objForm.isAtividadeAtual(preencheFormularioDeReembolso) || 
		objForm.isAtividadeAtual(corrigirSolicitacaoReembolso)) {
		log.info("Antes de entrar na função validarSelecaoReembolso");
		validarSelecaoReembolso(objForm, form);
		validarCampoBanco(objForm, form);
		fnValidacaoValorReembolso(objForm, form);
		validarPoliticaReembolso(objForm, form);
	}

}

function validarPoliticaReembolso(objForm, form) {
	// objForm.isCampoVazio("infoDentroPolitica", true); andre
}

function fnValidacaoValorReembolso(objForm, form) {
	var indexes = form.getChildrenIndexes("tbVinculoDespesas");
	var linhaAtual = 0;

	for ( var i in indexes) {
		linhaAtual++;
		fnAddCampoEObrigatorio(objForm, indexes[i], linhaAtual);
	}
}

function fnAddCampoEObrigatorio(objForm, indice, linhaAtual) {
	var sufixoNome = '___' + indice;

	objForm.setFields('dataDespesas' + sufixoNome, 'Linha ' + linhaAtual + ': '
			+ i18n.translate("label.dataDasDespesas"));

	objForm.setFields('tipoDeDespesas' + sufixoNome, 'Linha ' + linhaAtual
			+ ': ' + i18n.translate("label.tipoDeDespesa"));

	objForm.setFields('valorDespesas' + sufixoNome, 'Linha ' + linhaAtual
			+ ': ' + i18n.translate("label.valorDespesa"));

	objForm.isCampoVazio('dataDespesas' + sufixoNome, true);
	objForm.isCampoVazio('tipoDeDespesas' + sufixoNome, true);
	objForm.isCampoVazio('valorDespesas' + sufixoNome, true);
}
function validarRegrasECamposAprovacaoDaSolicitacao(objForm){
	objForm.setFields("aceite", i18n.translate("label.aceite"));
	objForm.isCampoVazio("aceite", true);	
	if(objForm.isCampoIgual("aceite",["N"], false)){
		objForm.setFields("compSolicitante", i18n.translate("label.complemento.solicitante"));
		objForm.isCampoVazio("compSolicitante", true);	
	}

}


function validarRegrasECamposSolucaoDaInconsistencia(objForm){
	objForm.setFields("retorno", i18n.translate("label.complemento.analista"));
	objForm.isCampoVazio("retorno", true);
}
// function validaRateio(form){
// 	if (form.getValue('alimentacao') != form.getValue('cpValorTotalRateio') &&
// 	form.getValue('cpValorTotalRateio') != '') {
// 	throw 'Valor do centro de custo deve ser o mesmo do valor total da nota !!!\n'
// }
// }