function servicetask162(attempt, message) {
    var numSolicitacao = getValue("WKNumProces");
    
    var properties = {};
    properties["log.soap.messages"] = "true";
    properties["receive.timeout"] = "300000";
        
    var indexes = hAPI.getChildrenIndexes("tbImpostos");   
    var loja = "01";
	
	for (var i = 0; i < indexes.length; i++) { 
		
		if ( hAPI.getCardValue("integra___"+indexes[i]) == "S"){ 	    
			
			var tipo = hAPI.getCardValue("codTipolancamento");

			var dirf = hAPI.getCardValue("dirf___"+indexes[i]);
				if (dirf == "S") {dirf = "1"
				}else{ dirf = "2" }
				
			var forn = hAPI.getCardValue("forn___"+indexes[i]);
			var constraint = new Array();
		    constraint.push(DatasetFactory.createConstraint('CODIGO', forn, forn, ConstraintType.MUST));				
			var dsResult = DatasetFactory.getDataset('ds_fornecedor', null, constraint, null);			
			var loja = dsResult.getValue(0, "LOJA")
	
            var XML = "";
            XML += '<?xml version="1.0" encoding="UTF-8"?>'
            XML += "<Titulo><Operacao><Id>1</Id></Operacao>"
            XML += "<Cadastro>"            
            XML += "<E2_FILIAL>" + hAPI.getCardValue("filial_protheus") + "</E2_FILIAL>"
            XML += "<E2_PREFIXO>" + hAPI.getCardValue("tit___"+indexes[i]) + "</E2_PREFIXO>"           
            XML += "<E2_PARCELA>1</E2_PARCELA>" 
            XML += "<E2_TIPO>" + hAPI.getCardValue("tit___"+indexes[i]) + "</E2_TIPO>"
            XML += "<E2_FORNECE>" + hAPI.getCardValue("forn___"+indexes[i]) + "</E2_FORNECE>"
            XML += "<E2_LOJA>"+ loja +"</E2_LOJA>"
            XML += "<E2_ZMULTA>0</E2_ZMULTA>"
            XML += "<E2_ZJUROS>0</E2_ZJUROS>"
            XML += "<E2_ZCNABOK>S</E2_ZCNABOK>"
            XML += "<E2_NATUREZ>" + hAPI.getCardValue("natur___"+indexes[i]) + "</E2_NATUREZ>"           
            XML += "<E2_EMISSAO>" + ajustaData(hAPI.getCardValue("dataSolicitante")) + "</E2_EMISSAO>"           
            XML += "<E2_VALOR>" + removeMascaraMonetaria(hAPI.getCardValue("vlimp___"+indexes[i])) + "</E2_VALOR>"
            XML += "<E2_CCD>" + hAPI.getCardValue("CTT_CUSTO") + "</E2_CCD>"
            XML += "<E2_CCUSTO>" + hAPI.getCardValue("CTT_CUSTO") + "</E2_CCUSTO>"
            XML += "<E2_HIST>" + removeAcentosEspacos(hAPI.getCardValue("historico")).toUpperCase() + "</E2_HIST>"
            XML += "<E2_ZIDFLG>" + getValue("WKNumProces") + "</E2_ZIDFLG>"
            XML += "<E2_ZDTINT>" + ajustaData(dataAtual()) + "</E2_ZDTINT>"
            XML += "<E2_ZHRINT>" + horaAtual() + "</E2_ZHRINT>"             
            XML += "<E2_MULTNAT>2</E2_MULTNAT>"
            XML += "<E2_VENCTO>" + ajustaData(hAPI.getCardValue("venc___"+indexes[i])) + "</E2_VENCTO>"
            XML += "<E2_CODRET>" + hAPI.getCardValue("darf___"+indexes[i]) + "</E2_CODRET>"           
            XML += "<E2_CGCTRIB>" + new java.lang.String(hAPI.getCardValue("cnpjContribuinte")).replaceAll("[^0-9]", "") + "</E2_CGCTRIB>"
            XML += "<E2_ZPERIOD>" + ajustaData(hAPI.getCardValue("dataApuracaoImp")) + "</E2_ZPERIOD>"
            XML += "<E2_DIRF>" + dirf + "</E2_DIRF>"
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
                hAPI.setCardValue("tit_gerado___"+indexes[i], mensagem);
                hAPI.setCardValue("obsTitulo", "Título criado com sucesso.");
                log.info("##--Numero Titulo " + mensagem);
            } else {
                hAPI.setCardValue("numeroTitulo", "");
                hAPI.setCardValue("obsTitulo", mensagem);
                log.info("##--Falha ao integrar " + mensagem);
                throw mensagem;
            }
						
							 					
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



