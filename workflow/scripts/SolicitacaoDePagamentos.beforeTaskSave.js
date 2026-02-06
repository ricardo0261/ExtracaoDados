var gestorResponsavelId = "";

function beforeTaskSave(colleagueId, nextSequenceId, userList) {
	GETSLA();
	var atividadeAtual = getValue("WKNumState");
	var ATIVIDADE = getValue("WKNumState");
	//	var atribuirResponsavel = 43;

	var primeiraAtividade_1 = 0;
	var primeiraAtividade = 8;
	var servicoXML = 68;
	var inconsistenciaDados = 72;
	var avaliacaoGestor = 9;
	var swift_contratos = 170;

	var tipoPagamento = hAPI.getCardValue("tipoLancamento");
	var tipoLancamento = hAPI.getCardValue('zoomTipolancamento');

	/*
	if (nextSequenceId == ATRIBUIR_RESPONSAVEL) {
		definirGestorResponsavel();
	}
	*/
	 var anexos = hAPI.listAttachments();
	 var qtdAnexos = anexos.size();
	

	if (ATIVIDADE == primeiraAtividade && hAPI.getCardValue("viaWebService") == "false") {

		
		var temAnexo = false;

		if (anexos.size() > 0) {
			temAnexo = true;

			log.info("ENTREI NO ANEXO...");
		}

		var temAnexo2 = temAnexo;
		log.info("TEM ANEXO..." + temAnexo2);

		if (!temAnexo) {
			throw "É preciso anexar o documento para continuar o processo!";

			log.info("NÃO ENTREI NO ANEXO...");
		}

		//Valida no protheus se o Codigo do titilo já existe registrado.
		/*if (hAPI.getCardValue('numeroTitulo') != '' && hAPI.getCardValue('numeroTitulo') != null && hAPI.getCardValue('numeroTitulo') != undefined) {
			var constraintCodTitulo = [];
			var constraintNumero = DatasetFactory.createConstraint('NUMERO', hAPI.getCardValue('numeroTitulo'), hAPI.getCardValue('numeroTitulo'), ConstraintType.SHOULD);
			var constraintCodFornecedor = DatasetFactory.createConstraint('CODFORNECEDOR', hAPI.getCardValue('A2_COD'), hAPI.getCardValue('A2_COD'), ConstraintType.SHOULD);
			var constraintNatureza = DatasetFactory.createConstraint('NATUREZA', hAPI.getCardValue('zoomNatureza'), hAPI.getCardValue('zoomNatureza'), ConstraintType.SHOULD);

			if (tipoPagamento == 'dp' && tipoLancamento == 'DARF - INSS') {
				var constraintValor = DatasetFactory.createConstraint('VALOR', removeMascaraMonetaria(hAPI.getCardValue('vlFolha')), removeMascaraMonetaria(hAPI.getCardValue('vlFolha')), ConstraintType.SHOULD);
			} else {
				var constraintValor = DatasetFactory.createConstraint('VALOR', removeMascaraMonetaria(hAPI.getCardValue('valorPgtoGuiaTaxaBoletos')), removeMascaraMonetaria(hAPI.getCardValue('valorPgtoGuiaTaxaBoletos')), ConstraintType.SHOULD);
			}
			constraintCodTitulo.push(constraintNumero);
			constraintCodTitulo.push(constraintCodFornecedor);
			constraintCodTitulo.push(constraintNatureza);
			constraintCodTitulo.push(constraintValor);
			var ds_codigoTitulo = DatasetFactory.getDataset('ds_contasPagar', null, constraintCodTitulo, null);
			var numeroTitulo = ds_codigoTitulo.getValue(0, "NUMERO");

			if (numeroTitulo != "") {
				throw "Já existe um registro para este <b>Número de Título</b>!";
			}

			//Valida titulos do fluig 
			log.info("**##" + temAnexo2);
			log.info("CTT_CUSTO " + hAPI.getCardValue('CTT_CUSTO'));
			log.info("filial_protheus " + hAPI.getCardValue('filial_protheus'));
			log.info("numeroTitulo" + hAPI.getCardValue('numeroTitulo'));
			log.info("##**" + temAnexo2);


			var cons = []
			cons.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST));
			cons.push(DatasetFactory.createConstraint('CTT_CUSTO', hAPI.getCardValue('CTT_CUSTO'), hAPI.getCardValue('CTT_CUSTO'), ConstraintType.MUST));
			cons.push(DatasetFactory.createConstraint('filial_protheus', hAPI.getCardValue('filial_protheus'), hAPI.getCardValue('filial_protheus'), ConstraintType.MUST));
			cons.push(DatasetFactory.createConstraint('numeroTitulo', hAPI.getCardValue('numeroTitulo'), hAPI.getCardValue('numeroTitulo'), ConstraintType.MUST));
		
			var colunas = new Array('solicitante', 'codSolicitacao', 'FORNECEDOR_BANCO_DESC', 'cnpjFornecedor', 'metadata#active', 'metadata#id');
			var ds_solicitacao = DatasetFactory.getDataset('ds_solicitacaoDePagamentos', colunas, cons, null).values;
			var numeroSolicitacao = ds_solicitacao[0].codSolicitacao;//ds_solicitacao.getValue(0, "codSolicitacao");
			
			if (numeroSolicitacao != "") {
				throw "Já existe um registro com as mesmas características <b>" + numeroSolicitacao + "</b>!";
			}
		}*/
	}

	if (ATIVIDADE == CORRIGIR) {

		hAPI.setCardValue("nomeAprovGestor1", "");
		hAPI.setCardValue("dataAprovGestor1", "");
		hAPI.setCardValue("decisaoGestor1", "");
		hAPI.setCardValue("motivoAprovGestor1", "");

		hAPI.setCardValue("nomeAprovGestor2", "");
		hAPI.setCardValue("dataAprovGestor2", "");
		hAPI.setCardValue("decisaoGestor2", "");
		hAPI.setCardValue("motivoAprovGestor2", "");

		hAPI.setCardValue("nomeAprovGestor3", "");
		hAPI.setCardValue("dataAprovGestor3", "");
		hAPI.setCardValue("decisaoGestor3", "");
		hAPI.setCardValue("motivoAprovGestor3", "");

		hAPI.setCardValue("nomeAprovGestor4", "");
		hAPI.setCardValue("dataAprovGestor4", "");
		hAPI.setCardValue("decisaoGestor4", "");
		hAPI.setCardValue("motivoAprovGestor4", "");

		hAPI.setCardValue("nomeAprovGestor5", "");
		hAPI.setCardValue("dataAprovGestor5", "");
		hAPI.setCardValue("decisaoGestor5", "");
		hAPI.setCardValue("motivoAprovGestor5", "");

	}

	if (ATIVIDADE == GESTOR) {
		hAPI.setCardValue("nivelAtualAprovacao", parseInt(hAPI.getCardValue("nivelAtualAprovacao")) + 1);
	}

	
	if (ATIVIDADE == swift_contratos) {
		if (qtdAnexos < 2) {			
			throw "É preciso anexar o Swift ou Contrato para continuar o processo!";
		}
	}



	/*if (atividadeAtual == PROGRAMAR && getValue("WKCompletTask")=="true"){
		//Caso aprovado pelo fiscal e não seja "apenas boleto" o título será gerado
		log.info('HEITOR SALDANHA CAMPO SOLICITACAO: '+hAPI.getCardValue('numSolLancNfPgtoGuiaTxBoletos'))
		if(hAPI.getCardValue('decisaoAprovacaoFinanc') == 'Sim' && hAPI.getCardValue('numSolLancNfPgtoGuiaTxBoletos') == ''){
			log.info('HEITOR SALDANHA INTEGROU PAGAMENTO');
			//verifica se deve-se gerar o título do protheus baseado nas retenções
			if(verificaRetencao()){
				// Faz a inserção de Título no Protheus
				var msgWS = insereTituloProtheus();
				var retornoWS = verificaErro(msgWS);
				if (retornoWS != "Sucesso") {
					throw "Não foi possível inserir o Título no Protheus. ";
				} else {
					var numeroTitulo = msgWS.split("|"); 
					var users = new java.util.ArrayList();
					hAPI.setCardValue("numeroDocumento", numeroTitulo[1]);
				}
			}			
		}		
	}*/

	//Apaga o titulo quando ele for enviado para correção 
	/*if(atividadeAtual == EXCLUSIVO_VALIDAR_PROGRAMAR && getValue("WKCompletTask")=="true"){
		if(nextSequenceId == CORRECAO || nextSequenceId == VALIDACAO){
			var numeroTitulo = hAPI.getCardValue('numeroDocumento');
			if(numeroTitulo != '' && numeroTitulo != undefined){
				var msgWS = removeTiTuloProtheus();
				var retornoWS = verificaErro(msgWS);
				if (retornoWS != "Sucesso") {
					throw "Não foi possível remover o Título no Protheus. ";
				} else {
					var numeroTitulo = msgWS.split("|"); 
					var users = new java.util.ArrayList();
					hAPI.setCardValue("numeroDocumento", '');
				}
			}
		}
	}*/
}

