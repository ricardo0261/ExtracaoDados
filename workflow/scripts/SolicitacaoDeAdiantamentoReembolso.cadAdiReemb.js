function cadAdiReemb() {

	// var valorAdiantamentoReembolso =
	// hAPI.getCardValue("tipoSolicitacaoHidden");
	log.info("Montando objAdiantamentoReembolso ...");
	var objAdiantamentoReembolso = new objWS('OncoclinicasCriacaoTitulos', 'WSINTIPG');
	log.info("Objeto objAdiantamentoReembolso obtido");
	// var tipo = 'Titulo';
	var operacao = '1';

	montaXMLNovo(objAdiantamentoReembolso, operacao);
	log.info("Executando objAdiantamentoReembolso ...");
	var retorno = objAdiantamentoReembolso.executar();
	log.info("Retornado para condição automática " + retorno);
	var hrWS = hAPI.getCardValue("hiddenRetornoWS");
	//var tipoSol = hAPI.getCardValue("tipoSolicitacaoHidden");
	//hrWS += tipoSol + ": " + (hrWS == "") ? retorno : ";   " + retorno;
	hrWS += (hrWS == "") ? retorno : ";   " + retorno;
	
	hAPI.setCardValue("hiddenRetornoWS", hrWS);

	var retornoMsg = retorno.split("|");
	log.info("setando valor hidden " + retornoMsg[0]);
	if((retornoMsg[0] + '') == '3'){ //Erro na criação de título
		debug(replaceAll(retorno, "\n","<br>")); 
	}
	
	return retorno;
}

