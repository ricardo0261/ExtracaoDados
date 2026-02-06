var valorTotal = 0;
var valorTotalfds = 0;
var underline = "___";
var msgLimpezaReembolso = "Existem 'Itens de Reembolso' preenchidos, para efetuar a alteração solicitada deverá excluir os dados, confirma a exclusão?";
var msgLimpezaAdiantamento = "Existem 'Itens de Adiantamento' preenchido, para efetuar a alteração solicitada deverá excluir os dados, confirma a exclusão?";
var GROUP_ID_GESTOR = "GAP";
//var grupoGestor;
var CURRENT_STATE;
var myModal;
var warningFSDBShowed;
//$.noConflict();

$(function () {

	btnAprov();
	

	$('#fornecedor').change(function () {
		var nome = $('#fornecedor').val();
		$('#nomeFantasia').val(nome);
	});

	$(document).on('change', "#tpReembolso", function () {

		var tipo = $("#tpReembolso").val();

		if (tipo != "") {
			$('#tbVinculoDespesas tbody tr').not(':first').remove(); // remover tabela
			if (tipo == "1") {
				$("#infCidadeColaboradorHidden").val("0");
				$("#cursos").hide('slow');
				$("#foradapolitica").hide('slow');
				$("#infoDentroPoliticaHidden").val("0");
				$("#grupoAprovador").val($("#aprovadorFilOrigem").val());
			}

			if (tipo == "2") {
				$("#infCidadeColaboradorHidden").val("1");
				$("#cursos").hide('slow');
				$("#foradapolitica").hide('slow');
				$("#infoDentroPoliticaHidden").val("0");
				$("#grupoAprovador").val($("#aprovadorFilOrigem").val());
			}

			if (tipo == "3") {
				$("#infCidadeColaboradorHidden").val("0");
				$("#cursos").show('slow');
				$("#foradapolitica").hide('slow');
				$("#infoDentroPoliticaHidden").val("0");
				$("#grupoAprovador").val($("#aprovadorFilOrigem").val());
			}

			if (tipo == "4") {
				$("#infCidadeColaboradorHidden").val("0");
				$("#infoDentroPoliticaHidden").val("1");
				$("#cursos").hide('slow');
				$("#foradapolitica").show('slow');
				$("#grupoAprovador").val($("#aprovadorFilOrigem").val());

			}

			$(".blocoDadosBancarios").show();
			$(".blocoReembolso").show();
			$(".blocoDespesas").show();

			carregaSelectTipoDespesas(); //Carrega os itens do tipo de despesa		
			controleTablenameDespesas(); // Adiciona um registro se não possuir

		} else {

			$(".blocoDadosBancarios").hide();
			$(".blocoReembolso").hide();
			$(".blocoDespesas").hide();
			$("#rateio").hide();
		}
	});

	CURRENT_STATE = buscarAtividadeAtual();
	setaExibicaoTipoDespesa();
	validarCheckFDS();
	alimentaFilial();
	alimentarUnidadeProtheus();
	limpaCampoChangeFilial();
	//validarFlagGestor();
	buscarDadosTipoSolicitacao();
	carregarLabelTipoSolicitacao();
	changeReembolso();
	calcularDiasViagem();
	controleTelaItemReembolso();
	controleTelaResumoDasDespesas();
	calcularValorTotalReembolso();
	calcularCampos();
	controlarBotaoNovo();
	recuperarCampoDestino();
	recuperarCampoFuncionario();
	pegaDataAprovPrevista();

	recuperarCampoForaDaPolitica();

	if(MODO_EDICAO != "VIEW"){      

        setarCalendario();

       
    };
	retirarEspacoDosCampos();
	recuperarValorGestorSetor();
	recuperarValorGestorSetorCSO();
	recuperarValorGestorCurso();
	recuperarValorGestorValidaCurso();

	//if(CURRENT_STATE == "") {
	recuperarValorGestorSetorFinanceiro();
	//}

	recuperarValorGestorSetorReembolso();

	//if(CURRENT_STATE == "") {
	recuperarValorReembolsoFinanceiro();
	//}

	preencherCampo();
	controlarTelaEmModoCorrecao();
	validarDataMenorDataAtual();
	//habilitaFlagGestor();
	//pegarValorDoBotaoCheckIlimitado();
	validarDatasAdiantamento();
	limparClickFDS();
	selecionarTelaPorTipo();
	preencherCampoBancoAdiantamento();
	preencherCampoAtividadeAberta();
	bindChangeAceiteSolucao();
	ocultarMsgNovaSc();
	//Inicia pesquisa de satisfação
	getParamsURL();
	mostraCampoArea();

	/*$('#CTT_CUSTO, #codigo').change(() => {
		var aprovador
		var aprovador2 = '';
		var cc = $('#CTT_CUSTO').val().trim()
		var filial = $('#codigo').val().trim()
		if (cc && filial != "09") {
			var filterCC = new Array()
			filterCC.push(DatasetFactory.createConstraint('cc_codigo', cc, cc, ConstraintType.MUST, true))
			filterCC.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST))
			var aprovCC = DatasetFactory.getDataset('cadastroResponsavelCentroCusto', null, filterCC, null).values;
			if (aprovCC.length > 0) {
				aprovCC[0].responsavelId_1 == parent.WCMAPI.userCode ? aprovador = aprovCC[0].responsavelId_2 : aprovador = aprovCC[0].responsavelId_1;
			    aprovador2 = aprovCC[0].responsavelId_2;
			} else {
				var filterFilial = new Array()
				filterFilial.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST))
				filterFilial.push(DatasetFactory.createConstraint('codigo_Filial', filial, filial, ConstraintType.MUST, true))
				var aprovFilial = DatasetFactory.getDataset('cadastroResponsavelFilial', null, filterFilial, null).values;
				aprovFilial[0].responsavelId_1 == parent.WCMAPI.userCode ? aprovador = aprovFilial[0].responsavelId_2 : aprovador = aprovFilial[0].responsavelId_1
			}
			$('#codigoAprovador').val(aprovador)
			$('#codigoAprovador2').val(aprovador2)
		} else {
			$('#codigoAprovador').val('57d432e684db11eaa3d70a586460a80e') //deixa assim
		}


	})*/



	//if(CURRENT_STATE == ATIV_ANALISAR_SOLIC_REEMBOLSO || CURRENT_STATE == ATIV_APROVACAO_SOLICITANTE) {
	if (CURRENT_STATE == CONFIRMAR_SOLICITACAO_ADIANTAMENTO || CURRENT_STATE == AVALIAR_ANEXO_PEDIDO_REEMBOLSO) {
		valorDataEmissaoVencimento();
	}

	if (CURRENT_STATE == ATIV_MICRODEPOSITO || CURRENT_STATE == ATIV_CORRIGIRCAD) {
		$("#divAprovacaoFinanceiro").show();
		$("#cadastroFornecedor").show();
		$(".solucao").hide();
		$("#tpReembolsoo").hide();
		$(".desabilitaAmbos").hide();
		$(".informacoesAdiantamento").hide();
		$(".blocoDadosBancarios").hide();
		$(".informacoesAdiantamento").hide();

		$(".blocoDespesas").hide();
		$(".blocoReembolso").hide();
		$(".aprovadorGestor").hide();
		$(".aprovadorGestorCSO").hide();

		$(".aprovadorGestorFinanceiro").hide();
		$(".aprovadorGestorReembolso").hide();
		$(".aprovadorGestorCSOFP").hide();
		$(".aprovadorReembolsoFinanceiro").hide();

	}

	if(CURRENT_STATE == ATIV_CORRIGIRCAD){

		$("#valTransfeera_02").val('');

	}

	if (CURRENT_STATE == ATIV_CURSOS) {
		$(".aprovadorVCursos").show();
		$(".aprovadorGestorCursos").show();

		$(".solucao").hide();
		//$("#tpReembolsoo").hide();
		$(".desabilitaAmbos").hide();
		$(".informacoesAdiantamento").hide();
		$(".blocoDadosBancarios").hide();
		$(".informacoesAdiantamento").hide();

		$(".blocoDespesas").hide();
		$(".blocoReembolso").show();
		$(".aprovadorGestor").hide();
		$(".aprovadorGestorCSO").hide();

		$(".aprovadorGestorFinanceiro").hide();
		$(".aprovadorGestorReembolso").hide();
		$(".aprovadorGestorCSOFP").hide();
		$(".aprovadorReembolsoFinanceiro").hide();

	}
	if (CURRENT_STATE == ATIV_VALIDA_TREINAMENTO) {
		$(".aprovadorVCursos").show();

		$(".solucao").hide();
		//$("#tpReembolsoo").hide();
		$(".desabilitaAmbos").hide();
		$(".informacoesAdiantamento").hide();
		$(".blocoDadosBancarios").hide();
		$(".informacoesAdiantamento").hide();

		$(".blocoDespesas").hide();
		$(".blocoReembolso").show();
		$(".aprovadorGestor").hide();
		$(".aprovadorGestorCSO").hide();

		$(".aprovadorGestorFinanceiro").hide();
		$(".aprovadorGestorReembolso").hide();
		$(".aprovadorGestorCSOFP").hide();
		$(".aprovadorReembolsoFinanceiro").hide();

	}
		
	if (CURRENT_STATE == ATIV_ANALISAR_SOLIC_REEMBOLSO || CURRENT_STATE == ATIV_ANAL_ADIANTAMENTO ) {
		nextAprovador();
	}
	
	if (CURRENT_STATE == ATIV_ANAL_REMBOLSO_CSO) {
		nextDiretor();
	}		
	
	if (CURRENT_STATE == ATIV_PREENCHE_FORM_REEMBOLSO) {	

		buscaAprovadorCC()					
		
	}		
	
	controleTelaAprovadorCSOFPAction();
	warningFSDBShowed = false;

	/*$("#aprovDataPrevista").change(function() {
		var dataPrevistaDoFinanceiro = $("#aprovDataPrevista").val();
		$("#dataPrevistaSolici").val(dataPrevistaDoFinanceiro );
	});*/

	$("[name=filialOrigem]").change(function () {
		setTimeout(function () {
			var codFilialOrigem = $("[name=codigoFilialOrigem]").val();
			if (codFilialOrigem != '') {
				var filtro = DatasetFactory.createConstraint('codigoFilial', codFilialOrigem, codFilialOrigem, ConstraintType.MUST);
				var coluna = new Array('codigoFilial', 'valor');
				var ds_cadastroFilialReembolso = DatasetFactory.getDataset('ds_CadastroFilialReembolso', coluna, new Array(filtro), null);

				//caso a filial não esteja cadastrada
				if (ds_cadastroFilialReembolso.values.length < 1) {
					FLUIGC.message.alert({
						title: "Filial não cadastrada",
						message: "Sua filial de origem não foi cadastrada para reembolso. Solicite o cadastro para seu gestor.",
						label: "OK"
					}, function () {
						$("[name=codigoFilialOrigem]").val('');
						$("[name=filialOrigem]").val('')
						desabilitarCampoQuandoAlterado();
					});
				} else {
					//seta o valor do almoço de reembolso
					$("[name=valorAlmocoReembolso]").val(ds_cadastroFilialReembolso.values[0].valor.replace());
				}
				//Reseta os itens de reembolso se já existir
				if ($('input[name=informacaoCidadeColaborador]:checked').val() != undefined) {
					limparTablename();
					desabilitarCampoQuandoAlterado();
					limparCampoReembolso();
					$(".blocoReembolso").hide();
					$(".blocoDespesas").hide();
					//Carrega os itens do tipo de despesa
					carregaSelectTipoDespesas();
				}
			}

		}, 200);
	});
	
	getCotacaoDolar();
});

function buscaAprovadorCC() {
	
	
		    var cc = $('#CTT_CUSTO').val().trim();
	        var filial = $('#codigo').val().trim();
			
			if (cc && filial != "09") {
				var filterCC = new Array();
				var aprovador2 = '';
				filterCC.push(DatasetFactory.createConstraint('cc_codigo',cc, cc, ConstraintType.MUST, true))
				filterCC.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST))
				var aprovCC = DatasetFactory.getDataset('cadastroResponsavelCentroCusto', null, filterCC, null).values;
				if (aprovCC.length > 0) {
					aprovCC[0].responsavelId_1 == parent.WCMAPI.userCode ? aprovador = aprovCC[0].responsavelId_2 : aprovador = aprovCC[0].responsavelId_1;
					aprovador2 = aprovCC[0].responsavelId_2;
				} else {
					var filterFilial = new Array()
					filterFilial.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST))
					filterFilial.push(DatasetFactory.createConstraint('codigo_Filial', filial,filial, ConstraintType.MUST, true))
					var aprovFilial = DatasetFactory.getDataset('cadastroResponsavelFilial', null, filterFilial, null).values;
					aprovFilial[0].responsavelId_1 == parent.WCMAPI.userCode? aprovador = aprovFilial[0].responsavelId_2 : aprovador = aprovFilial[0].responsavelId_1
				}
	
				$('#codigoAprovador').val(aprovador);
				$('#codigoAprovador2').val(aprovador2)
			}
			else{
				$('#codigoAprovador').val('57d432e684db11eaa3d70a586460a80e') //deixa assim

			}
}

