var objWS =
/**
 * Classe responsável pela manipulação do Web Service junto ao Protheus
 * 
 * @param stringServiceInstance
 *            Exemplo:
 * @param stringMetodoWebService
 *            Exemplo:
 */
function(stringServiceInstance, stringMetodoWebService, rateado) {
	var serviceInstance = '';
	var metodoWebService = '';
	var serviceProvider = '';
	var serviceLocator = '';
	var service = '';
	var instantiate = '';
	var lista = [];
	var listaIndice = [];
	var listaStringIni = '';
	var listaString = '';
	var listaStringCabec = '';
	var listaXMLItensFinal = '';
	var listaFinal = '';
	var tipoWS = '';
	var tipoWSFim = '';
	var operacaoWS = '';
	var usaExcluiPreNota = false;

	var setServiceInstance = function(stringServiceInstance) {
		serviceInstance = stringServiceInstance;
	};
	var setInstantiate = function() {
		instantiate = "br.com.oncoclinicas.FSWSP001Locator";
	};
	var setMetodoWebService = function(stringMetodoWebService) {
		metodoWebService = stringMetodoWebService;
	};
	var getItemLista = function(stringNomeCampo) {
		for ( var column in listaIndice) {
			if (listaIndice[column] == stringNomeCampo) {
				return true;
			}
		}

		return false;
	};
	/**
	 * Adicionar campos na lista do Web Service. O valor será atribuido
	 * automaticamente.
	 * 
	 * @param stringNomeCampo
	 *            Inserir o name do campo
	 * @param valorCampoEstatico
	 *            Opcional, inserir o valor do campo em caso de campo estático
	 */
	this.setListaCabec = function(stringNomeCampo, valorCampoEstatico) {
		if (!getItemLista(stringNomeCampo)) {

			if (valorCampoEstatico == null) {
				lista.push(setObjValorCampo(stringNomeCampo));
				listaIndice.push(stringNomeCampo);
			} else if (valorCampoEstatico != '') {
				lista.push(valorCampoEstatico);
				listaIndice.push(stringNomeCampo);
			} else {
				debug("<br><br>- " + stringNomeCampo
						+ " declarado com valor vazio em objWS.setLista.");
			}
		} else {
			debug("<br><br>- " + stringNomeCampo
					+ " declarado repetidamente em objWS.setLista.");
		}
	};
	var setObjValorCampo = function(stringNomeCampo) {
		var valorCampo = buscarValorCampo(stringNomeCampo);

		if (!valorCampo) {
			debug("<br><br>- " + stringNomeCampo
					+ " não encontrado em objWS.setObjValorCampo.");
		}

		return valorCampo;
	};
	var processarListaCabec = function() {
		listaString = '';
		

		if (lista.length == 0) {
			debug("<br><br>- Erro ao processar Lista está vazia! Preencha algum campo.");
		}

		for ( var item in lista) {
			
			var string = lista[item]+"";

			if(string.indexOf("/") > -1){
				var arrayDataXML = string.split("/");
				var data = '';
				if(arrayDataXML.length == 3){
				    
					var ano = arrayDataXML[2];
					var mes = arrayDataXML[1];
					var dia = arrayDataXML[0];
					
					data = ano + '' + mes + '' + dia;	
					
					listaString += '<'+ listaIndice[item] + '>' + data + '</' + listaIndice[item] + '>';
				}
			}else{
				listaString += '<'+ listaIndice[item] + '>' + string + '</' + listaIndice[item] + '>';
			}
			
			
		}
	};
	
	var processarListaIniFimCabec = function() {
		//Verifica se o valor está sendo rateado para gerar a tag XML adequada.
		if(rateado == true){
			var listaStringCabecIni =  '<Banco>';
			var listaStringCabecFim =  '</Banco>';			
		} else {
			var listaStringCabecIni =  '<Cadastro>';
			var listaStringCabecFim =  '</Cadastro>';
		}
		listaStringCabec = listaStringCabecIni + listaString + listaStringCabecFim;
	};
	
	this.setListaTipo = function(tipo) {
		tipoWS = '';
		tipoWSFim = '';
		tipoWS += '<' + tipo + '>';
		tipoWSFim += '</' + tipo + '>';
	};
	this.setListaOperacao = function(operacao){
		operacaoWS = '';
		operacaoWS += '<Operacao><Id>' + operacao + '</Id></Operacao>';
	};
	
	this.setExclui = function(exclui){
		usaExcluiPreNota = false;
		usaExcluiPreNota = exclui;
	};
		
	this.setListaItens = function(arrayCamposNatureza,arrayCamposItens) {
		var listaXMLItensIni = '<Naturezas>';
		var ListaXMLItensFim = '</Naturezas>';
		var listaXMLIten = '';
		var listaTodosXMLIten = '';
		var listaXMLItensTag = '';
		if (arrayCamposItens == undefined || arrayCamposItens.length == 0) {
			debug("<br><br>- Erro ao processar Lista está vazia! Preencha algum campo de item.");
		}
			listaXMLItensTag = '';
			listaXMLIten = '<Natureza>';
			
			for (var i=arrayCamposNatureza.length - 1 ; i >= 0;i--){
				var tag = arrayCamposNatureza[i].tag;
				var valorTag = arrayCamposNatureza[i].valorTag;
				listaXMLIten += '<' + tag + '>' + valorTag + '</' + tag + '>';
			}
			
			listaXMLIten += '<EV_RATEICC>1</EV_RATEICC>'; //Informa ao Protheus a existência de rateio por centro de custo
			listaXMLIten += '<CentrosCustos>';
			for (var i=arrayCamposItens.length - 1 ; i >= 0;i--){
				listaXMLIten += '<CentroCusto>';
				listaXMLItensTag = '';
				for(var propriedade in arrayCamposItens[i]) {
					var string = arrayCamposItens[i][propriedade].name;
					var n = string.lastIndexOf('___');
					var tag = string.substring(0, n);
					var valorTag = arrayCamposItens[i][propriedade].value;
				
					listaXMLItensTag += '<' + tag + '>' + valorTag + '</' + tag + '>';
				}
				listaXMLIten += listaXMLItensTag;
				listaXMLIten += '</CentroCusto>';
			}
			listaXMLIten += '</CentrosCustos>';
			listaXMLIten += '</Natureza>';
		
			listaTodosXMLIten += listaXMLIten;
			
		
		listaXMLItensFinal += listaXMLItensIni + listaTodosXMLIten + ListaXMLItensFim;
		
		

	}; 
	
	var processarInic = function(){
		var listaInic = '<?xml version="1.0" encoding="UTF-8"?>';
		listaStringIni += listaInic + tipoWS + operacaoWS;
	
	};
	
	var processarFim = function(){
		var listaFim = '';
		listaFim += tipoWSFim;
	
		listaFinal += listaStringIni + listaStringCabec + listaXMLItensFinal + listaFim;
	};
	var criarService = function() {
		serviceProvider = ServiceManager.getServiceInstance(serviceInstance);
	};
	var instanciarLocator = function() {
		serviceLocator = serviceProvider.instantiate(instantiate);
	};
	var instanciarPort = function() {
		service = serviceLocator.getFSWSP001SOAP();
	};
	var executarWebService = function() {
		log.info("##-service" + service);
		if (service == undefined) {
			debug("Ocorreu um erro ao executarWebService.");
		}
		log.info("##-operacaoWS" + operacaoWS);
		try{
			
			var webService = service.WSINTIPG(listaFinal);
			log.info("##-webService" + webService);
			var mensagem = webService.getMENSAGEM();
			log.info("##-mensagem" + mensagem);
			var retorno = webService.getRETORNO();
			log.info("##-retorno" + retorno);
			var retMensagem = retorno + "|" + mensagem;

			if(operacaoWS == "3" && usaExcluiPreNota == true){
				if (retorno != "1" && retorno != "2" && retorno != "3") {
					debug("Ocorreu um erro ao cadastrar no Protheus: " + mensagem);
				}
			}else if(operacaoWS == "3" && usaExcluiPreNota == false){
				if (retorno != "1" && retorno != "2") {
					debug("Ocorreu um erro ao cadastrar no Protheus: " + mensagem);
				}
			}else if(operacaoWS == "1" && usaExcluiPreNota == false){
				if (retorno != "1" && retorno != "2") {
					debug("Ocorreu um erro ao cadastrar no Protheus: " + mensagem);
				}			
			}
			log.info("##-retMensagem" + retMensagem);
			return retMensagem;
			
		}catch(e){
			log.error('Erro ao executar webservice: '+e);
		}
	};
	/**
	 * Executar a funcionalidade do Web Service.
	 */
	this.executar = function() {
		processarInic();
		processarListaCabec();
		processarListaIniFimCabec();
		processarFim();
		criarService();
		instanciarLocator();
		instanciarPort();
		log.info("XML: "+listaFinal);
		return executarWebService();
		 
	};
	var __construct = function(stringServiceInstance, stringMetodoWebService) {
		setServiceInstance(stringServiceInstance);
		setInstantiate();
		setMetodoWebService(stringMetodoWebService);
	}(stringServiceInstance, stringMetodoWebService);
};
