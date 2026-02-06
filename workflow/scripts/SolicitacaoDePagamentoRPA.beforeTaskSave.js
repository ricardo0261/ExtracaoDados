function beforeTaskSave(colleagueId, nextSequenceId, userList) {
    GETSLA();
    var dataVencimento = hAPI.getCardValue("dataVencimento");
    var filial = hAPI.getCardValue("nomeFilial");
    var emergencial = hAPI.getCardValue("emergencial");
    dataFormatada = '';
    dataFormatada += dataVencimento.split('/')[2];
    dataFormatada += '/' + dataVencimento.split('/')[1];
    dataFormatada += '/' + dataVencimento.split('/')[0]
    if (emergencial == "on") {
        var campoIdentificador = dataFormatada + " - " + "E - " + filial;
        hAPI.setCardValue("campoIdentificador", campoIdentificador)
    } else {
        var campoIdentificador = dataFormatada + " - " + "N - " + filial;
        hAPI.setCardValue("campoIdentificador", campoIdentificador)
    }
    if (getValue('WKNumState') == 15 && hAPI.getCardValue("tipoSolicitacao") == "rpa" && hAPI.getCardValue("aprovDp") == "sim") {
        verificaAnexo(1);
    }
    if (getValue('WKNumState') == 8) {
        var indice = hAPI.getCardValue("alcadaAtual")
        indice++;
        hAPI.setCardValue("alcadaAtual", indice);
    }

    if (getValue('WKNumState') == 0 || getValue('WKNumState') == 7) {
        var recolhimentoInss = hAPI.getCardValue("cbRecolhimentoINSS");

        if (hAPI.getCardValue("tipoSolicitacao") == "nf") {
            if (recolhimentoInss == "on") {
                verificaAnexo(2);
            } else {
                verificaAnexo(1);
            }
        } else {
            verificaAnexo(1);
        }
    }
}

function verificaAnexo(qtde) {

    qtdAnexos = hAPI.listAttachments().size();

    if (qtdAnexos < parseInt(qtde)) {
        throw ("É preciso anexar ao menos " + qtde + " documento para continuar o processo");
    }
}