function validaSolicitacoes(){
	
	
	if ($("#A2_COD").val() != ""){
	
		var fornecedor = $("#A2_COD").val();
		var c1 = DatasetFactory.createConstraint("A2_COD", fornecedor, fornecedor, ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("metadata#active", "true", "true",ConstraintType.MUST);
		var constraints = new Array(c1,c2);
		var dataset = DatasetFactory.getDataset("ds_adiantamentoReembolso3", null, constraints, null);
	
		if (dataset.values.length > 0) {		
			
			for (var i = 0; i < dataset.values.length; i++) {
				//var atv = dataset[i]["atvAtual"];			
				var atv = dataset.values[i].atvAtual;	
				var aberta = dataset.values[i].solicitacaoAberta;
				var fluig = dataset.values[i].E2_ZIDFLG;
				
				if ((atv == "0" || atv == "5" || atv == "37" || atv == "38" || atv == "54" || atv == "203" || atv == "88" || atv == "124" ||
					atv == "50" || atv == "101" || atv == "102" || atv == "185" || atv == "158" ||
					atv == "10" || atv == "34" || atv == "24" || atv == "14" || atv == "20"	) && aberta == "1") {
									
					mensagemComConfirmacao('Aviso', 'O colaborador '+$("#nomeFornecedor").val()+' possui reembolsos/adiantamento em aberto ! FLUIG '+fluig, null);
					
					$("#A2_COD").val('');
					$("#nomeFornecedor").val('');				
					window['filialOrigem'].clear();
					window['filial'].clear();
													
					$("#validaSolicitacoesAberto").show();
					$("#tpReembolsoo").hide();		
					
					return;
				}					
			}
		}	
	}
}

function mostraCampoArea(){
	
	if ($('#filialOrigem_protheus').val() == "00101" || $('#filialOrigem_protheus').val() == "00104" ){
		$(".mostraCSOHolding").show('slow');		
	}
}

function nextAprovador(){		
	
	$("#motivoaGestorReembolso").val('');	
	$("#decisaoGestorReembolso").prop('checked',false);
	
	$("#decisaoGestorReembolsoSim").prop('checked',false);
	$("#decisaoGestorReembolsoNao").prop('checked',false);
	$("#decisaoGestorReembolsoCancelada").prop('checked',false);
	
	$("#decisaoGestorSim").prop('checked',false);
	$("#decisaoGestorNao").prop('checked',false);
	$("#decisaoGestorCancelar").prop('checked',false);		
	$("#decisaoGestorHidden").val('');
	$("#motivoaGestor").val('');	
			
	var alcada = $("#validaAlcadaAprovador").val();	
	
	if ($("#infoDentroPoliticaHidden").val() == "1"){ // fora politica
		if (alcada == 'nao' && parseFloat($("#totalDasDespesas").val())> 5000){				
			$("#nextAprovador").val('nao');			
		}
	}
	
	if ($("#infoDentroPoliticaHidden").val() == "0"){ // dentro da politica
		
		if ($("#excecaoCC").val() == 'sim' && $("#codigoAprovador2").val() == '' && $("#codigoAprovador3").val() != '' && $("#validaAlcadaAprovador").val() == 'sim'){				
			$("#ultimoAprovador").val('nao');	
			$("#validaAlcadaAprovador").val('nao');
			$("#codigoAprovador2").val('0');
		}
		
		if (alcada == 'sim' && parseFloat($("#totalDasDespesas").val())> 5000 && $("#excecaoCC").val() != 'sim'){		
			$("#validaAlcadaAprovador").val('nao');
			$("#nextAprovador").val('sim');		
			$("#achou2cc").val('sim');
		}
		
		if (alcada == 'nao' && parseFloat($("#totalDasDespesas").val())> 5000 && $("#excecaoCC").val() != 'sim'){				
			$("#nextAprovador").val('nao');	
			$("#ultimoAprovador").val('sim');				
		}
		
		if (alcada == 'nao' && parseFloat($("#totalDasDespesas").val())<= 5000 && $("#excecaoCC").val() != 'sim'){				
			$("#nextGestor").val('nao');			
		}
		
			
		
	}		
	
	if ($("#tipoSolicitacaoHidden").val() == "adiantamento"){ // dentro da politica
		
		if (alcada == 'sim' && parseFloat($("#valorTotal").val())> 5000){		
			$("#validaAlcadaAprovador").val('nao');
			$("#nextAprovador").val('sim');		
			$("#achou2cc").val('sim');
		}
		
		if (alcada == 'nao' && parseFloat($("#valorTotal").val())> 5000){				
			$("#nextAprovador").val('nao');	
			$("#ultimoAprovador").val('sim');				
		}
		
		if (alcada == 'nao' && parseFloat($("#valorTotal").val())<= 5000){				
			$("#nextGestor").val('nao');			
		}
	}
	
}

function nextDiretor(){		
	
	$("#decisaoGestorCSOFPSim").prop('checked',false);
	$("#decisaoGestorCSOFPNao").prop('checked',false);
	$("#decisaoGestorHiddenCSOFP").prop('checked',false);
	
	$("#motivoaGestorCSOFP").val('');	
	$("#decisaoGestorCSOFP").prop('checked',false);	
		
	
}

function buscaFornecedor() {

	var cpf = $("#cpfFornecedor").val().replace(/[^\d]+/g, '');

	var c1 = DatasetFactory.createConstraint("CGC", cpf, cpf, ConstraintType.MUST);
	var constraints = new Array(c1);
	var dataset = DatasetFactory.getDataset("ds_fornecedor", null, constraints, null);

	if (dataset.values[0].CODIGO != "") {

		$('#A2_COD').val(dataset.values[0].CODIGO);
		$('#E2_FORNECE').val(dataset.values[0].CODIGO);
		$('#A2_BANCO').val(dataset.values[0].BANCO);
		$('#A2_AGENCIA').val(dataset.values[0].AGENCIA);
		$('#A2_DVAGE').val(dataset.values[0].DV_AGENCIA);
		$('#A2_NUMCON').val(dataset.values[0].CONTA);
		$('#A2_DVCTA').val(dataset.values[0].DV_CONTA);
		$('#nomeFornecedor').val(dataset.values[0].DESCRICAO);
		$('#A2_CGC').val(dataset.values[0].CGC);
		$(".blocoDadosBancarios").hide();
		
		$("#validaSolicitacoesAberto").hide();
		$("#tpReembolsoo").show();
		
		
	} else {
		$('#nomeFornecedor').val("Não encontrado");
		$("#cadastroFornecedor").show('slow');
		$("#dadosAdicionais").show('slow');
		window["paisBancoCentral"].setValue("105");
		window["pais"].setValue("BRASIL");
		$(".Bancario").val('');
		$(".blocoDadosBancarios").hide();

		FLUIGC.toast({
			title: 'Não é fornecedor: ',
			message: 'Não foi encontrado o cpf acima como fornecedor. Por favor preencher os dados para ele ser um fornecedor !',
			type: 'danger',
			timeout: 'slow'
		});
	}
	
	validaSolicitacoes();

}

function setSelectedZoomItem(selectedItem) {

	var id = selectedItem.inputId.split('___')[0];
	var index = selectedItem.inputId.split('___')[1];

	/*if (id == 'FORNECEDOR_BANCO_DESC') {
        $('#A2_COD').val(selectedItem.CODIGO);
		$('#E2_FORNECE').val(selectedItem.CODIGO);
		$('#A2_BANCO').val(selectedItem.BANCO);
		$('#A2_AGENCIA').val(selectedItem.AGENCIA);
		$('#A2_DVAGE').val(selectedItem.DV_AGENCIA);
		$('#A2_NUMCON').val(selectedItem.CONTA);
		$('#A2_DVCTA').val(selectedItem.DV_CONTA);
		$('#nomeFornecedor').val(selectedItem.DESCRICAO);
		$('#A2_CGC').val(selectedItem.CNPJ);
		// $('#AUTBANCO').val(selectedItem.BANCO);
		// $('#AUTAGENCIA').val(selectedItem.AGENCIA);
		// $('#AUTCONTA').val(selectedItem.CONTA);
    }*/

	if (id == 'filialOrigem') {

		$('#codigoFilialOrigem').val(selectedItem.CODIGO_FLUIG);
		$('#filialOrigem_protheus').val(selectedItem.CODIGO);
		$('#aprovadorFilOrigem').val(selectedItem.ID_GESTOR);
		// $('#cpTipo___' + index).val(selectedItem.DESCRICAO);

		// se filial CSO ou Holding SP
		if ($('#filialOrigem_protheus').val() == "00101" || $('#filialOrigem_protheus').val() == "00104" ){
			$(".mostraCSOHolding").show('slow');
			buscaAprovadorDiretor();
		}else{
			getAprovadorRegional();
			$(".mostraCSOHolding").hide();			
			window['area'].clear();
		}
		
		if ($('#codigoFilialOrigem').val() == "111") {			
			FLUIGC.toast({
				title: 'Alerta: ',
				message: 'Prezado (a) as operações de registro de documentos para pagamentos do Hospital Vila da Serra - HVS que se enquadra neste fluxo ainda não estão sendo realizadas pelo CSO e sim internamente no Hospital, gentileza enviar sua demanda para o e-mail centraldenotas@oncoclinicas.com que direcionaremos sua demanda para o responsável do HVS !',
				type: 'danger',
				timeout: 'slow'
			});			
			window['filialOrigem'].clear();
		}

	}

	if (id == 'filial') {

		$('#codigo').val(selectedItem.CODIGO_FLUIG);

		buscaAprovadorCC();
		
		$('#filial_protheus').val(selectedItem.CODIGO);
		$('#codigo_filial').val(selectedItem.CODIGO_FLUIG);
		$('#hiddenFilial').val(selectedItem.CODIGO_FLUIG);
		$('#E2_FILIAL').val(selectedItem.CODIGO);
		/* $('#codigoAprovador').val(selectedItem.ID_GESTOR); */
		buscarDadosBancariosAdiantamento(selectedItem.CODIGO);


		if ($('#filial_protheus').val() == "06601") {
			FLUIGC.message.alert({
				message: 'Prezado (a) as operações de registro de documentos para pagamentos do Hospital Vila da Serra - HVS que se enquadra neste fluxo ainda não estão sendo realizadas pelo CSO e sim internamente no Hospital, gentileza enviar sua demanda para o e-mail centraldenotas@oncoclinicas.com que direcionaremos sua demanda para o responsável do HVS. ',
				title: 'Alerta',
				label: 'OK'
			}, function (el, ev) {});
			window['filial'].clear();
		}
	}

	if (id == 'banco') {

		$('#codBanco').val(selectedItem.CodigoDoBanco);
		// $('#cpCentroCusto___' + index).val(selectedItem.DESCRICAO);
	}

	
	
	
	
	/*
	
	if (id == 'CENTRO_CUSTO_DESC') {
		$('#CTT_CUSTO').val(selectedItem.CODIGO);
		buscaAprovadorCC();
		
	
		
		
		
		
	}*/
	
	
	//atualizacao samuelzinho
	
	if (id == 'CENTRO_CUSTO_DESC') {
		$('#CTT_CUSTO').val(selectedItem.CODIGO);

		buscaAprovadorCC();

	}
	
	if (id == 'pais') {
		$('#codPais').val(selectedItem.CODIGO);
	}

	if (id == 'ddiC') {
		$('#ddi').val(selectedItem.CODIGO);
	}

	if (id == 'zoomMunicipio') {
		$('#codCidade').val(selectedItem.CODIGO);
	}
	
	if (id == 'area') {
		
		buscaAprovadorDiretor();
		
	}
	
	

}

function controleTelaAprovadorCSOFP() {
	var valDecisao = $("[name=decisaoGestorCSOFP]:checked").val();
	$("#decisaoGestorHiddenCSOFP").val(valDecisao);
	switch (valDecisao) {
		case "nao":
			$(".motivoaGestorCSOFP").show();
			break;
		default:
			$(".motivoaGestorCSOFP").hide();
			break;
	}
}

function controleTelaAprovadorCSOFPAction() {
	controleTelaAprovadorCSOFP();
	$("[name=decisaoGestorCSOFP]").change(function () {
		controleTelaAprovadorCSOFP();
	});
}

function alimentaFilial() {
	$("[name=codigo]").change(function () {
		var filialId = $("[name=codigo]").val();
		var filialDataSet = new objDataSet("filiais");
		filialDataSet.setCampo("filial");
		filialDataSet.setFiltro("codigo", filialId, filialId, true);
		filialDataSet.filtrarBusca();
		var dadosFilialProtheus = filialDataSet.getDados();
		var unidade = dadosFilialProtheus.values[0].filial;
		$("[name=hiddenFilial]").val(unidade);
		//$("[name=hiddenFilial]").change();
		$("[name=analyticsNmFilial]").val(unidade);
	});
}

function alimentarUnidadeProtheus() {
	$("[name=codigo]").change(function () {
		var filialId = $("[name=codigo]").val();
		var filialDataSet = new objDataSet("filiais");
		filialDataSet.setCampo("filial_protheus");
		filialDataSet.setFiltro("codigo", filialId, filialId, true);
		filialDataSet.filtrarBusca();
		var dadosFilialProtheus = filialDataSet.getDados();
		var filialProtheusId = dadosFilialProtheus.values[0].filial_protheus;
		$("[name=filial_protheus]").val(filialProtheusId);
		$("[name=codigo_filial]").val(filialId);
		$("[name=filial_protheus]").change();
		$("[name=codigo_filial]").change();

	});
}

function limpaCampoChangeFilial() {
	$("[name=codigo]").change(function () {
		$("[name=CENTRO_CUSTO_DESC]").val("");
		$("[name=CTT_CUSTO]").val("");
		$("[name=NNR_CODIGO]").val("");
		$("[name=NNR_DESCRI]").val("");
	});
}

function desabilitarCampoQuandoHaSolicAberta() {
	$("[name=A2_COD]").val("");
	$("[name=FORNECEDOR_BANCO_DESC]").val("");
	$("[name=tipoSolicitacao]").attr('checked', false);
	$(".informacoesAdiantamento").hide();
	$(".blocoDadosBancarios").hide();
	$(".desabilitaAmbos").hide();
	$("[name=filial").val("");
}

function lerDataSetAtividadeAberta() {
	// Monta as constraints para consulta
	var valorFornecedorSelecionado = $("[name=codigoFilialAberto]").val();
	var c1 = DatasetFactory.createConstraint("codigoFilialAberto",
		valorFornecedorSelecionado, valorFornecedorSelecionado,
		ConstraintType.MUST);
	var c2 = DatasetFactory.createConstraint("metadata#active", "true", "true",
		ConstraintType.MUST);
	var c3 = DatasetFactory.createConstraint("documentid", buscarDocumentoForm(),
		buscarDocumentoForm(),
		ConstraintType.MUST_NOT);

	var constraints = new Array(c1, c2, c3);

	// Busca o dataset
	var dataset = DatasetFactory.getDataset(
		"solicitacaoDeAdiantamentoReembolso4", null, constraints, null).values;

	for (var i = 0; i < dataset.length; i++) {
		var varrendoValorAtivo = dataset[i]["solicitacaoAberta"];
		var varrendoValorFilial = dataset[i]["codigoFilialAberto"];
		var valorAtivo1 = 1;
		// alert(dataset[i]["solicitacaoAberta"]);
	}
	if (varrendoValorAtivo == valorAtivo1 && varrendoValorFilial == valorFornecedorSelecionado) {
		FLUIGC.message.alert({
			title: "Atenção",
			message: "Não foi possível atender a sua solicitação pois existem adiantamentos em aberto.",
			label: "OK"
		});
		desabilitarCampoQuandoHaSolicAberta();
		return false;
	}
	return true;
}

function preencherCampoAtividadeAberta() {
	$("[name=tipoSolicitacao]").change(function () {
		var valorSolicitacao = $(this).val();
		$("#analyticsTpSolicitacao").val(valorSolicitacao);
		var valorFornecedorSelecionado = $("[name=A2_COD]").val();
		var valorSolcitacaoAberta = 1;
		var tipoSolicitacaoAdiantamento = "adiantamento";
		var valorVazio = "";

		if (valorSolicitacao == tipoSolicitacaoAdiantamento && valorFornecedorSelecionado != valorVazio) {
			$("[name=solicitacaoAberta]").val(valorSolcitacaoAberta);
			$("[name=codigoFilialAberto]").val(valorFornecedorSelecionado);
			if (lerDataSetAtividadeAberta()) {
				setValorIntegracaoAdiantamento();

				if (!isSetDadosBancariosFilial() && !warningFSDBShowed) {
					warningFilialSemDadosBancarios();
					//$(this).checked = false;
					//this.checked = false;
					$(this).prop('checked', false);
				}
			}
		} else {
			setValorIntegracaoReembolso();
			$("[name=solicitacaoAberta]").val(valorVazio);
			$("[name=codigoFilialAberto]").val(valorVazio);

		}

	});
}

function limparClickFDS() {

	$("[name=flagValidaFDS]").click(function () {
		var valorDataViagem = $("[name=viagemParaAdiantamento]").val()
		var valorVazio = '';
		if (valorDataViagem != valorVazio) {
			$("[name=viagemParaAdiantamento]").val(valorVazio)
		}

	});

}

function validarDatasAdiantamento() {
	$("[name=viagemDeAdiantamento], [name=viagemParaAdiantamento]").change(
		function () {
			validarCondicaoData(this);
			limparCampoQuandoClicado();
		});
}

function validarCondicaoData(obj) {
	var dataDe = $("[name=viagemDeAdiantamento]").val();
	var dataPara = $("[name=viagemParaAdiantamento]").val();

	if (dataDe != '' && dataPara != '') {
		var dataInicial = setObjData(dataDe);
		var dataFinal = setObjData(dataPara);

		if (dataInicial > dataFinal) {
			FLUIGC.message.alert({
				title: "Atenção",
				message: "O Valor do ''periodo de viagem De'' informado tem que ser menor do que a data atual, favor informar uma data valida.",
				label: "OK"
			});
			$(obj).val("");
		} else {
			calcularQtdDias(dataInicial, dataFinal);
		}
	}
}

function calcularQtdDias(dataInicial, dataFinal) {
	var qtdDiasSemanaAdiant = 0;
	var qtdDiasFimSemanaAdiant = 0;
	var dataCorrente = dataInicial;
	var diaSemanaCorrente = dataCorrente.getDay();
	var valorCheckBoxFDS = $("#flagValidaFDSHidden").val();
	var valorDataInicio = $("[name=viagemDeAdiantamento]").val();
	var valorDataFim = $("[name=viagemParaAdiantamento]").val();
	var valorFinalDeSeamana = 1;
	var valorSabado = 6;
	var valorDomingo = 0;
	var valorVazio = "";
	var proximoDia = "";
	var anoCorrente = "";
	var mesCorrente = "";

	while (dataCorrente <= dataFinal) {

		// console.log("Inicio rotina -> dataCorrente:" + dataCorrente
		// + " dataFinal:" + dataFinal + " -> Dia Semana Corrente: "
		// + diaSemanaCorrente);

		if (diaSemanaCorrente > valorDomingo && diaSemanaCorrente < valorSabado &&
			valorDataInicio != proximoDia && valorDataFim != proximoDia) {

			qtdDiasSemanaAdiant++;

			// console.log("valor qtdDiasSemanaAdiant=" + qtdDiasSemanaAdiant);

		} else if (valorCheckBoxFDS == valorFinalDeSeamana &&
			valorDataInicio != proximoDia && valorDataFim != proximoDia) {

			qtdDiasFimSemanaAdiant++;

			// // console.log("valor qtdDiasFimSemanaAdiant="
			// + qtdDiasFimSemanaAdiant);
			$("#diasViagemFDS").val(qtdDiasFimSemanaAdiant);

		}

		// Rotina deverá ser a última dentro do While
		proximoDia = setValor2Digitos(dataCorrente.getDate() + 1);
		// Soma 1 para executar a funcao
		mesCorrente = setValor2Digitos(dataCorrente.getMonth() + 1);
		anoCorrente = dataCorrente.getFullYear();

		// console.log("proximoDia=" + proximoDia);
		// dataCorrente.setDate(proximoDia);
		dataCorrente = setObjData(proximoDia + '/' + mesCorrente + '/' +
			anoCorrente);
		// console.log('rodou apos o setObjData dataCorrente=' + dataCorrente);

		diaSemanaCorrente = setDiaSemanaCorrente(diaSemanaCorrente);
		// console.log("Comparação=" + (dataCorrente <= dataFinal));
	}
	$("#diasViagem").val(qtdDiasSemanaAdiant);
}

function setValor2Digitos(valor) {
	valor = '' + valor;
	return (valor.length > 1) ? valor : '0' + valor;
}

function setDiaSemanaCorrente(diaSemanaCorrente) {
	diaSemanaCorrente = (diaSemanaCorrente < 6) ? diaSemanaCorrente + 1 : 0;
	return diaSemanaCorrente;
}

function setObjData(string) {
	return new Date(string.substr(6, 4), string.substr(3, 2) - 1, string
		.substr(0, 2), 0, 0, 0);
}

function setarMensagemAlerta() {
	var nomeAprovador = $("#nomeaprovGestorReembolso").val();
	var nomeFornecedor = $("#FORNECEDOR_BANCO_DESC").val();

	if (nomeAprovador != null && nomeAprovador != "" && nomeFornecedor != null &&
		nomeFornecedor != "") {
		nomeAprovador = nomeAprovador.trim().toUpperCase();
		nomeFornecedor = nomeFornecedor.trim().toUpperCase();
		var aprovador = nomeAprovador.split(" ");
		var fornecedor = nomeFornecedor.split(" ");

		if (aprovador[0] == fornecedor[0]) {
			var ultimoNome = aprovador[aprovador.length - 1];
			for (var i = 0; i < fornecedor.length; i++) {
				if (fornecedor[i] == ultimoNome) {
					FLUIGC.message.alert({
						message: "Prezado, o fornecedor a receber o adiantamento/reembolso parece ser a mesma pessoa que o aprovou. Por favor verifique se o reembolso está de acordo com a política.",
						title: "Atenção",
						label: "OK"
					});
				}
			}
		}
	}
}

function controlarTelaEmModoCorrecao() {
	var valorControlecontroleCampo = $("#tipoSolicitacaoHidden").val();
	var valorCampoReembolso = "reembolso";
	var valorCampoAdiantamento = "adiantamento";
	if (valorControlecontroleCampo == valorCampoAdiantamento) {
		$(".informacoesReembolso").hide();
		$(".blocoReembolso").hide();
		$(".blocoDespesas").hide();
		$(".informacoesAdiantamento").show();
		$(".desabilitaAmbos").show();

	}
	if (valorControlecontroleCampo == valorCampoReembolso) {
		$(".informacoesAdiantamento").hide();
		$(".informacoesReembolso").show();
		$(".desabilitaAmbos").show();
	}

}

function preencherCampoBancoAdiantamento() {
	//$("[name=hiddenfilial]").change(function () {
	$("[name=filial_protheus]").change(function () {
		var fornecedor = $(this).val();
		//var E2_FILIAL = $("#filial_protheus").val();
		//$("#E2_FILIAL").val(E2_FILIAL);
		buscarDadosBancariosAdiantamento(fornecedor);
	});
	/*
	$("[name=filial_protheus]").change(function () {
		var E2_FILIAL = $(this).val();
		$("#E2_FILIAL").val(E2_FILIAL);
	});
	*/
}

function buscarDadosBancariosAdiantamento(fornecedor) {
	//valorDataEmissaoVencimento();

	var fornecDataSetBanco = new objDataSet("filial_agencia_e_conta");

	fornecDataSetBanco.setCampo("codigo");
	fornecDataSetBanco.setCampo("nomeFilial");
	fornecDataSetBanco.setCampo("codBanco");
	fornecDataSetBanco.setCampo("codAgencia");
	fornecDataSetBanco.setCampo("conta");

	fornecDataSetBanco.setFiltro("codigo", fornecedor);

	fornecDataSetBanco.filtrarBusca();
	var dadosFornecProtheus = fornecDataSetBanco.getDados();

	if (dadosFornecProtheus.values.length > 0) {
		var fornecCodigo = dadosFornecProtheus.values[0].codigo;
		var fornecFilial = dadosFornecProtheus.values[0].nomeFilial;
		var fornecBanco = dadosFornecProtheus.values[0].codBanco;
		var fornecAgencia = dadosFornecProtheus.values[0].codAgencia;
		var fornecConta = dadosFornecProtheus.values[0].conta;

		$("#AUTBANCO").val(fornecBanco);
		$("#AUTAGENCIA").val(fornecAgencia);
		$("#AUTCONTA").val(fornecConta);
		$("#MV_PAR05").val("1");
		$("#MV_PAR09").val("1");
	} else {
		//warningFilialSemDadosBancarios();
	}
}

function warningFilialSemDadosBancarios() {
	FLUIGC.message.alert({
		message: "Os dados bancários dessa unidade não estão cadastrados para emissão de reembolso ou não foram preenchidos corretamente!",
		title: "Erro de Cadastro",
		label: "OK"
	}, function (el, ev) {
		$("[name=filial_protheus]").val("");
		$("[name=codigo_filial]").val("");
		$("[name=hiddenFilial]").val("");
		$("[name=analyticsNmFilial]").val("");
		$("[name=filial]").val("");
		$("[name=codigo]").val("");

		$("#AUTBANCO").val("");
		$("#AUTAGENCIA").val("");
		$("#AUTCONTA").val("");
		$("#MV_PAR05").val("");
		$("#MV_PAR09").val("");
		desabilitarCampoQuandoAlterado();
		warningFSDBShowed = false;
	});
	warningFSDBShowed = true;
}

function isSetDadosBancariosFilial() {
	var banco = $("#AUTBANCO").val();
	var agencia = $("#AUTAGENCIA").val();
	var conta = $("#AUTCONTA").val();
	var param05 = $("#MV_PAR05").val();
	var param09 = $("#MV_PAR09").val();

	return (banco != "") && (agencia != "") && (conta != "") && (param05 != "") && (param09 != "");
}

function setValorIntegracaoAdiantamento() {

	$("#E2_MULTNAT").val("1");
	$("#E2_PREFIXO").val("DIV");
	$("#E2_TIPO").val("PA");
	$("#E2_PARCELA").val("1");
	$("#E2_LOJA").val("01");
	$("#E2_HIST").val("INT ADI");
	$("#E2_NATUREZ").val("41112001");

}

function setValorIntegracaoReembolso() {

	//valorDataEmissaoVencimento();

	$("#E2_MULTNAT").val("1");
	$("#E2_PREFIXO").val("REV");
	$("#E2_TIPO").val("RC");
	$("#E2_PARCELA").val("1");
	$("#E2_LOJA").val("01");
	$("#E2_HIST").val("INT REEMB");
	$("#E2_NATUREZ").val("41110008");

}




function valorDataEmissaoVencimento() {
	var dataAtual = buscarDataAtual();
	$("#E2_EMISSAO").val(dataAtual);

	var dataSomada = buscarVencimento();
	var valor = dataSomada.substr(6, 2);

	/*
	if (valor > 31) {
		$("#E2_VENCTO").val(dataAtual);
	} else {
		$("#E2_VENCTO").val(dataAtual);
	}
	*/

	$("[name=aprovDataPrevistaAdiant]").change(function () {
		var dataSomada = buscarVencimento();
		$("#E2_VENCTO").val(dataSomada);
	});

	$("[name=aprovDataPrevista]").change(function () {
		var dataSomada = buscarVencimento();
		$("#E2_VENCTO").val(dataSomada);
	});
}

function buscarData() {
	return new Date();
}

function buscarDiaAtual() {
	return buscarData().getDate().toString();
}

function buscarDiaVencimento() {
	return (buscarData().getDate() + 7).toString();
}

/*
 * Retorna o Mes Atual (String)
 */
function buscarMesAtual() {
	return (buscarData().getMonth() + 1).toString();
}

/*
 * Retorna o Ano Atual (String)
 */
function buscarAnoAtual() {
	return buscarData().getFullYear().toString();
}

/*
 * Retorna a Data Atual (Formato Brasileiro) (String)
 *
 * Params: Dia (String), Mes (String), Ano (String)
 */
function formatarData(ano, mes, dia) {
	if (dia.length == 1)
		dia = 0 + dia;
	if (mes.length == 1)
		mes = 0 + mes;
	return ano + "" + mes + "" + dia;
}

/*
 * Retorna a Data Atual (Formato Brasileiro)
 */
function buscarDataAtual() {
	return formatarData(buscarAnoAtual(), buscarMesAtual(), buscarDiaAtual());
}

function buscarDataAtualSemConverter() {
	return formatarData(buscarDiaAtual(), buscarMesAtual(), buscarAnoAtual());

}

function buscarVencimento() {
	var vencto = "";
	var tipo = $("[name=tipoSolicitacaoHidden]").val();
	if (tipo == "adiantamento")
		vencto = $("[name=aprovDataPrevistaAdiant]").val();
	else if (tipo == "reembolso") {
		vencto = $("[name=aprovDataPrevista]").val();
	}

	if (vencto != "") {
		var itensVencto = vencto.split("/");
		return formatarData(itensVencto[2], itensVencto[1], itensVencto[0]);
	}
	return formatarData(buscarAnoAtual(), buscarMesAtual(), buscarDiaVencimento());
}

function preencherCampo() {
	$("#A2_COD").change(function () {
		var recebeValorFornece = $(this).val();
		$("#E2_FORNECE").val(recebeValorFornece);
		$("#codigoFilialAberto").val(recebeValorFornece);
		buscarDadosBancarios(recebeValorFornece);
		desabilitarCampoQuandoAlterado();

	});

	/*
	$("[name=codigo]").change(function () {
		var selectUnidade = $("[name=codigo]").val();
		$("#E2_FILIAL").val(selectUnidade);
	});*/

	$("[name=filial_protheus]").change(function () {
		var selectUnidade = $("[name=filial_protheus]").val();
		$("#E2_FILIAL").val(selectUnidade);
	});

}

function desabilitarCampoQuandoAlterado() {
	$("[name=tipoSolicitacao]").attr('checked', false);
	$(".informacoesAdiantamento").hide();
	$(".blocoDadosBancarios").hide();
	$(".desabilitaAmbos").hide();

}

function buscarDadosBancarios(fornecedor) {

	var fornecDataSet = new objDataSet("consultaDadosProtheus");
	fornecDataSet.setCampo("SA2");
	fornecDataSet.setCampo("A2_COD = '" + fornecedor + "'");
	fornecDataSet
		.setCampo("A2_CGC,A2_BANCO,A2_AGENCIA,A2_DVAGE,A2_NUMCON,A2_DVCTA");
	fornecDataSet.filtrarBusca();
	var dadosFornecProtheus = fornecDataSet.getDados();

	var fornecBanco = dadosFornecProtheus.values[0].A2_BANCO;
	var fornecAgencia = dadosFornecProtheus.values[0].A2_AGENCIA;
	var fornecDVAGE = dadosFornecProtheus.values[0].A2_DVAGE;
	var fornecNUMCON = dadosFornecProtheus.values[0].A2_NUMCON;
	var fornecDVCTA = dadosFornecProtheus.values[0].A2_DVCTA;

	$("[name=A2_BANCO]").val(fornecBanco);
	$("[name=A2_AGENCIA]").val(fornecAgencia);
	$("[name=A2_DVAGE]").val(fornecDVAGE);
	$("[name=A2_NUMCON]").val(fornecNUMCON);
	$("[name=A2_DVCTA]").val(fornecDVCTA);

}

function validarDataRetroativa() {
	var total = 0;
	var dataInicial = $("[name=viagemDe]").val();
	var date2 = new Date();
	var valorPosterior = 31; /* dias */
	date1 = new Date(dataInicial.substr(6, 4), dataInicial.substr(3, 2) - 1,
		dataInicial.substr(0, 2));
	var diferenca = Math.abs(date1 - date2);
	var dia = 1000 * 60 * 60 * 24;
	total = Math.round(diferenca / dia);
	if (total > valorPosterior) {
		FLUIGC.message.alert({
			message: "Solicitações de reembolso não poderão ser realizadas quando o início da viagem ultrapassar mais de um mês. Informe uma data válida no campo 'Período de Viagem De' ou entre em contato com a Administração do CSO para obter orientações de como realizar solicitações que ultrapassam o prazo do pedido.",
			title: "Atenção",
			label: "OK"
		});
		$("[name=viagemDe]").val("");
	}

}

function validarDataPosterior() {
	var dataInicial = $("[name=viagemPara]").val();
	var date2 = new Date();
	var valorPosterior = 31; /* dias */
	date1 = new Date(dataInicial.substr(6, 4), dataInicial.substr(3, 2) - 1,
		dataInicial.substr(0, 2));
	var diferenca = Math.abs(date1 - date2);
	var dia = 1000 * 60 * 60 * 24;
	var total = Math.round(diferenca / dia);

	if (total > valorPosterior) {
		FLUIGC.message.alert({
			message: "Solicitações de reembolso não poderão ser realizadas quando o fim da viagem ultrapassar mais de um mês. Informe uma data válida no campo 'Período de Viagem Até' ou entre em contato com a Administração do CSO para obter orientações de como realizar solicitações que ultrapassam o prazo do pedido.",
			title: "Atenção",
			label: "OK"
		});
		$("[name=viagemPara]").val("");
	}

}
/* teste */
function validarDataMaiorQueDataAtual() {
	var dataInicial = $("[name=viagemPara]").val();
	var date2 = new Date();
	var valorPosterior = 0; /* dias */
	var valorDia = 1; /* dias */
	date1 = new Date(dataInicial.substr(6, 4), dataInicial.substr(3, 2) - 1,
		dataInicial.substr(0, 2));
	var diferenca = Math.abs(date2 - date1);
	var dia = 1000 * 60 * 60 * 24;
	var total = Math.round(diferenca / dia);

	if (date1 > date2 || total == valorPosterior) {
		FLUIGC.message.alert({
			message: "Solicitações de reembolso não poderão ser realizadas quando o fim da viagem é maior ou igual a data atual. Informe uma data válida no campo 'Período de Viagem Até' ou entre em contato com a Administração do CSO para obter orientações de como realizar solicitações que ultrapassam o prazo do pedido.",
			title: "Atenção",
			label: "OK"
		});
		$("[name=viagemPara]").val("");
	}
}

function validarDataAtual() {
	var recebeDataAtual = new Date();
	var dataInicial = $("[name=viagemDe]").val();
	var validacao = true;

	if (dataInicial != '' || recebeDataAtual != '') {
		var date1 = new Date(dataInicial.substr(6, 4), dataInicial.substr(3, 2) - 1, dataInicial.substr(0, 2));
		if (date1 > recebeDataAtual) {
			FLUIGC.message.alert({
				message: 'O Valor do "periodo de viagem De" informado tem que ser menor do que a data atual, favor informar uma data valida.',
				title: "Atenção",
				label: "OK"
			});
			$("#viagemDe").val("");
			$("[name=diasViagemReembolso").val("");
			calculoDiasViagem($("[name=viagemDe]").val(),
				$("[name=viagemPara]").val());
			validacao = false;
		}
	}

	return validacao;
}

function validarDataMenorDataAtual() {
	$("[name=viagemDe]").change(function () {
		if (validarDataAtual()) {
			validarDataRetroativa();
		}
	});

	$("[name=viagemPara]").change(function () {
		validarDataPosterior();
		validarDataAtual();
		validarDataMaiorQueDataAtual();
	});
}

function limparCampoQuandoClicado() {
	$("#valorTotal").val("0");
	$("#E2_VALOR_TOTAL").val("0");
	$("[name^=despesaDinamica_]").attr("checked", false);
}

function controlarTelaReembolsoPassouAdiantamento() {
	if ($("#passouPeloAdiantamentoHidden").val() == "passouPeloAdiantamento") {
		$("#tipoSolicitacaoReembolso").attr("checked", true);
		$("#tipoSolicitacaoHidden").val("reembolso").change();
		$(".informacoesAdiantamento").hide();
		$(".informacoesReembolso").show();
		setValorIntegracaoReembolso();
	} else {
		controlarTela();
	}
}

function controlarTela() {
	if ($("#tipoSolicitacaoHidden").val() == "adiantamento") {
		exibirCamposAdiantamentoControle();
	}
	if ($("#tipoSolicitacaoHidden").val() == "reembolso") {
		exibirCamposReembolsoControle();

	}
}

function selecionarTelaPorTipo() {

	$("[name=tipoSolicitacao]").change(function () {
		var valorSolicitacao = $(this).val();
		var tipoSolicitacaoHidden = $("#tipoSolicitacaoHidden").val();
		controlarTelaTipoSolicitacao(tipoSolicitacaoHidden);
		$("#tipoSolicitacaoHidden").val(valorSolicitacao).change();
		exibirTipoSolicitacao(valorSolicitacao);
	});
}

function controlarTelaTipoSolicitacao(tipoSolicitacaoHidden) {
	if (tipoSolicitacaoHidden != "") {
		if (tipoSolicitacaoHidden == "reembolso") {
			confirmacaoLimpar();
			limparTablename();

		}
		if (tipoSolicitacaoHidden == "adiantamento") {
			limparCampoQuandoClicado();
		}
	}
}
var corrigeBugDuploClique = true;

function exibirTipoSolicitacao(tipoSolicitacao) {
	if ($("[name=valorAlmocoReembolso]").val() != '') {
		if (tipoSolicitacao == "adiantamento") {
			exibirCamposAdiantamento();
			$(".blocoDadosBancarios").show();
		} else if (tipoSolicitacao == "reembolso") {
			exibirCamposReembolso();

		}
	} else {
		console.log($("[name=tipoSolicitacao]:checked").val())
		if (corrigeBugDuploClique) {
			corrigeBugDuploClique = false;
			FLUIGC.message.alert({
				title: "Filial não cadastrada",
				message: "Sua filial de origem não foi cadastrada para reembolso. Solicite o cadastro para seu gestor.",
				label: "OK"
			}, function () {
				$("[name=tipoSolicitacao]").prop('checked', false);
				corrigeBugDuploClique = true;
			});
		}
	}
}

function recuperarValorGestorSetor() {

	$('#decisaoGestorSim').click(function () {
		var decisaoGestorSim = $("#decisaoGestorSim").val();
		$("#decisaoGestorHidden").val(decisaoGestorSim);
	});

	$('#decisaoGestorNao').click(function () {
		var decisaoGestorNao = $("#decisaoGestorNao").val();
		$("#decisaoGestorHidden").val(decisaoGestorNao);
	});

	$('#decisaoGestorCancelar').click(function () {
		var decisaoGestorCancelar = $("#decisaoGestorCancelar").val();
		$("#decisaoGestorHidden").val(decisaoGestorCancelar);
	});

}

function recuperarValorGestorSetorCSO() {

	$('#decisaoGestorCSOSim').click(function () {
		var decisaoGestorCSOSim = $("#decisaoGestorCSOSim").val();
		$("#decisaoGestorCSOHidden").val(decisaoGestorCSOSim);
	});

	$('#decisaoGestorCSONao').click(function () {
		var decisaoGestorCSONao = $("#decisaoGestorCSONao").val();
		$("#decisaoGestorCSOHidden").val(decisaoGestorCSONao);
	});

	$('#decisaoGestorCSOCancelar').click(function () {
		var decisaoGestorCSOCancelar = $("#decisaoGestorCSOCancelar").val();
		$("#decisaoGestorCSOHidden").val(decisaoGestorCSOCancelar);
	});

}

function recuperarValorGestorCurso() {

	$('#decisaoCursoReembolsoSim').click(function () {
		var decisaoGestorCSOSim = $("#decisaoCursoReembolsoSim").val();
		$("#decisaoGestorHiddenCursos").val(decisaoGestorCSOSim);
	});

	$('#decisaoCursoReembolsoNao').click(function () {
		var decisaoGestorCSONao = $("#decisaoCursoReembolsoNao").val();
		$("#decisaoGestorHiddenCursos").val(decisaoGestorCSONao);
	});

}

function recuperarValorGestorValidaCurso() {

	$('#decisaoVCursoReembolsoSim').click(function () {
		var decisaoGestorCSOSim = $("#decisaoVCursoReembolsoSim").val();
		$("#decisaoGestorHiddenVCursos").val(decisaoGestorCSOSim);
	});

	$('#decisaoVCursoReembolsoNao').click(function () {
		var decisaoGestorCSONao = $("#decisaoVCursoReembolsoNao").val();
		$("#decisaoGestorHiddenVCursos").val(decisaoGestorCSONao);
	});

}

function recuperarValorGestorSetorFinanceiro() {
	/*
	$('#decisaoGestorFinanceiroSim').click(
			function() {
				var decisaoGestorFinanceiroSim = $("#decisaoGestorFinanceiroSim").val();
				$("#decisaoGestorFinanceiroHidden").val(decisaoGestorFinanceiroSim);
			});

	$('#decisaoGestorFinanceiroNao').click(
			function() {
				var decisaoGestorFinanceiroNao = $("#decisaoGestorFinanceiroNao").val();
				$("#decisaoGestorFinanceiroHidden").val(decisaoGestorFinanceiroNao);
			});

	$('#decisaoGestorFinanceiroSim').click(function() {
		var decisaoPassouPorAdiantamento = "passouPeloAdiantamento";
		$("#passouPeloAdiantamentoHidden").val(decisaoPassouPorAdiantamento);
	});
	*/

	/*
	$(".motivoaGestorFinanceiro").hide();
	$(".dataPrevistaAdiant").hide();
	*/
	var opcao = $("[name=decisaoGestorFinanceiro]:checked").val();
	if (opcao == undefined)
		opcao = $("[name=_decisaoGestorFinanceiro]:checked").val();
	mostraDecisaoGestorSetorFinanceiro(opcao)

	$("[name=decisaoGestorFinanceiro]").change(function () {
		var opcao = $(this).val();
		$("#decisaoGestorFinanceiroHidden").val(opcao);
		mostraDecisaoGestorSetorFinanceiro(opcao);
		/*
		if(opcao == "sim") {
			//var decisaoPassouPorAdiantamento = "passouPeloAdiantamento";
			$("#passouPeloAdiantamentoHidden").val("passouPeloAdiantamento");
			$(".motivoaGestorFinanceiro").hide();
			$(".dataPrevistaAdiant").show();
		} else if(opcao == "nao") {
			$("#passouPeloAdiantamentoHidden").val("");
			$(".motivoaGestorFinanceiro").show();
			$(".dataPrevistaAdiant").hide();
		}
		*/
	});
}

function mostraDecisaoGestorSetorFinanceiro(opcao) {
	if (opcao == "sim") {
		//var decisaoPassouPorAdiantamento = "passouPeloAdiantamento";
		$("#passouPeloAdiantamentoHidden").val("passouPeloAdiantamento");
		$(".motivoaGestorFinanceiro").hide();
		$(".dataPrevistaAdiant").show();
	} else if (opcao == "nao") {
		$("#passouPeloAdiantamentoHidden").val("");
		$(".motivoaGestorFinanceiro").show();
		$(".dataPrevistaAdiant").hide();
	} else {
		$(".motivoaGestorFinanceiro").hide();
		$(".dataPrevistaAdiant").hide();
	}
}

function recuperarValorGestorSetorReembolso() {

	$('#decisaoGestorReembolsoSim').click(function () {
		var decisaoGestorReembolsoSim = $("#decisaoGestorReembolsoSim").val();
		$("#decisaoGestorReembolsoHidden").val(decisaoGestorReembolsoSim);
	});

	$('#decisaoGestorReembolsoNao').click(function () {
		var decisaoGestorReembolsoNao = $("#decisaoGestorReembolsoNao").val();
		$("#decisaoGestorReembolsoHidden").val(decisaoGestorReembolsoNao);
	});

	$('#decisaoGestorReembolsoCancelada').click(
		function () {
			var decisaoGestorReembolsoCancelar = $(
				"#decisaoGestorReembolsoCancelada").val();
			$("#decisaoGestorReembolsoHidden").val(
				decisaoGestorReembolsoCancelar);
		});

}

function recuperarValorReembolsoFinanceiro() {
	/*
	$(".motivoaReembolsoFinanceiro").hide();
	$(".dataPrevista").hide();
	*/
	var opcao = $("[name=decisaoReembolsoFinanceiro]:checked").val();
	if (opcao == undefined)
		opcao = $("[name=_decisaoReembolsoFinanceiro]:checked").val();
	mostraOpcoesReembolsoFinanceiro(opcao);

	$("[name=decisaoReembolsoFinanceiro]").change(function () {
		var opcao = $(this).val();
		$("#decisaoReembolsoFinHidden").val(opcao);
		mostraOpcoesReembolsoFinanceiro(opcao);
	});
}

function mostraOpcoesReembolsoFinanceiro(opcao) {
	if (opcao == "sim") {
		$(".motivoaReembolsoFinanceiro").hide();
		$(".dataPrevista").show();
	} else if (opcao == "nao") {
		$(".motivoaReembolsoFinanceiro").show();
		$(".dataPrevista").hide();
	} else {
		$(".motivoaReembolsoFinanceiro").hide();
		$(".dataPrevista").hide();
	}
}

function bloquearBotaoZoom() {
	$(".btZoom").addClass('disabled');
	$(".btZoom").each(function () {
		this.removeAttribute("onclick");
	});
}

function retirarEspacoDosCampos() {
	$("#tipoSolicitacaoAdiantaqmento").click(function () {
		$("#A2_BANCO").val($("#A2_BANCO").val().trim());
		$("#A2_AGENCIA").val($("#A2_AGENCIA").val().trim());
		$("#A2_DVAGE").val($("#A2_DVAGE").val().trim());
		$("#A2_NUMCON").val($("#A2_NUMCON").val().trim());
		$("#A2_DVCTA").val($("#A2_DVCTA").val().trim());
	});
	$("#tipoSolicitacaoReembolso").click(function () {
		$("#A2_BANCO").val($("#A2_BANCO").val().trim());
		$("#A2_AGENCIA").val($("#A2_AGENCIA").val().trim());
		$("#A2_DVAGE").val($("#A2_DVAGE").val().trim());
		$("#A2_NUMCON").val($("#A2_NUMCON").val().trim());
		$("#A2_DVCTA").val($("#A2_DVCTA").val().trim());
	});

}

function setarCalendario() {
	setDatepicker("viagemDe");
	setDatepicker("viagemPara");
	setDatepicker("viagemDeAdiantamento");
	setDatepicker("viagemParaAdiantamento");

	setDatepickerAferToday("aprovDataPrevistaAdiant");
	setDatepickerAferToday("aprovDataPrevista");

	/*
	var data = new Date();
	var dia = data.getDate();
	var mes = data.getMonth() + 1;
	var ano = data.getFullYear();

	var hoje = new Date(ano, mes - 1, dia);

	$("#aprovDataPrevistaAdiant").datepicker({
		dateFormat : "dd/mm/yy",
		dayNames : [ "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo" ],
		dayNamesMin : [ "D", "S", "T", "Q", "Q", "S", "S", "D" ],
		dayNamesShort : [ "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom" ],
		monthNames : [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
		monthNamesShort : [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez" ],
		nextText : "Próximo",
		prevText : "Anterior",
		minDate: hoje,
		maxDate : '+30Y',
		inline : true
	});

	$("[name=aprovDataPrevista]").datepicker(	{
		dateFormat : "dd/mm/yy",
		dayNames : [ "Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo" ],
		dayNamesMin : [ "D", "S", "T", "Q", "Q", "S", "S", "D" ],
		dayNamesShort : [ "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom" ],
		monthNames : [ "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" ],
		monthNamesShort : [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez" ],
		nextText : "Próximo",
		prevText : "Anterior",
		minDate: hoje,
		maxDate : '+30Y',
		inline : true
	});
	*/
	// setDatepicker("dataInicioViagem");
}

function setDatepickerAferToday(nameCampo) {
	var data = new Date();
	var dia = data.getDate();
	var mes = data.getMonth() + 1;
	var ano = data.getFullYear();

	var hoje = new Date(ano, mes - 1, dia);

	$("[name='" + nameCampo + "']").datepicker({
		dateFormat: "dd/mm/yy",
		dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"],
		dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S", "D"],
		dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
		monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
		monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
		nextText: "Próximo",
		prevText: "Anterior",
		minDate: hoje,
		maxDate: '+30Y',
		inline: true
	});
}

function recuperarCampoDestino() {
	$("[name=informacaoCidadeColaborador]").change(function () {
		var valorCidadeAnterior = $("#infCidadeColaboradorHidden").val();
		var valorCidadeNovo = $(this).filter(':checked').val();

		if (valorCidadeAnterior != '' && valorCidadeAnterior != valorCidadeNovo && !validarDespesaPreenchida()) {
			confirmacaoLimparTablename("informacaoCidadeColaborador", valorCidadeAnterior, "infCidadeColaboradorHidden", valorCidadeNovo);
		} else {
			$("#infCidadeColaboradorHidden").val(valorCidadeNovo);
		}
	});
}

function recuperarCampoForaDaPolitica() { // refatorar 'recuperarCampoDestino' e 'recuperarCampoForaDaPolitica', criando uma uni
	$("[name=infoDentroPolitica]").change(function () {
		var opcaoAnterior = $("#infoDentroPoliticaHidden").val();
		//var novaOpcao = $(this).filter(':checked').val();
		var novaOpcao = $(this).filter(':checked').val();

		if (opcaoAnterior != '' && opcaoAnterior != novaOpcao && !validarDespesaPreenchida()) {
			confirmacaoLimparTablename("infoDentroPolitica", opcaoAnterior, "infoDentroPoliticaHidden", novaOpcao);
		} else {
			$("#infoDentroPoliticaHidden").val(novaOpcao);
			warningPoliticaReembolso();
		}

	});
}

function warningPoliticaReembolso() {
	var tipo = $("[name=infoDentroPolitica]:checked").val();
	andre
	//var tipo = $("#infoDentroPoliticaHidden").val();
	if (tipo == 1) {
		FLUIGC.message.alert({
			message: "Todos os reembolsos solicitados \"Fora da Politica\" serão avaliados pela Gerência Financeira do CSO",
			title: "Reembolso Fora da Política",
			label: "OK"
		}, function (el, ev) {});
	}
}

function resetItensReembolso(campo, campoHid, typeInput) {
	$("[name=" + campo + "]").change(function () {
		var opcaoAnterior = $("#" + campoHid).val();

		switch (typeInput) {
			case "radio":
				var novaOpcao = $(this).filter(':checked').val();
				break;
			case "check":
				var novaOpcao = $(this).val();
				break;
			default:
				var novaOpcao = $(this).val();
				break;
		}

		if (opcaoAnterior != '' && opcaoAnterior != novaOpcao && !validarDespesaPreenchida()) {
			confirmacaoLimparTablename(campo, opcaoAnterior, campoHid, novaOpcao);
		} else {
			$("#" + campoHid).val(novaOpcao);
		}
	});
}

function recuperarCampoFuncionario() {
	$("[name=tipoDeColaborador]").change(function () {
		var valorFuncAnterior = $("#tipoDeColaboradorHidden").val();
		var valorFuncNovo = $(this).filter(':checked').val();

		if (valorFuncAnterior != '' && valorFuncAnterior != valorFuncNovo && !validarDespesaPreenchida()) {
			confirmacaoLimparTablename("tipoDeColaborador", valorFuncAnterior, "tipoDeColaboradorHidden", valorFuncNovo);
		} else {
			$("#tipoDeColaboradorHidden").val(valorFuncNovo);
		}
	});
}

// Caso usuário confirme a alteração será limpado o tablename, caso não confirme
// o campo receberá o valor antigo
function confirmacaoLimparTablename(nomeCampoCancelar, valorAnterior, nomeCampoHidden, valorNovo) {
	var optModal = confirmacaoLimparReembolso(nomeCampoCancelar, valorAnterior, nomeCampoHidden, valorNovo);
	/*
	if ( optModal ) {
		$("#" + nomeCampoHidden).val(valorNovo);
		limparTablename();
	} else {
		//$("[name='" + nomeCampoCancelar + "'][value='" + valorAnterior + "']").trigger("click");
	}
	*/
}

function confirmacaoLimparReembolso(nomeCampoCancelar, valorAnterior, nomeCampoHidden, valorNovo) {
	// Alerta solicitando confirmação usuário
	//if ( $('input[name=tipoSolicitacao]:checked').val() == "reembolso" ){ // tipo solicitação não muda quando passa de adiantamento para reembolso
	if ($('input[name=tipoSolicitacaoHidden]').val() == "reembolso") {
		myModal = FLUIGC.modal({
			title: 'Itens Reembolso',
			content: '<h4>' + msgLimpezaReembolso + '</h4>',
			id: 'fluig-modal',
			actions: [{
				'label': 'OK',
				'id': 'btnOk',
				'bind': 'onclick=limpesaReembolsoConfirmada("' + nomeCampoCancelar + '","' + valorAnterior + '","' + nomeCampoHidden + '","' + valorNovo + '")'
			}, {
				'label': 'Cancelar',
				'bind': 'onclick=limpezaReembolsoCancelada("' + nomeCampoCancelar + '","' + valorAnterior + '")',
				'autoClose': true
			}]
		}, function (err, data) {
			if (err) {

			} else {

			}
		});

		return false; // Realizar o tratamento do true após
	}
}

function confirmacaoLimpar() {
	return true;
}

function limpezaReembolsoCancelada(nomeCampoCancelar, valorAnterior) {
	$("[name='" + nomeCampoCancelar + "'][value='" + valorAnterior + "']").trigger("click");
}

function limpesaReembolsoConfirmada(nomeCampoCancelar, valorAnterior, nomeCampoHidden, valorNovo) {

	//console.log(" limpesaReembolsoConfirmada : " + nomeCampoCancelar + "," + valorAnterior + "," + nomeCampoHidden + "," + valorNovo);

	myModal.remove();

	switch (nomeCampoCancelar) {
		case "informacaoCidadeColaborador":
			$('input:radio[name=' + nomeCampoCancelar + ']')[valorNovo].checked = true;
			$("#" + nomeCampoHidden).val(valorNovo);
			limparTablename();
			break;
		case "tipoDeColaborador":
			var indice = 0; // Funcionario
			if (valorNovo == "tercerizado") {
				indice = 1;
			}
			$('input:radio[name=' + nomeCampoCancelar + ']')[indice].checked = true;
			$("#" + nomeCampoHidden).val(valorNovo);
			limparTablename();
			break;
		case "infoDentroPolitica":
			$('input:radio[name=' + nomeCampoCancelar + ']')[valorNovo].checked = true;
			$("#" + nomeCampoHidden).val(valorNovo);
			warningPoliticaReembolso();
			limparTablename();
			break;
	}
}

function limparTablename() {
	var registro = 0;

	// $("tr[detailname='tbVinculoDespesas'] td img").each(function() {
	$("tr td img").each(function () {
		// Primeiro registro não pode deletar
		if (registro > 0) {
			fnWdkRemoveChild($(this)[0]);
		}

		registro++;
	});

	controleTablenameDespesas();

	calcularValorTodosReembolso();

	// Exibe ou oculta os item do reembolso
	controleTelaResumoDasDespesas();

	calcularValorTotalReembolso();

	$("[name=diasViagemReembolso").val("");
	calculoDiasViagem($("[name=viagemDe]").val(), $("[name=viagemPara]").val());

}

function comecarCamposDesabilitado() {
	$(".informacoesAdiantamento").hide();
	$(".informacoesReembolso").hide();
	$(".desabilitaAmbos").hide();

}

function exibirCamposAdiantamentoControle() {
	$(".blocoReembolso").hide();
	$(".blocoDespesas").hide();
	$(".informacoesReembolso").hide();
	$(".informacoesAdiantamento").show();

}

function exibirCamposReembolsoControle() {
	$(".informacoesAdiantamento").hide();
	$(".informacoesReembolso").show();
	$(".blocoReembolso").show();
	$(".blocoDespesas").show();

}

function ocultaReembolsoAdiantamento() {
	$(".blocoReembolso").hide();
	$(".informacoesAdiantamento").hide();
}

function exibirCamposAdiantamento() {
	$(".informacoesReembolso").hide();
	$(".blocoReembolso").hide();
	$(".blocoDespesas").hide();
	$(".informacoesAdiantamento").show();
	$(".desabilitaAmbos").show();
}

function exibirCamposReembolso() {
	$(".informacoesAdiantamento").hide();
	$(".informacoesReembolso").show();
	$(".desabilitaAmbos").show();
}

function calcularCampos() {
	$("[name^=despesaDinamica_]").change(function () {
		calcularValorTotal();
	});

}

function calcularValorTotal() {
	$("[name^=despesaDinamica_]").each(function () {
		var valorCheckBoxMarcado = $("#flagValidaFDSHidden").val();
		var nome = $(this).attr("name");
		var pos = nome.split("_")[1];
		if (pos == 0) {
			valorTotal = 0.00;
		} else {
			valorTotal = $("#valorTotal").val();
		}

		if ($(this).prop("checked")) {
			var valorUnit = $(
				"[name=valorDinamica_" + pos + "]").val();
			var quant = $("#diasViagem").val();
			var valorUnitFDS = $("[name=valorFDS_" + pos + "]").val();
			var quantFDS = $("#diasViagemFDS").val();

			if (valorCheckBoxMarcado == 1 && quantFDS != 0) {

				valorTotalMaisFDS = parseFloat(valorTotalfds) + (parseFloat(valorUnitFDS) * parseFloat(quantFDS));

				valorTotal = parseFloat(valorTotal) + (parseFloat(valorUnit) * parseFloat(quant));

				var valorSomado = valorTotalMaisFDS + valorTotal;

				valorTotal = parseFloat(valorSomado).toFixed(2);

			} else {
				valorTotal = parseFloat(valorTotal) + (parseFloat(valorUnit) * parseFloat(quant));
				valorTotal = parseFloat(valorTotal).toFixed(2);
				setarValorTotal(valorTotal);

			}
		}
		setarValorTotal(valorTotal);
		$("#valorTotal").val(valorTotal);
	});

	limparCampoReembolso();


}

function setarValorTotal(valorTotal) {
	$("#valorTotal").val(valorTotal);
	$("[name=adiantamentoRecebido]").val(valorTotal);
	$("[name=E2_VALOR_TOTAL]").val(valorTotal);
}

function limparCampoReembolso() {
	$("#tipoSolicitacaoReembolso").click(function () {
		$("#valorTotal").val("");
		$("[name=adiantamentoRecebido]").val("");
		$("[name=E2_VALOR_TOTAL]").val("");
	});

}

function controlarBotaoNovo() {
	$("#addRegistroDespesas").click(function () {
		wdkAddChild('tbVinculoDespesas');
		setCalendario("dataDespesas");
		controleTelaItemReembolso();
	});
}

function controleTablenameDespesas() {
	var qtd = $("table[name=tbVinculoDespesas] tbody tr").length;

	if (qtd == 2) {
		//if (qtd > 1) {
		$("#addRegistroDespesas").trigger("click");
	}
}

function fnCustomDelete(oElement, nameTable, classFieldSet) {
	var qtdDeParaMatMed = $("table[name=" + nameTable + "] tbody tr").length;

	// Chamada a funcao padrao, NAO RETIRAR
	// Caso tenha apenas 3 não é permitido excluir pois um é oculto e o
	// outro é
	// o último registro da tablename
	if (qtdDeParaMatMed > 3) {
		fnWdkRemoveChild(oElement);

		calcularValorTodosReembolso();
	} else {
		var campo = $("fieldset." + classFieldSet + " legend").html();
		alert(objForm_exibicaoDeErros + "\n\n - " + campo + " " +
			msg_campo_vazio);
	}
}

function setCalendario(sufixoNameCampo) {
	var lista = $("[name^='" + sufixoNameCampo + "']");
	var ultimaPos = lista.length;
	var item = lista.eq(ultimaPos - 1);
	var nameCampo = item.attr("name");
	setDatepicker(nameCampo);
}

function setDatepicker(nameCampo) {
	$("[name='" + nameCampo + "']").datepicker({
		dateFormat: "dd/mm/yy",
		dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta",
			"Sexta", "Sábado", "Domingo"
		],
		dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S", "D"],
		dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex",
			"Sáb", "Dom"
		],
		monthNames: ["Janeiro", "Fevereiro", "Março", "Abril",
			"Maio", "Junho", "Julho", "Agosto", "Setembro",
			"Outubro", "Novembro", "Dezembro"
		],
		monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
			"Jul", "Ago", "Set", "Out", "Nov", "Dez"
		],
		nextText: "Próximo",
		prevText: "Anterior"
	});
}

