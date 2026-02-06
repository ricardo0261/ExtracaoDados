function verificacaoFiscal() {
    if (hAPI.getCardValue('cpDecisao') == 'sim') {
        return 1
    } else {
        return 2
    }
}

function decisivo55() {
    var medCarrerMed = hAPI.getCardValue("parteCarrerMedica");
    if (hAPI.getCardValue('cpDecisao') == 'sim') {
        if (medCarrerMed == 'sim') {
            return 1
        }
        if (medCarrerMed == 'nao') {
            return 3
        }
    } else {
        return 2
    }
}

function decisivo120() {
    if (hAPI.getCardValue('cpDecisaoCarreira') == 'sim') {
        return 1
    } else {
        return 2
    }
}

function aprovacaoSolicitante() {
    var aprovado = hAPI.getCardValue("chamadoAprovado");
    if (aprovado == 'sim') {
        return 1; //Finaliza
    } else {
        return 2; //Solucao da inconsistencia
    }
}