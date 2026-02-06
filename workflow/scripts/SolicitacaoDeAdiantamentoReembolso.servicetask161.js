
function servicetask161(attempt, message) {

    cadastraFornecedor();

    
}




function cadastraFornecedor() {

    
    var cgcfornecedor = removeCPF(hAPI.getCardValue('cpf'));

    var c1 = DatasetFactory.createConstraint('CGC', cgcfornecedor, cgcfornecedor, ConstraintType.MUST);
    var dsfornecedor = DatasetFactory.getDataset('ds_fornecedor', null, new Array(c1), null);

    log.info("CADASTRO...")
    log.dir(dsfornecedor)
    log.info("CADASTROOO: "+ dsfornecedor.rowsCount)

    if(dsfornecedor.rowsCount != undefined && dsfornecedor.rowsCount > 0){


        if(dsfornecedor.getValue(0, "CGC") == cgcfornecedor ){


            hAPI.setCardValue("temcadastro", "SIM");
            hAPI.setCardValue("codFornecedor", "" + dsfornecedor.getValue(0 , "CODIGO"));
            hAPI.setCardValue("E2_FORNECE","" + dsfornecedor.getValue(0 , "CODIGO"));
            hAPI.setCardValue("lojaFornecedor", "01");
            hAPI.setCardValue("nomeFornecedor", "" + dsfornecedor.getValue(0 , "DESCRICAO"));
            hAPI.setCardValue("valTransfeera_02", "sim");

          

                throw 'Fornecedor já cadastrado, código  ' + dsfornecedor.getValue(0,"CODIGO") + '  !!'
        }
         
    }

   

    var fornecedor = hAPI.getCardValue("tipoFornecedor");
    var cep = removeCEP(hAPI.getCardValue("cep"));
    var cgc = removeCPF(hAPI.getCardValue("cpf"));
    var formaPagto = hAPI.getCardValue("tipoConta");

    var naoExiste = hAPI.getCardValue("nomeForn");

    if (naoExiste != "") {
        var camposIntegracao = '';
        camposIntegracao += 'A2_LOJA;01|';
        camposIntegracao += 'A2_NOME;' + hAPI.getCardValue("fornecedor") + '|';
        camposIntegracao += 'A2_NREDUZ;' + hAPI.getCardValue("fornecedor") + '|';
        camposIntegracao += 'A2_END;' + hAPI.getCardValue("endereco") + '|';
        camposIntegracao += 'A2_BAIRRO;' + hAPI.getCardValue("bairro") + '|';
        camposIntegracao += 'A2_EST;' + hAPI.getCardValue("uf") + '|';
        camposIntegracao += 'A2_COD_MUN;' + hAPI.getCardValue("codCidade") + '|';
        camposIntegracao += 'A2_MUN;' + hAPI.getCardValue("zoomMunicipio") + '|';
        camposIntegracao += 'A2_CEP;' + cep + '|';
        camposIntegracao += 'A2_TIPO;' + fornecedor + '|';
        camposIntegracao += 'A2_CGC;' + cgc + '|';
        camposIntegracao += 'A2_DDD;' + hAPI.getCardValue("ddd") + '|';
        camposIntegracao += 'A2_TEL;' + hAPI.getCardValue("telefone") + '|';
        camposIntegracao += 'A2_PAIS;105|';
        camposIntegracao += 'A2_PAISDES;BRASIL |';
        camposIntegracao += 'A2_EMAIL;' + hAPI.getCardValue("emailForn") + '|';
        camposIntegracao += 'A2_ENDCOMP;' + hAPI.getCardValue("complementoEnd") + '|';
        camposIntegracao += 'A2_NUMCON;' + hAPI.getCardValue("contaCorrente") + '|';
        camposIntegracao += 'A2_BANCO;' + hAPI.getCardValue("codBanco") + '|';
        camposIntegracao += 'A2_AGENCIA;' + hAPI.getCardValue("agencia") + '|';
        camposIntegracao += 'A2_DVCTA;' + hAPI.getCardValue("digVConta") + '|';
        camposIntegracao += 'A2_RECISS;' + hAPI.getCardValue("recolheISS") + '|';
        camposIntegracao += 'A2_RECINSS;' + hAPI.getCardValue("calcInss") + '|';
        camposIntegracao += 'A2_RECPIS;' + hAPI.getCardValue("recolhePIS") + '|';
        camposIntegracao += 'A2_RECCOFI;' + hAPI.getCardValue("recolheCofins") + '|';
        camposIntegracao += 'A2_RECCSLL;' + hAPI.getCardValue("recolheCSLL") + '|';
        camposIntegracao += 'A2_CALCIRF;' + hAPI.getCardValue("irrf") + '|';
        camposIntegracao += 'A2_SITESBH;' + hAPI.getCardValue("SitEspResBH") + '|';
        camposIntegracao += 'A2_MINIRF;' + hAPI.getCardValue("minIR") + '|';
        camposIntegracao += 'A2_CPRB;' + hAPI.getCardValue("indicativoRetencaoCPRB") + '|';
        camposIntegracao += 'A2_TPJ;' + hAPI.getCardValue("tipoPJ") + '|';
        camposIntegracao += 'A2_SIMPNAC;' + hAPI.getCardValue("optanteSimpleNac") + '|';
        camposIntegracao += 'A2_XCODRET;' + hAPI.getCardValue("codRetencaoDirf") + '|';
        camposIntegracao += 'A2_ZTPISS;' + hAPI.getCardValue("tpjISS") + '|';
        if (formaPagto == '1') {
            camposIntegracao += 'A2_TIPCTA;' + formaPagto + '|';
            camposIntegracao += 'A2_XFORPAG;2|';
        } else {
            camposIntegracao += 'A2_TIPCTA;' + formaPagto + '|';
            camposIntegracao += 'A2_XFORPAG;1|';
        }

        var periodicService = ServiceManager.getService('OncoclinicasFornecedorProduto');
        var serviceHelper = periodicService.getBean();
        var serviceLocator = serviceHelper.instantiate('local.sp01.spon4404.ONCOCLINICAS_WEBSERVICES_apw.ONCOCLINICAS_WEBSERVICESLocator');
        var service = serviceLocator.getONCOCLINICAS_WEBSERVICESSOAP();
        log.info("XML Fornecedor:" + camposIntegracao);
        var resultObj = service.SETINSEREFORNECEDOR(camposIntegracao);
        if (resultObj == '' || resultObj == null || resultObj == ' ' || resultObj.length() > 8) {
            throw 'ERRO CRIACAO DO FORNECEDOR<br><br>' + resultObj;
        } else {
            var codigoForn = resultObj.substring(0, 6);
            hAPI.setTaskComments(getValue("WKUser"), getValue("WKNumProces"), 0, "Código do fornecedor Protheus: " + codigoForn);
            hAPI.setCardValue('codFornecedor', codigoForn);
            hAPI.setCardValue('E2_FORNECE', codigoForn);
            hAPI.setCardValue('lojaFornecedor', "01");
            hAPI.setCardValue('nomeFornecedor', hAPI.getCardValue("fornecedor"));
            log.info("codFornecedor cadastrado: " + codigoForn);
        }

       
    }
    
}
function converteDataProtheus(dataFluig) {
    if (dataFluig != undefined) {
        var arrayData = dataFluig.split("/");
        var data = '';
        if (arrayData.length == 3) {
            var ano = arrayData[2];
            var mes = arrayData[1];
            var dia = arrayData[0];
            data = ano + '' + mes + '' + dia;
        }
        return data;
    } else {
        return '';
    }
}
function formataDDD(telefone) {
    if (telefone != "" || telefone != null || telefone != undefined) {
        var ddd = telefone.split(" ")[0];
        var dddTratado = ddd.replace("(", "").replace(")", "");
        log.info("DDD do Telefone: " + dddTratado);
        return dddTratado;
    }
}
function formataTelefone(telefone) {
    if (telefone != "" || telefone != null || telefone != undefined) {
        var numero = telefone.split(" ")[1];
        var numeroTratado = numero.replace("-", "");
        log.info("Número de Telefone: " + numeroTratado);
        return numeroTratado;
    }
}

function removeCEP(cep) {
    if (cep != undefined && cep != "" && cep != null) {
        cep = cep.replace('-', '');
        log.info("CEP: " + cep);
        return cep;
    } else {
        return;
    }
}



function removeCPF(cgc) {
    if (cgc != undefined && cgc != "" && cgc != null) {
    	 cgc = cgc.replace('.', '');
         cgc = cgc.replace('.', '');
         cgc = cgc.replace('.', '');
         cgc = cgc.replace('-', '');
        return cgc;
    } else {
        return ;
    }
}