function montaXMLNovo(objAdiantamentoReembolso, operacao, tipo) {
	var tagAbreNatureza = "Natureza";
	// var tagFechaNatureza = "Natureza";
	var valorTotalDasDespesasReembolso = hAPI.getCardValue("totalDasDespesas");
	var valorTotalAdiantamento = hAPI.getCardValue("E2_VALOR_TOTAL");
	var CTT_CUSTO = hAPI.getCardValue("CTT_CUSTO");
	// campos dinamicos
	var tipoSolicitacao = hAPI.getCardValue("tipoSolicitacaoHidden");
	objAdiantamentoReembolso.setListaCabec('E2_FILIAL'); // ok
	objAdiantamentoReembolso.setListaCabec('E2_FORNECE');// ok
	
	if (tipoSolicitacao == "reembolso") {
		objAdiantamentoReembolso.setListaCabec('E2_VALOR', valorTotalDasDespesasReembolso);

	} else if (tipoSolicitacao == "adiantamento") {
		objAdiantamentoReembolso.setListaCabec('E2_VALOR',valorTotalAdiantamento);
	}
	
	objAdiantamentoReembolso.setListaCabec('E2_EMISSAO');// alterado
	objAdiantamentoReembolso.setListaCabec('E2_VENCTO');// alterado
	objAdiantamentoReembolso.setListaCabec('E2_ZIDFLG');
	objAdiantamentoReembolso.setListaCabec('E2_NATUREZ');
	// camnpos fixo no fonte
	objAdiantamentoReembolso.setListaCabec('E2_PREFIXO');
	objAdiantamentoReembolso.setListaCabec('E2_TIPO');
	objAdiantamentoReembolso.setListaCabec('E2_PARCELA');
	objAdiantamentoReembolso.setListaCabec('E2_LOJA');
	objAdiantamentoReembolso.setListaCabec('E2_HIST');
	objAdiantamentoReembolso.setListaCabec('E2_MULTNAT');

	// glpi 133775
	objAdiantamentoReembolso.setListaCabec('E2_CCUSTO', CTT_CUSTO);
	objAdiantamentoReembolso.setListaCabec('E2_CCD', CTT_CUSTO);
	
	var alimentacao = hAPI.getCardValue("alimentacao");
	var combustivel = hAPI.getCardValue("combustivel");
	var estacionamento = hAPI.getCardValue("estacionamento");
	var lavanderia = hAPI.getCardValue("lavanderia");
	var transporte = hAPI.getCardValue("transporte");
	var outros = hAPI.getCardValue("outros");
	var internacional = hAPI.getCardValue("internacional");
	

	// dados bancario
	var valor = hAPI.getCardValue("E2_VALOR_TOTAL");
	var codBanco = hAPI.getCardValue("AUTBANCO");
	var codAgencia = hAPI.getCardValue("AUTAGENCIA");
	var codConta = hAPI.getCardValue("AUTCONTA");
	var mv_par05 = hAPI.getCardValue("MV_PAR05");
	var mv_par09 = hAPI.getCardValue("MV_PAR09");

	if (tipoSolicitacao == "reembolso") {
		log.info("Entrou aqui Reembolso:" + tipoSolicitacao);
		if (alimentacao != null && alimentacao != "" && alimentacao > 0) {
			objAdiantamentoReembolso.setListaNatureza('EV_PERC', '1');
			objAdiantamentoReembolso.setListaNatureza('EV_VALOR', alimentacao);
			objAdiantamentoReembolso.setListaNatureza('EV_NATUREZ', '41110001'); // NATUREZA
			// ALIMENTACAO
		}

		if (combustivel != null && combustivel != "" && combustivel > 0) {
			objAdiantamentoReembolso.setListaNatureza('EV_PERC', '1');
			objAdiantamentoReembolso.setListaNatureza('EV_VALOR', combustivel);
			objAdiantamentoReembolso.setListaNatureza('EV_NATUREZ', '41110002'); // NATUREZA
			// COMBUSTIVEL
		}
		if (estacionamento != null && estacionamento != ""
				&& estacionamento > 0) {
			objAdiantamentoReembolso.setListaNatureza('EV_PERC', '1');
			objAdiantamentoReembolso.setListaNatureza('EV_VALOR',
					estacionamento);
			objAdiantamentoReembolso.setListaNatureza('EV_NATUREZ', '41110003'); // estacionamento
			// estacionamento
		}
		if (lavanderia != null && lavanderia != "" && lavanderia > 0) {
			objAdiantamentoReembolso.setListaNatureza('EV_PERC', '1');
			objAdiantamentoReembolso.setListaNatureza('EV_VALOR', lavanderia);
			objAdiantamentoReembolso.setListaNatureza('EV_NATUREZ', '51105016'); // lavanderia
			// lavanderia
		}
		if (transporte != null && transporte != "" && transporte > 0) {
			objAdiantamentoReembolso.setListaNatureza('EV_PERC', '1');
			objAdiantamentoReembolso.setListaNatureza('EV_VALOR', transporte);
			objAdiantamentoReembolso.setListaNatureza('EV_NATUREZ', '41110007'); // transporte
			// transporte
		}
		if (internacional != null && internacional != "" && internacional > 0) {
			objAdiantamentoReembolso.setListaNatureza('EV_PERC', '1');
			objAdiantamentoReembolso.setListaNatureza('EV_VALOR', internacional);
			objAdiantamentoReembolso.setListaNatureza('EV_NATUREZ', '51105016'); // internacional
			// lavanderia
		}
		
		if (outros != null && outros != "" && outros > 0) {
			objAdiantamentoReembolso.setListaNatureza('EV_PERC', '1');
			objAdiantamentoReembolso.setListaNatureza('EV_VALOR', outros);
			objAdiantamentoReembolso.setListaNatureza('EV_NATUREZ', '51105016'); // outros
			
		}
		
	} else if (tipoSolicitacao == "adiantamento") {
		log.info("Entrou aqui Adiantamento:" + tipoSolicitacao);
		log.info("Valor do Adiantamento:" + valor);
		//	
		if (valor != null && valor != "" && valor > 0) {
			objAdiantamentoReembolso.setListaNatureza('EV_PERC', '100');
			objAdiantamentoReembolso.setListaNatureza('EV_VALOR', valor);
			objAdiantamentoReembolso.setListaNatureza('EV_NATUREZ', '41109033'); // NATUREZA
			// ALIMENTACAO
		}

		objAdiantamentoReembolso.processarListaBancos(codBanco, codAgencia,
				codConta);
		objAdiantamentoReembolso.processarListaParametros(mv_par05, mv_par09);

	}
	objAdiantamentoReembolso.setListaOperacao(operacao);

}

/*
 * Debug
 */
function debug(string){
	log.info(string);	
	throw string;
}

function replaceAll(str, de, para){
    var pos = str.indexOf(de);
    while (pos > -1){
		str = str.replace(de, para);
		pos = str.indexOf(de);
	}
    return (str);
}