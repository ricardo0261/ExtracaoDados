// funçoes utilizadas para decisoes dos exclusivos

function exclusivo12() {
	
	if (hAPI.getCardValue('decisaoGestorHidden') == 'sim') {
		
		if (parseFloat(hAPI.getCardValue('valorTotal')) > 5000 ) {   
		    		
		    		if (hAPI.getCardValue('ultimoAprovador') == 'nao'){
		    			
			    		hAPI.setCardValue('validaAlcadaAprovador',"sim");
			    		var aprovador2 = hAPI.getCardValue('codigoAprovador2');
			    		hAPI.setCardValue('codigoAprovador',aprovador2); 
			    		
			    		if ((hAPI.getCardValue('filialOrigem_protheus') == "00101" || hAPI.getCardValue('filialOrigem_protheus') == "00104")&& hAPI.getCardValue('nextAprovador') == 'sim' && hAPI.getCardValue('achou2cc') == 'sim' ){	    			
			    			var aprovadorArea = hAPI.getCardValue('gestorArea');         		
			        		hAPI.setCardValue('codigoAprovador',aprovadorArea);
			        		hAPI.setCardValue('validaAlcadaAprovador',"nao");	        		
			        		log.info("pegou ultimo aprovador gestor")
			        		return 0;	// avança para fora politica
			    		}else if ((hAPI.getCardValue('filialOrigem_protheus') != "00101" && hAPI.getCardValue('filialOrigem_protheus')!= "00104") && hAPI.getCardValue('nextAprovador') == 'sim' ){	    			
			    			var gerenteRegional = hAPI.getCardValue('aprovadorRegional');	        		
			        		hAPI.setCardValue('codigoAprovador',gerenteRegional);  
			        		hAPI.setCardValue('validaAlcadaAprovador',"nao");			    			
			    			return 0;    	
				        	log.info("avança para a proxima fase");
			    		} 
						if (hAPI.getCardValue("area") == "CEO") { 
							return 4;
						}
			    		return 1; // volta para o segundo aprov	
		    		}else if (hAPI.getCardValue('ultimoAprovador') == 'sim'){
		    			return 4; // avança
		    		}
		    		    		
		  }	else if (parseFloat(hAPI.getCardValue('valorTotal')) <= 5000 && hAPI.getCardValue('nextGestor') == 'sim') {
		    		    		    		
		    		if ((hAPI.getCardValue('filialOrigem_protheus') == "00101" || hAPI.getCardValue('filialOrigem_protheus') == "00104")){    	
						if (hAPI.getCardValue("area") == "CEO") { 
							return 4;
						}else{
							var aprovadorArea = hAPI.getCardValue('gestorArea');  
							hAPI.setCardValue('validaAlcadaAprovador',"nao");
							hAPI.setCardValue('codigoAprovador',aprovadorArea);       			
							log.info("aprovador menor dentro da politica: < 5000 "+ aprovadorArea);		    			
							return 1;	
							log.info("pegou return1");
						}					    		
		    		} else{		    			
			    		return 4;    	
			        	
		    		}
				
		  } else if (parseFloat(hAPI.getCardValue('valorTotal')) <= 5000 && hAPI.getCardValue('nextGestor') == 'nao') {
			  
			  			return 4;
		  }     
		}else if (hAPI.getCardValue('decisaoGestorHidden') == 'nao'){
				return 2;    	
				log.info("nao econtrou nada e foi para o proximo aprovador da unidade.");
		}else{		
				return 3;
		}
}



