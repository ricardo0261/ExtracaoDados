function servicetask90(attempt, message) {
    var numSolicitacao = getValue("WKNumProces");
    //var numNateza = hAPI.getCardValue("zoomNatureza");
    
    log.info("## integracao titulos financeiro fluig: " + numSolicitacao);

    if (hAPI.getCardValue('centroCustosBloqueado') == 'true') {
        throw 'Centro de Custos Principal ou de Rateio Bloqueado!!! Favor procurar a área responsável para desbloqueio ou selecionar outro centro de custo.' +
            '\n Caso opte por outro centro de custos será necessário passar por uma nova alçada de aprovação.'
    }

    var properties = {};
    properties["log.soap.messages"] = "true";
    properties["receive.timeout"] = "300000";


    // var c1 = DatasetFactory.createConstraint("ID_FLUIG", numSolicitacao, numSolicitacao, ConstraintType.MUST);

    var c1 = DatasetFactory.createConstraint("ID_FLUIG", numSolicitacao, numSolicitacao, ConstraintType.MUST);

    var constraints = new Array(c1);

    log.info("##--ci" + constraints);
    log.dir(constraints)
    var ds_contasPagar = DatasetFactory.getDataset("ds_contasPagar", null, constraints, null);
    log.info("##--contasapagar" + ds_contasPagar);
    log.dir(ds_contasPagar);
    var perdComp1 = hAPI.getCardValue('perdCompHidden');
    log.dir(perdComp1);
    if (ds_contasPagar == null || ds_contasPagar.rowsCount == 0 || ds_contasPagar.getValue(0, "NUMERO") == ""|| perdComp1 != "") {
        log.info("##--entrounoif");
        log.dir(ds_contasPagar);
        var integraSolicitacao = hAPI.getCardValue("integraSolicitacao");
        var tipoPagamento = hAPI.getCardValue("tipoLancamento");
        var tipoLancamento = hAPI.getCardValue('zoomTipolancamento');
        // var codNatureza = hAPI.getCardValue('zoomTipolancamento');
        var rateio = (hAPI.getCardValue("existeRateio") == "true") ? true : false;
        var rateioGuiando = hAPI.getCardValue("possuiRateio");
        var geraDirf = (hAPI.getCardValue("cbGeraDirf") == "S") ? 1 : 2;
        var webService = hAPI.getCardValue("viaWebService");
        var origem = hAPI.getCardValue("origem");
        var integraProtheus = hAPI.getCardValue("integraProtheus");

        log.info("##--integraSolicitacao" + integraSolicitacao);
        log.info("##--rateio" + rateio);

        if (integraSolicitacao == "true" || hAPI.getCardValue("idContaGuiando") != '') {

            /// Inicio da criação do XML para integração com o Protheus
            var XML = "";
            XML += '<?xml version="1.0" encoding="UTF-8"?>'
            XML += "<Titulo><Operacao><Id>1</Id></Operacao>"

            if (rateio == true || rateioGuiando == "sim") {
                XML += "<Banco>"
            } else {
                XML += "<Cadastro>"
            }

            var tipo = hAPI.getCardValue("codTipolancamento");
            var codNatureza = hAPI.getCardValue('codNatureza')
            log.info("##--passou0 ");
            //Os prefixos dos títulos incluidos automaticamente devem ser iguais aos tipos, exceto nos casos de pagamento internacional
            //que devem ser "CAM".
            var prefixo = tipo;
            if (tipoPagamento == 'estrangeiro') {
                prefixo = 'CAM';
            }

            //Monta campos do XML pelo Tipo de Lançamento
            if (tipoLancamento == 'GPS') {
                XML += "<E2_CODTRIB>" + hAPI.getCardValue("codTributoGPS") + "</E2_CODTRIB>"
                XML += "<E2_CGCTRIB>" + new java.lang.String(hAPI.getCardValue("cgcTributo")).replaceAll("[^0-9]", "") + "</E2_CGCTRIB>"
                XML += "<E2_COMPET>" + new java.lang.String(hAPI.getCardValue("dataApuracao")).replaceAll("[^0-9]", "").substring(2) + "</E2_COMPET>"
                XML += "<E2_ZPERIOD>" + ajustaData(hAPI.getCardValue("dataApuracao")) + "</E2_ZPERIOD>"
            } else if (tipoLancamento == 'FGTS') {
                XML += "<E2_CGCTRIB>" + new java.lang.String(hAPI.getCardValue("cgcTributo")).replaceAll("[^0-9]", "") + "</E2_CGCTRIB>"
                XML += "<E2_ZTPTRIB>" + codTipoTributo(hAPI.getCardValue("tipoTributo")) + "</E2_ZTPTRIB>"
                XML += "<E2_COMPET>" + new java.lang.String(hAPI.getCardValue("dataApuracao")).replaceAll("[^0-9]", "").substring(2) + "</E2_COMPET>"
                XML += "<E2_ZPERIOD>" + ajustaData(hAPI.getCardValue("dataApuracao")) + "</E2_ZPERIOD>"
            } else if (tipoLancamento == 'DARF') {
                XML += "<E2_CGCTRIB>" + new java.lang.String(hAPI.getCardValue("cgcTributo")).replaceAll("[^0-9]", "") + "</E2_CGCTRIB>"
                XML += "<E2_CODRET>" + hAPI.getCardValue("zoomCodRetencao").split("-")[0] + "</E2_CODRET>"
                XML += "<E2_COMPET>" + new java.lang.String(hAPI.getCardValue("dataApuracao")).replaceAll("[^0-9]", "").substring(2) + "</E2_COMPET>"
                XML += "<E2_ZPERIOD>" + ajustaData(hAPI.getCardValue("dataApuracao")) + "</E2_ZPERIOD>"
                XML += "<E2_DIRF>" + geraDirf + "</E2_DIRF>"
            } else if (tipoLancamento == 'IPTU') {
                XML += "<E2_CGCTRIB>" + new java.lang.String(hAPI.getCardValue("cgcTributo")).replaceAll("[^0-9]", "") + "</E2_CGCTRIB>"
                XML += "<E2_ZTPTRIB>" + codTipoTributo(hAPI.getCardValue("tipoTributo")) + "</E2_ZTPTRIB>"
            }

            if (tipoPagamento == 'dp' || tipoPagamento == 'impostos') {
                if (hAPI.getCardValue('vlJuros') != '' && hAPI.getCardValue('vlJuros') != null && hAPI.getCardValue('vlJuros') != undefined) {
                    XML += "<E2_ZJUROS>" + removeMascaraMonetaria(hAPI.getCardValue("vlJuros")) + "</E2_ZJUROS>"
                }
                if (hAPI.getCardValue('vlMulta') != '' && hAPI.getCardValue('vlMulta') != null && hAPI.getCardValue('vlMulta') != undefined) {
                    XML += "<E2_ZMULTA>" + removeMascaraMonetaria(hAPI.getCardValue("vlMulta")) + "</E2_ZMULTA>"
                }

                if (hAPI.getCardValue('perdCompHidden') != '' && hAPI.getCardValue('perdCompHidden') != null && hAPI.getCardValue('perdCompHidden') != undefined) {
                    XML += "<E2_ZCOMPES>" + hAPI.getCardValue("perdCompHidden") + "</E2_ZCOMPES>"
                }
            }

            log.info("##--passou1 ");
            if (tipoPagamento == 'dp' && tipoLancamento == 'DARF - INSS') {
                XML += "<E2_VALOR>" + removeMascaraMonetaria(hAPI.getCardValue("vlFolha")) + "</E2_VALOR>"
            } else {
                XML += "<E2_VALOR>" + removeMascaraMonetaria(hAPI.getCardValue("valorPgtoGuiaTaxaBoletos")) + "</E2_VALOR>"
            }
            //Integração do campo item contabil se o tipo for juros e emprestimo
            if (tipoPagamento == "diversos" && tipo == "JUR" && codNatureza == "41202010") {
                XML += "<E2_ITEMD>" + hAPI.getCardValue("codItemContabil") + "</E2_ITEMD>"
            }
            log.info("##--passou2 ");
            var natureza = hAPI.getCardValue('zoomNatureza');
            if (natureza == '41111030' || natureza == '41111027' || natureza == '41111028' || natureza == '41111029') {
                XML += "<E2_ZCCIMPO>" + hAPI.getCardValue("campoConcatenadoExterior") + "</E2_ZCCIMPO>"
            
            
            
            } else {
                XML += "<E2_CCD>" + hAPI.getCardValue("CTT_CUSTO") + "</E2_CCD>"
                XML += "<E2_CCUSTO>" + hAPI.getCardValue("CTT_CUSTO") + "</E2_CCUSTO>"

                log.info("##--teste " + hAPI.getCardValue("CTT_CUSTO"));
            }
            log.info("##--passou3 ");
            XML += "<E2_PREFIXO>" + prefixo + "</E2_PREFIXO>"
            XML += "<E2_FILIAL>" + hAPI.getCardValue("filial_protheus") + "</E2_FILIAL>"
            XML += "<E2_TIPO>" + hAPI.getCardValue("codTipoLancamento") + "</E2_TIPO>"
            XML += "<E2_NATUREZ>" + hAPI.getCardValue("zoomNatureza").split("-")[0].trim() + "</E2_NATUREZ>"
            XML += "<E2_FORNECE>" + hAPI.getCardValue("A2_COD") + "</E2_FORNECE>"
            XML += "<E2_EMISSAO>" + ajustaData(hAPI.getCardValue("dataSolicitante")) + "</E2_EMISSAO>"
            XML += "<E2_ZVALENT>" + removeMascaraMonetaria(hAPI.getCardValue("vlrOutEntidades")) + "</E2_ZVALENT>"
            // XML += "<E2_CCD>" + hAPI.getCardValue("CTT_CUSTO") + "</E2_CCD>"
            // XML += "<E2_CCUSTO>" + hAPI.getCardValue("CTT_CUSTO") + "</E2_CCUSTO>"
            XML += "<E2_LOJA>" + hAPI.getCardValue("lojaFornecedor") + "</E2_LOJA>"
            XML += "<E2_HIST>" + removeAcentosEspacos(hAPI.getCardValue("historico")).toUpperCase() + "</E2_HIST>"
            XML += "<E2_ZIDFLG>" + getValue("WKNumProces") + "</E2_ZIDFLG>"
            XML += "<E2_ZDTINT>" + ajustaData(dataAtual()) + "</E2_ZDTINT>"
            XML += "<E2_ZHRINT>" + horaAtual() + "</E2_ZHRINT>"
            XML += "<E2_PARCELA>1</E2_PARCELA>"
            if (rateio == true || rateioGuiando == "sim") {
                XML += "<E2_MULTNAT>1</E2_MULTNAT>"
            } else {
                XML += "<E2_MULTNAT>2</E2_MULTNAT>"
            }
            log.info("##--passou4");
            var moeda = hAPI.getCardValue("sMoeda");
            moeda = moeda == "" ? "1" : moeda;

            XML += "<E2_MOEDA>" + moeda + "</E2_MOEDA>"
            if (moeda == "1") {
                XML += "<E2_TXMOEDA>1</E2_TXMOEDA>";
            } else {
                XML += "<E2_TXMOEDA>" + taxaCotacaoMoeda(moeda) + "</E2_TXMOEDA>";
            }

            var data = new Date();
            //Verifica se o titulo foi pago após o vencimento, para preencher os campos Vencimento Original e Vencimento no Protheus
            if (hAPI.getCardValue('dtDePgtoGuiaTaxaBoletos') != '' && hAPI.getCardValue('dtDePgtoGuiaTaxaBoletos') != null && hAPI.getCardValue('dtDePgtoGuiaTaxaBoletos') != undefined) {
                if (hAPI.getCardValue('dtDePgtoGuiaTaxaBoletos') != hAPI.getCardValue('dtDeVencPgtoGuiaTaxaBoletos')) {
                    XML += "<E2_VENCORI>" + ajustaData(hAPI.getCardValue("dtDeVencPgtoGuiaTaxaBoletos")) + "</E2_VENCORI>"
                    XML += "<E2_VENCTO>" + ajustaData(hAPI.getCardValue('dtDePgtoGuiaTaxaBoletos')) + "</E2_VENCTO>"
                } else {
                    XML += "<E2_VENCTO>" + ajustaData(hAPI.getCardValue("dtDeVencPgtoGuiaTaxaBoletos")) + "</E2_VENCTO>"
                }
            } else {
                XML += "<E2_VENCTO>" + ajustaData(hAPI.getCardValue("dtDeVencPgtoGuiaTaxaBoletos")) + "</E2_VENCTO>"
            }

            if (hAPI.getCardValue('codigoBarra') != '' && hAPI.getCardValue('codigoBarra') != null && hAPI.getCardValue('codigoBarra') != undefined) {
                XML += "<E2_CODBAR>" + removeAcentosEspacos(hAPI.getCardValue('codigoBarra')) + "</E2_CODBAR>"
            }

            if (hAPI.getCardValue('numeroTitulo') != '' && hAPI.getCardValue('numeroTitulo') != null && hAPI.getCardValue('numeroTitulo') != undefined) {
                XML += "<E2_NUM>" + removeAcentosEspacos(hAPI.getCardValue('numeroTitulo')) + "</E2_NUM>"
            }

            //Se existir rateio na solicitação
            if (rateio == true || rateioGuiando == "sim") {
                XML += "</Banco><Naturezas><Natureza>"
                XML += "<EV_VALOR>" + removeMascaraMonetaria(hAPI.getCardValue("valorPgtoGuiaTaxaBoletos")) + "</EV_VALOR>"
                XML += "<EV_NATUREZ>" + hAPI.getCardValue("zoomNatureza").split("-")[0].trim() + "</EV_NATUREZ>"
                XML += "<EV_PERC>100</EV_PERC>"
                XML += "<EV_RATEICC>1</EV_RATEICC>"
                XML += "<CentrosCustos>"
                var campos = hAPI.getCardData(getValue("WKNumProces")).keySet().toArray();
                var id;
                for (var x in campos) {
                    var field = campos[x];
                    if (field.indexOf("codCentroCustoBeneficio___") > -1) {
                        id = field.split("___")[1];
                        XML += "<CentroCusto>"
                        XML += "<EZ_CCUSTO>" + hAPI.getCardValue("codCentroCustoBeneficio___" + id) + "</EZ_CCUSTO>"
                        if (hAPI.getCardValue("tipoLancamento") == "dp" && hAPI.getCardValue("viaWebService") == "true") {
                            XML += "<EZ_VALOR>" + hAPI.getCardValue("valorBeneficio___" + id) + "</EZ_VALOR>"
                        } else {
                            XML += "<EZ_VALOR>" + removeMascaraMonetaria(hAPI.getCardValue("valorBeneficio___" + id)) + "</EZ_VALOR>"
                        }
                        XML += "</CentroCusto>"
                    }
                }
                XML += "</CentrosCustos></Natureza></Naturezas>"
            } else {
                XML += "</Cadastro>"
            }

            XML += "</Titulo>"
            log.info("##--XML:" + XML);
            var periodicService = ServiceManager.getService("OncoclinicasCriacaoTitulos");
            var serviceHelper = periodicService.getBean();
            var serviceLocator = serviceHelper.instantiate("br.com.oncoclinicas.FSWSP001Locator");
            var service = serviceLocator.getFSWSP001SOAP();
            var webService = service.WSINTIPG(XML);
            var mensagem = webService.getMENSAGEM();
            var retorno = webService.getRETORNO();
            if (retorno == 1) {
                hAPI.setCardValue("numeroTitulo", mensagem);
                hAPI.setCardValue("obsTitulo", "Título criado com sucesso.");
                hAPI.setTaskComments("imwn2dyhbuywfa0f1522083830483", getValue("WKNumProces"), 0, "Título criado com sucesso: "+mensagem );
                log.info("##--Numero Titulo " + mensagem);
            } else {
                hAPI.setCardValue("numeroTitulo", "");
                hAPI.setCardValue("obsTitulo", mensagem);
                log.info("##--Falha ao integrar " + mensagem);
                throw mensagem;
            }
            log.info("##--passou8 ");
        } else if (integraProtheus == "true" && tipoPagamento == "impostos") {
            var tipo = hAPI.getCardValue("codTipolancamento");
            var perdComp = hAPI.getCardValue('perdCompHidden');

            //Os prefixos dos títulos incluidos automaticamente devem ser iguais aos tipos, exceto nos casos de pagamento internacional
            //que devem ser "CAM".
            var prefixo = tipo;

            if (tipoPagamento == 'estrangeiro') {
                prefixo = 'CAM';
            }

            var XML = "";

            XML += '<?xml version="1.0" encoding="UTF-8"?>'
            XML += "<Titulo><Operacao><Id>2</Id></Operacao>"
            XML += "<Cadastro>"

            XML += "<E2_FILIAL>" + hAPI.getCardValue("filial_protheus") + "</E2_FILIAL>"
            XML += "<E2_PREFIXO>" + hAPI.getCardValue("prefixoIntegra") + "</E2_PREFIXO>"
            XML += "<E2_NUM>" + removeAcentosEspacos(hAPI.getCardValue('zoomNumTitulo')) + "</E2_NUM>"
            XML += "<E2_PARCELA>" + hAPI.getCardValue("parcelaIntegra") + "</E2_PARCELA>"
            XML += "<E2_TIPO>" + hAPI.getCardValue("tipoIntegra") + "</E2_TIPO>"
            XML += "<E2_FORNECE>" + hAPI.getCardValue("fornecedorIntegra") + "</E2_FORNECE>"
            XML += "<E2_LOJA>" + hAPI.getCardValue("lojaFornecedor") + "</E2_LOJA>"
            XML += "<E2_ZMULTA>" + removeMascaraMonetaria(hAPI.getCardValue("vlMulta")) + "</E2_ZMULTA>"
            XML += "<E2_ZJUROS>" + removeMascaraMonetaria(hAPI.getCardValue("vlJuros")) + "</E2_ZJUROS>"
            XML += "<E2_ZCNABOK>S</E2_ZCNABOK>"

            if (perdComp != "" && perdComp != null && perdComp != undefined) {
                XML += "<E2_ZCOMPES>" + hAPI.getCardValue("perdCompHidden") + "</E2_ZCOMPES>"
            }
            
            log.info("##--passou6 ");
            XML += "</Cadastro>"
            XML += "</Titulo>"
            log.info("##--XML:" + XML);
            log.info("##--entrouaqui ");
            var periodicService = ServiceManager.getService("OncoclinicasCriacaoTitulos");
            var serviceHelper = periodicService.getBean();
            var serviceLocator = serviceHelper.instantiate("br.com.oncoclinicas.FSWSP001Locator");
            var service = serviceLocator.getFSWSP001SOAP();
            var webService = service.WSINTIPG(XML);
            var mensagem = webService.getMENSAGEM();
            var retorno = webService.getRETORNO();
            if (retorno == 1) {
                hAPI.setCardValue("numeroTitulo", mensagem);
                hAPI.setCardValue("obsTitulo", "Título criado com sucesso.");
                hAPI.setTaskComments("imwn2dyhbuywfa0f1522083830483", getValue("WKNumProces"), 0, "Título criado com sucesso: "+mensagem );
                log.info("##--Numero Titulo " + mensagem);
            } else {
                hAPI.setCardValue("numeroTitulo", "");
                hAPI.setCardValue("obsTitulo", mensagem);
                log.info("##--Falha ao integrar " + mensagem);
                throw mensagem;
            }
        } else if (webService == "true") {
            var tipo = hAPI.getCardValue("codTipolancamento");

            //Os prefixos dos títulos incluidos automaticamente devem ser iguais aos tipos, exceto nos casos de pagamento internacional
            //que devem ser "CAM".
            var prefixo = tipo;
            if (tipoPagamento == 'estrangeiro') {
                prefixo = 'CAM';
            }
            var XML = "";
            XML += '<?xml version="1.0" encoding="UTF-8"?>'
            XML += "<Titulo><Operacao><Id>2</Id></Operacao>"
            XML += "<Cadastro>"

            XML += "<E2_PREFIXO>" + hAPI.getCardValue("prefixoWebS") + "</E2_PREFIXO>"
            XML += "<E2_FILIAL>" + hAPI.getCardValue("filial_protheus") + "</E2_FILIAL>"
            XML += "<E2_TIPO>" + hAPI.getCardValue("codTipoLancamento") + "</E2_TIPO>"
            XML += "<E2_FORNECE>" + hAPI.getCardValue("A2_COD") + "</E2_FORNECE>"
            XML += "<E2_LOJA>" + hAPI.getCardValue("lojaFornecedor") + "</E2_LOJA>"
            XML += "<E2_PARCELA>" + hAPI.getCardValue("parcelaWS") + "</E2_PARCELA>"
            // XML += "<E2_NATUREZ>" + hAPI.getCardValue("zoomNatureza").split("-")[0].trim() + "</E2_NATUREZ>"
            XML += "<E2_NUM>" + removeAcentosEspacos(hAPI.getCardValue('numeroWebS')) + "</E2_NUM>"
            XML += "<E2_ZMULTA>" + removeMascaraMonetaria(hAPI.getCardValue("vlMulta")) + "</E2_ZMULTA>"
            XML += "<E2_ZJUROS>" + removeMascaraMonetaria(hAPI.getCardValue("vlJuros")) + "</E2_ZJUROS>"
            XML += "<E2_ZCNABOK>S</E2_ZCNABOK>"

            XML += "</Cadastro>"
            XML += "</Titulo>"
            log.info("##--XML:" + XML);

            var periodicService = ServiceManager.getService("OncoclinicasCriacaoTitulos");
            var serviceHelper = periodicService.getBean();
            var serviceLocator = serviceHelper.instantiate("br.com.oncoclinicas.FSWSP001Locator");
            var service = serviceLocator.getFSWSP001SOAP();
            var webService = service.WSINTIPG(XML);
            var mensagem = webService.getMENSAGEM();
            var retorno = webService.getRETORNO();
            if (retorno == 1) {
                hAPI.setCardValue("numeroTitulo", mensagem);
                hAPI.setCardValue("obsTitulo", "Título criado com sucesso.");
                hAPI.setTaskComments("imwn2dyhbuywfa0f1522083830483", getValue("WKNumProces"), 0, "Título criado com sucesso: "+mensagem );
                log.info("##--Numero Titulo " + mensagem);
            } else {
                hAPI.setCardValue("numeroTitulo", "");
                hAPI.setCardValue("obsTitulo", mensagem);
                log.info("##--Falha ao integrar " + mensagem);
                throw mensagem;
            }
        } else if (integraSolicitacao == "false" && tipoPagamento != "impostos") {
            log.info("## Já foi encontrado um título integrado para a solicitação " + numSolicitacao);
            var numeroTitulo = ds_contasPagar.getValue(0, "NUMERO");
            hAPI.setCardValue("numeroTitulo", numeroTitulo);
            hAPI.setCardValue("obsTitulo", "Título criado com sucesso " + ds_contasPagar.getValue(0, "DT_INTEGRACAO") + " às " + ds_contasPagar.getValue(0, "HR_INTEGRACAO"));
            hAPI.setTaskComments(getValue("WKUser"), getValue("WKNumProces"), 0, "Título criado com sucesso em " + ds_contasPagar.getValue(0, "DT_INTEGRACAO") + " às " + ds_contasPagar.getValue(0, "HR_INTEGRACAO"));
            log.info("##--Numero Titulo " + numeroTitulo);
        }
    }
}

