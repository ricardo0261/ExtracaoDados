function enableFields(form) {
    var atividade = getValue('WKNumState')
    if (atividade == inicio || atividade == 0) {
        setSolicitante(form);
        setEmailSolicitante(form);
        setData(form, 'dataSolicitacao');
        hidePainelDp(form);
        hidePainelFinanceiro(form);
        hidePainelFiscal(form);
        hidePainelGestor(form);
        hidePainelInconsistencia(form);
        hidePainelSolicitante(form);
        form.setEnabled("inss", false)
    } else if (atividade == aprovacaoGestor) {
        painelSolicitante(form)
        hidePainelDp(form);
        hidePainelFinanceiro(form);
        hidePainelFiscal(form);
        hidePainelInconsistencia(form);
        hidePainelSolicitante(form);
        setData(form, 'dataAprovGestor');
    } else if (atividade == confeccao) {
        painelSolicitante(form)
        hidePainelFinanceiro(form);
        hidePainelFiscal(form);
        hidePainelGestor(form);
        hidePainelInconsistencia(form);
        hidePainelSolicitante(form);
        var usuario = getValue('WKUser');
        var nomeUsuario = buscarNomeUsuario(usuario);
        form.setValue("aprovadorDp", nomeUsuario);
        setData(form, 'dataAprovGestorDP');
        if (form.getValue('cbRecolhimentoINSS') == 'on') {
            form.setEnabled("inss", true)
        }
    } else if (atividade == erroIntegracaoPrenota) {
        painelSolicitante(form)
        hidePainelDp(form);
        hidePainelFinanceiro(form);
        hidePainelFiscal(form);
        hidePainelGestor(form);
        hidePainelInconsistencia(form);
        hidePainelSolicitante(form);
    } else if (atividade == classificacaoFiscal) {
        painelSolicitante(form);
        hidePainelDp(form);
        hidePainelFinanceiro(form);
        hidePainelGestor(form);
        hidePainelInconsistencia(form);
        hidePainelSolicitante(form);
        var usuario = getValue('WKUser')
        var nomeUsuario = buscarNomeUsuario(usuario);
        form.setValue("aprovadorFiscal", nomeUsuario);
        setData(form, 'dataAprovFiscal');
    } else if (atividade == erroEstorno) {
        painelSolicitante(form)
        hidePainelDp(form);
        hidePainelFinanceiro(form);
        hidePainelFiscal(form);
        hidePainelGestor(form);
        hidePainelInconsistencia(form);
        hidePainelSolicitante(form);
    } else if (atividade == programarPagamento) {
        painelSolicitante(form)
        hidePainelDp(form);
        hidePainelFiscal(form);
        hidePainelGestor(form);
        hidePainelInconsistencia(form);
        hidePainelSolicitante(form);
        var usuario = getValue('WKUser');
        var nomeUsuario = buscarNomeUsuario(usuario);
        form.setValue("aprovadorFinanceiro", nomeUsuario);
        setData(form, 'dataAprovFinanceiro');
    } else if (atividade == erroIntegracaoTitulo) {
        painelSolicitante(form)
        hidePainelDp(form);
        hidePainelFinanceiro(form);
        hidePainelFiscal(form);
        hidePainelGestor(form);
        hidePainelInconsistencia(form);
        hidePainelSolicitante(form);
        form.setEnabled("dataVencimento", true);
    } else if (atividade == aprovacaoSolicitante) {
        painelSolicitante(form)
        hidePainelDp(form);
        hidePainelFinanceiro(form);
        hidePainelFiscal(form);
        hidePainelGestor(form);
        hidePainelInconsistencia(form);
        setData(form, 'dataAprovSolicitante');
    } else if (atividade == solucaoInconsistencia) {
        painelSolicitante(form)
        hidePainelDp(form);
        hidePainelFinanceiro(form);
        hidePainelFiscal(form);
        hidePainelGestor(form);
        hidePainelSolicitante(form);
    } else if (atividade == corrigirInconsistencia) {
        setEnabledAprovadores(form);
    }
}