function buscaAprovadorDiretor(){
	
	var filial = $("#filialOrigem_protheus").val();
	var area = $("#area").val();
	
	const areaString = new String(area);	
	var area = areaString;

	// consulta se é cso ou holding sp	
	if ( (filial == "00101" || filial == "00104") && (area != null && area != 'null') ){
		
		var x1 = DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST);
		var x2 = DatasetFactory.createConstraint("codFilial", filial, filial, ConstraintType.MUST);		 
		var datasetPai = DatasetFactory.getDataset("ds_areas_aprovadores", null, new Array(x1,x2), null).values;
		for (var i in datasetPai) {
			//Cria as constraints para buscar os campos filhos, passando o tablename, número da ficha e versão (no caso a última).
			var c1 = DatasetFactory.createConstraint("tablename", "tbAreas", "tbAreas", ConstraintType.MUST);
			var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
			var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST);
			var c4 = DatasetFactory.createConstraint("area", area, area, ConstraintType.MUST);
			// // Busca o dataset
			var ds_aprovadores = DatasetFactory.getDataset("ds_areas_aprovadores", null, new Array(c1, c2, c3, c4), null).values;
			
			if (ds_aprovadores.length < 1) mensagemComConfirmacao('Aviso', 'Não possui aprovadores para essa area', null);	
			var gestorArea = ds_aprovadores[0].matrGestor;             
			var diretorArea = ds_aprovadores[0].matrDiretor;    

			//BUSCA CARGO SENIOR
			var cpfFornecedor = removeMaskCpf($("#cpfFornecedor").val());
			var c1 = DatasetFactory.createConstraint('NUM_CPF', cpfFornecedor, cpfFornecedor, ConstraintType.MUST);
			var dsCargo = DatasetFactory.getDataset('ds_cargoCpfSenior', null, new Array(c1), null).values;
			var cargo = dsCargo[0].DESC_CARGO;
			//VERIFICA SE O CARGO É DE DIRETORIA PARA SELECIONAR O 
			if(cargo.indexOf("DIRETOR") == -1 && ds_aprovadores[0].area == "DIRETORIA HOLDING"){
				FLUIGC.message.alert({
					message: "Somente colaboradores com cargo de diretoria podem selecionar a área DIRETORIA HOLDING.",
					title: "Atenção",
					label: "OK"
				});
				window['area'].clear();
			}else{
				$("#gestorArea").val(gestorArea);
				$("#diretorArea").val(diretorArea);	
			}	
		}    
	}

}

