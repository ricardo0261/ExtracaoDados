function displayFields(form, customHTML) {
    var atividade = getValue('WKNumState')
    
    customHTML.append('<script>var atividade = ' + getValue("WKNumState") + '; </script>');


    var modo = form.getFormMode();
    if (modo == "VIEW") {
        customHTML.append("<script> $('.btn').hide(); </script>")
    }
    if ((atividade == corrigirInconsistencia || atividade == inicio || atividade == 0)) {
        customHTML.append("<script> $('.data').prop( 'disabled', true);</script>")
        customHTML.append("<script> getConfiFichario() </script>")
    } 

    if (atividade == corrigirInconsistencia) {
        // Zera os valores da alçada quando passar pela atividade de correção;
        var aprovadores = JSON.parse(form.getValue("alcada"));
        var aprovador = "";
        aprovador = aprovadores[0].id;
        form.setValue("alcadaAtual", "0");
        form.setValue("proximoAprovador", aprovador);
        form.setValue("aprovacao", "true");
    }

    if (atividade == aprovacaoSolicitante) {
        getVencimentoProtheus(form, customHTML) 
    }
}


function getVencimentoProtheus(form, customHTML) {

    var filial = form.getValue("codFilial");
    var numero = form.getValue("numeroTitulo");
    var codFornecedor = form.getValue("codFornecedor");
    var lojFornecedor = form.getValue("loja");
    
    var c1 = DatasetFactory.createConstraint("FILIAL", filial, filial, ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("NUMERO", numero, numero, ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("COD_FORNECEDOR", codFornecedor, codFornecedor, ConstraintType.MUST);
    var c4 = DatasetFactory.createConstraint("LOJA_FORNECEDOR", lojFornecedor, lojFornecedor, ConstraintType.MUST);
    var constraints = new Array(c1, c2, c3,c4);

    var ds_contasPagar = DatasetFactory.getDataset("ds_contasPagar", null, constraints, null);
    form.setValue("dataPagamentoPrevista", ds_contasPagar.getValue(0, "DT_VENCTO_REAL"));
    //form.setValue("statusPagamento", ds_contasPagar.getValue(0, "SALDO"));

    if (ds_contasPagar.getValue(0, "SALDO") == '0') {
        form.setValue("statusPagamento","Titulo Baixado");
    }else{
        form.setValue("statusPagamento","Titulo em Aberto");
    }

}