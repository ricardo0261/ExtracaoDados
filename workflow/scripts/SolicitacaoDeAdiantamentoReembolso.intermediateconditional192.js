function intermediateconditional192() {

var status = hAPI.getCardValue('valTransfeera_02');
	
	segundaEtapa();
		
	if (status != "nao"){		
		return true;		
	}		

}

function segundaEtapa(){

 	var token = geraToken();
 	log.info("token gerado: "+ token )
    var idTransfeera =  hAPI.getCardValue("idConsultaT")
    log.info("idTransfeera: "+ idTransfeera )
    var respostaMicro =  consultaValidacao(idTransfeera, token)
    var resultado = respostaMicro
    log.info("respostaMicro: "+respostaMicro)
    hAPI.setCardValue("respostaMicro", resultado)
    if(resultado == true){
    	
    	hAPI.setCardValue("valTransfeera_02", "sim")      	   
    	log.info("##-- entrou no SIM valida Micro");
	   
    }else if(resultado == false){
     
    	hAPI.setCardValue("valTransfeera_02", "erro")
    	log.info("##-- entrou no NAO valida Micro");
    }
    else if(resultado == null){
     
    	hAPI.setCardValue("valTransfeera_02", "nao")
    	log.info("##-- entrou no NULL valida Micro");
    }       
 
} 

function consultaValidacao (idTransfeera, token){	
		var urlAPI = "https://contacerta-api-sandbox.transfeera.com/validation/" + idTransfeera;
		// var urlAPI = "https://contacerta-api.transfeera.com/validation/" + idTransfeera;
		var url = new java.net.URL(urlAPI);
		var connection = url.openConnection();
		
		log.info("URL API: "+urlAPI);
		
		// POST para enviar os dados
		connection.setRequestMethod("GET");
		
		// Tipo de dado a ser enviado		
		connection.setRequestProperty("Authorization", token);
		connection.setRequestProperty("Content-Type", "application/json");
		connection.setRequestProperty("User-Agent", "ONCOCLINICAS DO BRASIL SERVICOS MEDICOS SA (equipe.financeiro@oncoclinicas.com)");     
		
		// Send post request
		connection.setDoOutput(true);
		
		var retorno = connection.getResponseCode()	     
		
		// caso dê erro na requisição, exibirá mensagem ao usuário.
		if (retorno != 200) {
			log.warn("ERRO DE COMUNICACAO +====> " + connection.getErrorStream())
			var isr = new java.io.InputStreamReader(connection.getErrorStream());
			var la = new java.io.BufferedReader(isr);
			var responseString = "";
			var outputString = "";
			while ((responseString = la.readLine()) != null) {
			   outputString = outputString + responseString;
			   log.info("outputString da segunda etapa ERRO: "+outputString);
			}                     
		
		} else{
			var isr = new java.io.InputStreamReader(connection.getInputStream());
			var la = new java.io.BufferedReader(isr);
			var responseString = "";
			var outputString = "";
			while ((responseString = la.readLine()) != null) {
			   outputString = outputString + responseString;
			}
		      			
			var tokenArray = JSON.parse(outputString);        
			
				if (tokenArray.valid == false){					
					
					var msgErro = tokenArray.errors[0].message;					
					hAPI.setCardValue("erroSegundaEtapaTransfeera",msgErro )
					
					tokenArray = tokenArray.valid;
				}else{
					
					tokenArray = tokenArray.valid;
				}
									
			log.info("tokenArray da segunda etapa: "+tokenArray);
			
			return tokenArray;
		
		}
		
		return tokenArray;	
      	
	
}



function geraToken(){	
	 
	 var postData = JSON.stringify({ 
			    //   "grant_type": "client_credentials",
			    //   "client_id": "649fe80f-c49c-4a9c-a84b-0a912e0bb8ce",
			    //   "client_secret": "7c35658a-0f9f-4182-b4cd-6984e934d7efd970bce7-7c71-41d6-bf0f-8aa0940be7c2"

				"grant_type": "client_credentials",
				"client_id": "c353cf25-61ce-4e8e-bbef-b0a06a0c6c38",
				"client_secret": "9b2eeab1-20b7-4ba6-9dcd-3ade80e7b3a2e2f26304-d7b2-446c-8b5e-a0e105aa05fa"
			})   
        
    // var urlAPI = "https://login-api.transfeera.com/authorization";
	var urlAPI = "https://login-api-sandbox.transfeera.com/authorization";
    var url = new java.net.URL(urlAPI);
    var connection = url.openConnection();

    // POST para enviar os dados
    connection.setRequestMethod("POST");

    // Tipo de dado a ser enviado
     connection.setRequestProperty("Content-Type", "application/json");
     connection.setRequestProperty("User-Agent", "ONCOCLINICAS DO BRASIL SERVICOS MEDICOS SA (equipe.financeiro@oncoclinicas.com)");     
         
    // Send post request
    connection.setDoOutput(true);       
    
  //realiza o envio do json para o servidor
    var wr = new java.io.DataOutputStream(connection.getOutputStream());
    wr.writeBytes(postData);
    wr.flush();
    wr.close();
    	
	var retorno = connection.getResponseCode()	     

    // caso dê erro na requisição, exibirá mensagem ao usuário.
    if (retorno != 200) {
    	log.warn("ERRO DE COMUNICACAO +====> " + connection.getErrorStream())
    	var isr = new java.io.InputStreamReader(connection.getErrorStream());
        var la = new java.io.BufferedReader(isr);
        var responseString = "";
        var outputString = "";
        while ((responseString = la.readLine()) != null) {
            outputString = outputString + responseString;
        }                     
        
    }
    else{
    	var isr = new java.io.InputStreamReader(connection.getInputStream());
        var la = new java.io.BufferedReader(isr);
        var responseString = "";
        var outputString = "";
        while ((responseString = la.readLine()) != null) {
            outputString = outputString + responseString;
        }
               
        var tokenArray = JSON.parse(outputString);        
        tokenArray = tokenArray.access_token;
        
        return tokenArray;
       
    }

	return tokenArray;
   
}
	