function getAprovadorRegional(){
	
	var filial = $("#codigoFilialOrigem").val();
				
	    var cons = []
	    cons.push(DatasetFactory.createConstraint('codigo_Filial', filial, filial, ConstraintType.MUST))
	    var dadosAprovador = DatasetFactory.getDataset('cadastroResponsavelFilial', null, cons, null).values;
	    
	    if (dadosAprovador.length > 0) {
	    
		    for (var i = 0; i < dadosAprovador.length; i++) {
		        var documentId = dadosAprovador[i]["metadata#id"];
		        var documentVersion = dadosAprovador[i]["metadata#version"];
		        var cons1 = []
		        cons1.push(DatasetFactory.createConstraint("metadata#id", documentId, documentId, ConstraintType.MUST));
		        cons1.push(DatasetFactory.createConstraint("metadata#version", documentVersion, documentVersion, ConstraintType.MUST));
		        //Busca o dataset
		        var datasetFilhos = DatasetFactory.getDataset("cadastroResponsavelFilial", null, cons1, null).values
		    }	   
		    
		    if (datasetFilhos.length > 0) {
		        $('#aprovadorGO').val(datasetFilhos[0].responsavelId_1);
		        $('#aprovadorRegional').val(datasetFilhos[0].responsavelId_2);
		    }else{
		    	mensagemComConfirmacao('Aviso', 'Gestor Regional / GO não cadastrado para essa filial', null);	    	
		    }
	    }
	    else{
	    	mensagemComConfirmacao('Aviso', 'Gestor Regional / GO não cadastrado para essa filial', null);	    	
	    }	
	
}


