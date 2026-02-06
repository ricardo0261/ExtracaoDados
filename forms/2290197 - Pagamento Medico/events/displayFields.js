var INICIO = 4;
var INTEGRAR_NOTA = 13
var FIM = 27
var ANEXAR_NOTA = 61;
var CLASSIFICACAO_FISCAL = 63
var ERRO_INTEGRAR = 64
var VALIDACAO_FISCAL = 65
var APROVACAO_CLINICA = 66
var CORRIGIR_INCONSISTENCIA = 67
var APROV_SOLIC = 85
var SOL_INCONSISTENCIA = 88
var VERIFICACAO_FISCAL = 99
var APROV_CARREIRA_MEDICA = 118

function displayFields(form, customHTML) {
    
    var ATIVIDADE = getValue('WKNumState')
    var USUARIO = getValue('WKUser')
    var userMail = getValue('WKUser');
    form.setValue('atvAtual', ATIVIDADE);


    if (ATIVIDADE == INICIO || ATIVIDADE == 0) {

        form.setValue('cpSolicitante', buscarUsuario(USUARIO))
        form.setValue("emailSolicitante", buscarMailUsuario(userMail));
        form.setValue('dtSolicitacao', getDate())
        let cmds = []
        cmds.push("$('#fieldAprovacao').hide()")
        execJquery(cmds, customHTML)

    } else if (ATIVIDADE == CORRIGIR_INCONSISTENCIA) {

        if (form.getValue('cpOrigem') != 'Manual') {

            form.setEnabled('zmFornecedor', false)
            form.setEnabled('zmFilial', false)
            form.setEnabled('zmEspecieNf', false)
            form.setEnabled('zmCentroCusto', false)
        }
        let cmds = []
        cmds.push("$('#fieldAprovacao input').prop('disabled',true)")
        cmds.push("$('#fieldAprovacao button').prop('disabled',true)")
        cmds.push("$('#fieldAprovacao textarea').prop('disabled',true)")
        cmds.push("$('#cpInconsistencia').val('true')")
        execJquery(cmds, customHTML)

    } else if (ATIVIDADE == ANEXAR_NOTA) {

        form.setEnabled('zmFornecedor', false)
        form.setEnabled('zmFilial', false)
        form.setEnabled('zmCentroCusto', false)
        form.setEnabled('zmEspecieNf', false)
        let cmds = []
        cmds.push("$('#fieldAprovacao').hide()")
        cmds.push("setInputs()")
        execJquery(cmds, customHTML)

    } else if (ATIVIDADE == CLASSIFICACAO_FISCAL) {

        form.setEnabled('zmFornecedor', false)
        form.setEnabled('zmFilial', false)
        form.setEnabled('zmEspecieNf', false)
        form.setEnabled('zmCentroCusto', false)
        form.setEnabled('cpNumNota', false)
        let cmds = []
        cmds.push("$('#fieldAprovacao').hide()")
        cmds.push("$('input').prop('readonly','true')")
        execJquery(cmds, customHTML)

    } else if (ATIVIDADE == VALIDACAO_FISCAL) {

        form.setEnabled('zmFornecedor', false)
        form.setEnabled('zmFilial', false)
        form.setEnabled('zmEspecieNf', false)
        form.setEnabled('zmCentroCusto', false)
        form.setValue('cpAprovador', buscarUsuario(USUARIO))
        form.setValue('dtAprovacao', getDate())
        let cmds = []
        cmds.push("$('input').prop('readonly','true')")
        cmds.push("$('#fieldAprovacao').hide()")
        execJquery(cmds, customHTML)


    } else if (ATIVIDADE == APROVACAO_CLINICA) {

        form.setEnabled('zmFornecedor', false)
        form.setEnabled('zmFilial', false)
        form.setEnabled('zmEspecieNf', false)
        form.setEnabled('zmCentroCusto', false)
        form.setValue('cpAprovador', buscarUsuario(USUARIO))
        form.setValue('dtAprovacao', getDate())
        let cmds = []
        cmds.push("$('input').prop('readonly','true')")
        cmds.push("$('#divAprovacaoCarreira').show()")
        cmds.push("$('#divAprovacaoCarreira input').prop('disabled',true)")
        cmds.push("$('#divAprovacaoCarreira button').prop('disabled',true)")
        cmds.push("$('#divAprovacaoCarreira textarea').prop('disabled',true)")
        execJquery(cmds, customHTML)


    } else if (ATIVIDADE == ERRO_INTEGRAR) {

//        form.setEnabled('zmFornecedor', false)
//        form.setEnabled('zmFilial', false)
//        form.setEnabled('zmEspecieNf', false)
//        form.setEnabled('zmCentroCusto', false)
//        let cmds = []
//        cmds.push("$('input').prop('readonly','true')")
//        cmds.push("$('#fieldAprovacao').hide()")
//        execJquery(cmds, customHTML)
    } else if (ATIVIDADE == VERIFICACAO_FISCAL) {


        form.setEnabled('dtEmissao', true)
        form.setEnabled('cpNumNota', true)
        form.setEnabled('cpSerie', true)
        form.setEnabled('zmEspecieNf', true)
  
  
        form.setEnabled('dtVencimento', false)
        form.setEnabled('cpLocalServico', false)
        form.setEnabled('cpvlrUnitario', false)
        form.setEnabled('cpIpi', false)
        form.setEnabled('cpDesconto', false)
        form.setEnabled('zmProduto', false)
        form.setValue('cpAprovador', buscarUsuario(USUARIO))
        form.setValue('dtAprovacao', getDate())
        form.setEnabled('zmFornecedor', false)
        form.setEnabled('zmFilial', false)
        //form.setEnabled('zmEspecieNf', false)
        form.setEnabled('zmCentroCusto', false)

        let cmds = []
        //cmds.push("$('input').prop('readonly','true')")
        //cmds.push("$('#cpTes').prop('readonly',false)")
        //cmds.push("$('#cpAliqISS').prop('readonly',false)")

        if (form.getValue('cpSimplesNacional') == 'Não') {
            //cmds.push("$('.aliquota').hide()")
        }
        execJquery(cmds, customHTML)
    } else if (ATIVIDADE == APROV_CARREIRA_MEDICA) {

        form.setEnabled('zmFornecedor', false)
        form.setEnabled('zmFilial', false)
        form.setEnabled('zmEspecieNf', false)
        form.setEnabled('zmCentroCusto', false)
        form.setValue('cpAprovadorCarreira', buscarUsuario(USUARIO))
        form.setValue('dtAprovacaoCarreira', getDate())
        let cmds = []
        cmds.push("$('#divAprovacaoCarreira').show()")
        cmds.push("$('input').prop('readonly','true')")
        cmds.push("$('#fieldAprovacao input').prop('disabled',true)")
        cmds.push("$('#fieldAprovacao button').prop('disabled',true)")
        cmds.push("$('#fieldAprovacao textarea').prop('disabled',true)")
        execJquery(cmds, customHTML)


    }

    if (ATIVIDADE != APROV_SOLIC && ATIVIDADE != SOL_INCONSISTENCIA) {
        let cmds = []
        //getVencimentoProtheus(form, customHTML)
        cmds.push("$('#divAprovacaoSolictante').hide()")

        if (ATIVIDADE != SOL_INCONSISTENCIA) {
            cmds.push("$('#solucaoInconsistencia').hide()")
        }
        execJquery(cmds, customHTML)

    } else {

        form.setEnabled('zmFornecedor', false)
        form.setEnabled('zmFilial', false)
        form.setEnabled('zmEspecieNf', false)
        form.setEnabled('zmCentroCusto', false)

        let cmds = []
        cmds.push("$('input').prop('readonly','true')")
        cmds.push("$('#fieldAprovacao button').prop('disabled',true)")
        cmds.push("$('#fieldAprovacao textarea').prop('disabled',true)")

        if (ATIVIDADE != SOL_INCONSISTENCIA) {
            if (form.getValue('solucao') == '') {
                cmds.push("$('#solucaoInconsistencia').hide()")
            } else {
                cmds.push("$('#solucaoInconsistencia textarea').prop('disabled',true)")
            }
        } else {
            cmds.push("$('#divAprovacaoSolictante textarea').prop('disabled',true)")
            cmds.push("$('#divAprovacaoSolictante button').prop('disabled',true)")
            cmds.push("$('#pesquisaSatisfacao').hide()")
        }
        execJquery(cmds, customHTML)
    }

    if (ATIVIDADE != VERIFICACAO_FISCAL) {
        form.setEnabled('cpSimplesNacional', false)
        form.setEnabled('cpAliqISS', false)
        form.setEnabled('slCepom', false)
        form.setEnabled('cpTes', false)
        let cmds = []
        cmds.push("$('.impostos').hide()")
        execJquery(cmds, customHTML)

    }
    
     if(ATIVIDADE == APROV_SOLIC){

        form.setEnabled('parteCarrerMedica', false)
        form.setEnabled('zmFilial2', false)
        form.setEnabled('especiMedico', false)
        form.setEnabled('dtEmissao', false)
        form.setEnabled('dtVencimento', false)
        form.setEnabled('cpNumNota', false)
        form.setEnabled('cpSerie', false)
        form.setEnabled('zmProduto', false)
        form.setEnabled('cpvlrUnitario', false)
        form.setEnabled('cpIpi', false)
        form.setEnabled('cpDesconto', false)
        form.setEnabled('cpLocalServico', false)
        
     }

}

