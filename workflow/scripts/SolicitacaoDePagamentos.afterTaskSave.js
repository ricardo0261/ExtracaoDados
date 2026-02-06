var ativPosInicial = 46;

function afterTaskSave(colleagueId, nextSequenceId, userList) {
    if (nextSequenceId == ativPosInicial) {
        preencherIdentificador();
    }
}

function preencherIdentificador() {
    var unidade = hAPI.getCardValue("hiddenFilial");
    var dataVencimento = hAPI.getCardValue("dtDeVencPgtoGuiaTaxaBoletos");
    // var dataInicial = hAPI.getCardValue("dataSolicitante");
    var emergencial = hAPI.getCardValue("pagamentoEmergencialHidden");
    var dataFormatada = dataVencimento.split('/')[2];
    dataFormatada += '/' + dataVencimento.split('/')[1];
    dataFormatada += '/' + dataVencimento.split('/')[0];

    if (emergencial == "") {
        hAPI.setCardValue("campoIdentificador", dataFormatada + ' - N - ' + unidade);

    } else {
        hAPI.setCardValue("campoIdentificador", dataFormatada + ' - E - ' + unidade);
    }

	hAPI.setCardValue("codSolicitacao", getValue("WKNumProces"));
}

if (hAPI.getCardValue("viaWebService") == "true") {
	   hAPI.setCardValue("cdSolicitante", "Pool:Group:FIN_GUIANDO");
	 }