function buscarDadosTipoSolicitacao() {
	// Executa a ação ao alterar
	$("[name=tipoSolicitacaoHidden]").change(function () {
		var tipoSolicitacao = $(this).val();

		selecaoTipoSolicitacao(tipoSolicitacao);
	});

	// Executa a ação ao carregar
	var tipoSolicitacao = $("[name=tipoSolicitacaoHidden]").val();

	selecaoTipoSolicitacao(tipoSolicitacao);
}

function selecaoTipoSolicitacao(tipoSolicitacao) {
	if (tipoSolicitacao == 'adiantamento') {
		buscarSelecaoTipoSolicitacao('objAdiantamento');
		// carregarSelecaoTipoSolicitacao('objAdiantamento');

		exibirDespesas();
	} else if (tipoSolicitacao == 'reembolso') {
		// name="objReembolso"

	}
}


function buscarSelecaoTipoSolicitacao(objTipoSolicitacao) { // funcao alterada para pegar os valores do adiantamento.
	var valueObjTipoSolicitacao = $("[name=" + objTipoSolicitacao + "]").val();
	
	var arrayAdt = [];	

	if (valueObjTipoSolicitacao == '') {
		
		var constraintPai = DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST);
		var datasetPai = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(constraintPai), null).values;

		for (var i in datasetPai) {           
		    var c1 = DatasetFactory.createConstraint("tablename", "tbAdiantamento", "tbAdiantamento", ConstraintType.MUST);
		    var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
		    var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST); 	    
		    var ds_adiantamento = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(c1, c2, c3), null).values; 		    		    
		}
		
		for(var j = 0; j < ds_adiantamento.length; j++) {
			
			var codigo = ds_adiantamento[j].codigo_adt;
			var parametro = ds_adiantamento[j].parametro_adt;
			var valor = ds_adiantamento[j].valor_adt;
			var valorFDS = ds_adiantamento[j].valorFds_adt;			
			
			arrayAdt.push({"codigo":codigo,"parametro":parametro,"valor":valor,"valorFDS":valorFDS});					
			
		}							
		carregarSelecaoTipoSolicitacao(arrayAdt);
		$("[name=" + objTipoSolicitacao + "]").val(1).change();
	}
}


/*
function buscarSelecaoTipoSolicitacao(objTipoSolicitacao) {
	var valueObjTipoSolicitacao = $("[name=" + objTipoSolicitacao + "]").val();

	if (valueObjTipoSolicitacao == '') {
		var dataSet = new objDataSet("tipoDeDespesaAdiantamento");

		dataSet.setCampo("codigo");
		dataSet.setCampo("parametro");
		dataSet.setCampo("valor");
		dataSet.setCampo("valorFDS");

		dataSet.filtrarBusca();

		var dadosTipoDeDespesa = dataSet.getDados();
		carregarSelecaoTipoSolicitacao(dadosTipoDeDespesa.values);
		$("[name=" + objTipoSolicitacao + "]").val(1).change();
	}
}
*/
//alteração função @severa. 342648

function carregarSelecaoTipoSolicitacao(dadosTipoDeDespesa) {
    for (var pos in dadosTipoDeDespesa) {
        $("[name=labelDinamica_" + pos + "]").val(dadosTipoDeDespesa[pos].parametro).change();
        $("[name=valorFDS_" + pos + "]").val(dadosTipoDeDespesa[pos].valorFDS).change();
        if ($("[name=labelDinamica_" + pos + "]").val() == 'Almoço') { //Adiantamento de reembolso os valores de almoco são setados através de outro dataset

            var tipo = $("#tipoSolicitacaoHidden").val();

            if (tipo != "adiantamento"){          
                var valorAlmoco = removeMascaraMonetaria($("[name=valorAlmocoReembolso]").val()).toFixed(2);
            }else{
                var valorAlmoco = dadosTipoDeDespesa[pos].valor;
            }

            $("[name=valorDinamica_" + pos + "]").val(valorAlmoco).change();
        } else {
            $("[name=valorDinamica_" + pos + "]").val(dadosTipoDeDespesa[pos].valor).change();
        }
    }
}

/*
function carregarSelecaoTipoSolicitacao(dadosTipoDeDespesa) {
	for (var pos in dadosTipoDeDespesa) {
		$("[name=labelDinamica_" + pos + "]").val(dadosTipoDeDespesa[pos].parametro).change();
		$("[name=valorFDS_" + pos + "]").val(dadosTipoDeDespesa[pos].valorFDS).change();
		if ($("[name=labelDinamica_" + pos + "]").val() == 'Almoço') { //Adiantamento de reembolso os valores de almoco são setados através de outro dataset
			var valorAlmoco = removeMascaraMonetaria($("[name=valorAlmocoReembolso]").val()).toFixed(2);
			$("[name=valorDinamica_" + pos + "]").val(valorAlmoco).change();
		} else {
			$("[name=valorDinamica_" + pos + "]").val(dadosTipoDeDespesa[pos].valor).change();
		}
	}
}
*/

