function beforeStateEntry(sequenceId) {
    
    var pastaPai = 8898;
    var verificarAnexo = new checkAnexo();
    // populaCamposHiddenAnalytics(sequenceId);

    log.info("##-- sequenceId: " + sequenceId);
    if (sequenceId == 90) {
        codCC = hAPI.getCardValue("CTT_CUSTO")
        var constraintDs_centroCusto1 = DatasetFactory.createConstraint('CODIGO', codCC, codCC, ConstraintType.MUST);
        var ds_centroCusto = DatasetFactory.getDataset('ds_centroCusto', null, new Array(constraintDs_centroCusto1), null);
        if (ds_centroCusto.getValue(0, 'CODIGO') == '') {
            hAPI.setCardValue('centroCustosBloqueado', 'true')
            hAPI.setCardValue('centroCustosAnterior', codCC)

        } else {
            hAPI.setCardValue('centroCustosBloqueado', 'false')
        }

        if (hAPI.getCardValue("existeRateio") == "true" && hAPI.getCardValue('indiceRateio') != '0') {
            var index = hAPI.getCardValue('indiceRateio')
            var cons = new Array()

            for (var i = 1; i <= index; i++) {
                var filtroCodigo = hAPI.getCardValue('codCentroCustoBeneficio___' + i)
                cons.push(DatasetFactory.createConstraint('CODIGO', filtroCodigo, filtroCodigo, ConstraintType.MUST))
            }

            var ds_centroCusto = DatasetFactory.getDataset('ds_centroCusto', null, cons, null);
            log.info('' + getValue("WKNumProces") + '<<<< LINHAS qtde rateio >>>>' + index);
            log.info('' + getValue("WKNumProces") + '<<<< DSCENTROCUSTOS do rateio >>>>' + ds_centroCusto.rowsCount);
            if (ds_centroCusto.rowsCount >= index) {
                hAPI.setCardValue('centroCustosBloqueado', 'false')
            } else {
                hAPI.setCardValue('centroCustosBloqueado', 'true')
            }
        }


    }



    if (sequenceId == GESTOR) {

        var nivelAtualAprovacao = hAPI.getCardValue("nivelAtualAprovacao");
        var nivelMaximoAprovacao = hAPI.getCardValue("nivelMaximoAprovacao");
        verificaDataVencimento();

        if (nivelAtualAprovacao < nivelMaximoAprovacao) {

            nivelAtualAprovacao = parseInt(nivelAtualAprovacao) + 1;
            hAPI.setCardValue("proximoAprovador", hAPI.getCardValue("idAprovGestor" + nivelAtualAprovacao));
            //hAPI.setCardValue("codigoAprovador", hAPI.getCardValue("idAprovGestor" + nivelAtualAprovacao));

        } else {
            hAPI.setCardValue("proximoAprovador", "");
        }

        // if (hAPI.getCardValue('motValidacaoFiscal') != ""){
        //     hAPI.setCardValue('validacaoFiscal').setVisible(true);  
        // } else{
        //     hAPI.setCardValue('validacaoFiscal').setVisible(false); 
        // }
    
        // if (hAPI.getCardValue('motAprovacaoTesoura') != ""){
        //     hAPI.setCardValue('aprovacaoTesoura').setVisible(true);   
        // } else{
        //     hAPI.setCardValue('aprovacaoTesoura').setVisible(false); 
        // }

        // if (hAPI.getCardValue('motAprovacaoFinanc') != ""){
        //     hAPI.setCardValue('aprovacaoFinanc').setVisible(true);  
        // } else{
        //     hAPI.setCardValue('aprovacaoFinanc').setVisible(false);  
        // }

        // if (hAPI.getCardValue('motivoAprovFiscal') != ""){
        //     hAPI.setCardValue('aprovacaoFiscal').setVisible(true);  
        // } else{
        //     hAPI.setCardValue('aprovacaoFiscal').setVisible(false); 
        // }
    }

    if (sequenceId) {
        log.info("beforeStateEntry -> Proxima Tarefa =>>>> " + sequenceId);
        if (sequenceId == ATRIBUIR_RESPONSAVEL) {
        	if (hAPI.getCardValue('viaWebService') == 'false') verificarAnexo.executar("Guias/Taxas/Boletos/Nota Fiscal");
        } else if (sequenceId == 31) {
            verificarAnexo.executar("Guias/Taxas/Boletos/Nota Fiscal");
            publicaDocumento(pastaPai);
        } else if (sequenceId == SOLUCAO_INC && sequenceId != buscarAtividadeAtual()) {
            incrementaNrReprovacoes();
        }
    } else {
        log.info("Execução do beforeStateEntry sem preenchimento do sequenceId!");
        return;
    }

    if (sequenceId == ATRIBUIR_RESPONSAVEL) {
        //var gestorResponsavel = getWFParametro("gestorResponsavel");
        //if(gestorResponsavel == ""){
        //throw "Ausência de cadastro de Gestor para aprovação do Centro de Custo selecionado. Favor entrar em contato com a Central de Atendimento.";
        //}
        getNatureza();
        definirAtividadeAutomatica();
    }


    if (sequenceId == ATUALIZA_SLA_1) {
        var users = new java.util.ArrayList();
        users.add(hAPI.getCardValue("cdSolicitante"));
        hAPI.setAutomaticDecision(CORRECAO, users,
            "Tarefa movimentada atualizando o tempo que está sendo empenhado na atividade.");
    }

    if (sequenceId == ATUALIZA_SLA_2) {
        var users = new java.util.ArrayList();
        users.add(hAPI.getCardValue("cdSolicitante"));
        hAPI.setAutomaticDecision(APROV_SOLIC, users,
            "Tarefa movimentada atualizando o tempo que está sendo empenhado na atividade.");

    }

    if (sequenceId == APROV_SOLIC || sequenceId == PROGRAMAR) {
        var dataPgto;
        if (hAPI.getCardValue("dtDePgtoGuiaTaxaBoletos") != '') {
            dataPgto = hAPI.getCardValue("dtDePgtoGuiaTaxaBoletos");
        } else {
            dataPgto = hAPI.getCardValue("dtDeVencPgtoGuiaTaxaBoletos");
        }
        hAPI.setCardValue("aprovDataPrevista", dataPgto);
        hAPI.setCardValue("aprovDataPrevistaSolici", dataPgto);
    }
}