// desabilita a ediçao dos dados do solicitante
function painelSolicitante(form) {
    form.setEnabled("tipoSolicitacao", false);
    form.setEnabled("emergencial", false);
    form.setEnabled("ZoomFilial", false);
    form.setEnabled("zoomCentroCusto", false);
    form.setEnabled("zoomFornecedor", false);
    form.setEnabled("cpf", false);
    form.setEnabled("pis", false);
    form.setEnabled("loja", false);
    form.setEnabled("dependentes", false);
    form.setEnabled("endereco", false);
    form.setEnabled("cidade", false);
    form.setEnabled("banco", false);
    form.setEnabled("agencia", false);
    form.setEnabled("agenciaDigito", false);
    form.setEnabled("conta", false);
    form.setEnabled("contaDigito", false);
    form.setEnabled("zoomServicos", false);
    form.setEnabled("zoomMunicipio", false);
    form.setEnabled("zoomNatureza", false);
    form.setEnabled("descricaoServico", false);
    form.setEnabled("valorEstimado", false);
    form.setEnabled("dataVencimento", false);
    form.setEnabled("numeroTitulo", false);
    form.setEnabled("zoomTipoTitulo", false);
    form.setEnabled("zoomEspecieNf", false);
    form.setEnabled("serieNf", false);
    form.setEnabled("numeroDoc", false);
    form.setEnabled("zoomFilial", false);
    form.setEnabled("zoomCentroCusto", false);
    form.setEnabled("zoomFornecedor", false);
    form.setEnabled("zoomServico", false);
    form.setEnabled("zoomMunicipio", false);
    form.setEnabled("zoomNatureza", false);
    form.setEnabled("zoomTipoTitulo", false);
    form.setEnabled("zoomEspecieNf", false);
    form.setEnabled('dataEmissao', false);
    form.setEnabled('nomeFilial', false);
    form.setEnabled('centroCustos', false);
    form.setEnabled('fornecedor', false);
    form.setEnabled('servico', false);
    form.setEnabled('municipio', false);
    form.setEnabled('natureza', false);
    form.setEnabled('especieNf', false);
    form.setEnabled('tipoTitulo', false);
    form.setEnabled('cbRecolhimentoINSS', false);
    form.setEnabled('cpNomePai', false);
    form.setEnabled('cpNomeMae', false);
    form.setEnabled('cpNaturalidade', false);
    form.setEnabled('cpEstadoCivil', false);
    form.setEnabled('cpCtps', false);
    form.setEnabled('cpSerieCtps', false);
    form.setEnabled('dtNascimento', false);
    form.setEnabled("inss", false)
}
// Esconde o painel do Gestor
function hidePainelGestor(form) {
    form.setVisibleById("painelGestor", false);
}
// Esconde o painel do DP
function hidePainelDp(form) {
    form.setVisibleById("painelDp", false);
}
// Esconde o painel do Fiscal
function hidePainelFiscal(form) {
    form.setVisibleById("painelFiscal", false);
}
// Esconde o painel do Financeiro
function hidePainelFinanceiro(form) {
    form.setVisibleById("painelFinanceiro", false);
}
// Esconde o painel do Solicitante
function hidePainelSolicitante(form) {
    form.setVisibleById("painelSolicitante", false);
}
// Esconde o painel da Inconsistencia
function hidePainelInconsistencia(form) {
    form.setVisibleById("painelIncosistencia", false);
}
// seta as informacoes de usuario solicitante e data 
function setData(form, nomeCampo) {
    var date = new Date();
    var dia = date.getDate();
    if (dia.toString().length == 1) {
        dia = '0' + dia;
    }
    var mes = date.getMonth() + 1;
    if (mes.toString().length == 1) {
        mes = '0' + mes;
    }
    var ano = date.getFullYear();
    form.setValue(nomeCampo, dia + "/" + mes + "/" + ano);
}

function setSolicitante(form) {
    var usuario = buscarNomeUsuario(getValue('WKUser'))
    form.setValue("solicitanteProcesso", usuario);
}

function setEmailSolicitante(form) {
    var userMail = buscarMailUsuario(getValue('WKUser'))
    form.setValue("emailSolicitante", userMail);
}



// busca o nome do Solicitante
function buscarNomeUsuario(user) {
    var userName = "";
    var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", user,
        user, ConstraintType.MUST);
    var dataset = DatasetFactory.getDataset("colleague", null, [c1], null);
    if (dataset.rowsCount == 1) {
        userName = dataset.getValue(0, "colleagueName");
    }
    return userName;
}

// busca o email do Solicitante
function buscarMailUsuario(mail) {
    var userMail = "";
    var c2 = DatasetFactory.createConstraint("colleaguePK.colleagueId", mail, mail, ConstraintType.MUST);
    var dataset = DatasetFactory.getDataset("colleague", null, [c2], null);
    if (dataset.rowsCount == 1) {
        userMail = dataset.getValue(0, "mail");
    }
    return userMail;
}

function setEnabledAprovadores(form) {
    form.setEnabled('aprovGestor', false);
    form.setEnabled('motivoReijecaoGestor', false);
    form.setEnabled('aprovDp', false);
    form.setEnabled('motivoRejeicaoDp', false);
    form.setEnabled('aprovFiscal', false);
    form.setEnabled('motivoReijecaoFiscal', false);
    form.setEnabled('destinoFiscal', false);
    form.setEnabled('aprovFinanceiro', false);
    form.setEnabled('motivoReijecaoFinanceiro', false);
    form.setEnabled('destinoFinanceiro', false);
    form.setEnabled('aprovSolicitante', false);
    form.setEnabled('motivoReijecaoSolicitante', false);
    form.setEnabled('solucaoInconsistencia', false);
}