function execJquery(cmds, customHTML) {
    for (var key in cmds) {
        customHTML.append("<script>" + cmds[key] + "</script>")
    }
}

// busca o nome do usuario na base do fluig
function buscarUsuario(user) {
    var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user, user, ConstraintType.MUST);
    var dataset = DatasetFactory.getDataset("colleague", null, [c1], null);
    if (dataset.rowsCount == 1) {
        return dataset.getValue(0, "colleagueName");
    }
}

// busca o email do usuario na base do fluig
function buscarMailUsuario(mail) {
    var userMail = "";
    var c2 = DatasetFactory.createConstraint("colleaguePK.colleagueId", mail, mail, ConstraintType.MUST);
    var dataset = DatasetFactory.getDataset("colleague", null, [c2], null);
    if (dataset.rowsCount == 1) {
        userMail = dataset.getValue(0, "mail");
    }
    return userMail;
}

// retorna a data atual no formato YYYY/mm/DD
function getDate() {
    var data = new Date();
    var dia = data.getDate();
    var mes = parseInt(data.getMonth()) + 1;
    var ano = data.getFullYear()
    if (dia < 10) {
        dia = '0' + dia
    }
    if (mes < 10) {
        mes = '0' + mes
    }
    return ano + '-' + mes + '-' + dia
}