function carregarLabelTipoSolicitacao() {
	// Ao alterar
	$("[name^=labelDinamica_]").change(function () {
		var name = $(this).attr("name");

		alimentarLabelTipoSolicitacao(name);
	});

	// Ao carregar
	$("[name^=labelDinamica_]").each(function () {
		var name = $(this).attr("name");

		alimentarLabelTipoSolicitacao(name);
	});
}

function alimentarLabelTipoSolicitacao(name) {
	$("." + name).html($("[name=" + name + "]").val());
}

function exibirDespesas() {
	var ultimaPos = 0;

	$("[class^=bloco_despesa_]").each(function () {
		var nome = $(this).attr("class");
		var pos = nome.split("_")[2];
		var label = $("[name=labelDinamica_" + pos + "]").val();

		if (label == '') {
			$(".bloco_despesa_" + pos).hide();
		}
	});
}

function executarOcultarTipoSolicitacao() {
	$("[name=objAdiantamento]").change(function () {
		exibirDespesas();
	});
}

function changeReembolso() {
	$("[name=informacaoCidadeColaborador]").change(function () {
		controleDeTelaReembolso($(this).val(), $("[name=tipoDeColaborador]").is(":checked"));
	});

	$("[name=tipoDeColaborador]").change(function () {
		controleDeTelaReembolso($("[name=informacaoCidadeColaborador]").is(":checked"), $(this).is(":checked"));
	});

	$("[name=diasViagemReembolso]").change(function () {
		controleDeTelaReembolso($("#infCidadeColaboradorHidden").val(), $("[name=tipoDeColaboradorHidden]").val());
	});

	$("[name=infoDentroPolitica]").change(function () {
		controleDeTelaReembolso($(this).val(), $("[name=tipoDeColaborador]").is(":checked"));
	});

	controleDeTelaReembolso($("#infCidadeColaboradorHidden").val(), $("[name=tipoDeColaboradorHidden]").val());
}

function controleDeTelaReembolso(campo1, campo2) {
	var campoDataPreenchida = $("[name=diasViagemReembolso]").val();

	if (campo1 == '' || campo2 == '' || campoDataPreenchida == '') {
		$(".blocoDadosBancarios").hide();
		$(".blocoReembolso").hide();
		$(".blocoDespesas").hide();
	} else {
		$(".blocoDadosBancarios").show();
		$(".blocoReembolso").show();
		$(".blocoDespesas").show();
		//Carrega os itens do tipo de despesa
		carregaSelectTipoDespesas();
		// Adiciona um registro se não possuir
		controleTablenameDespesas();

	}
}

/*
 * Dias de viagem
 */
function calcularDiasViagem() {
	$("[name=viagemDe], [name=viagemPara]").focus(function () {
		dataAnterior = $(this).val();
	}).change(
		function () {
			if (!validarPreenchimentoDias()) {
				$(this).val(dataAnterior);
			} else if (!validarDespesaPreenchida()) {
				if (confirmacaoLimpar()) {
					// limpar tabela
					limparTablename();
				} else {
					$(this).val(dataAnterior);
				}
			} else {
				// chamar função para calculo de dias de viagem
				calculoDiasViagem($("[name=viagemDe]").val(), $(
					"[name=viagemPara]").val());
			}
		});
}

function validarPreenchimentoDias() {
	var dataInicial = $("[name=viagemDe]").val();
	var dataFinal = $("[name=viagemPara]").val();
	var validacao = true;

	if (dataInicial != '' && dataFinal != '') {
		var date1 = new Date(dataInicial.substr(6, 4),
			dataInicial.substr(3, 2) - 1, dataInicial.substr(0, 2));
		var date2 = new Date(dataFinal.substr(6, 4),
			dataFinal.substr(3, 2) - 1, dataFinal.substr(0, 2));

		if (date1 > date2) {
			FLUIGC.message.alert({
				message: "'Período de Viagem De' informado é superior ao 'Período de Viagem até' favor informar uma data válida",
				title: "Atenção",
				label: "OK"
			});
			validacao = false;
		}
	}

	return validacao;
}

// Calcular os dias e gravar no Hidden
function calculoDiasViagem(dataInicial, dataFinal) {
	if (dataInicial != '' && dataFinal != '') {
		var date1 = new Date(dataInicial.substr(6, 4),
			dataInicial.substr(3, 2) - 1, dataInicial.substr(0, 2));

		var date2 = new Date(dataFinal.substr(6, 4),
			dataFinal.substr(3, 2) - 1, dataFinal.substr(0, 2));

		var diferenca = Math.ceil((date2.getTime() - date1.getTime()) / 1000 /
			60 / 60 / 24);
		if (diferenca >= 0) {
			diferenca++;
		}

		$("[name=diasViagemReembolso]").val(diferenca).change();
	}
}

/*
 * Reembolso
 */
function calcularValorItemReembolso(objParametro) {
	var itemPos = retornarPos(objParametro);
	var codigoDespesa = $("[name=codigoDespesa" + underline + itemPos + "]").val();

	calcularValorReembolso(codigoDespesa);
}

function calcularValorTodosReembolso() {
	zerarResumoDasDespesas();

	var codigoDespesaTemp = 0;

	$("[name^=codigoDespesa" + underline + "]").each(function () {
		var codigoDespesa = $(this).val();

		if (codigoDespesaTemp != codigoDespesa) {
			calcularValorReembolso(codigoDespesa);

			codigoDespesaTemp = codigoDespesa;
		}
	});
}

function calcularValorReembolso(codigoDespesa) {
	//var valorCheckedGestor = $("#infoDentroPoliticaHidden").val();
	var opcao = codigoDespesa;
	//if(valorCheckedGestor == 1) {
	//	opcao = "00";
	//}

	switch (opcao) {
		// Combustivel
		case '02':
			calcularReembolsoCombustivel(codigoDespesa);
			break;
			// Lavanderia
		case '06':
			calcularReembolsoLavanderia(codigoDespesa);
			break;
			// Demais calculos de min e max
		default:
			calcularReembolsoPadrao(codigoDespesa);
			break;
	}

	// Exibe ou oculta os item do reembolso
	controleTelaResumoDasDespesas();

	// Recalcula os totais do reembolso
	calcularValorTotalReembolso();
}

function calcularReembolsoCombustivel(codigoDespesa) {
	var somaCategoria = 0;

	$("[name^=codigoDespesa" + underline + "]").each(function () {
		var itemPos = retornarPos($(this));
		var valorCodigoDespesa = $(this).val();

		if (codigoDespesa == valorCodigoDespesa) {
			var valorMax = $("[name=valorMax" + underline + itemPos + "]").val();
			var valorDespesas = $("[name=valorDespesas" + underline + itemPos + "]").val();
			somaCategoria += valorMax * valorDespesas;
		}
	});

	var nameCategoria = $(".resumoDasDespesas[codigodespesa='" + codigoDespesa + "']").attr("name");

	$("[name=" + nameCategoria + "]").val(somaCategoria.toFixed(2));
}

function calcularReembolsoLavanderia(codigoDespesa) {
	var diasViagemReembolso = $("[name=diasViagemReembolso]").val();
	var somaCategoria = 0;

	$("[name^=codigoDespesa" + underline + "]").each(function () {
		var itemPos = retornarPos($(this));
		var valorCodigoDespesa = $(this).val();

		if (codigoDespesa == valorCodigoDespesa) {
			var diasMin = $("[name=diasMin" + underline + itemPos + "]").val();

			if (parseInt(diasViagemReembolso) >= parseInt(diasMin)) {
				var valorDespesas = parseFloat($("[name=valorDespesas" + underline + itemPos + "]").val());
				
				var valorMax = parseFloat($("[name=valorMax" + underline + itemPos + "]").val());
				
				var valorMaximo = parseInt(diasViagemReembolso) * valorMax; // andre severino
				
				if (valorDespesas > valorMaximo) {
					somaCategoria += valorMaximo;
				}else{					
					somaCategoria += valorDespesas;
				}
				

			}
		}
	});

	var nameCategoria = $(".resumoDasDespesas[codigodespesa='" + codigoDespesa + "']").attr("name");

	$("[name=" + nameCategoria + "]").val(somaCategoria.toFixed(2));
}

/* aqui calculo reembolso */
function calcularReembolsoPadrao(codigoDespesa) {
	var somaCategoria = 0;
	$("[name^=codigoDespesa" + underline + "]").each(function () {
		var itemPos = retornarPos($(this));
		var valorCodigoDespesa = $(this).val();

		if (codigoDespesa == valorCodigoDespesa) {
			var valorDespesas = parseFloat($("[name=valorDespesas" + underline + itemPos + "]").val());
			var funcOncoclinicas = ($("[name=tipoDeColaboradorHidden]").val() != "tercerizado");
			var valorIlimitado = $("[name=valorIlimitado" + underline + itemPos + "]").val();

			var valorCheckedGestor = $("#infoDentroPoliticaHidden").val();

			if (codigoDespesa == "08") { // despesa internacional				
				somaCategoria += calcularReembolsoDolar(valorDespesas, itemPos, valorIlimitado, funcOncoclinicas);
			} else if (valorCheckedGestor == 1) {
				somaCategoria += calcularReembolsoPadraoIlimitado(valorDespesas);
			} else {
				somaCategoria += calcularReembolsoPadraoLimitado(valorDespesas, itemPos, valorIlimitado, funcOncoclinicas);
			}

		}
	});


	var nameCategoria = $(".resumoDasDespesas[codigodespesa='" + codigoDespesa + "']").attr("name");

	$("[name=" + nameCategoria + "]").val(somaCategoria.toFixed(2));
}

function calcularReembolsoPadraoIlimitado(valorDespesas) {
	return (valorDespesas == '' || valorDespesas == undefined || valorDespesas == null || valorDespesas == "NaN" || isNaN(valorDespesas)) ? 0 : valorDespesas;
}

function calcularReembolsoPadraoLimitado(valorDespesas, itemPos, valorIlimitado, funcOncoclinicas) {
	var somaCategoria = 0;
	var valorMin = parseFloat($("[name=valorMin" + underline + itemPos + "]").val());
	var valorMax = parseFloat($("[name=valorMax" + underline + itemPos + "]").val());
	var valorFinalDeSemana = $("[name=valorFinalDeSemana" + underline + itemPos + "]").val();

	var valorParcial = 0;
	var minParcial = (funcOncoclinicas && valorFinalDeSemana == 0) ? valorMin : 0;

	if (valorDespesas > minParcial) {
		if (valorDespesas >= valorMax) {
			valorParcial = valorMax - minParcial;
		} else {
			valorParcial = valorDespesas - minParcial;
		}


		somaCategoria += valorParcial;
	}

	return somaCategoria;
}

function calcularReembolsoDolar(valorDespesas, itemPos, valorIlimitado, funcOncoclinicas) {
	var somaCategoria = 0;
	var valorMin = parseFloat($("[name=valorMin" + underline + itemPos + "]").val());
	var valorMax = parseFloat($("[name=valorMax" + underline + itemPos + "]").val());
	var valorFinalDeSemana = $("[name=valorFinalDeSemana" + underline + itemPos + "]").val();
	var cotacao = $("#cotacaoDolar").val();

	var valorParcial = 0;
	var minParcial = (funcOncoclinicas && valorFinalDeSemana == 0) ? valorMin : 0;

	if (valorDespesas > minParcial) {
		if (valorDespesas >= valorMax) {
			valorParcial = valorMax - minParcial;
		} else {
			valorParcial = valorDespesas - minParcial;
		}


		somaCategoria += valorParcial * cotacao;
	}

	return somaCategoria;
}

function calcularValorTotalReembolso() {
	var totalDasDespesas = 0;

	$("input.resumoDasDespesas").each(function () {
		var valor = $(this).val();

		valor = (valor == '' || valor == undefined || valor == null || valor == "NaN" || isNaN(valor)) ? 0 : valor;

		totalDasDespesas += parseFloat(valor);
	});

	// Gravar no campo
	$("[name=totalDasDespesas]").val(totalDasDespesas.toFixed(2));

	var adiantamentoRecebido = $("[name=adiantamentoRecebido]").val();

	if (adiantamentoRecebido == '') {
		adiantamentoRecebido = 0;

		$("[name=adiantamentoRecebido]").val(adiantamentoRecebido.toFixed(2));
	}

	var saldoTotalReembolso = parseFloat(totalDasDespesas) - parseFloat(adiantamentoRecebido);
	// Gravar no campo
	$("[name=saldoTotalReembolso]").val(saldoTotalReembolso.toFixed(2));

	if (saldoTotalReembolso >= 0) {
		$(".msgValorPositivo").show();
		$(".msgValorNegativo").hide();
	} else {
		$(".msgValorPositivo").hide();
		$(".msgValorNegativo").show();
	}
	if ($("#tipoSolicitacaoHidden").val() == "reembolso") {
		$("[name=E2_VALOR_TOTAL]").val(saldoTotalReembolso);
	}
}

function zerarResumoDasDespesas() {
	var zero = 0;
	zero.toFixed(2);

	$("input.resumoDasDespesas").each(function () {
		$(this).val(zero);
	});
}

function controleTelaItemReembolso() {
	$("[name^='dataDespesas" + underline + "']").focus(function () {
		dataAnterior = $(this).val();
	}).bind("change", function () {
		if (!validarData($(this)) || !validacaoItemReembolso($(this))) {
			$(this).val(dataAnterior);
			return false;
		} else {
			/* calculo fds */
			var dataString = $(this).val();
			var dataArray = dataString.split("/");
			var dia = dataArray[0];
			var mes = dataArray[1] - 1;
			var ano = dataArray[2];
			var dataAtual = new Date(ano, mes, dia);
			var diaSelecionado = dataAtual.getDay();
			var codigoTableName = retornarPos($(this));

			var diaFimSemana = (diaSelecionado == '0' || diaSelecionado == '6') ? 1 : 0;
			$("[name='valorFinalDeSemana" + underline + codigoTableName + "']").val(diaFimSemana);
			controleTelaValorItem($(this));
		}
	});

	$("[name^='tipoDeDespesas" + underline + "']").change(function () {
		limparCampoValorReembolso($(this));

		if (!validacaoItemReembolso($(this))) {
			//bloquearCampoValor($(this));

			limparCampoTipoDeDespesa($(this));

			// recalcular todos
			calcularValorTodosReembolso();
		} else {
			//liberarCampoValor($(this));

			// Busca os demais dados necessários para o calculo do
			// reembolso
			buscarDemaisDadosReembolso($(this));
		}

		controleTelaValorItem($(this));

	});
	$("[name^='selectTipoDeDespesa" + underline + "']").change(function () {
		var indice = retornarPos($(this));
		$("[name='codtipoDeDespesas" + underline + "" + indice + "']").val(buscaCodigoDespesa(indice)).change();
		$("[name='tipoDeDespesas" + underline + "" + indice + "']").val(buscaNomeDespesa(indice)).change();
		$("#espelhoSelectTipoDeDespesa" + underline + "" + indice + "").val($(this).val());

	});

	$("[name^='valorDespesas" + underline + "']").change(function () {
		calcularValorItemReembolso($(this));
	});

	//#FLUIG-45 - Código que garante que toda vez que a data da despesa for alterada o valor da mesma vai ser recalculado.
	$("[name^='dataDespesas" + underline + "']").change(function () {
		calcularValorItemReembolso($(this));
	});

	$("[name^='valorDespesas" + underline + "']").blur(function () {
		/// GLPI 137490 - Thiago Della Giustina
		calcularValorItemReembolso($(this));
		var val = $(this).val();
		if (val == "0.00")
			$(this).val("");
	});

	$("[name='diasViagemReembolso" + underline + "']").change(function () {
		calcularValorTodosReembolso();
	});
}

function controleTelaValorItem(objParametro) {
	var itemPos = retornarPos(objParametro);
	var itemData = $("[name='dataDespesas" + underline + itemPos + "']").val();
	var itemTipo = $("[name='tipoDeDespesas" + underline + itemPos + "']").val();

	var objValorDespesa = $("[name='valorDespesas" + underline + itemPos + "']");

	if (itemData != "" && itemTipo != "") {
		//liberarCampoValor($(this));
		objValorDespesa.removeAttr('readonly');
		setarMascaraValor(itemPos);
	} else {
		//bloquearCampoValor($(this));
		objValorDespesa.attr("readonly", "readonly");
		objValorDespesa.maskMoney('destroy');
	}
}

