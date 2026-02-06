/**
 * objZoom destinado a executar as a??es de consulta de dados no Protheus.
 */
// Inserir no cabe?alho head do html =>> <script type="text/javascript" src="util_objZoom_4-0-0.js"></script><script src="../vcXMLRPC.js"></script>
// Colar a imagem zoom.png, util_objZoom_4-0-0.js e util_dataSet_1-3-0.js no diret?rio html do projeto
/**
 * Necess?rio manter padr?o nos nomes dos campos abaixo.
 * 
 * Exemplos: Para Pais:
 */
var objZoom = ({
	nameSufixoTablename : '',
	divisorTablename : '___',
	separadorSimples : ',',
	separadorColuna : '||',
	separadorRegistro : '&&',
	versaoDatasetId : '',
	listaItemMatriz : [ 'filtros', 'camposExtra', 'salvarDadosHtml',
			'campoObrigatorio' ],
	itens_filtros : [ 'tipoFiltro', 'descricao', 'campoDataSet',
			'nameCampoHtml', 'valorDefault', 'usarSufixoTableName' ],
	itens_camposExtra : [ 'titulo', 'campoDataSet' ],
	itens_salvarDadosHtml : [ 'campoDataSet', 'nameCampoHtml',
			'usarSufixoTableName' ],
	itens_campoObrigatorio : [ 'tipoCampo', 'descricao', 'nameCampoHtml',
			'usarSufixoTableName' ],
	config : [],
	setNameSufixoTablename : function(nameCampo) {
		this.nameSufixoTablename = '';
		this.config.sufixoTablename = '';
		var existTablename = nameCampo.split(this.divisorTablename);

		if (existTablename.length > 1) {
			this.config.sufixoTablename = existTablename[1];
			this.nameSufixoTablename = this.divisorTablename
					+ existTablename[1];
		}
	},
	setConfig : function(codigoZoom, nameCodigoZoom, nameDescZoom) {
		if (codigoZoom == '') {
			alert('Erro de não declaração do objZoom.setConfig().');
			return false;
		}

		this.config = [];

		if (!this.getDataSet(codigoZoom)) {
			return false;
		}

		/*
		 * Declara??o de variav?is comuns a todos!
		 */
		this.config.codigoZoom = codigoZoom;

		this.config.nameCodigoZoom = nameCodigoZoom;
		this.config.nameDescZoom = nameDescZoom;

		// Variavel type agora cont?m a informa??o do complemento do tablename
		this.config.type = this.config.nameZoom;

		this.config.tipoProcessamento = this.getTipoProcessamento(
				this.config.datasetId, this.config.dataSetCustomizado);

		this.config.dataFields = '';
		this.config.resultFieldsFim = '';

		// Campos a serem exibidos de C?digo
		if (this.config.columnTitle[0].length != 0) {
			this.config.dataFields += this.config.columnCodigo + ','
					+ this.config.columnTitle[0];

			this.config.resultFieldsFim += this.config.columnCodigo;
		}

		// Campos a serem exibidos de Descri??o
		if (this.config.columnTitle[1].length != 0) {
			this.config.dataFields += (this.config.dataFields != '') ? ',' : '';
			this.config.dataFields += this.config.columnDescricao + ','
					+ this.config.columnTitle[1];

			this.config.resultFieldsFim += (this.config.resultFieldsFim != '') ? ','
					: '';
			this.config.resultFieldsFim += this.config.columnDescricao;
		}

		// var table = (this.config.table != '') ? this.config.table + ',,' :
		// '';

		this.config.likeField = '';
		this.config.likeValue = '';

		return true;
	},
	setVersaoDataSetId : function() {
		this.versaoDatasetId = (this.config.datasetId == 'consultaDadosProtheus') ? 'V2'
				: '';
	},
	setResultFields : function() {
		if (this.config.datasetId == 'consultaDadosProtheus') {
			this.setResultFieldsProtheus();
		} else {
			this.setResultFieldsDataSet();
		}
	},
	setResultFieldsProtheus : function() {
		// var nameZoom = this.config.nameZoom;
		var codigoZoom = this.config.codigo;
		var filial = this.getBranch();
		var filtrosExtra = this.config.filtrosExtra;
		var limite = this.config.limite;

		// &resultFields=FORNECEDOR_BANCO,001,00104,A2_MSBLQL=%272%27,100

		this.config.resultFieldsInicio = '';
		// this.config.resultFieldsInicio += nameZoom + ','; // Retirado a
		// string de nome do Zoom e incluido no type
		this.config.resultFieldsInicio += codigoZoom + ',';
		this.config.resultFieldsInicio += filial + ',';
		this.config.resultFieldsInicio += filtrosExtra + ',';
		this.config.resultFieldsInicio += limite;
	},
	setResultFieldsDataSet : function() {
		if(this.config.dataSetCustomizado == "1"){
			
			var filtrosExtra = this.config.filtrosExtra;
			var limite = this.config.limite;

			// &resultFields=FORNECEDOR_BANCO,001,00104,A2_MSBLQL=%272%27,100

			this.config.resultFieldsInicio = '';
			// this.config.resultFieldsInicio += nameZoom + ','; // Retirado a
			// string de nome do Zoom e incluido no type
			this.config.resultFieldsInicio += filtrosExtra + ',';
			this.config.resultFieldsInicio += limite;
		}else{
			
			// table +
			this.config.resultFieldsInicio = this.config.columnCodigo + '.'
			+ this.config.columnDescricao;
			
			this.config.resultFieldsFim = this.config.columnCodigo + ','
			+ this.config.columnDescricao;
		}
		
	},
	getDataSet : function(codigoZoom) {
		var objConfigZoom = new objDataSet('configZoomV5');

		// Inserir as colunas que irei utilizar
		objConfigZoom.setFiltro('metadata#active', true, true, true);
		objConfigZoom.setFiltro('codigo', codigoZoom, codigoZoom, true);

		objConfigZoom.buscar();

		var configZoom = objConfigZoom.getDados();
		// var configZoom = objConfigZoom.filtrarBusca();

		// if (configZoom.values.length == 0) {
		if (configZoom.rowsCount == 0) {
			alert("Erro ao buscar os dados de configuração do Zoom!");
			return false;
		}

		this.setDataSet(configZoom);

		return true;
	},
	setDataSet : function(configZoom) {
		var nomeCampo = '';

		for ( var pos in configZoom.values) {
			for ( var posCampo in configZoom.columns) {
				nomeCampo = configZoom.columns[posCampo];

				if (nomeCampo.indexOf('#') == -1) {
					eval('this.config.' + nomeCampo + ' = "'
							+ eval('configZoom.values[pos].' + nomeCampo)
							+ '";');
				}
			}
		}

		// Convers?o dos campos que s?o string e precisam ser convertidos para
		// array de forma autom?tica
		this.converteConfigArray('columnTitle', this.separadorColuna);
		this.converteConfigArray('filtros', this.separadorRegistro);
		this.converteConfigArray('camposExtra', this.separadorRegistro);
		this.converteConfigArray('salvarDadosHtml', this.separadorRegistro);
		this.converteConfigArray('campoObrigatorio', this.separadorRegistro);
	},
	filterConfig : function() {
		var validado = true;
		this.config.filtrosExtra = '';

		for ( var posFiltro in this.config.filtros) {
			var filtroHtml = this.config.filtros[posFiltro].nameCampoHtml;

			filtroHtml += (this.config.filtros[posFiltro].usarSufixoTableName == 1) ? this.nameSufixoTablename
					: '';

			// Type = 0 BUSCA COM VALOR DEFAULT
			if (this.config.filtros[posFiltro].tipoFiltro == 0) {
				this.config.filtros[posFiltro].columnValueFiltro = this.config.filtros[posFiltro].valorDefault;
			}
			// Type = 1 BUSCA EM COMBOBOX
			else if (this.config.filtros[posFiltro].tipoFiltro == 1) {
				this.config.filtros[posFiltro].columnValueFiltro = $(
						"[name=" + filtroHtml + "] option:selected").val();

				if (this.config.filtros[posFiltro].columnValueFiltro == '00') {
					validado = false;
				}
			}
			// Type = 2 BUSCA EM INPUT
			else if (this.config.filtros[posFiltro].tipoFiltro == 2) {
				this.config.filtros[posFiltro].columnValueFiltro = $(
						"[name=" + filtroHtml + "]").val();

				if (this.config.filtros[posFiltro].columnValueFiltro == ''
						|| this.config.filtros[posFiltro].columnValueFiltro == undefined) {
					validado = false;
				}
			}

			// Type = 99 Execu??o da troca de BRANCH (Unidade) no Protheus
			// Sempre busca os dados em um input
			if (!this.validacaoBranch(posFiltro, filtroHtml)) {
				validado = false;
			}

			// else if (this.config.filtros[posFiltro].tipoFiltro == 99) {
			// var branch = $("[name=" + filtroHtml + "]").val();
			//
			// if (branch == '') {
			// validado = false;
			// } else {
			// // Adicionar o BRANCH para que o webservice reconhe?a qual
			// // banco deve usar
			// var arrayfieldsInicio = this.config.resultFieldsInicio
			// .split(",,");
			//
			// this.config.resultFieldsInicio = arrayfieldsInicio[0]
			// + this.divisorTablename + branch + ',,'
			// + arrayfieldsInicio[1];
			// }
			// }

			if (!validado) {
				try {
					alert(i18n.translate("objZoom.favorInformarCampo") + ' '
							+ this.config.filtros[posFiltro].descricao + ' '
							+ i18n.translate("objZoom.antesDoCampo") + ' '
							+ this.config.columnTitle[1]);
					return false;
				} catch (e) {
					alert("Favor informar o campo " + ' '
							+ this.config.filtros[posFiltro].descricao + ' '
							+ " antes do campo " + ' '
							+ this.config.columnTitle[1]);
					return false;
				}
			}

			// Montagem dos campos de filtro
			// Caso o Tipo de Filtro seja troca de BRANCH n?o incluir no filtro
			if (this.config.filtros[posFiltro].campoDataSet != ''
					&& this.config.filtros[posFiltro].tipoFiltro != 99) {

				// Filtro de DataSet Customizado
				// Retorno=3 é Zoom de DataSet Customizado
				if (this.config.tipoProcessamento == 3) {
					this.config.likeField += (this.config.likeField != '') ? ','
							: '&likeField=';
					this.config.likeField += this.config.filtros[posFiltro].campoDataSet;

					this.config.likeValue += (this.config.likeValue != '') ? ','
							: '&likeValue=';
					this.config.likeValue += this.config.filtros[posFiltro].columnValueFiltro;
				}

				// Tratar o zoom do dataSet

				// this.config.resultFieldsInicio += '.' +
				// this.config.filtros[posFiltro].campoDataSet;
				// this.config.resultFieldsFim += ',' +
				// this.config.filtros[posFiltro].campoDataSet;

				this.config.filtrosExtra += (this.config.filtrosExtra) ? ' AND '
						: '';
				this.config.filtrosExtra += this.config.filtros[posFiltro].campoDataSet
						+ ' = "'
						+ this.config.filtros[posFiltro].columnValueFiltro
						+ '"';
			}
		}

		return true;
	},
	validacaoBranch : function(posFiltro, filtroHtml) {
		if (this.config.datasetId == 'consultaDadosProtheus') {
			if (this.config.filtros[posFiltro].tipoFiltro == 99) {
				var branch = $("[name=" + filtroHtml + "]").val();

				if (branch == '') {
					return false;
				} else {
					this.config.branch = branch;
				}
			}
		}

		return true;
	},
	getBranch : function() {
		return (this.config.branch != undefined) ? this.config.branch : '';
	},
	campoObrigatorioConfig : function() {
		var validado = true;

		for ( var pos in this.config.campoObrigatorio) {
			var campoObrigatorioHtml = this.config.campoObrigatorio[pos].nameCampoHtml
			campoObrigatorioHtml += (this.config.campoObrigatorio[pos].usarSufixoTableName == 1) ? this.nameSufixoTablename
					: '';
			// Type = 1 BUSCA EM COMBOBOX
			if (this.config.campoObrigatorio[pos].tipoCampo == 1) {
				this.config.campoObrigatorio[pos].valueCampo = $(
						"[name=" + campoObrigatorioHtml + "] option:selected")
						.val();

				if (this.config.campoObrigatorio[pos].valueCampo == undefined
						|| this.config.campoObrigatorio[pos].valueCampo == '00') {
					validado = false;
				}
			}
			// Type = 2 BUSCA EM INPUT
			else if (this.config.campoObrigatorio[pos].tipoCampo == 2) {
				this.config.campoObrigatorio[pos].valueCampo = $(
						"[name=" + campoObrigatorioHtml + "]").val();

				if (this.config.campoObrigatorio[pos].valueCampo == undefined
						|| this.config.campoObrigatorio[pos].valueCampo == '') {
					validado = false;
				}
			}
		}

		if (!validado) {
			this.exibirMensagem(this.config.campoObrigatorio[pos].descricao,
					this.config.columnTitle[1]);
		}

		return validado;
	},
	exibirMensagem : function(tituloObrigatorio, tituloCampo) {
		try {
			alert(i18n.translate("objZoom.favorInformarCampo") + ' '
					+ tituloObrigatorio + ' '
					+ i18n.translate("objZoom.antesDoCampo") + ' '
					+ tituloCampo);
		} catch (e) {
			alert("Favor informar o campo " + ' ' + tituloObrigatorio + ' '
					+ " antes do campo " + ' ' + tituloCampo);
		}
	},
	finishConfig : function() {
		// Popula a lista de campos para serem retornados do protheus
		for ( var pos in this.config.camposExtra) {
			if (this.config.camposExtra[pos].campoDataSet != ''
					&& this.config.camposExtra[pos].titulo != '') {
				this.config.dataFields += ','
						+ this.config.camposExtra[pos].campoDataSet + ','
						+ this.config.camposExtra[pos].titulo;

				// Retorno=3 é Zoom de DataSet Customizado
				/*
				 * if (this.config.tipoProcessamento == 3) {
				 * this.config.resultFieldsInicio += '.' +
				 * this.config.camposExtra[pos].campoDataSet; }
				 */

				this.config.resultFieldsFim += (this.config.resultFieldsFim != '') ? ','
						: '';
				this.config.resultFieldsFim += this.config.camposExtra[pos].campoDataSet;
			}
		}

		this.config.resultFields = this.config.resultFieldsInicio + ','
				+ this.config.resultFieldsFim;
	},
	/**
	 * M?todo para convers?o de String em Array e Matriz
	 * 
	 * @param nomeItemConfig
	 *            Nome do Atributo que ir? ser transformado em array
	 * @param separadorRegistro
	 *            Separado de Registro para ser usado no split
	 * @param separadorColunas
	 */
	converteConfigArray : function(nomeItemConfig, separadorRegistro) {
		var itemConfig = eval('this.config.' + nomeItemConfig);
		var itemConfigArray = [];
		itemConfigArray = itemConfig.split(separadorRegistro);

		if (itemConfig.length > 0) {
			eval('this.config.' + nomeItemConfig + ' = itemConfigArray;');
		}

		if (this.listaItemMatriz.indexOf(nomeItemConfig) != -1) {
			this.converteConfigMatriz(nomeItemConfig);
		}
	},
	converteConfigMatriz : function(nomeItemConfig) {
		var itemConfig = eval('this.config.' + nomeItemConfig);

		// Limpa os registros antigos do item no this.config
		eval('this.config.' + nomeItemConfig + ' = []');

		// Em caso de n?o preenchimento do campo n?o executar restante do m?todo
		if (itemConfig == '') {
			return;
		}

		var novoItemConfig = [];
		var itemConfigArray = [];
		var nomeItens = 'this.itens_' + nomeItemConfig;
		var nomeItem = '';
		var totalNomeItens = eval(eval('nomeItens') + '.length');
		var valorItemConfig = '';

		for ( var posValor in itemConfig) {
			// Executa a separa??o das colunas em array
			itemConfigArray = itemConfig[posValor].split(this.separadorColuna);

			for ( var posName = 0; posName < totalNomeItens; posName++) {
				nomeItem = eval(eval('nomeItens') + '[posName]');
				valorItemConfig = itemConfigArray[posName];
				eval('novoItemConfig.' + nomeItem + ' = ' + 'valorItemConfig');
			}

			eval('this.config.' + nomeItemConfig + '.push(novoItemConfig)');

			// Limpa variavel
			novoItemConfig = [];
		}
	},
	/**
	 * Método para informar o Tipo de Processamento: 1-consultaDadosProtheus
	 * 2-dataSet Fluig original 3-dataSet Fluig customizado
	 */
	getTipoProcessamento : function(nameZoom, dataSetCustomizado) {
		if (nameZoom == 'consultaDadosProtheus') {
			return 1;
		} else if (dataSetCustomizado == 1) {
			return 3;
		} else {
			return 2;
		}
	},
	open : function(objZoomField) {
		// Identifica utiliza??o de tablename no zoom
		// var nameZoom = objZoomField.getAttribute("nameZoom");
		var codigoZoom = objZoomField.getAttribute("codigoZoom");

		var nameCodigoZoom = objZoomField.getAttribute("nameCodigoZoom");
		var nameDescZoom = objZoomField.getAttribute("nameDescZoom");

		// Busca o name atual do campo nameCodigo que possui o sufixo do
		// tablename
		var nameSufixoTablename = $(objZoomField).prev().attr("name");
		this.setNameSufixoTablename(nameSufixoTablename);

		if (!this.setConfig(codigoZoom, nameCodigoZoom, nameDescZoom)) {
			return false;
		}

		if (!this.filterConfig()) {
			return false;
		}

		if (!this.campoObrigatorioConfig()) {
			return false;
		}

		this.setVersaoDataSetId();

		this.setResultFields();

		this.finishConfig();

		var largura = screen.width * 0.67;
		var altura = screen.height * 0.67;

		window.open("/webdesk/zoom.jsp?datasetId=" + this.config.datasetId
				+ this.versaoDatasetId + "&dataFields="
				+ this.config.dataFields + "&resultFields="
				+ this.config.resultFields + this.config.likeField
				+ this.config.likeValue + "&type=" + this.config.type, "zoom",
				"status, scrollbars=no,width=" + largura + ", height=" + altura
						+ ", top=0, left=0");

		// + "&title=" + this.config.title + ""
	},
	setSelectedZoomItem : function(record) {
		var type = record.type;

		if (this.config.type != type) {
			alert('Entrou no If do objZoom.setSelectedZoomItem(). Sendo reconfigurado o obj!');
			return false;
		}

		var campoCodigo = this.config.nameCodigoZoom + this.nameSufixoTablename;
		var campoDesc = this.config.nameDescZoom + this.nameSufixoTablename;
			
		//###SOLUÇÃO DE CONTORNO###	
		//Variavel Global declarada no arquivo custom.js
		//O objetivo desta variavel é impedir que sejam exibidas várias mensagens.
		//Ainda não conseguimos entender porque ele chama várias mensagens.
		mostrouModal = false;
		
		$('[name="' + campoCodigo + '"]').val(
				eval('record.' + this.config.columnCodigo)).change();
		$('[name="' + campoDesc + '"]').val(
				eval('record.' + this.config.columnDescricao)).change();

		// C?digos para gravar em outros Inputs valores buscados no Zoom
		// Separa os blocos para salvar
		if (this.config.salvarDadosHtml.length > 0) {
			var registroDadosHtml = '';
			var usarNameSufixoTablename = '';
			for ( var pos in this.config.salvarDadosHtml) {
				usarNameSufixoTablename = (this.config.salvarDadosHtml[pos].usarSufixoTableName == 1) ? this.nameSufixoTablename
						: '';

				$(
						'[name="'
								+ this.config.salvarDadosHtml[pos].nameCampoHtml
								+ usarNameSufixoTablename + '"]')
						.val(
								eval('record.'
										+ this.config.salvarDadosHtml[pos].campoDataSet))
						.change();
			}
		}
	},
});

function setSelectedZoomItem(record) {
	objZoom.setSelectedZoomItem(record);
}