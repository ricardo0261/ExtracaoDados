/**
 * VERSAO 2309-p13
 */

var filter_Processo,
	set_zoomProcesso;

var filter_Filial,
	set_zoomFilial;

var extracaoAnexos = SuperWidget.extend({

    // METODO INICIADO QUANDO A WIDGET É CARREGADA
    init: function() {
    	
    	debugger;
    	
    	// REMOVE CABECALHO
    	$('.layout-1-1')[0].remove();
    	
		// INICIAR FILTROS
        filter_Processo = FLUIGC.filter( '#zoomProcesso',set_zoomProcesso );
        filter_Filial   = FLUIGC.filter( '#zoomFilial',set_zoomFilial     );
    },
  
    // BIND DE EVENTOS
    bindings: {
        local: {
            'execute': ['click_executeAction']
        },
        global: {
        }
    },
    
    executeAction: function(htmlElement, event) {
    	var callbackFactory =  new Object();
        callbackFactory.success = function(dsDados){
        	if(dsDados==null||dsDados.values==undefined)
            	FLUIGC.toast({ message:'Problema ao executar dataset. Favor acionar o suporte.',type:'danger' });
        	else
        		if(dsDados.values.length<=0)
        	    	FLUIGC.toast({ message:'Nenhum dado encontrado conforme parâmetros informados.',type:'danger' });
        		else {
    				// SOMENTE WFS FINALIZADOS
        			for (var iDados = 0; iDados < dsDados.values.length; iDados++) {
        				
        				$('#txtAcompanha').val(iDados);
        				console.log(iDados);
        				
        				if(new Date(dsDados.values[iDados]['startDateProcess']) >= new Date($('#dt_cadast_ini').val()         ) && 
        				   new Date(dsDados.values[iDados]['endDateProcess'])   <= new Date($('#dt_cadast_fim').val()+'T23:59')	){
	            		
        					if(dsDados.values[iDados].status =='2' ){
	            				var INSTANCEID = dsDados.values[iDados]['workflowProcessPK.processInstanceId'];
	            				var documentID = dsDados.values[iDados]['cardDocumentId'];
        						
        						// VERIFICAR SE O PROCESSO POSSUI ANEXOS
        				    	var params = [];
	        			    		params.push(DatasetFactory.createConstraint("processInstanceId",INSTANCEID,INSTANCEID,ConstraintType.MUST));
	        			    	var result1 = DatasetFactory.getDataset('processAttachment',null,params,null);
        						if(result1.values.length >1){
        							
        							// SE FILIAL INFORMADA VALIDAR 
        							var filial_filtra = false,
        								filial_achei  = false;
        							
        							if( $('#auxFilial').val()!='' ){
        								filial_filtra = true;
                				    	var params2 = [];
	    	        			    		params2.push(DatasetFactory.createConstraint("documentId",documentID,documentID,ConstraintType.MUST));
	    	        			    	var result2 = DatasetFactory.getDataset('document',null,params2,null);
	            						if(result2.values.length >0){
	            							try {
	            								if(result2.values[0]['cpCodFilial']==$('#auxFilial').val())
	            									filial_achei = true;
											} catch (e) {
												filial_achei  = false;
											}
	            						}
        							}
        							
        							// DOWNLOAD DE TODOS ARQUIVOS ANEXOS
        							if(!filial_filtra || (filial_filtra && filial_achei) ){
			            				var myH_Ref  = WCMAPI.serverURL;
	        								myH_Ref += '/bpm/api/v1/requests/'+INSTANCEID+'/attachments/download';
			
	        							console.log(myH_Ref);
	        								
			            				var a = document.createElement('a');
				            				a.href     = myH_Ref;
				            				a.download = 'anexos_FW-'+INSTANCEID+'.zip';
				            				document.body.appendChild(a);
				            				a.click();
				            				document.body.removeChild(a);
        							}
        						}
        					}
	            		}
        		}
    			// MSG FINALIZADO
    			FLUIGC.toast({ message:'Execução conforme parametros finalizada.',type:'info' });
        	}
        }
    	callbackFactory.error = function(xhr, txtStatus, error) {
    		// ERRO SOLICITANTE
    		FLUIGC.toast({ message:'Falha na extração de dados '+error.message,type:'danger' });
        }
    	var processId = $('#auxProcesso'  ).val();
    	
    	var params = [];
    		params.push(DatasetFactory.createConstraint("processId",processId,processId,ConstraintType.MUST));
    	DatasetFactory.getDataset('workflowProcess',null,params,null,callbackFactory);

    }
});

var set_zoomProcesso = {
	    source: {
	        url:  '/api/public/ecm/dataset/search?datasetId=processDefinition&searchField=processDescription&',
	        contentType: 'application/json',
	        root: 'content',
	        pattern: '',
	        limit: 1000,
	        offset: 0,
	        patternKey: 'searchValue',
	        limitkey: 'limit',
	        offsetKey: 'offset'
	    },
	    displayKey: 'processDescription',
	    multiSelect: false,
	    style: {
	        autocompleteTagClass: 'tag-gray',
	        tableSelectedLineClass: 'info'
	    },
	    table: {
	    	header: [{	'title'    : 'Nome',
			    		'standard' : true,
			    		'dataorder': 'processDescription',
			    	},{ 'title'    : 'ID',
			    		'display'  : false
			    	}],
	    	renderContent: ['processDescription','processId']
	    }
}

$(document).on('change', '[selected-zoomProcesso]', function(ev) {
	try {
	    var items = filter_Processo.getSelectedItems();
	    $('#auxProcesso').val( items[0]['processId'] );
	} catch (e) {
	    $('#auxProcesso').val('');
	}
});

var set_zoomFilial = {
	    source: {
	        url:  '/api/public/ecm/dataset/search?datasetId=ds_Filial&searchField=FILTRO&',
	        order: ['FILTRO', 'asc'],
	        contentType: 'application/json',
	        root: 'content',
	        pattern: '',
	        limit: 1000,
	        offset: 0,
	        patternKey: 'searchValue',
	        limitkey: 'limit',
	        offsetKey: 'offset'
	    },
	    displayKey: 'FILTRO',
	    multiSelect: false,
	    style: {
	        autocompleteTagClass: 'tag-gray',
	        tableSelectedLineClass: 'info'
	    },
	    table: {
	    	header: [{	'title'    : 'Nome',
			    		'standard' : true,
			    		'dataorder': 'FILTRO',
			    	},{ 'title'    : 'ID',
			    		'display'  : false
			    	}],
	    	renderContent: ['FILTRO','CODIGO']
	    }
}

$(document).on('change', '[selected-zoomFilial]', function(ev) {
	try {
	    var items = filter_Filial.getSelectedItems();
	    $('#auxFilial').val( items[0]["CODIGO"] );
	} catch (e) {
	    $('#auxFilial').val('');
	}
});
