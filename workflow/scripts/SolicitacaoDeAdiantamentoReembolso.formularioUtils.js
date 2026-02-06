//function formularioUtils(){
//	
//	this.buscaCamposPaiFilho = function(arrCampos){	
//		var arrReferencia = new Array();
//		var arrResult     = new Array();
//		var cardData      = hAPI.getCardData(getValue("WKNumProces"));/* Alterar aqui caso for utilizar em algum evento de formulario => form.getCardData(); */	
//		var iterator      = cardData.keySet().iterator();	
//		var campos        = new Array();
//		
//		arrReferencia.contains = function(obj) {		
//		    var i = this.length;
//		    while (i--) {	    	
//		        if (this[i].ref == obj) {
//		            return true;
//		        }
//		    }
//		    return false;
//		};
//		
//		arrCampos.contains = function(obj) {		
//		    var i = this.length;
//		    while (i--) {	    	
//		        if (this[i].ref == obj) {
//		            return true;
//		        }
//		    }
//			
//		    return false;
//		};
//		
//		while (iterator.hasNext()) {			
//			var curField = iterator.next();	
//			if((curField.indexOf("___") > -1) && arrCampos.contains(curField.substring(0, curField.indexOf("___")))) {							
//				if(!arrReferencia.contains(curField.substring(0, curField.indexOf("___") + 3))){						
//					var ref = curField.substring(0, curField.indexOf("___") + 3);										
//					arrReferencia.push({"ref":ref});					
//				}
//				campos.push({"desc":curField});			
//			}		
//		}
//		
//		if(arrReferencia.length <= 0)
//			return;
//		
//		var referencia = arrReferencia[0].ref;
//						
//		for(c in campos){			
//			var curField = campos[c].desc;	
//			if(curField == undefined)
//				continue;							
//			if (curField.indexOf(referencia) > -1) {				
//				var idx = curField.substring(curField.indexOf("___") + 3, curField.length());					
//				var str = "";		
//				for(item in arrReferencia){
//					var cam = arrReferencia[item].ref;
//					if(cam == undefined)
//						continue;				
//										
//					str += (str?",":"")+"'"+cam.replace("___", "")+"'"+":"+					
//					"{" +
//						"'name' :'" + cam + idx +"'" + "," +
//						"'value':'" + (hAPI.getCardValue(cam + idx)?hAPI.getCardValue(cam + idx).replace("'", ""):"")+"'" +"" +
//					"}";					
//				}					
//				eval('arrResult.push({'+str+'});');					
//			}						
//		}				
//		return arrResult;
//	};	
//}