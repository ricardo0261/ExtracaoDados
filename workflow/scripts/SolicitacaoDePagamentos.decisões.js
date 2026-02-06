function exclusivo18() {
    if (hAPI.getCardValue("decisaoGestor" + hAPI.getCardValue("nivelAtualAprovacao")) == "Nao") {
        return 0
    } else if (hAPI.getCardValue("decisaoGestor" + hAPI.getCardValue("nivelAtualAprovacao")) == "Sim") {
        if (hAPI.getCardValue("tipoLancamento") == "dp" && hAPI.getCardValue("viaWebService") == "true") {
            return 6
        }
        if (hAPI.getCardValue("proximoAprovador") != "") {
            return 1
        } else if (hAPI.getCardValue("tblFilho") != "tblRECIBO") {
            var lancamento = hAPI.getCardValue("tipoLancamento");

            if (lancamento == "estrangeiro") {
                return 2
            }
            if (lancamento == "impostos") {
                return 3
            }
            if (lancamento == "dp" &&
                hAPI.getCardValue("zoomTipo") == "Titulo de Taxas") {
                return 4
            }
            if ((lancamento == "diversos" || lancamento == "faciliteis") &&
                hAPI.getCardValue("foraPolitica") == 'true') {
                if (hAPI.getCardValue("idAprovadorValFinanceiro") != '') {
                    return 5
                } else {
                    return 6
                }
            } else if (lancamento != "faciliteis") {
                return 3
            } else {
                return 6
            }
        }
        if (hAPI.getCardValue("tipoLancamento") != "diversos" &&
            hAPI.getCardValue("tipoLancamento") != "estrangeiro") {
            return 6
        }
    }
}

function exclusivo107() {
    if (hAPI.getCardValue('decisaoFinanceiro') == 'Nao') {
        return 0
    } else if (hAPI.getCardValue("tipoLancamento") == "diversos") {
        return 1
    } else {
        return 2
    }
}

function decisivo115() {
    if (hAPI.getCardValue("centroCustosBloqueado") == 'true') {
        return 1
    } else {
        return 2
    }
}
function decisivo119() {
    if (hAPI.getCardValue('centroCustosAnterior') == hAPI.getCardValue("CTT_CUSTO")) {
        return 1
    } else {
        return 2
    }
}