/**
 *
 * @returns {String} Retorna a data atual formatada dd/mm/aaaa.
 */
function dataAtual() {

    var data = new Date();
    var dia = data.getUTCDate();
    var mes = data.getUTCMonth() + 1;
    var ano = data.getUTCFullYear();
    if (dia < 10) {
        dia = "0" + dia;
    }
    if (mes < 10) {
        mes = "0" + mes;
    }
    return dia + "/" + mes + "/" + ano;
}

/**
 *
 * @returns {String} Retorna a hora atual formatada HH:MM:SS.
 */
function horaAtual() {
    var data = new Date();
    var hora = data.getHours();
    var minuto = data.getMinutes();
    var segundo = data.getSeconds();
    return ((hora < 10) ? "0" + hora : hora) + ":" + ((minuto < 10) ? "0" + minuto : minuto) + ":" + ((segundo < 10) ? "0" + segundo : segundo);
}

/**
 * Recebe uma String como paramentro e a retorna sem os acentos
 * @param string
 * @returns
 */
function removeAcentos(string) {
    string = string.toUpperCase();
    string = string.replaceAll('Á|À|Â|Ã|Ä', 'A');
    string = string.replaceAll('É|È|Ê|Ë', 'E');
    string = string.replaceAll('Í|Ì|Î|Ï', 'I');
    string = string.replaceAll('Ó|Ò|Ô|Õ|Ö', 'O');
    string = string.replaceAll('Ú|Ù|Û|Ü', 'U');
    string = string.replaceAll('Ç', 'C');
    string = string.replaceAll('º', '');
    string = string.replaceAll('°', '');
    string = string.replaceAll('°', '');
    return string
}

