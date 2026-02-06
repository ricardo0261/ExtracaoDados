function servicetask68(attempt, message) {

	//Se for via XML, este serviço seta o GESTOR responsável através da filial, centro de custo e valor.
	if (hAPI.getCardValue("viaWebService") == "true") {

		if (hAPI.getCardValue("A2_COD") != "001387") hAPI.setCardValue("zoomCodRetencao", "N/A"); //Setando os valores "N/A" para inserir o Título no Protheus.
		hAPI.setCardValue("codTributoGPS", "N/A"); //Setando os valores "N/A" para inserir o Título no Protheus.

		var hiddenFilialXML = hAPI.getCardValue("filial");
		hAPI.setCardValue("hiddenFilial", hiddenFilialXML); // Setando valor no campo HiddenFilial para o campo identificador

		var filial = hAPI.getCardValue("filial_protheus");
		var centroCusto = hAPI.getCardValue("CTT_CUSTO");
		var valor = hAPI.getCardValue("valorPgtoGuiaTaxaBoletos");
		//valor = removeMascaraMonetaria(valor);		

		if (filial == "" || centroCusto == "" || valor == "") {
			throw "Os campos não podem estar vazios";
		} else {
			var c1 = DatasetFactory.createConstraint("filial", filial, filial, ConstraintType.MUST);
			var c2 = DatasetFactory.createConstraint("centroCusto", centroCusto, centroCusto, ConstraintType.MUST);
			var c3 = DatasetFactory.createConstraint("valor", valor, valor, ConstraintType.MUST);
			var constraints = new Array(c1, c2, c3);
			var ds_aprov = DatasetFactory.getDataset("ds_alcadaAprovacaoPagamentos", null, constraints, null);

			//Alçada de Aprovação
			var pxAprovador = hAPI.getCardValue("proximoAprovador");
			var nivelAtualAprov = hAPI.getCardValue("nivelAtualAprovacao");
			var idGestor1 = hAPI.getCardValue("idAprovGestor1");
			var idGestor2 = hAPI.getCardValue("idAprovGestor2");
			var idGestor3 = hAPI.getCardValue("idAprovGestor3");
			var idGestor4 = hAPI.getCardValue("idAprovGestor4");
			var idGestor5 = hAPI.getCardValue("idAprovGestor5");

			hAPI.setCardValue("pxAprovador", "");
			hAPI.setCardValue("nivelAtualAprov", "0");
			hAPI.setCardValue("nivelMaximoAprovacao", "5");
			hAPI.setCardValue("idGestor1", "");
			hAPI.setCardValue("idGestor2", "");
			hAPI.setCardValue("idGestor3", "");
			hAPI.setCardValue("idGestor4", "");
			hAPI.setCardValue("idGestor5", "");

			for (var x = 0; x < ds_aprov.rowsCount; x++) {

				if (pxAprovador == "") {

					hAPI.setCardValue("proximoAprovador", ds_aprov.getValue(x, "IDAPROVADOR"));

					hAPI.setCardValue("nivelAtualAprovacao", "1");

					pxAprovador = ds_aprov.getValue(x, "IDAPROVADOR");

				}

				hAPI.setCardValue("idAprovGestor" + (x + 1), ds_aprov.getValue(x, "IDAPROVADOR"));

			}
		}
	}

	//Aplicando data prevista de pagamento
	var dataPagamento = hAPI.getCardValue("dtDePgtoGuiaTaxaBoletos");
	var dataVencimento = hAPI.getCardValue("dtDeVencPgtoGuiaTaxaBoletos");
	if (dataVencimento != "") {
		if (dataPagamento != "") {
			hAPI.setCardValue("aprovDataPrevista", dataPagamento);
			hAPI.setCardValue("aprovDataPrevista", dataPagamento);
		} else {
			hAPI.setCardValue("aprovDataPrevista", dataVencimento);
		}
	}
}


function removeMascaraMonetaria(mask) {
	if (mask != undefined) {
		mask = mask.replace('R$', '');
		mask = mask.replace(' ', '');
		//mask = mask = mask.replace(/[\.]/g, '');

		mask = mask.replace('.', '');
		mask = mask.replace('.', '');
		mask = mask.replace('.', '');

		mask = mask.replace(',', '.');
		return parseFloat(mask);
	} else {
		return 0.00;
	}
}