function liberarCampoValor(objParametro) {
	var itemPos = retornarPos(objParametro);

	$("[name='valorDespesas" + underline + itemPos + "']").removeAttr('readonly');
}

function bloquearCampoValor(objParametro) {
	var itemPos = retornarPos(objParametro);

	$("[name='valorDespesas" + underline + itemPos + "']").attr("readonly", "readonly");
}

function limparCampoValorReembolso(objDespesa) {
	var itemPos = retornarPos(objDespesa);
	$("[name='valorDespesas" + underline + itemPos + "']").val("").change();
}

function setarMascaraValor(itemPos) {
	var codigoDespesa = $("[name=codigoDespesa" + underline + itemPos + "]").val();

	/// GLPI 137490 - Thiago Della Giustina
	$("[name='valorDespesas" + underline + itemPos + "']").unbind('.maskMoney');

	// Combustível
	if (codigoDespesa == '02') {
		setMaskMoney('valorDespesas' + underline + itemPos + '', 0);
	} else {
		setMaskMoney('valorDespesas' + underline + itemPos + '', 2);
	}
}

/**
 * Método para incluir a mascara monet�ria, sendo informada o número de digitos
 * desejado
 *
 * @param nameCampo
 * @param digitos
 * @author sergio.santos
 */
function setMaskMoney(nameCampo, digitos) {
	var simboloDecimal = (digitos == 0) ? "" : ".";

	$("[name='" + nameCampo + "']").maskMoney({
		showSymbol: true,
		symbol: "",
		decimal: simboloDecimal,
		thousands: "",
		precision: digitos
	});
}

// Limpar todos os campos que são puxados via dataSet
function limparCampoTipoDeDespesa(objDespesa) {
	var itemPos = retornarPos(objDespesa);

	$("[name=codtipoDeDespesas" + underline + itemPos + "]").val("");
	$("[name=codigoDespesa" + underline + itemPos + "]").val("");
	$("[name=tipoDeDespesas" + underline + itemPos + "]").val("");
}

function retornarPos(obj) {
	var nome = obj.attr("name");
	return nome.split(underline)[1];
}

function validacaoItemReembolso(objParametro) {
	var itemPos = retornarPos(objParametro);
	var itemData = $("[name='dataDespesas" + underline + itemPos + "']").val();

	//if(itemData == "")
	//	return false;

	var itemCodigo = $("[name='codtipoDeDespesas" + underline + itemPos + "']").val();
	var validacao = true;

	$("[name^='tipoDeDespesas" + underline + "']").each(function () {
		var thisPos = retornarPos($(this));

		if (thisPos != itemPos) {
			var thisData = $("[name='dataDespesas" + underline + thisPos + "']").val();
			var thisCodigo = $("[name='codtipoDeDespesas" + underline + thisPos + "']").val();

			if (validarIgualdade(itemData, thisData) && validarIgualdade(itemCodigo, thisCodigo)) {
				FLUIGC.message.alert({
					message: "Não permitido repetir a mesma data e despesa",
					title: "Atenção",
					label: "OK"
				});
				validacao = false;
				return false;
			}
		}
	});

	return validacao;
}

function validarIgualdade(dado1, dado2) {
	return (dado1 == dado2);
}

function validarData(objData) {
	var dataDespesa = objData.val();
	var dataInicial = $("[name=viagemDe]").val();
	var dataFinal = $("[name=viagemPara]").val();
	var data30Dias = new Date();
	data30Dias.setDate(data30Dias.getDate() - 60);
	data30Dias.setHours(0, 0, 0);

	var objDataDespesa = new Date(dataDespesa.substr(6, 4), dataDespesa.substr(
		3, 2) - 1, dataDespesa.substr(0, 2));
	var objDataInicial = new Date(dataInicial.substr(6, 4), dataInicial.substr(
		3, 2) - 1, dataInicial.substr(0, 2));
	var objDataFinal = new Date(dataFinal.substr(6, 4),
		dataFinal.substr(3, 2) - 1, dataFinal.substr(0, 2));

	if (objDataInicial > objDataDespesa) {
		FLUIGC.message.alert({
			title: "Atenção",
			message: "Data da despesa inválida considerando as datas informadas no 'Período de Viagem'. Favor inserir uma data válida ou alterar as datas informadas no campo 'Período de Viagem'",
			label: "OK"
		});
		return false;
	} else if (objDataFinal < objDataDespesa) {
		FLUIGC.message.alert({
			title: "Atenção",
			message: "Data informada é superior a data do Período de Viagem",
			label: "OK"
		});
		return false;
	} else if (data30Dias > objDataDespesa) {
		FLUIGC.message.alert({
			title: "Atenção",
			message: "Data da despesa não poderá ultrapassar dois meses para realizar a solicitação de reembolso",
			label: "OK"
		});
	} else {
		return true;
	}
}

function removeMascaraMonetaria(mask) {
	if (mask != undefined) {
		mask = mask.replace('R$', '');
		mask = mask.replace(' ', '');
		mask = mask = mask.replace(/[\.]/g, '');
		mask = mask.replace(',', '.');
		return parseFloat(mask);
	} else {
		return 0.00;
	}
}

function buscaCodigoDespesa(indice) {
	var valorDespesa = $("#selectTipoDeDespesa___" + indice + " option:selected").val();
	return valorDespesa.slice(0, 2);
}

function buscaNomeDespesa(indice) {
	var valorDespesa = $("#selectTipoDeDespesa___" + indice + " option:selected").val();
	valorDespesa = valorDespesa.split("-")[1].trim();
	return valorDespesa;
}


function buscarDemaisDadosReembolso(objValorDespesas) {
	var itemPos = retornarPos(objValorDespesas);
	var codTipoDespesa = buscaCodigoDespesa(itemPos);		
	
	var cidade = $("[name=infCidadeColaboradorHidden]").val(); // andre
	var tipo = $("#tpReembolso").val();	
	
	var constraintPai = DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST);
    var datasetPai = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(constraintPai), null).values;
    
    if (cidade == "0" && tipo == "1"){
    
        for (var i in datasetPai) {           
            var c1 = DatasetFactory.createConstraint("tablename", "tbLocaisDentro", "tbLocaisDentro", ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
            var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST); 
            var c4 = DatasetFactory.createConstraint("codigo", codTipoDespesa, codTipoDespesa, ConstraintType.MUST);
            var ds_tipoDeDespesa = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(c1, c2, c3,c4), null).values; 
        }
        
        var codigoDespesa = ds_tipoDeDespesa[0].codigoDespesa;
    	var valorMin = ds_tipoDeDespesa[0].valorMin;
    	var valorMax = ds_tipoDeDespesa[0].valorMax;
    	var diasMin = ds_tipoDeDespesa[0].diasMin;
    	var valorIlimitado = ds_tipoDeDespesa[0].valorIlimitado;
    	var labelParametro = ds_tipoDeDespesa[0].parametro;

    	$("[name=codigoDespesa" + underline + itemPos + "]").val(codigoDespesa);
    	$("[name=diasMin" + underline + itemPos + "]").val(diasMin);
    	$("[name=valorIlimitado" + underline + itemPos + "]").val(valorIlimitado);
    	$("[name=valorMax" + underline + itemPos + "]").val(valorMax);
    	if (labelParametro == 'Almoço') { //Adiantamento de reembolso os valores de almoco são setados através de outro dataset
    		var valorAlmoco = removeMascaraMonetaria($("[name=valorAlmocoReembolso]").val());
    		//$("[name=valorMin" + underline + itemPos + "]").val(valorAlmoco); andre
    		$("[name=valorMin" + underline + itemPos + "]").val(valorMin);
    	} else {
    		$("[name=valorMin" + underline + itemPos + "]").val(valorMin);
    	}  		
    }
    
    else if (cidade == "1" && tipo == "1"){
        
        for (var i in datasetPai) {           
            var c1 = DatasetFactory.createConstraint("tablename", "tbLocaisFora", "tbLocaisFora", ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
            var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST); 
            var c4 = DatasetFactory.createConstraint("codigo_f", codTipoDespesa, codTipoDespesa, ConstraintType.MUST);
            var ds_tipoDeDespesa = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(c1, c2, c3,c4), null).values; 
        }
        
        var codigoDespesa = ds_tipoDeDespesa[0].codigoDespesa_f;
    	var valorMin = ds_tipoDeDespesa[0].valorMin_f;
    	var valorMax = ds_tipoDeDespesa[0].valorMax_f;
    	var diasMin = ds_tipoDeDespesa[0].diasMin_f;
    	var valorIlimitado = ds_tipoDeDespesa[0].valorIlimitado_f;
    	var labelParametro = ds_tipoDeDespesa[0].parametro_f;

    	$("[name=codigoDespesa" + underline + itemPos + "]").val(codigoDespesa);
    	$("[name=diasMin" + underline + itemPos + "]").val(diasMin);
    	$("[name=valorIlimitado" + underline + itemPos + "]").val(valorIlimitado);
    	$("[name=valorMax" + underline + itemPos + "]").val(valorMax);
    	if (labelParametro == 'Almoço') { //Adiantamento de reembolso os valores de almoco são setados através de outro dataset
    		var valorAlmoco = removeMascaraMonetaria($("[name=valorAlmocoReembolso]").val());
    		//$("[name=valorMin" + underline + itemPos + "]").val(valorAlmoco); andre
    		$("[name=valorMin" + underline + itemPos + "]").val(valorMin);
    	} else {
    		$("[name=valorMin" + underline + itemPos + "]").val(valorMin);
    	}  		
    }
    
    else if (cidade == "1" && tipo == "2"){
        
        for (var i in datasetPai) {           
            var c1 = DatasetFactory.createConstraint("tablename", "tbViagem", "tbViagem", ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
            var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST); 
            var c4 = DatasetFactory.createConstraint("codigo_v", codTipoDespesa, codTipoDespesa, ConstraintType.MUST);
            var ds_tipoDeDespesa = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(c1, c2, c3,c4), null).values; 
        }
        
        var codigoDespesa = ds_tipoDeDespesa[0].codigoDespesa_v;
    	var valorMin = ds_tipoDeDespesa[0].valorMin_v;
    	var valorMax = ds_tipoDeDespesa[0].valorMax_v;
    	var diasMin = ds_tipoDeDespesa[0].diasMin_v;
    	var valorIlimitado = ds_tipoDeDespesa[0].valorIlimitado_v;
    	var labelParametro = ds_tipoDeDespesa[0].parametro_v;

    	$("[name=codigoDespesa" + underline + itemPos + "]").val(codigoDespesa);
    	$("[name=diasMin" + underline + itemPos + "]").val(diasMin);
    	$("[name=valorIlimitado" + underline + itemPos + "]").val(valorIlimitado);
    	$("[name=valorMax" + underline + itemPos + "]").val(valorMax);
    	if (labelParametro == 'Almoço') { //Adiantamento de reembolso os valores de almoco são setados através de outro dataset
    		var valorAlmoco = removeMascaraMonetaria($("[name=valorAlmocoReembolso]").val());
    		//$("[name=valorMin" + underline + itemPos + "]").val(valorAlmoco); andre
    		$("[name=valorMin" + underline + itemPos + "]").val(valorMin);
    	} else {
    		$("[name=valorMin" + underline + itemPos + "]").val(valorMin);
    	}  		
    }
    
    else if (cidade == "0" && tipo == "3"){
        
        for (var i in datasetPai) {           
            var c1 = DatasetFactory.createConstraint("tablename", "tbCursos", "tbCursos", ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
            var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST); 
            var c4 = DatasetFactory.createConstraint("codigo_c", codTipoDespesa, codTipoDespesa, ConstraintType.MUST);
            var ds_tipoDeDespesa = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(c1, c2, c3,c4), null).values; 
        }
        
        var codigoDespesa = ds_tipoDeDespesa[0].codigoDespesa_c;
    	var valorMin = ds_tipoDeDespesa[0].valorMin_c;
    	var valorMax = ds_tipoDeDespesa[0].valorMax_c;
    	var diasMin = ds_tipoDeDespesa[0].diasMin_c;
    	var valorIlimitado = ds_tipoDeDespesa[0].valorIlimitado_c;
    	var labelParametro = ds_tipoDeDespesa[0].parametro_c;

    	$("[name=codigoDespesa" + underline + itemPos + "]").val(codigoDespesa);
    	$("[name=diasMin" + underline + itemPos + "]").val(diasMin);
    	$("[name=valorIlimitado" + underline + itemPos + "]").val(valorIlimitado);
    	$("[name=valorMax" + underline + itemPos + "]").val(valorMax);
    	if (labelParametro == 'Almoço') { //Adiantamento de reembolso os valores de almoco são setados através de outro dataset
    		var valorAlmoco = removeMascaraMonetaria($("[name=valorAlmocoReembolso]").val());
    		//$("[name=valorMin" + underline + itemPos + "]").val(valorAlmoco); andre
    		$("[name=valorMin" + underline + itemPos + "]").val(valorMin);
    	} else {
    		$("[name=valorMin" + underline + itemPos + "]").val(valorMin);
    	}  		
    }
    else{
    	
    	for (var i in datasetPai) {           
            var c1 = DatasetFactory.createConstraint("tablename", "tbForaPolitica", "tbForaPolitica", ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
            var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST); 
            var c4 = DatasetFactory.createConstraint("codigo_fp", codTipoDespesa, codTipoDespesa, ConstraintType.MUST);
            var ds_tipoDeDespesa = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(c1, c2, c3,c4), null).values; 
        }
        
        var codigoDespesa = ds_tipoDeDespesa[0].codigoDespesa_fp;
    	var valorMin = ds_tipoDeDespesa[0].valorMin_fp;
    	var valorMax = ds_tipoDeDespesa[0].valorMax_fp;
    	var diasMin = ds_tipoDeDespesa[0].diasMin_fp;
    	var valorIlimitado = ds_tipoDeDespesa[0].valorIlimitado_fp;
    	var labelParametro = ds_tipoDeDespesa[0].parametro_fp;

    	$("[name=codigoDespesa" + underline + itemPos + "]").val(codigoDespesa);
    	$("[name=diasMin" + underline + itemPos + "]").val(diasMin);
    	$("[name=valorIlimitado" + underline + itemPos + "]").val(valorIlimitado);
    	$("[name=valorMax" + underline + itemPos + "]").val(valorMax);
    	if (labelParametro == 'Almoço') { //Adiantamento de reembolso os valores de almoco são setados através de outro dataset
    		var valorAlmoco = removeMascaraMonetaria($("[name=valorAlmocoReembolso]").val());
    		//$("[name=valorMin" + underline + itemPos + "]").val(valorAlmoco); andre
    		$("[name=valorMin" + underline + itemPos + "]").val(valorMin);
    	} else {
    		$("[name=valorMin" + underline + itemPos + "]").val(valorMin);
    	}  	
    	
    	
    	
    }
	
		
	
	
	// fim testes
	
	
	
	
	
	
	
	
	
	
	
}




function controleTelaResumoDasDespesas() {
	$("input.resumoDasDespesas").each(function () {
		var valor = $(this).val();
		var codigodespesa = $(this).attr("codigodespesa");

		if (valor == '' || valor == '0.00' || valor == '0') {
			$(".resumoDasDespesas_" + codigodespesa).hide();
		} else {
			$(".resumoDasDespesas_" + codigodespesa).show();
		}
	});
}

function validarDespesaPreenchida() {
	dataDespesas = $("[name^=dataDespesas" + underline + "]");

	var validacao = true;

	if (dataDespesas.length > 1) {
		validacao = false;
	} else {
		tipoDeDespesas = $("[name^=tipoDeDespesas" + underline + "]");

		var valorDataDespesas = dataDespesas.val();
		var valorTipoDeDespesas = tipoDeDespesas.val();

		if (valorDataDespesas != undefined && valorDataDespesas != '') {
			validacao = false;
		} else if (valorTipoDeDespesas != undefined &&
			valorTipoDeDespesas != '') {
			validacao = false;
		}
	}

	return validacao;
}

