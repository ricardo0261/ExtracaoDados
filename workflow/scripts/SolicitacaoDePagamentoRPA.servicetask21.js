function servicetask21(attempt, message) {
    var tipo = hAPI.getCardValue("tipoSolicitacao");
    var periodicService = ServiceManager.getService("OncoclinicasCriacaoTitulos");
    var serviceHelper = periodicService.getBean();
    var serviceLocator = serviceHelper.instantiate("br.com.oncoclinicas.FSWSP001Locator");
    var service = serviceLocator.getFSWSP001SOAP();

    var XML = gerarXML();

    var webService = service.WSINTPNF(XML);
    var mensagem = webService.getMENSAGEM();
    var retorno = webService.getRETORNO();

    if (retorno == 1 || retorno == 2) {
        hAPI.setCardValue("codResult", retorno);
        hAPI.setCardValue("obsTitulo", "Pré nota Integrada com sucesso");
    } else {
        hAPI.setCardValue("codResult", "");
        hAPI.setCardValue("obsTitulo", mensagem);
        throw mensagem
    }

}
function gerarXML() {
    var xml = ""
    xml = "<?xml version='1.0' encoding='UTF-8'?>"
    xml += '<PreNota>'
    xml += '<Operacao>'
    xml += '<Id>1</Id>'
    xml += '</Operacao>'
    xml += '<Cabecalho>'
    xml += '<F1_FILIAL>' + hAPI.getCardValue("codFilial") + '</F1_FILIAL>'
    xml += '<F1_DOC>' + hAPI.getCardValue('numeroDoc') + '</F1_DOC>'
    xml += '<F1_SERIE>' + removeAcentos(hAPI.getCardValue('serieNf')) + '</F1_SERIE>'
    xml += '<F1_FORNECE>' + hAPI.getCardValue("codFornecedor") + '</F1_FORNECE>'
    xml += '<F1_LOJA>' + hAPI.getCardValue("loja") + '</F1_LOJA>'
    xml += '<F1_TIPO>Normal</F1_TIPO>'
    xml += '<F1_EMISSAO>' + converteData(hAPI.getCardValue("dataEmissao")) + '</F1_EMISSAO>'
    xml += '<F1_ESPECIE>' + hAPI.getCardValue('codEspecie') + '</F1_ESPECIE>'
    xml += '</Cabecalho>'
    xml += '<Itens>'
    xml += '<Iten>'
    xml += '<D1_FILIAL>' + hAPI.getCardValue("codFilial") + '</D1_FILIAL>'
    xml += '<D1_ITEM>0001</D1_ITEM>'
    xml += '<D1_COD>' + hAPI.getCardValue("codServico") + '</D1_COD>'
    xml += '<D1_UM>' + hAPI.getCardValue('unidadeMedida') + '</D1_UM>'
    xml += '<D1_QUANT>1</D1_QUANT>'
    xml += '<D1_VUNIT>' + removeMascaraMonetaria(hAPI.getCardValue("valorEstimado")) + '</D1_VUNIT>'
    xml += '<D1_TOTAL>' + removeMascaraMonetaria(hAPI.getCardValue("valorEstimado")) + '</D1_TOTAL>'
    xml += '<D1_VALDESC>0.0000</D1_VALDESC>'
    xml += '<D1_DESCPRO>' + removeAcentos(hAPI.getCardValue("servico")) + '</D1_DESCPRO>'
    xml += '<D1_VALFRE>0</D1_VALFRE>'
    xml += '<D1_SEGURO>0</D1_SEGURO>'
    xml += '<D1_DESPESA>0</D1_DESPESA>'
    xml += '<D1_ALIQISS>' + removePercentual(hAPI.getCardValue('porcentagemIss')) + '</D1_ALIQISS>';
    xml += '<D1_VALISS>' + removeMascaraMonetaria(hAPI.getCardValue('valorIss')) + '</D1_VALISS>';
    xml += '<D1_ALIQINS>' + removePercentual(hAPI.getCardValue('aliquotaInss')) + '</D1_ALIQINS>';
    xml += '<D1_VALINS>' + removeMascaraMonetaria(hAPI.getCardValue('inss')) + '</D1_VALINS>';
    xml += '<D1_CC>' + hAPI.getCardValue("codCentroCustos") + '</D1_CC>'
    xml += '<E2_VENCTO>' + converteData(hAPI.getCardValue("dataVencimento")) + '</E2_VENCTO>'
    xml += '<E2_NATUREZ>' + hAPI.getCardValue("codNatureza") + '</E2_NATUREZ>'
    xml += '<D1_DTVALID>' + converteData(hAPI.getCardValue("dataVencimento")) + '</D1_DTVALID>'
    xml += '<D1_ZIDFLG>' + getValue("WKNumProces") + '</D1_ZIDFLG>'
    xml += '</Iten>'
    xml += '</Itens>'
    xml += '</PreNota>'
    log.info('LUCAS GEORDANE SAYS: ' + xml);
    return xml;
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
function removeMascaraMonetaria(string) {
    if (string != undefined && string != "" && string != null) {
        string = string.replace("R$", "");
        string = string.replace(" ", "");
        string = string.replace(".", "");
        string = string.replace(".", "");
        string = string.replace(".", "");
        string = string.replace(".", "");
        string = string.replace(",", ".");
        string = parseFloat(string);
        return string.toFixed(4);
    } else {
        return 0.0000;
    }
}
function removePercentual(string) {
    if (string != undefined && string != "" && string != null) {
        string = string.replace("%", "");
        string = string.replace(",", ".");
        return parseFloat(string);
    } else {
        return 0.00;
    }
}
function converteData(data) {
    var dia = data.split("/")[0];
    var mes = data.split("/")[1];
    var ano = data.split("/")[2];
    return ano + mes + dia
}