/**
 * Recebe uma String como paramentro e a retorna sem os acentos
 * @param string
 * @returns
 */
function formataCGC(string) {
    string = string.toUpperCase();
    string = string.replaceAll('.', '');
    string = string.replaceAll('/', '');
    string = string.replaceAll('-', '');
    return string
}

/**
 * Funcao para remover a mascara monetaria.
 * @param mask - Conteudo que terá sua mascara removida.
 * @returns - Retorna um float sem mascara monetaria.
 */
function removeMascaraMonetaria(valor) {

    if (hAPI.getCardValue('sMoeda') == '' || hAPI.getCardValue('sMoeda') == '1' || hAPI.getCardValue('sMoeda') == '4') {
        valor = valor.replace("R$", ''); //1 - Real ou 4 - UFIR
    } else if (hAPI.getCardValue('sMoeda') == '2') {
        valor = valor.replace("US$", ''); //2 - Dolar
    } else if (hAPI.getCardValue('sMoeda') == '3') {
        valor = valor.replace("€", ''); //3 - Euro
    } else if (hAPI.getCardValue('sMoeda') == '5') {
        valor = valor.replace("¥", ''); //5 - Iene
    }
    valor = valor.replace(" ", '');

    while (valor.indexOf(".") != -1) {
        valor = valor.replace('.', '');
    }

    valor = valor.replace(",", ".");
    valor = parseFloat(valor);

    return valor;

}