/*
function validarFlagGestor() {
	var usuarioLogado = buscarUsuarioLogado();
	// buscar empresa
	var empresa = buscaEmpresa();
	grupoGestor = false;
	// busca grupos do usuarios logado

	var pegarIdUsuarioLogado = DatasetFactory.createConstraint(
			"colleagueGroupPK.colleagueId", usuarioLogado, usuarioLogado,
			ConstraintType.MUST); // filtro
	var pegarIdCompanhia = DatasetFactory
			.createConstraint("colleagueGroupPK.companyId", empresa, empresa,
					ConstraintType.MUST); // filtro
	var constraints = new Array(pegarIdUsuarioLogado, pegarIdCompanhia); // Array
	// com
	// os
	// objetos
	// filtro
	var sortingFields = new Array(); // Array de ordenacao
	var fields = new Array(); // Campos que eu quero que sejam retornados pelo
	// dataset
	var dataset = DatasetFactory.getDataset("colleagueGroup", fields,
			constraints, sortingFields);
	if (dataset.values.length >= 1) {
		for (var x = 0; x < dataset.values.length; x++) {
			var colunaGroupId = contornarMigracao136_137('colleagueGroupPK.groupId');
			if (dataset.values[x][colunaGroupId] == GROUP_ID_GESTOR) {
				grupoGestor = true;
			}
		}
	} else {
		grupoGestor = false;
	}
}
*/

function contornarMigracao136_137(campo) {
	// var prefixoCampo = campo.substring(0, campo.indexOf(".") + 1);
	// return prefixoCampo + campo;
	return campo;
}

/*
function habilitaFlagGestor() {
	if (grupoGestor) {
		habilitaCampoFlagGestor();
	} else {
		desabilitaCampoFlagGestor();
	}
}
function habilitaCampoFlagGestor() {
	var gerente = 1;
	$("#usuarioGerente").val(gerente);
	$(".habilitaCampoFlagGestor").show();

}
function desabilitaCampoFlagGestor() {
	var usuarioComum = 0;
	$("#usuarioGerente").val(usuarioComum);
	$(".habilitaCampoFlagGestor").hide();
}
*/

function pegarValorDoBotaoCheckIlimitado() {

	$("[name=infoDentroPolitica]").click(function () {
		var option = $(this).filter(':checked').val();
		/*
		switch(option) {
			case "S":
				$("#infoDentroPoliticaHidden").val(0); // Dentro da politica
				break;
			case "N":
				$("#infoDentroPoliticaHidden").val(1); // Fora da politica
				break;
			default:
				$("#infoDentroPoliticaHidden").val("");
				break;
		}
		*/
		$("#infoDentroPoliticaHidden").val(option);
	});
}

function validarCheckFDS() {

	$("#flagValidaFDS").click(function () {
		if ($(this).prop("checked") == true) {
			var setarValorHiddenGestor = 1;
			$("#flagValidaFDSHidden").val(setarValorHiddenGestor);
			$("#diasViagem").val("0");
			limparCampoQuandoClicado();

		} else if ($(this).prop("checked") == false) {
			var setarValorHiddenUsuarioComum = 0;
			$("#flagValidaFDSHidden").val(setarValorHiddenUsuarioComum);
			$("#diasViagem").val("0");
			limparCampoQuandoClicado();
		}

	});

}

function bindChangeAceiteSolucao() {
	$("input[name='aceite']").change(function () {
		if ($(this).val() == "N") {
			$(".reqCompSolicitente").show();
			$(".oculto").hide();
			
		} else {
			$(".reqCompSolicitente").hide();
			$(".oculto").show();
			
		}
	});
}

function ocultarMsgNovaSc() {
	var x = $("#aceiteSim:checked").val();
	if (x == "S") {
		$(".oculto").show();
	}
}

function carregaSelectTipoDespesas() {
	var valorAlmoco = $("[name=valorAlmocoReembolso]").val();
	var cidade = $("[name=infCidadeColaboradorHidden]").val(); // andre
	var tipo = $("#tpReembolso").val();
	var tabela = "";
	//var cidade = $("#informacaoCidadeColaborador").val();
	if (!isEmpty(valorAlmoco)) {
		valorAlmoco = removeMascaraMonetaria(valorAlmoco).toFixed(2);
		/*var c1 = DatasetFactory.createConstraint("valorAlmoco", valorAlmoco, valorAlmoco, ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("cidade", cidade, cidade, ConstraintType.MUST);
		var c3 = DatasetFactory.createConstraint("tipo", tipo, tipo, ConstraintType.MUST);
		var ds_tipoDeDespesa = DatasetFactory.getDataset('tipoDeDespesaReembolso', null, new Array(c1, c2, c3), null); // andre*/						
		
		var constraintPai = DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST);
        var datasetPai = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(constraintPai), null).values;
        
        if (cidade == "0" && tipo == "1"){
        
	        for (var i in datasetPai) {
	            //Cria as constraints para buscar os campos filhos, passando o tablename, número da ficha e versão (no caso a última).
	            var c1 = DatasetFactory.createConstraint("tablename", "tbLocaisDentro", "tbLocaisDentro", ConstraintType.MUST);
	            var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
	            var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST); 
	            var ds_tipoDeDespesa = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(c1, c2, c3), null).values; 
	        }
	        
	        $("#selectTipoDeDespesa, [name^='selectTipoDeDespesa___']:first").empty().append('<option selected="selected" disabled value="">---</option>');
			for (var i = 0; i < ds_tipoDeDespesa.length; i++) {
				$("#selectTipoDeDespesa, [name^='selectTipoDeDespesa___']:first").append($('<option>', {
					value: ds_tipoDeDespesa[i].codigo + " - " + ds_tipoDeDespesa[i].parametro + " - " + ds_tipoDeDespesa[i].valorExibicao,
					text: ds_tipoDeDespesa[i].codigo + " - " + ds_tipoDeDespesa[i].parametro + " - " + ds_tipoDeDespesa[i].valorExibicao
				}));			
			}
			
        }else if (cidade == "1" && tipo == "1"){
        	
        	for (var i in datasetPai) {
	            //Cria as constraints para buscar os campos filhos, passando o tablename, número da ficha e versão (no caso a última).
	            var c1 = DatasetFactory.createConstraint("tablename", "tbLocaisFora", "tbLocaisFora", ConstraintType.MUST);
	            var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
	            var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST); 
	            var ds_tipoDeDespesa = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(c1, c2, c3), null).values; 
	        }
	        
	        $("#selectTipoDeDespesa, [name^='selectTipoDeDespesa___']:first").empty().append('<option selected="selected" disabled value="">---</option>');
			for (var i = 0; i < ds_tipoDeDespesa.length; i++) {
				$("#selectTipoDeDespesa, [name^='selectTipoDeDespesa___']:first").append($('<option>', {
					value: ds_tipoDeDespesa[i].codigo_f + " - " + ds_tipoDeDespesa[i].parametro_f + " - " + ds_tipoDeDespesa[i].valorExibicao_f,
					text: ds_tipoDeDespesa[i].codigo_f + " - " + ds_tipoDeDespesa[i].parametro_f + " - " + ds_tipoDeDespesa[i].valorExibicao_f
				}));			
			}
        	
        }else if (cidade == "1" && tipo == "2"){ // viagem
        	
        	for (var i in datasetPai) {
	            //Cria as constraints para buscar os campos filhos, passando o tablename, número da ficha e versão (no caso a última).
	            var c1 = DatasetFactory.createConstraint("tablename", "tbViagem", "tbViagem", ConstraintType.MUST);
	            var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
	            var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST); 
	            var ds_tipoDeDespesa = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(c1, c2, c3), null).values; 
	        }
	        
	        $("#selectTipoDeDespesa, [name^='selectTipoDeDespesa___']:first").empty().append('<option selected="selected" disabled value="">---</option>');
			for (var i = 0; i < ds_tipoDeDespesa.length; i++) {
				$("#selectTipoDeDespesa, [name^='selectTipoDeDespesa___']:first").append($('<option>', {
					value: ds_tipoDeDespesa[i].codigo_v + " - " + ds_tipoDeDespesa[i].parametro_v + " - " + ds_tipoDeDespesa[i].valorExibicao_v,
					text: ds_tipoDeDespesa[i].codigo_v + " - " + ds_tipoDeDespesa[i].parametro_v + " - " + ds_tipoDeDespesa[i].valorExibicao_v
				}));			
			}
			
		}else if (cidade == "0" && tipo == "3"){ // cursos
			
			for (var i in datasetPai) {
	            //Cria as constraints para buscar os campos filhos, passando o tablename, número da ficha e versão (no caso a última).
	            var c1 = DatasetFactory.createConstraint("tablename", "tbCursos", "tbCursos", ConstraintType.MUST);
	            var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
	            var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST); 
	            var ds_tipoDeDespesa = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(c1, c2, c3), null).values; 
	        }
	        
	        $("#selectTipoDeDespesa, [name^='selectTipoDeDespesa___']:first").empty().append('<option selected="selected" disabled value="">---</option>');
			for (var i = 0; i < ds_tipoDeDespesa.length; i++) {
				$("#selectTipoDeDespesa, [name^='selectTipoDeDespesa___']:first").append($('<option>', {
					value: ds_tipoDeDespesa[i].codigo_c + " - " + ds_tipoDeDespesa[i].parametro_c + " - " + ds_tipoDeDespesa[i].valorExibicao_c,
					text: ds_tipoDeDespesa[i].codigo_c + " - " + ds_tipoDeDespesa[i].parametro_c + " - " + ds_tipoDeDespesa[i].valorExibicao_c
				}));			
			}
			
		}else{
			
			for (var i in datasetPai) {
	            //Cria as constraints para buscar os campos filhos, passando o tablename, número da ficha e versão (no caso a última).
	            var c1 = DatasetFactory.createConstraint("tablename", "tbForaPolitica", "tbForaPolitica", ConstraintType.MUST);
	            var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
	            var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST); 
	            var ds_tipoDeDespesa = DatasetFactory.getDataset("ds_despesasReembolso", null, new Array(c1, c2, c3), null).values; 
	        }
	        
	        $("#selectTipoDeDespesa, [name^='selectTipoDeDespesa___']:first").empty().append('<option selected="selected" disabled value="">---</option>');
			for (var i = 0; i < ds_tipoDeDespesa.length; i++) {
				$("#selectTipoDeDespesa, [name^='selectTipoDeDespesa___']:first").append($('<option>', {
					value: ds_tipoDeDespesa[i].codigo_fp + " - " + ds_tipoDeDespesa[i].parametro_fp + " - " + ds_tipoDeDespesa[i].valorExibicao_fp,
					text: ds_tipoDeDespesa[i].codigo_fp + " - " + ds_tipoDeDespesa[i].parametro_fp + " - " + ds_tipoDeDespesa[i].valorExibicao_fp
				}));			
			}
			
		}	
		
		
	} 
}

function setaExibicaoTipoDespesa() {
	if ((CURRENT_STATE == 0 ||
			CURRENT_STATE == ATIV_INICIAL ||
			CURRENT_STATE == CORRIGIR_REEMBOLSO ||
			CURRENT_STATE == ATIV_PREENCHE_FORM_REEMBOLSO) &&
		(FORM_MODE == 'ADD' || FORM_MODE == 'MOD')) {
		
		$("#nomeSolic").val(parent.WCMAPI.user);     
		$("#codSolic").val(parent.WCMAPI.userCode);
		$("#emailSolic").val(parent.WCMAPI.userEmail); 
		$("#dataSolicitacao").val(getDateAndHours()); 
		$("[id^=espelhoSelectTipoDeDespesa]").hide();
	} else {
		$("[id^=selectTipoDeDespesa]").hide();
	}
}

function buscaGestorCC() {
 	let centroCusto = $('#CTT_CUSTO').val()
 	var valor = $("#totalDasDespesas").val() != "" ? convertFloat($("#totalDasDespesas").val()) : convertFloat($("#valorTotal").val())  
 	
    if (centroCusto) {	   
        // defina as constraints para buscar o ds do pai
        var constraintPai = DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST);
        var datasetPai = DatasetFactory.getDataset("ds_alcadas_aprov_v2", null, new Array(constraintPai), null).values;
        for (var i in datasetPai) {
            //Cria as constraints para buscar os campos filhos, passando o tablename, número da ficha e versão (no caso a última).
            var c1 = DatasetFactory.createConstraint("tablename", "tbCentroCusto", "tbCentroCusto", ConstraintType.MUST);
            var c2 = DatasetFactory.createConstraint("metadata#id", datasetPai[i]['metadata#id'], datasetPai[i]['metadata#id'], ConstraintType.MUST);
            var c3 = DatasetFactory.createConstraint("metadata#version", datasetPai[i]["metadata#version"], datasetPai[i]["metadata#version"], ConstraintType.MUST);
            var c4 = DatasetFactory.createConstraint("CTT_CUSTO", centroCusto + ' ', centroCusto + ' ', ConstraintType.MUST);
            // // Busca o dataset
            var ds_centroCusto = DatasetFactory.getDataset("ds_alcadas_aprov_v2", null, new Array(c1, c2, c3, c4), null).values;
        }    	                        
        
        var ObjAprovadores = new Array();           
        if (ds_centroCusto.length > 0) {
            
        	var aprovador = new Object();
            aprovador.ID = ds_centroCusto[0]['usuarioGerenteCentro'];
            aprovador.NOME = ds_centroCusto[0]['usuarioGerenteCentroDesc']
            ObjAprovadores.push(aprovador);
            $("#codigoAprovador").val(aprovador.ID);            
           
            if (valor > convertFloat(ds_centroCusto[0]['valorGerenteCentro'])){
                var aprovador = new Object();
                aprovador.ID = ds_centroCusto[0]['usuarioGerenteCentro2'];
                aprovador.NOME = ds_centroCusto[0]['usuarioGerenteCentro2Desc']
                ObjAprovadores.push(aprovador);
                $("#codigoAprovador2").val(aprovador.ID);
            }            
            
            if (valor > convertFloat(ds_centroCusto[0]['valorGerenteCentro2'])){            		
            	var aprovador = new Object();
                aprovador.ID = ds_centroCusto[0]['usuarioDirOperacoesCentro'];
                aprovador.NOME = ds_centroCusto[0]['usuarioDirOperacoesCentroDesc']
                ObjAprovadores.push(aprovador);
                $("#codigoAprovador3").val(aprovador.ID);             
            }	       		        
        
        }
    }
}

function verificaCCExcecao(){	
	//11060102 - NOVOS NEGOCIOS e 11060103 - NOVOS NEGOCIOS JURIDICO	
	var cc = $("#CTT_CUSTO").val();	
	if (cc == "11060102" || cc == "11060103"){		
		return true;		
	}else{
		return false;
	}
		
}

function isEmpty(str) {
	if (str == '' || str == undefined || str == null) {
		return true;
	} else {
		return false;
	}
}

//Pega data de Prevista de Pagamento e deixa visível para o solicitante
function pegaDataAprovPrevista() {
	$("#aprovDataPrevista").change(function () {
		var dataPrevistaDoFinanceiro = $("#aprovDataPrevista").val();
		$("#dataPrevistaSolici").val(dataPrevistaDoFinanceiro).change();
	});
}

function getCotacaoDolar() {

	var dolar = "2";
	var c1 = DatasetFactory.createConstraint("CODIGO", dolar, dolar, ConstraintType.MUST);
	var dataset = DatasetFactory.getDataset('ds_moeda', null, new Array(c1), null);

	if ( dataset != undefined ){	
		if (dataset.values.length > 0) {	
			$("#cotacaoDolar").val(dataset.values[0].VALOR);	
		}
	}

}

function mensagemComConfirmacao(titulo, mensagem) {

    FLUIGC.message.alert({
        message: mensagem,
        title: titulo,
        label: 'OK'
    }, function(el, ev) {

    });
}

function removeMaskCpf(cpf){
	cpf = cpf.replaceAll(".","")
	cpf = cpf.replaceAll("-","")
	return cpf;
}

function addZero(x, n) {
    if (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
};

function getDateAndHours(){
	var now = new Date();
    var year = now.getFullYear();
    var month = addZero(now.getMonth() + 1, 2);
    var day = addZero(now.getDate(), 2);
	var hour = addZero(now.getHours(), 2);
	var min = addZero(now.getMinutes(), 2);
    var currentDate = day + '/' + month + '/' + year + " " + hour + ":" + min;
	return currentDate;    
}

function convertReal(string) {
	if (string != '0' && string != '' && string != undefined && string != NaN) {
		string = this.convertFloat(string)
		string = parseFloat(string).toFixed(2)
		string = string.split('.');
		string[0] = string[0].split(/(?=(?:...)*$)/).join('.');
		string.join(',');
		return "R$ " + string;
	} else {
		return 'R$ 0,00'
	}
}
// transforma um valor com mascara em um float sem mascara
function convertFloat(valor) {
	if (valor != 0 && valor != undefined && valor != null) {
		valor = valor.toString()
		if (valor.indexOf(',') != -1) {

			valor = valor.replace(/[R$.]/g, '');
			valor = valor.replace(',', '.');
			return parseFloat(valor);

		} else {

			valor = valor.replace(/[R$]/g, '');
			return parseFloat(valor);

		}
	}
	return 0;

}