function getNatureza(){

    var solicitante = hAPI.getCardValue('solicitante');

    if(solicitante == 'integrador.fluig@oncoclinicas.com'){
        
        var natureza = hAPI.getCardValue('zoomNatureza');
        var codNatureza = natureza.substr(0, 8);
        log.info('CODNATUREZA>>>>>>>' + codNatureza);

        if(codNatureza == '41111006' || codNatureza == '41111007' || codNatureza == '41111008' || codNatureza == '41111010' || codNatureza == '41111016' || codNatureza == '41111017' || codNatureza == '41111040' || codNatureza == '41111041' || codNatureza == '41111014' || codNatureza == '41111037' || codNatureza == '41111013' || codNatureza == '41111036' || codNatureza == '41111028' || codNatureza == '41111027' || codNatureza == '41111030' || codNatureza == '41202035' || codNatureza == '41111029' || codNatureza == '41111011' || codNatureza == '41111012' || codNatureza == '41111009') {
            hAPI.setCardValue("responsavelTiZoom", "imposto2");
        } 
    } 
     
}

function verificaDataVencimento() {
    var bool = true;
    var dt = (hAPI.getCardValue("dtDeVencPgtoGuiaTaxaBoletos")).split('/');
    var dtLimite = new Date(dt[2], dt[1] - 1, dt[0]);
    var dtPagto = new Date();
    var lancamento = hAPI.getCardValue("tipoLancamento");
    var novaData = '';

    if (lancamento == 'faciliteis' || lancamento == 'diversos') {
        if (parseFloat(hAPI.getCardValue("valorPagtoNum")) < 5000) { // solicitações com menos de 5 mil reais
            if (dtLimite.getTime() <= dtPagto.getTime()) { //se venceu antes ou no dia da aprovação
                while (bool) {
                    if (dtPagto.getDay() != 5 && dtPagto.getDay() != 6) { //se o dia atual não for sexta/sábado
                        dtPagto.setDate(dtPagto.getDate() + 1); //adiciona próximo dia como dia de pgto
                        novaData = dataString(dtPagto);
                        bool = false;
                    } else {
                        dtPagto.setDate(dtPagto.getDate() + 1);
                    }
                }
            }
        }
    } else if (lancamento == 'impostos') {
        if (dtLimite.getTime() > dtPagto.getTime()) {
            while (bool) {
                if (dtLimite.getDay() != 6 && dtLimite.getDay() != 0) { //se o dia atual não for sábado/domingo
                    novaData = dataString(dtLimite);
                    bool = false;
                } else {
                    dtLimite.setDate(dtLimite.getDate() - 1);
                }
            }
        }
    }

    if (novaData != '') {
        hAPI.setCardValue("dtDePgtoGuiaTaxaBoletos", novaData);
    }
}

function publicaDocumento(pastaPai) {
    var tipoSolicitacao = getTipoSolicitacao();
    log.info("tipoSolicitacao: " + tipoSolicitacao);
    log.info("Prepara??o para a publica??o dos anexos!");
    var objAnexar = new objAnexo(pastaPai);

    objAnexar.setParametro(1, tipoSolicitacao);
    objAnexar.setParametro(2);

    log.info("TRATOU STRING");

    objAnexar.publicar();
    log.info("PUBLICOU ARQUIVO");
}

function getTipoSolicitacao() {
    var nomeTipo = '';
    nomeTipo = i18n.translate("label.pgtoTaxasBoletos");
    return nomeTipo;
}

function definirAtividadeAutomatica() {
    var users = new java.util.ArrayList();
    users.add("System:auto");
    hAPI.setAutomaticDecision(EXCLUSIVO_ATRIBUICAO, users,
        "Decisao tomada automaticamente pelo Fluig");

    log.info("movimentando para a atividade automatica");
}



function dataString(data) {
    var dia = data.getDate();
    var mes = data.getMonth() + 1;
    var ano = data.getFullYear();

    if (dia < 10) {
        dia = '0' + dia;
    }
    if (mes < 10) {
        mes = '0' + mes;
    }
    return dia + '/' + mes + '/' + ano;
}



