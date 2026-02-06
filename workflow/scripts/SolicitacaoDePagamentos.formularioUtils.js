function formularioUtils(){
	
	this.buscaCamposPaiFilho = function(arrCampos){	
		var arrReferencia = new Array();
		var arrResult     = new Array();
		var cardData      = hAPI.getCardData(getValue("WKNumProces"));/* Alterar aqui caso for utilizar em algum evento de formulario => form.getCardData(); */	
		var iterator2      = cardData.entrySet().iterator();	
		var campos        = new Array();
		
		arrReferencia.contains = function(obj) {		
		    var i = this.length;
		    while (i--) {	    	
		        if (this[i].ref == obj) {
		            return true;
		        }
		    }
		    return false;
		};
		
		arrCampos.contains = function(obj) {		
		    var i = this.length;
		    while (i--) {	    	
		        if (this[i].ref == obj) {
		            return true;
		        }
		    }
			
		    return false;
		};
		var lastIndice = 0;
		while (iterator2.hasNext()) {			
			var curField = iterator2.next();
			var chave = curField.getKey() + "";
			var valor = '';
			var desc = '';
			if((chave.indexOf("___") > -1)){
				for(x in arrCampos){
					var referencia = arrCampos[x]["ref"];
					if(referencia != undefined){	
						referencia = arrCampos[x]["ref"] + "";
						if(referencia.indexOf(chave.substring(0,chave.indexOf("___"))) > -1){	
							var indice = parseInt(chave.substring(chave.indexOf("___") + 3, chave.length));
							if(indice > lastIndice){
								lastIndice = indice;
							}
							if(chave == ('valorBeneficio___'+indice)){
								desc = 'EZ_VALOR___';
								valor = converteMoedaFloat(curField.getValue()+"");
							} else if(chave == ('codCentroCustoBeneficio___'+indice)) {
								desc = 'EZ_CCUSTO___';
								valor = curField.getValue();
							}
							campos.push({"idx":indice,"desc":desc,"val": valor});		
						}
					}
				}
			}
		}
		
		for(var x = 1; x <= lastIndice; x++){
			var str = "";	
			for(var c in campos){
				var indiceObject = campos[c]["idx"];
				if(x ==  indiceObject){
					str += (str?",":"")+"'"+campos[c]["desc"]+"'"+":"+					
					"{" +
						"'name' :'" + campos[c]["desc"] +"'" + "," +
						"'value':'" + campos[c]["val"]+"'" +"" +
					"}";
					
				}	
			}
			eval('arrResult.push({'+str+'});');
		}
		
		return arrResult;
	};	
}

/**
 * Converte o valor de um campo monetário para o formato aceito pelo Protheus
 * @param valor String do valor informado
 * @returns retorna o valor monetário como float
 */
function converteMoedaFloat(valor){
	if(hAPI.getCardValue('sMoeda') == '' || hAPI.getCardValue('sMoeda') == '1' || hAPI.getCardValue('sMoeda') == '3'){
		valor = valor.replace("R$",'');
	} else if (hAPI.getCardValue('sMoeda') == '2'){
		valor = valor.replace("US$",'');
	} else if (hAPI.getCardValue('sMoeda') == '4'){
		valor = valor.replace("€",'');
	} else if (hAPI.getCardValue('sMoeda') == '5'){
		valor = valor.replace("¥",'');
	}
	valor = valor.replace(" ",'');
	
	while(valor.indexOf(".") != -1){
		valor = valor.replace('.','');
	}
	
	valor = valor.replace(",",".");
	valor = parseFloat(valor);
	
	return valor;
}
