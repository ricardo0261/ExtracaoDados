/*
ANALISTA RICARDO ANDRADE 
*** NAO IDENTAR ESTE CODIGO *** 
*/
var myLOADING,tabelaResultados;
var server,COMPANY,myUSER,myLOGIN,userNome,userMail,userAdmin,acessoEspecial;
var GrupoResponsavel;
var datasets,dsCART;

var myExtracao = SuperWidget.extend({
    // MÉTODO INICIADO QUANDO A WIDGET É CARREGADA
    init: function() {
    	// PARAMETROS
        instanciaID      = this.instanceId;
    	myLOADING = FLUIGC.loading(window, {textMessage: 'A consulta pode demorar devido a quantidade de solicitações ...'});
    	
    	// ATUALIZAR DATA ATUAL 
    	var hoje    = new Date();
    	var xHoje   = hoje.getFullYear() + "-"
                    + pad(parseInt(hoje.getMonth() + 1)) + "-"
                    + pad(hoje.getDate());
    	$('#dtFIM').val(xHoje);
    	
    	// ATUALIZAR DATA INICIAL
    	var dias    = 7;
    	var dtAgora = new Date();
    	    dtAgora = new Date(hoje.getTime() - (dias * 24 * 60 * 60 * 1000));
    	var xData   = dtAgora.getFullYear() + "-"
    				+ pad(parseInt(dtAgora.getMonth() + 1)) + "-"
    				+ pad(dtAgora.getDate());
        $('#dtINI').val(xData);
        
        // VER QUAIS OPCOES PODEM OU DEVEM INFORMAR PERIODO DE DATAS
        $('#verDatas').show();
        
    	// DADOS DO USUARIO APROVADOR
		server  = WCMAPI.serverURL;
   		COMPANY = WCMAPI.getOrganizationId();
        myUSER  = WCMAPI.userCode;
        myLOGIN = WCMAPI.userLogin;
        //
    	var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId",myUSER,myUSER,ConstraintType.MUST);
    	var datasetUser = DatasetFactory.getDataset("colleague", null,[ c1 ], null);
    		userNome    = datasetUser.values[0]["colleagueName"];
            userMail    = datasetUser.values[0]["mail"];
            userAdmin   = datasetUser.values[0]["adminUser"]=='true'?true:false;

		$('#userNOME'      )[0].innerHTML = userNome.toUpperCase();
		$('#imgCOLABORADOR')[0].src = server+'/social/api/rest/social/image/profile/'+myUSER+'/SMALL_PICTURE';
            
    	// TIPO DE USUARIO
    	var tipUSU = tipoUSUARIO();
    	if(!tipUSU) {
    		$('.super-widget').hide();
    		myLOADING.hide();
    		FLUIGC.toast({ message:'Usuário sem permissão de acesso a este modulo. É necessário fazer parte do grupo: grp_Analytics',type:'danger' });
    		return false;
    	} 

		// OPCOES
		datasets = [];
		dsCART   = [];
    	var params = DatasetFactory.getDataset("ds_ParamsExtracaoDados",null,null,null);
		for (var iP = 0; iP < params.values.length; iP++) {
			if( (userAdmin == true) || 
			    (userAdmin == false && params.values[iP].aux_seSomenteAdmin !='sim') ) {
				dsCART.push(   params.values[iP].txtDataset  ); // NOME DE EXIBICAO
				datasets.push( params.values[iP].nomeDataset ); // NOME INTERNO
			}
		}

		// PREENCHER SELECT
		var xOPTION = document.getElementById("tpSOLICITACAO");
    	for (var iCART = 0; iCART < dsCART.length; iCART++) {
			var option       = document.createElement("option");
				option.value = iCART;
				option.text  = dsCART[iCART];
			xOPTION.add(option);
    	}
    	$('.slotfull')[0].remove();
    },
});

function tipoUSUARIO() {
	// CONFIGURAR ACESSO MENUS DE ACORDO COM OS GRUPOS DE USUARIOS
	var adm    = false,
		user   = WCMAPI.userCode,
		server = WCMAPI.serverURL,
		myURL  = '';
			
	// INICIALIZACAO ACESSO
	acessoEspecial = false;
	myURL  = server+'/api/public/2.0/groups/containsUser/grp_Analytics/'+myUSER;
	
	// GRUPO COM ACESSO AO PAINEL DE EXTRACAO DE DADOS
	FLUIGC.ajax({
        url: myURL,
        type:'GET',
        dataType:'json',
        contenttype:'application/json',
        async: false,
        success: function(result){ 
        	adm = result["content"];
        },
        error: function (request, status, error) {
    		myLOADING.hide();
        	FLUIGC.toast({ message:'Não consigo localizar o grupo de trabalho do usuário logado. \n' +error,type:'danger' })
        	adm=false;
        }
    });
	return adm;
}

function pad(num) {
	var numRet = num;
	if (parseInt(num) <= 9) {
		numRet = "0" + num;
	}
	return numRet;
}

function EXTRAIR(){
    myLOADING.show();
    setTimeout( function(){
    	EXTRAIR_AGORA();
    },300);
}