function exclusivo42() {
	
	log.info("entrou no decisor da atv exclusivo42");			
	// infoDentroPoliticaHidden" == "0" - dentro da politica 
	// infoDentroPoliticaHidden" == "1" - fora da politica 
	
	log.info("valor reembolso: "+parseFloat(hAPI.getCardValue('totalDasDespesas')));
	
	if (hAPI.getCardValue("tipoSolicitacaoHidden") == "adiantamento" && hAPI.getCardValue('excecaoCC') != 'sim') { 
		log.info("entrou no tipoSolicitacaoHidden"); 
    	return 2 ;   	
    }
 
	if (hAPI.getCardValue("area") == "CEO" && hAPI.getCardValue('excecaoCC') != 'sim') { 
		log.info("entrou no area CEO"); 
    	return 2 ;   	
    }
		
	else if (hAPI.getCardValue('decisaoGestorReembolsoHidden') == 'sim' && hAPI.getCardValue("tpReembolso") == "3") {
    	log.info("entrou no decisor rembolso sim + rembolso 3");    	
    	return 0
    } 
    
    else if (hAPI.getCardValue("decisaoGestorReembolsoHidden") == "sim" && hAPI.getCardValue("infoDentroPoliticaHidden") == "1" && hAPI.getCardValue('nextAprovador') == 'nao'){	
    	log.info("nao econtrou nada e foi para o proximo aprovador da unidade.");
    	return 5;    
    }
    
    else if (hAPI.getCardValue("decisaoGestorReembolsoHidden") == "nao") {    	
    	log.info("entrou no decisor rembolso nao");    
    	return 3 ;   	
    } 
    
    else if (hAPI.getCardValue('decisaoGestorReembolsoHidden') == 'cancelar'){ 
    	log.info("entrou no decisor rembolso cancelar");    	
    	return 4;     	
    }
  
    // novo codigo dentro da politica
    
    else if (hAPI.getCardValue("decisaoGestorReembolsoHidden") == "sim" && hAPI.getCardValue("infoDentroPoliticaHidden") == "0") {
    	
    	if (hAPI.getCardValue('excecaoCC') == 'sim' && (hAPI.getCardValue('codigoAprovador2') != "" && hAPI.getCardValue('codigoAprovador2') != "0" ) &&
    		hAPI.getCardValue('ultimoAprovador') != 'sim' && hAPI.getCardValue('validaAlcadaAprovador') != 'sim' ) {
			
    		log.info('entrou na primeira')
			var aprovador2 = hAPI.getCardValue('codigoAprovador2');
    		hAPI.setCardValue('codigoAprovador',aprovador2); 
    		hAPI.setCardValue('ultimoAprovador','sim');  
    		
    		if (hAPI.getCardValue('codigoAprovador3') != ""){
    			log.info('entrou no aprov 3 if');
    			hAPI.setCardValue('ultimoAprovador','nao'); 
    			hAPI.setCardValue('validaAlcadaAprovador',"sim");
    			hAPI.setCardValue('codigoAprovador2',"");
    			return 6;    			
    			
    		}else{
    			log.info('entrou no return 1 da excecao')    			
    			return 1;
    		}    		
    		
		}
		else if (hAPI.getCardValue('excecaoCC') == 'sim' && hAPI.getCardValue('codigoAprovador2') == "0" 
				&& hAPI.getCardValue('codigoAprovador3') != "" && hAPI.getCardValue('ultimoAprovador') != 'sim' 
				&& hAPI.getCardValue('validaAlcadaAprovador') == "nao") {
			log.info('entrou no aprov 3')
			var aprovador3 = hAPI.getCardValue('codigoAprovador3');
    		hAPI.setCardValue('codigoAprovador',aprovador3); 
    		hAPI.setCardValue('ultimoAprovador','sim');    		
    		return 6;     	
		}else    	
    	if (parseFloat(hAPI.getCardValue('totalDasDespesas')) > 5000 && hAPI.getCardValue('excecaoCC') != 'sim' ) {   
    		
    		if (hAPI.getCardValue('ultimoAprovador') == 'nao'){
    			
	    		hAPI.setCardValue('validaAlcadaAprovador',"sim");
	    		var aprovador2 = hAPI.getCardValue('codigoAprovador2');
	    		hAPI.setCardValue('codigoAprovador',aprovador2); 
    		
	    		if ((hAPI.getCardValue('filialOrigem_protheus') == "00101" || hAPI.getCardValue('filialOrigem_protheus') == "00104")&& hAPI.getCardValue('nextAprovador') == 'sim' && hAPI.getCardValue('achou2cc') == 'sim' ){	    			
	    			var aprovadorArea = hAPI.getCardValue('gestorArea');         		
	        		hAPI.setCardValue('codigoAprovador',aprovadorArea);
	        		hAPI.setCardValue('validaAlcadaAprovador',"nao");	        		
	        		log.info("pegou ultimo aprovador gestor")
	    		}else if ((hAPI.getCardValue('filialOrigem_protheus') != "00101" && hAPI.getCardValue('filialOrigem_protheus')!= "00104") && hAPI.getCardValue('nextAprovador') == 'sim' ){	    			
	    			var aprovadorGO = hAPI.getCardValue('aprovadorGO');        		
	        		hAPI.setCardValue('codigoAprovador',aprovadorGO); 	
	        		hAPI.setCardValue('validaAlcadaAprovador',"nao");	        		
	        		log.info("pegou ultimo aprovador gerente");
	        		return 2;
	    		} 
	    		log.info('entrou no return 1 do total > 5000')
	    		return 1;	
    		}else if (hAPI.getCardValue('ultimoAprovador') == 'sim'){
    			log.info('entrou no return 2 do total > 5000')
    			return 2;
    		}
    		    		
    	}
    	
    	else if (parseFloat(hAPI.getCardValue('totalDasDespesas')) <= 5000 && hAPI.getCardValue('nextGestor') == 'sim' && hAPI.getCardValue('excecaoCC') != 'sim') {
    		    		    		
    		if ((hAPI.getCardValue('filialOrigem_protheus') == "00101" || hAPI.getCardValue('filialOrigem_protheus') == "00104")){    			
    			var aprovadorArea = hAPI.getCardValue('gestorArea');  
    			hAPI.setCardValue('validaAlcadaAprovador',"nao");
    			hAPI.setCardValue('codigoAprovador',aprovadorArea);       			
    			log.info("aprovador menor dentro da politica: < 5000 "+ aprovadorArea);    			
    		}
    		log.info("pegou return1")
    		return 1;	
    		
    	}	
    	else{
    		log.info("nao encontrou nada e foi para a atv 50.");
    		return 2;    	        	
    	}
    } 
    
    
    
    //
        
    else if (hAPI.getCardValue("decisaoGestorReembolsoHidden") == "sim" && hAPI.getCardValue("infoDentroPoliticaHidden") == "1" && hAPI.getCardValue('nextAprovador') == 'sim' && hAPI.getCardValue('excecaoCC') != 'sim') {
    	
    	log.info("entrou no decisor rembolso fora politica");
    	if (parseFloat(hAPI.getCardValue('totalDasDespesas')) > 5000 && hAPI.getCardValue('nextAprovador') == 'sim') {
    		log.info("entrou aprovacao fora politica + despesas > 5000");    	
    		hAPI.setCardValue('validaAlcadaAprovador',"nao");    		
    		
		    		if ((hAPI.getCardValue('filialOrigem_protheus') == "00101" || hAPI.getCardValue('filialOrigem_protheus') == "00104")){    			
		    			var aprovador2 = hAPI.getCardValue('codigoAprovador2');
		        		hAPI.setCardValue('codigoAprovador',aprovador2); 
		        		var aprovadorArea = hAPI.getCardValue('gestorArea');  
		    			hAPI.setCardValue('aprovadorFilOrigem',aprovadorArea); 
		    			return 1;   
		        		log.info("pegou o 1");
		    		}else{	    			
		    			var gerenteRegional = hAPI.getCardValue('aprovadorRegional');	        		
		        		hAPI.setCardValue('codigoAprovador',gerenteRegional);		        			        		
		        		hAPI.setCardValue('aprovadorFilOrigem',gerenteRegional);
		        		log.info("pegou aprovador regional e filorigem - fora politica > 5000 - fora CSO");
		        		return 5;
		    		}    				    		
    		
    	}
    	
    	else if (parseFloat(hAPI.getCardValue('totalDasDespesas')) <= 5000 && hAPI.getCardValue('nextAprovador') == 'sim' && hAPI.getCardValue('excecaoCC') != 'sim') {
    		
    		log.info("entrou aprovacao fora politica + despesas < 5000");
    		
    		if ((hAPI.getCardValue('filialOrigem_protheus') == "00101" || hAPI.getCardValue('filialOrigem_protheus') == "00104")){    			
    			var aprovadorArea = hAPI.getCardValue('gestorArea');  
    			hAPI.setCardValue('aprovadorFilOrigem',aprovadorArea);    
    			hAPI.setCardValue('validaAlcadaAprovador',"nao");
    			log.info("aprovador menor: < 5000 "+ aprovadorArea);
    			
    		}else{	    			
    			var gerenteRegional = hAPI.getCardValue('aprovadorRegional');	        		
        		hAPI.setCardValue('aprovadorFilOrigem',gerenteRegional);	
        		hAPI.setCardValue('validaAlcadaAprovador',"nao");
    		}
    		log.info("pegou o 5");
    		return 5;	
    		
    	}	
    	else{
    		log.info("nao econtrou nada e foi para o proximo aprovador da unidade.");
    		return 5;    	
        	
    	}
    }     	    	
    	
    
}