// function getVencimentoProtheus(form, customHTML) {

//     var filial = form.getValue("cpCodFilial");
//     var numero = form.getValue("cpNumNota");
//     var serie = form.getValue("cpSerie");
//     var codFornecedor = form.getValue("cpCodFornecedor");
//     var lojFornecedor = form.getValue("cpLojaFornecedor");

   

//     var c1 = DatasetFactory.createConstraint("FILIAL", filial, filial, ConstraintType.MUST);
//     var c2 = DatasetFactory.createConstraint("NUMERO", numero, numero, ConstraintType.MUST);
//     var c3 = DatasetFactory.createConstraint("PREFIXO", serie, serie, ConstraintType.MUST);
//     var c4 = DatasetFactory.createConstraint("COD_FORNECEDOR", codFornecedor, codFornecedor, ConstraintType.MUST);
//     var c5 = DatasetFactory.createConstraint("LOJA_FORNECEDOR", lojFornecedor, lojFornecedor, ConstraintType.MUST);
//     var constraints = new Array(c1, c2, c3, c4,c5);

//     var ds_contasPagar = DatasetFactory.getDataset("ds_contasPagar", null, constraints, null);
//     //form.setValue("dataPagamentoPrevista", ds_contasPagar.getValue(0, "DT_VENCTO_REAL"));
//     //form.setValue("statusPagamento", ds_contasPagar.getValue(0, "SALDO"));

//     if (ds_contasPagar.getValue(0, "SALDO") == '0') {
//         form.setValue("statusPagamento","Titulo Baixado");
//     }else{
//         form.setValue("statusPagamento","Titulo em Aberto");
//     }

// }