function EXTRAIR_AGORA(){
	var callbackFactory =  new Object();
    callbackFactory.success = function(dsDados){
    	if(dsDados==null||dsDados.values==undefined){
    		myLOADING.hide();
        	FLUIGC.toast({ message:'Problema ao executar dataset. Favor acionar o suporte.',type:'danger' });
    	} else {
    		if(dsDados.values.length<=0){
    			myLOADING.hide();
    	    	FLUIGC.toast({ message:'Nenhum dado encontrado conforme parâmetros informados.',type:'danger' });
    		} else {
    			var registros=[];
    			for (var iRec = 0; iRec < dsDados.values.length; iRec++) {
    				var obj = {};
					// obj[dsDados.columns[iCP].replace('.','_').replace('Id','')] = dsDados.values[iRec][dsDados.columns[iCP]];
    				for (var iCP = 0; iCP < dsDados.columns.length; iCP++) 
    					obj[dsDados.columns[iCP].replace('.','_')] = dsDados.values[iRec][dsDados.columns[iCP]];
    				// GRAVAR DADOS RESULT
    				registros.push(obj);
    			}
				for (var iCP = 0; iCP < dsDados.columns.length; iCP++) 
					dsDados.columns[iCP] = dsDados.columns[iCP].replace('.','_'); // .replace('Id','');
				
    			// INICIALIZAR THEAD
				if ($.fn.DataTable.isDataTable ('#tabRESULTADO'))
					$ ('#tabRESULTADO').DataTable().destroy();
				$ ('#tabRESULTADO tbody').empty();
				
    			var xFORM = document.getElementById("tabRESULTADO");
    			while (xFORM.firstChild) 
    				xFORM.firstChild.remove();

    			// GERAR DATATABEL
				var head = $('<thead></thead>');
    			var linha = $('<tr></tr>');
    			dsDados.columns.forEach(function(coluna) { 
    				linha.append('<th>' + coluna + '</th>');
    			});
    			head.append(linha);
    			$("#tabRESULTADO").append(head);

    			var xColunas = [];
    			for (var iColunas = 0; iColunas < dsDados.columns.length; iColunas++) 
    				xColunas.push({
    					data : dsDados.columns[iColunas], 
    					width: '90%'
    				});
    			
    			// CARREGAR DATATABLE COM RESULTADO DO DATASET
    			try {
	    			tabelaResultados =
    				$('#tabRESULTADO').DataTable( {
    					dom: 'Blrtip',
    					colReorder: { enable: true,fixedColumnsLeft:1 },	
    					destroy: true,
    					autoWidth: true,
    					buttons: [ 	{ extend: 'excel', className: 'btn-primary' },
    					           	{ extend: 'csv'  , className: 'btn-info'    }, 
    					],
    					searching: false,
    					scrollX: true,
    					paging: true,
    					pageLength: 10,
    					data: registros, // dsDados.values,
    					columns: xColunas,
    					stateSave: true, //Ativa o armazenamento das preferencias de exibição
    					stateDuration: 0, //Indica o tempo que as preferencias ficaram armazenadas no chace
    					language: {
    						"sEmptyTable": "Nenhum registro encontrado",
    						"sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
    						"sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
    						"sInfoFiltered": "(Filtrados de _MAX_ registros)",
    						"sInfoPostFix": "",
    						"sInfoThousands": ".",
    						"sLengthMenu": "_MENU_ resultados por página",
    						"sLoadingRecords": "Carregando...",
    						"sProcessing": "Processando...",
    						"sZeroRecords": "Nenhum registro encontrado",
    						"sSearch": "Pesquisar",
    						"oPaginate": {
    							"sNext": "Próximo",
    							"sPrevious": "Anterior",
    							"sFirst": "Primeiro",
    							"sLast": "Último"
    						},
    						"oAria": {
    							"sSortAscending": ": Ordenar colunas de forma ascendente",
    							"sSortDescending": ": Ordenar colunas de forma descendente"
    						}
    					}
    				});
	    			// AJUSTAR CAMPO DE FILTRO PARA RESULTADOS POR PAGINA
	    			document.getElementsByName('tabRESULTADO_length')[0].classList.value='input-sm';
				} catch (e) {
					myLOADING.hide();
					FLUIGC.toast({ message:'Favor acionar o suporte, MSG: '+e.message,type:'danger' })
					return false;
				}
    			//
    			myLOADING.hide();
    		}
    	}
    }
	callbackFactory.error = function(xhr, txtStatus, error) {
		// ERRO SOLICITANTE
		myLOADING.hide();
		FLUIGC.toast({ message:'Falha na extração de dados '+error.message,type:'danger' });
    }
	//
	var xTIPO = $('#tpSOLICITACAO').val();
	if(xTIPO==null){
		myLOADING.hide();
		FLUIGC.toast({ message:'É necessário selecionar pelo menos 1 tipo de Solicitação.',type:'danger' })
		return false;
	}
	// 'DS_GED-PROTOCOLOS'
	var iDATA    = $('#dtINI').val();
	var fDATA    = $('#dtFIM').val()+' 23:59';
	
	// DATASETS
	var const1   = [];
		const1.push(DatasetFactory.createConstraint("dataSolicitacao",iDATA,fDATA,ConstraintType.MUST));
	DatasetFactory.getDataset(datasets[parseInt(xTIPO)],null,const1,null,callbackFactory);
}

function voltarHOME(){
	var server = WCMAPI.serverURL;
	var emp    = WCMAPI.organizationId;
	location = server+'/portal/p/'+emp+'/home';
}

function verOPCAO(qTpSOLICITACAO){
	// NAO IMPLEMENTADO PARA ONCOCLINICAS
	return true;
}