function exclusivo127() {
	
    if (hAPI.getCardValue("decisaoGestorHiddenCSOFP") == "sim"){    	
    	
       if ((hAPI.getCardValue('filialOrigem_protheus') == "00101" || hAPI.getCardValue('filialOrigem_protheus') == "00104") && hAPI.getCardValue('nextDiretor') == 'sim') {  
   
    	   if ( hAPI.getCardValue("infoDentroPoliticaHidden") == "1"){
				if(hAPI.getCardValue("area") == "DIRETORIA HOLDING"){
					return 1
				}else{//se for fora da politica
					var diretorArea = hAPI.getCardValue('diretorArea');
					hAPI.setCardValue('validaAlcadaDiretor',"nao");
					hAPI.setCardValue('nextDiretor',"nao");
					hAPI.setCardValue('aprovadorFilOrigem',diretorArea);
					return 0     
				}
 		   
    	   }else{
    		   return 1
    	   }
    	   
    	}else if ((hAPI.getCardValue('filialOrigem_protheus') != "00101" && hAPI.getCardValue('filialOrigem_protheus') != "00104") && hAPI.getCardValue('nextDiretor') == 'sim'){
    		
    		hAPI.setCardValue('validaAlcadaDiretor',"nao");
    		return 1
    		
    	}else{
    		
    		return 1;    		
    	}	
    } else {    	
    	
    	return 2    	
    }
       
    
}

