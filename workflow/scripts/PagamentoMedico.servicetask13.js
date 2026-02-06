function servicetask13(attempt, message) {
    var periodicService = ServiceManager.getService("OncoclinicasCriacaoTitulos");
    var serviceHelper = periodicService.getBean();
    var serviceLocator = serviceHelper.instantiate("br.com.oncoclinicas.FSWSP001Locator");
    var service = serviceLocator.getFSWSP001SOAP();

    var cabecalho = gerarCabecalhoXML(1);
    var itens = gerarItensXml()

    var webService = service.WSINTPNF(cabecalho + itens);
    var mensagem = webService.getMENSAGEM();
    var retorno = webService.getRETORNO();


    if (retorno != 1 && retorno != 2) {
        hAPI.setCardValue('cpMsgIntegracao', retorno)
        throw mensagem
    } else {
        hAPI.setCardValue('cpMsgIntegracao', retorno)
    }

}

function gerarCabecalhoXML(Tipo) {
    var xml = "<?xml version='1.0' encoding='UTF-8'?>"
    xml += '<PreNota>'
    xml += '<Operacao>'
    if (Tipo == 1) { //Tipo 1 integrar, tipo 2 extornar
        xml += '<Id>1</Id>'
    } else {
        xml += '<Id>3</Id>'
    }
    xml += '</Operacao>'
    xml += '<Cabecalho>'
    xml += '<F1_FILIAL>' + hAPI.getCardValue("cpCodFilial") + '</F1_FILIAL>'
    xml += '<F1_DOC>' + hAPI.getCardValue('cpNumNota') + '</F1_DOC>'
    xml += '<F1_SERIE>' + normalizeString(hAPI.getCardValue('cpSerie')) + '</F1_SERIE>'
    xml += '<F1_FORNECE>' + hAPI.getCardValue("cpCodFornecedor") + '</F1_FORNECE>'
    xml += '<F1_LOJA>' + hAPI.getCardValue("cpLojaFornecedor") + '</F1_LOJA>'
    xml += '<F1_TIPO>Normal</F1_TIPO>'
    xml += '<F1_EMISSAO>' + converteData(hAPI.getCardValue("dtEmissao")) + '</F1_EMISSAO>'
    xml += '<F1_ESPECIE>' + hAPI.getCardValue('cpCodEspecieNf') + '</F1_ESPECIE>'
    xml += '<F1_COND>089</F1_COND>'
    xml += '<F1_CHVNFE>' + hAPI.getCardValue('cpCodigoBarras') + '</F1_CHVNFE>'
    xml += '<F1_ZVENCTO>' + converteData(hAPI.getCardValue("dtVencimento")) + '</F1_ZVENCTO>'
    xml += '</Cabecalho>'

    return xml;
}
// gera os o xml dos itens da pre nota
function gerarItensXml() {

    var xml = '<Itens>'
    xml += '<Iten>'
    xml += '<D1_FILIAL>' + hAPI.getCardValue("cpCodFilial") + '</D1_FILIAL>';
    xml += '<D1_ITEM>0001</D1_ITEM>';
    xml += '<D1_COD>' + hAPI.getCardValue("cpCodProduto") + '</D1_COD>';
    xml += '<D1_UM>UN</D1_UM>';
    xml += '<D1_QUANT>' + hAPI.getCardValue("cpQuant") + '</D1_QUANT>';
    xml += '<D1_VUNIT>' + removeMask(hAPI.getCardValue("cpvlrUnitario")) + '</D1_VUNIT>';

    xml += '<D1_TOTAL>' + calcularTotal(hAPI.getCardValue("cpVlrTotal"),
        hAPI.getCardValue("cpIpi"),
        hAPI.getCardValue("cpDesconto")) + '</D1_TOTAL>';

    xml += '<D1_VALDESC>' + removeMask(hAPI.getCardValue("cpDesconto")) + '</D1_VALDESC>';
    xml += '<D1_DESCPRO>' + normalizeString(hAPI.getCardValue("cpProduto")) + '</D1_DESCPRO>';
    xml += '<D1_VALIPI>' + removeMask(hAPI.getCardValue("cpIpi")) + '</D1_VALIPI>';
    xml += '<D1_VALFRE>0</D1_VALFRE>';
    xml += '<D1_SEGURO>0</D1_SEGURO>';
    xml += '<D1_DESPESA>0</D1_DESPESA>';
    xml += '<D1_DTVALID>' + converteData(hAPI.getCardValue("dtVencimento")) + '</D1_DTVALID>'
    xml += '<D1_CC>' + hAPI.getCardValue("cpCodCentroCustos") + '</D1_CC>'
    xml += '<D1_ZIDFLG>' + getValue("WKNumProces") + '</D1_ZIDFLG>';
    xml += '<D1_ZTESPRE>141</D1_ZTESPRE>'

    //Inclusos na melhoria 198446      
    xml += '<D1_XFORPAG>2</D1_XFORPAG>'
    if (hAPI.getCardValue('cpSimplesNacional') == 'Não') {
        xml += '<D1_ALIQISS>' + hAPI.getCardValue('cpAliqISS') + '</D1_ALIQISS>' // Aliquota ISS
    } else {
        xml += '<D1_ALIQISS>0</D1_ALIQISS>' // Aliquita ISS
        xml += '<D1_XISSRGE>' + hAPI.getCardValue('cpAliqISS') + '</D1_XISSRGE>'
    }
    xml += '<D1_TES>' + hAPI.getCardValue('cpTes') + '</D1_TES>'
    xml += '<D1_ZCEPOM>' + hAPI.getCardValue('slCepom') + '</D1_ZCEPOM>' // Cepom
    //

    xml += '</Iten>'
    xml += '</Itens>'
    xml += '</PreNota>'

    return xml;
}



// adcicioa os 0 necessarios para alguns padroes do protheus e retorna o valor que foi inserido no formato
function addZero(quantidade, numero) {
    numero = numero.toString()
    for (var i = numero.length; i < quantidade; i++) {
        numero = "0" + numero
    }
    return numero;
}
// retorna a tada atual no padrao do protheus
function currentDate() {
    var data = new Date();
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();
    if (dia < 10) {
        dia = "0" + dia
    }
    if (mes < 10) {
        mes = "0" + mes
    }
    return '' + ano + mes + dia;
}
// remove os caracteres especias da string de entra e a retorna
function normalizeString(string) {
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
// remove a mascara monetaria da string de entrada e a retorna
function removeMask(valor) {
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
// converte a data do padrao YYYY-mm-DD para o padrao do protheus DDmmYYYY
function converteData(data) {
    var dia = data.split("-")[2];
    var mes = data.split("-")[1];
    var ano = data.split("-")[0];
    return ano + mes + dia
}

function calcularTotal(valor, ipi, desconto) {
    var valor = parseFloat(removeMask(valor));
    var ipi = parseFloat(removeMask(ipi));
    var desconto = parseFloat(removeMask(desconto));

    return valor - ipi + desconto;

}