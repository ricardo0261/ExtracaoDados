// verifica se o gestor aprova a solicitacao
function aprovGestor() {
    if (hAPI.getCardValue("aprovGestor") == "sim") {
        return true;
    }
    hAPI.setCardValue("aprovGestor", "")
    return false;
}
// verifica se o dp aprova a solicitacao, retornando "rpa" caso aprovada e tipo da solicitacao seja RPA,
//  "nf" caso seja aprovada e o tipo seja NF e "false" caso a solicitacao seja rejeitada
function aprovDp() {
    if (hAPI.getCardValue("aprovDp") == "sim") {
        if (hAPI.getCardValue("tipoSolicitacao") == "rpa") {
            return "rpa"
        }
        return "nf"
    }
    hAPI.setCardValue("aprovDp", "")
    return false;
}
// verifica se o dp aprova a solicitacao, retornando true  caso aprovada e false para reprovada
// e seta o campo destino para onde sera enviada a solicitaçao rejeitada
function aprovFiscal() {
    if (hAPI.getCardValue("aprovFiscal") == "sim") {
        return true;
    }
    if (hAPI.getCardValue("destinoFiscal") == "solicitante") {
        hAPI.setCardValue("destino", "solicitante");
        hAPI.setCardValue("alcadaAtual", 0)
        hAPI.setCardValue("alcada", "true");
        return false;
    }else {
        hAPI.setCardValue("destino", "confeccao");
    return false;
    }
}
// verifica se o financeiro aprova a solicitacao, retornando true caso aprove,caso rejeite retorna false
// e seta o campo destino para onde sera enviada a solicitaçao rejeitada
function aprovFinanceiro() {
    if (hAPI.getCardValue("aprovFinanceiro") == "sim") {
        return true;
    }
    if (hAPI.getCardValue("destinoFinanceiro") == "solicitante") {
        hAPI.setCardValue("destino", "solicitante");
        hAPI.setCardValue("alcadaAtual", 0)
        hAPI.setCardValue("alcada", "true");
        return false;
    }
    hAPI.setCardValue("destino", "confeccao");
    return false;
}
// verifica se o solicitante aprova a solicitacao, retornando true caso aprove,caso rejeite retorna false
function aprovSolicitante() {
    if (hAPI.getCardValue("aprovSolicitante") == "sim") {
        return true;
    }
    return false;
}
// retorna o destino da solicitacao
function getDestino() {
    return hAPI.getCardValue("destino")
}
function aprovacao(){
    var aprovacao = hAPI.getCardValue("aprovacao");
    if(aprovacao == 'true'){
        return true;
    }else{
        return false;
    }
}