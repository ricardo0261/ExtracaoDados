var objWS =
/**
 * Classe respons?vel pela manipula??o do Web Service junto ao Protheus
 * 
 * @param stringServiceInstance
 *            Exemplo:
 * @param stringMetodoWebService
 *            Exemplo:
 */
function(stringServiceInstance, stringMetodoWebService) {
	var serviceInstance = '';
	var metodoWebService = '';
	var serviceProvider = '';
	var serviceLocator = '';
	var service = '';
	var instantiate = '';
	var lista = [];
	var listaIndice = [];
	var listaNatureza = [];
	var listaIndiceNatureza = [];
	var listaStringIni = '';
	var listaString = '';
	var listaStringNatureza = '';
	var listaStringBanco = '';
	var listaStringParametro = '';
	var listaStringCabec = '';
	var listaXMLItensFinal = '';
	var listaFinal = '';
	var tipoWS = '';
	var tipoWSFim = '';
	var operacaoWS = '';
	var usaExcluiPreNota = false;
	var tipo = 'Titulo';
	var totalTagsNatureza = 3;

	var setServiceInstance = function(stringServiceInstance) {
		serviceInstance = stringServiceInstance;
	};
	var setInstantiate = function() {
		// instantiate = "_86._62._94._187.FSWSP001Locator";
		// Produ??o
		//instantiate = "_10._58._94._187.FSWSP001Locator";
		// base dev
//		instantiate = "_188._63._94._187.FSWSP001Locator";
		instantiate = "br.com.oncoclinicas.FSWSP001Locator";

	};
	var setMetodoWebService = function(stringMetodoWebService) {
		metodoWebService = stringMetodoWebService;
		log.info("Valor metodoWebService: " + metodoWebService);
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
	 * Adicionar campos na lista do Web Service. O valor ser? atribuido
	 * automaticamente.
	 * 
	 * @param stringNomeCampo
	 *            Inserir o name do campo
	 * @param valorCampoEstatico
	 *            Opcional, inserir o valor do campo em caso de campo est?tico
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
					+ " n?o encontrado em objWS.setObjValorCampo.");
		}

		return valorCampo;
	};

	/*
	 * this.setValorLiteral = function(valorLiteral) { if (valorLiteral == null) {
	 * debug("<br><br>- " + valorLiteral + " n?o encontrado em
	 * objWS.setObjValorCampo."); } else{ lista.push(valorLiteral);
	 * listaIndice.push(valorLiteral); } };
	 */

	this.setListaNatureza = function(chave, valor) {
		if (valor != null && valor != '') {
			listaNatureza.push(valor);
			listaIndiceNatureza.push(chave);
		} else {
			debug("<br><br>- " + chave
					+ " declarado com valor vazio em objWS.setLista.");
		}
	};

	var processarListaCabec = function() {
		listaString = '';

		if (lista.length == 0) {
			debug("<br><br>- Erro ao processar Lista est? vazia! Preencha algum campo.");
		}

		for ( var item in lista) {

			log.info("log lista " + lista[item]);

			var string = lista[item];
			while (string.indexOf("R$ ") > -1) {
				string = string.replace('R$ ', '');
			}

			while (string.indexOf(",") > -1) {
				string = string.replace(',', '.');
			}
			log.info("propriedade " + listaIndice[item]);
			log.info("formatada 3 " + string);

			if (string.indexOf("/") > -1) {
				var arrayDataXML = string.split("/");
				var data = '';
				if (arrayDataXML.length == 3) {

					var ano = arrayDataXML[2];
					var mes = arrayDataXML[1];
					var dia = arrayDataXML[0];
					log.info('ano ' + ano);

					data = ano + '' + mes + '' + dia;

					listaString += '<' + listaIndice[item] + '>' + data + '</'
							+ listaIndice[item] + '>';
				}
			} else {
				listaString += '<' + listaIndice[item] + '>' + string + '</'
						+ listaIndice[item] + '>';
			}

		}
	};

	this.processarListaBancos = function(codBanco, codAgencia, codConta) {
		listaStringBanco = '<Banco>';
		listaStringBanco += '<AUTBANCO>' + codBanco + '</AUTBANCO>';
		listaStringBanco += '<AUTAGENCIA>' + codAgencia + '</AUTAGENCIA>';
		listaStringBanco += '<AUTCONTA>' + codConta + '</AUTCONTA>';
		listaStringBanco += '</Banco>';
	};

	this.processarListaParametros = function(mv_par05, mv_par09) {
		listaStringParametro = '<Parametro>';
		listaStringParametro += '<MV_PAR05>' + mv_par05 + '</MV_PAR05>';
		listaStringParametro += '<MV_PAR09>' + mv_par09 + '</MV_PAR09>';
		listaStringParametro += '</Parametro>';
	};

	var processarListaNaturezas = function() {
		listaStringNatureza = '';

		if (listaNatureza.length == 0) {
			debug("<br><br>- Erro ao processar Lista est? vazia! Preencha algum campo.");
		}

		listaStringNatureza = '<Naturezas>';

		for (var item = 0; item < listaNatureza.length; item++) {
			if (item % totalTagsNatureza == 0) {
				if (item > 0) {
					listaStringNatureza += '</Natureza>';
				}
				listaStringNatureza += '<Natureza>';
			}

			log.info("log listaNatureza " + listaNatureza[item]);

			var string = listaNatureza[item];
			while (string.indexOf("R$ ") > -1) {
				string = string.replace('R$ ', '');
			}

			while (string.indexOf(",") > -1) {
				string = string.replace(',', '.');
			}
			log.info("propriedade " + listaIndiceNatureza[item]);
			log.info("formatada 3 " + string);

			if (string.indexOf("/") > -1) {
				var arrayDataXML = string.split("/");
				var data = '';
				if (arrayDataXML.length == 3) {

					var ano = arrayDataXML[2];
					var mes = arrayDataXML[1];
					var dia = arrayDataXML[0];
					log.info('ano ' + ano);

					data = ano + '' + mes + '' + dia;

					listaStringNatureza += '<' + listaIndiceNatureza[item]
							+ '>' + data + '</' + listaIndiceNatureza[item]
							+ '>';
				}
			} else {
				listaStringNatureza += '<' + listaIndiceNatureza[item] + '>'
						+ string + '</' + listaIndiceNatureza[item] + '>';
			}

		}
		listaStringNatureza += '</Natureza>';
		listaStringNatureza += '</Naturezas>';

		log.info('listaStringNatureza: ' + listaStringNatureza);
	};

	var processarListaIniFimCabec = function() {
		var listaStringCabecIni = '';
		var listaStringCabecFim = '';
		if (tipoWS != "<Titulo>") {
			listaStringCabecIni = '<Cabecalho>';
			listaStringCabecFim = '</Cabecalho>';
		} else {
			listaStringCabecIni = '<Cadastro>';
			tipoWSFim = '</Titulo>';
		}
		listaStringCabec = listaStringCabecIni + listaString
				+ listaStringNatureza + listaStringCabecFim
				+ listaStringBanco + listaStringParametro
				+ '</Cadastro>';
		log.info("XML do cabecalho " + listaStringCabec);

	};

	this.setListaOperacao = function(operacao) {
		operacaoWS = '';
		operacaoWS = '<Operacao><Id>' + operacao + '</Id></Operacao>';
		log.info("OPERACAO >>>>>> " + operacaoWS);

	};

	this.setExclui = function(exclui) {
		usaExcluiPreNota = false;
		usaExcluiPreNota = exclui;
		log.info("Utiliza exclusao >>>>>> " + exclui);

	};

	this.setListaItens = function(arrayCamposItens) {
		var listaXMLItensIni = '<Naturezas>';
		var ListaXMLItensFim = '</Naturezas>';
		var listaStringCabecFim = '</Cadastro>';
		var listaXMLIten = '';
		var listaTodosXMLIten = '';
		var listaXMLItensTag = '';
		if (arrayCamposItens == undefined || arrayCamposItens.length == 0) {
			debug("<br><br>- Erro ao processar Lista est? vazia! Preencha algum campo de item.");
		}
		for (var i = arrayCamposItens.length - 1; i >= 0; i--) {

			log.info("ArrayCamposItens quantidade de posi??es " + i);

			listaXMLItensTag = '';

			for ( var propriedade in arrayCamposItens[i]) {
				listaXMLIten = '<Natureza>';
				log.error(propriedade + ": "
						+ arrayCamposItens[i][propriedade].name);
				log.error(propriedade + ": "
						+ arrayCamposItens[i][propriedade].value);

				var string = arrayCamposItens[i][propriedade].name;
				var tag = string.substring(0, string.length - 4);
				var valorTag = arrayCamposItens[i][propriedade].value;

				while (valorTag.indexOf("R$ ") > -1) {
					valorTag = valorTag.replace('R$ ', '');
				}

				while (valorTag.indexOf(",") > -1) {
					valorTag = valorTag.replace(',', '.');
				}

				if (valorTag.indexOf("/") > -1) {
					var arrayDataXML = valorTag.split("/");
					var arrayDateXML = '';

					if (arrayDataXML.length == 3) {
						arrayDateXML = arrayDataXML[2] + '' + arrayDataXML[1]
								+ '' + arrayDataXML[0];
						log.info("Objeto data " + arrayDateXML);
						listaXMLItensTag += '<' + tag + '>' + arrayDateXML
								+ '</' + tag + '>';
					}
				} else {
					listaXMLItensTag += '<' + tag + '>' + valorTag + '</' + tag
							+ '>';
				}
				log.info("Tag " + listaXMLItensTag);
				listaXMLIten += listaXMLItensTag;
				listaXMLIten += '</Natureza>';
				log.info("Lista de itens " + listaXMLIten);
			}

			listaTodosXMLIten += listaXMLIten;

		}
		listaXMLItensFinal = listaXMLItensIni + listaTodosXMLIten
				+ ListaXMLItensFim + listaStringCabecFim;
		log.info("LISTA DAS PROPRIEDADES >>>>>>>> " + listaXMLItensFinal);

	};

	var processarInic = function() {
		var listaInic = '<?xml version="1.0" encoding="UTF-8"?>';
		tipoWS = '<' + tipo + '>';
		listaStringIni = listaInic + tipoWS + operacaoWS;
		log.info("INIC " + listaStringIni);
	};

	var processarFim = function() {
		var listaFim;
		listaFim = tipoWSFim;
		listaFinal = listaStringIni + listaStringCabec + listaXMLItensFinal
				+ listaFim;

	};
	var criarService = function() {
		gravarLog("String par?metros >>>>>>>>>>>>>>> " + listaString);
		gravarLog("String par?metros natureza >>>>>>>>>>>>>>> "
				+ listaStringNatureza);
		gravarLog("Instanciando webservice protheus");

		serviceProvider = ServiceManager.getServiceInstance(serviceInstance);
	};
	var instanciarLocator = function() {
		gravarLog("Instanciando Locator protheus");
		gravarLog("instantiate: " + instantiate);
		serviceLocator = serviceProvider.instantiate(instantiate);
		gravarLog("instanciarLocator: " + "EXECUTADO");
	};
	var instanciarPort = function() {
		gravarLog("Instanciando port protheus");

		service = serviceLocator.getFSWSP001SOAP();
		gravarLog("Instanciando port protheus");
	};
	var executarWebService = function() {
		if (service == undefined) {
			debug("Ocorreu um erro ao executarWebService.");
		}
		var wsp = "service." + metodoWebService + "(listaFinal)";
		gravarLog("webService: " + wsp);
		gravarLog("listaFinal: " + listaFinal);
		var webService = eval(wsp);

		gravarLog("MENSAGEM <<<<<<<<<<<<<<<<<<<<<< " + webService);
		var mensagem = webService.getMENSAGEM();
		var retorno = webService.getRETORNO();
		var retMensagem = retorno + "|" + mensagem;

		log.info("MENSAGEM WS >>>>>>>> " + mensagem);
		log.info("RETORNO WS >>>>>>>> " + retorno);
		if (operacaoWS == "3" && usaExcluiPreNota == true) {
			if (retorno != "1" && retorno != "2" && retorno != "3") {
				debug("Ocorreu um erro ao cadastrar no Protheus: " + mensagem);
			}
		} else if (operacaoWS == "3" && usaExcluiPreNota == false) {
			if (retorno != "1" && retorno != "2") {
				debug("Ocorreu um erro ao cadastrar no Protheus: " + mensagem);
			}
		} else if (operacaoWS == "1" && usaExcluiPreNota == false) {
			if (retorno != "1" && retorno != "2") {
				debug("Ocorreu um erro ao cadastrar no Protheus: " + mensagem);
			}
		}else if (retorno == 0){
			throw 'Não foi possível carregar o xml enviado';
			
		}else if (retorno == 1){
			log.info("XML enviado com sucesso");
			
		}
		return retMensagem;
	};
	/**
	 * Executar a funcionalidade do Web Service.
	 */

	this.executar = function() {
		processarInic();
		processarListaCabec();
		processarListaNaturezas();
		processarListaIniFimCabec();
		processarFim();
		criarService();
		log.info('XML FINAL ' + listaFinal);
		instanciarLocator();
		instanciarPort();
		return executarWebService();

	};
	var __construct = function(stringServiceInstance, stringMetodoWebService) {
		setServiceInstance(stringServiceInstance);
		setInstantiate();
		setMetodoWebService(stringMetodoWebService);
	}(stringServiceInstance, stringMetodoWebService);
};