function codTipoTributo(tipo) {
    var ret = "";
    if (tipo == 'ISS/IPTU/OUTROS') {
        ret = '1';
    } else if (tipo == 'IPV') {
        ret = '2';
    } else if (tipo == 'DRJ') {
        ret = '3';
    } else if (tipo == 'FGT') {
        ret = '4';
    } else if (tipo == 'GNR') {
        ret = '5';
    }
    return ret;
}

function ajustaData(data) {
    var novaData = "";
    var aux;
    if (data.indexOf("-") > 0) {
        aux = data.split("-");
        novaData = aux[0] + aux[1] + aux[2];
    } else {
        aux = data.split("/");
        novaData = aux[2] + aux[1] + aux[0];
    }
    return novaData;
}

function removeAcentosEspacos(string) {
    if (string != '' && string != null && string != undefined) {
        string = new java.lang.String(string);
        string = string.toUpperCase();
        string = string.replaceAll('Á|À|Â|Ã|Ä', 'A');
        string = string.replaceAll('É|È|Ê|Ë', 'E');
        string = string.replaceAll('Í|Ì|Î|Ï', 'I');
        string = string.replaceAll('Ó|Ò|Ô|Õ|Ö', 'O');
        string = string.replaceAll('Ú|Ù|Û|Ü', 'U');
        string = string.replaceAll('Ç', 'C');
        string = string.replaceAll('[^A-Za-z0-9]', '');
    }
    return string
}

function taxaCotacaoMoeda(moeda) {
    var ds_moeda = DatasetFactory.getDataset("ds_moeda", null, null, null);
    for (var i = 0; i < ds_moeda.rowsCount; i++) {
        if (ds_moeda.getValue(i, "CODIGO") == moeda) {
            return ds_moeda.getValue(i, "VALOR");
        }
    }
}