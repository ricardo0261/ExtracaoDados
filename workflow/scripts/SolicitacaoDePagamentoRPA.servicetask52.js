function servicetask52(attempt, message) {
    var tipo = hAPI.getCardValue("tipoSolicitacao");
    if (tipo == "rpa") {
        var periodicService = ServiceManager.getService("OncoclinicasCriacaoTitulos");
        var serviceHelper = periodicService.getBean();
        var serviceLocator = serviceHelper.instantiate("br.com.oncoclinicas.FSWSP001Locator");
        var service = serviceLocator.getFSWSP001SOAP();

        var XML = gerarXML();

        var webService = service.WSINTIPG(XML);
        var mensagem = webService.getMENSAGEM();
        var retorno = webService.getRETORNO();

        if (retorno == 1) {
            hAPI.setCardValue("numeroTitulo", mensagem);
            hAPI.setCardValue("obsTitulo", "Título criado com sucesso.");
        } else {
            hAPI.setCardValue("numeroTitulo", "");
            hAPI.setCardValue("obsTitulo", mensagem);
            throw mensagem
        }
    }
}
function gerarXML() {
    var xml = "";
    xml += "<?xml version='1.0' encoding='UTF-8'?>";
    xml += "<Titulo>";
    xml += "<Operacao>";
    xml += "<Id>1</Id>";
    xml += "</Operacao>";
    xml += "<Cadastro>";
    xml += "<E2_PREFIXO>" + hAPI.getCardValue("codTipoTitulo") + "</E2_PREFIXO>";
    xml += "<E2_FILIAL>" + hAPI.getCardValue("codFilial") + "</E2_FILIAL>";
    xml += "<E2_TIPO>" + hAPI.getCardValue("codTipoTitulo") + "</E2_TIPO>";
    xml += "<E2_NATUREZ>" + hAPI.getCardValue("codNatureza") + "</E2_NATUREZ>";
    xml += "<E2_FORNECE>" + hAPI.getCardValue("codFornecedor") + "</E2_FORNECE>";
    xml += "<E2_EMISSAO>" + dataAtual() + "</E2_EMISSAO>";
    xml += "<E2_VALOR>" + removeMascaraMonetaria(hAPI.getCardValue("valorEstimado")) + "</E2_VALOR>";
    xml += "<E2_BASEISS>" + removeMascaraMonetaria(hAPI.getCardValue("valorEstimado")) + "</E2_BASEISS>";
    // xml += "<E2_SALDO>" + removeMascaraMonetaria(hAPI.getCardValue("valorBruto")) + "</E2_SALDO>";
    xml += "<E2_VLCRUZ>" + removeMascaraMonetaria(hAPI.getCardValue("valorBruto")) + "</E2_VLCRUZ>";
    xml += "<E2_ISS>" + removeMascaraMonetaria(hAPI.getCardValue("valorIss")) + "</E2_ISS>"
    xml += "<E2_INSS>" + removeMascaraMonetaria(hAPI.getCardValue("inss")) + "</E2_INSS>"
    xml += "<E2_ZVALENT>0</E2_ZVALENT>";
    xml += "<E2_CCD>" + hAPI.getCardValue("codCentroCustos") + "</E2_CCD>";
    xml += "<E2_LOJA>" + hAPI.getCardValue("loja") + "</E2_LOJA>";
    xml += "<E2_HIST>" + removeAcentos(hAPI.getCardValue("descricaoServico")) + "</E2_HIST>";
    xml += "<E2_ZIDFLG>" + getValue("WKNumProces") + "</E2_ZIDFLG>";
    xml += "<E2_ZDTINT>" + dataAtual() + "</E2_ZDTINT>";
    xml += "<E2_ZHRINT>" + gethoras() + "</E2_ZHRINT>";
    xml += "<E2_PARCELA>1</E2_PARCELA>";
    xml += "<E2_MULTNAT>2</E2_MULTNAT>";
    xml += "<E2_MOEDA>1</E2_MOEDA>";
    xml += "<E2_TXMOEDA>1</E2_TXMOEDA>";
    xml += "<E2_VENCTO>" + converteData(hAPI.getCardValue("dataVencimento")) + "</E2_VENCTO>";
    xml += "</Cadastro>";
    xml += "</Titulo>";
    log.info('LUCAS GEORDANE SAYS: ' + xml)
    return xml
}
function dataAtual() {
    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    if (dia < 10) {
        dia = "0" + dia;
    }
    if (mes < 10) {
        mes = "0" + mes;
    }
    return '' + ano + mes + dia;
}
function gethoras() {
    var data = new Date();
    var horas = data.getHours();
    var minutos = data.getMinutes();
    var segundos = data.getSeconds()
    return horas + ":" + minutos + ":" + segundos
}
function removeAcentos(string) {
    string = new java.lang.String(string);
    string = string.toUpperCase();
    string = string.replaceAll("Á|À|Â|Ã|Ä", "A");
    string = string.replaceAll("É|È|Ê|Ë", "E");
    string = string.replaceAll("Í|Ì|Î|Ï", "I");
    string = string.replaceAll("Ó|Ò|Ô|Õ|Ö", "O");
    string = string.replaceAll("Ú|Ù|Û|Ü", "U");
    string = string.replaceAll("Ç", "C");
    return string
}
function removeMascaraMonetaria(valor) {
    if (valor != undefined && valor != "" && valor != null) {
        valor = valor.replace("R$", "");
        valor = valor.replace(" ", "");
        valor = valor.replace(".", "");
        valor = valor.replace(".", "");
        valor = valor.replace(".", "");
        valor = valor.replace(".", "");
        valor = valor.replace(".", "");
        valor = valor.replace(",", ".");
        valor = parseFloat(valor);
        return valor.toFixed(4);
    } else {
        return 0.0000;
    }
}
function converteData(data) {
    var dia = data.split("/")[0];
    var mes = data.split("/")[1];
    var ano = data.split("/")[2];
    return ano + mes + dia
}