function definirGestorResponsavel() {
	buscarGestorResponsavel();
	setWFParametro("gestorResponsavel", gestorResponsavelId);
}

function buscarGestorResponsavel() {
	var dataSet = new objDataSet("dataSetResponsavelAprovacaoGeral");

	// Parametro para consulta do responsavel do Centro de Custo
	var codFilial = getCodFilial();
	var codCentroCusto = getCodCentroCusto();
	var numAlcada = 1;
	var valorPedido = 0;

	// realizacao do filtro
	dataSet.setFiltro("codFilial", codFilial);
	dataSet.setFiltro("codCentroCusto", codCentroCusto);
	dataSet.setFiltro("numAlcada", numAlcada);
	dataSet.setFiltro("valorPedido", valorPedido);

	dataSet.buscar();

	// Retorno com todos os dados
	var dados = dataSet.getDados();

	if (dados.getValue(0, "status") != false) {
		gestorResponsavelId = dados.getValue(0, "matricula");

		return true;
	} else {
		return false;
	}
}

function getCodFilial() {
	return getWFParametro("codigo_filial");
}

function getCodCentroCusto() {
	return getWFParametro("CTT_CUSTO");;
}

function addDias(data, dias) {
	vData = data.split("/");
	var aData = new Date(vData[2], vData[1] - 1, vData[0]);
	aData.setDate(aData.getDate() + dias);
	month = (aData.getMonth() + 1);
	day = aData.getDate();
	year = aData.getFullYear();
	return ("00" + day).slice(-2) + "/" + ("00" + month).slice(-2) + "/" + year;
}

function getDia(data) {
	aData = data.split("/");
	var d1 = new Date(aData[2], aData[1] - 1, aData[0]);
	var nDia = d1.getDay();
	return nDia;
}

function removeMascaraMonetaria(valor) {
	if (hAPI.getCardValue('sMoeda') == '' || hAPI.getCardValue('sMoeda') == '1' || hAPI.getCardValue('sMoeda') == '4') {
		valor = valor.replace("R$", ''); //1 - Real ou 4 - UFIR
	} else if (hAPI.getCardValue('sMoeda') == '2') {
		valor = valor.replace("US$", ''); //2 - Dolar
	} else if (hAPI.getCardValue('sMoeda') == '3') {
		valor = valor.replace("€", ''); //3 - Euro
	} else if (hAPI.getCardValue('sMoeda') == '5') {
		valor = valor.replace("¥", ''); //5 - Iene
	}
	valor = valor.replace(" ", '');

	while (valor.indexOf(".") != -1) {
		valor = valor.replace('.', '');
	}

	valor = valor.replace(",", ".");
	valor = parseFloat(valor);

	return valor;

}