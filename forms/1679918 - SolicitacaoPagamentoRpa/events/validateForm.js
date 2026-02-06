function validateForm(form) {
    var atividade = getValue('WKNumState');
    erros = ""
    if (atividade == inicio || atividade == 0 || atividade == corrigirInconsistencia) {
        erros += validaFormulario(form);
        if (form.getValue('gestorEncontrado') == 'false') {
            erros += 'Ausência de cadastro de Gestor para aprovação do Centro de Custo selecionado. Favor entrar em contato com a Central de Atendimento.\n'
        }
    } else if (atividade == aprovacaoGestor) {
        erros += validaGestor(form);
    } else if (atividade == confeccao) {
        erros += validaDp(form);
    } else if (atividade == classificacaoFiscal) {
        erros += validaFiscal(form)
    } else if (atividade == programarPagamento) {
        erros += validaFinanceiro(form);
    } else if (atividade == aprovacaoSolicitante) {
        erros += validaSolicitante(form);
    } else if (atividade == solucaoInconsistencia) {
        erros += validaInconsistencia(form);
    } else if (atividade == corrigirInconsistencia) {
        erros += validaFormulario(form);
    }
    if (erros.length != '') {
        throw '\n' + erros;
    }
}
//Valida todos os campos do formulario, com excessao dos de aprovação
function validaFormulario(form) {
    var erros = "";
    if (form.getValue("tipoSolicitacao").isEmpty()) {
        erros += "Deve ser selecionado o tipo de solicitação.\n";
    }
    if (form.getValue("nomeFilial") == "") {
        erros += "Deve ser selecionada uma Filial.\n";
    }
    if (form.getValue("centroCustos") == "") {
        erros += "Deve ser selecionado um centro de custo.\n";
    }
    if (form.getValue("fornecedor") == "") {
        erros += "Deve ser selecionado um Fornecedor.\n";
    }
    if (form.getValue('cpf').length() > 14) {
        erros += "Esse tipo de solicitacao so pode ser solicitada para pessoas fisicas.\n";
    }
    if (form.getValue("cpf") == "") {
        erros += "Deve ser informado um CPF para o Fornecedor.\n";
    }
    if (form.getValue("pis") == "") {
        erros += "Deve ser informado um PIS para o Fornecedor.\n";
    }
    if (form.getValue("loja") == "") {
        erros += "Deve ser informada uma loja para o Forncedor.\n";
    }
    if (form.getValue("endereco") == "") {
        erros += "Deve ser informado um endereço para o Forncedor.\n";
    }
    if (form.getValue("banco") == "") {
        erros += "Deve ser informado o codigo do banco do Forncedor.\n";
    }
    if (form.getValue("agencia") == "") {
        erros += "Deve ser inforamda a agencia do banco do Fornecedor.\n";
    }
    if (form.getValue("conta" == "")) {
        erros += "Deve ser informada a conta do banco do Forncedor.\n";
    }
    if (form.getValue("servico") == "") {
        erros += "Deve ser informado o serviço prestado.\n"
    }
    if (form.getValue("municipio") == "") {
        erros += "Deve ser informado o muncipio onde foi prestado o serviço.\n";
    }
    if (form.getValue("natureza") == "") {
        erros += "Deve ser informada a natureza do serviço prestado.\n";
    }
    if (form.getValue("descricaoServico") == "") {
        erros += "Deve se dar uma descriçao do serviço prestado.\n";
    }
    if (form.getValue("valorEstimado") == "") {
        erros += "Deve se informar um valor estipulado.\n"
    } else if (form.getValue("valorEstimado") < 0) {
        erros += "Valor estipulado deve ser maior que 0.\n"
    }
    if (form.getValue("dataVencimento") == "") {
        erros += "Deve ser informada uma data de vencimento\n"
    }
    if (form.getValue("cpNomePai") == "") {
        erros += "Deve ser informado o nome do pai\n"
    }
    if (form.getValue("cpNomeMae") == "") {
        erros += "Deve ser informado o nome da mãe\n"
    }
    if (form.getValue("cpNaturalidade") == "") {
        erros += "Deve ser informada a naturalidade\n"
    }
    if (form.getValue("cpEstadoCivil") == "") {
        erros += "Deve ser informada o estado civil\n"
    }
    if (form.getValue("cpCtps") == "") {
        erros += "Deve ser informado o CTPS\n"
    }
    if (form.getValue("cpSerieCtps") == "") {
        erros += "Deve ser informada a serie do CTPS\n"
    }
    if (form.getValue("dtNascimento") == "") {
        erros += "Deve ser informada uma data de nascimento\n"
    }


    if (form.getValue('tipoSolicitacao') == 'rpa') {
        if (form.getValue("tipoTitulo") == "") {
            erros += "Deve ser informado um tipo de titulo.\n";
        }
    }
    if (form.getValue('tipoSolicitacao') == 'nf') {
        if (form.getValue('especieNf') == "") {
            erros += 'Deve ser informada uma especie de NF.\n'
        }
        if (form.getValue('serieNf') == '') {
            erros += 'Deve ser informado um numero de serie da NF.\n'
        }
        if (form.getValue('numeroDoc') == '') {
            erros += 'Deve ser informado um numero de documento.\n'
        } else if (form.getValue('numeroDoc').length() > 9) {
            erros += 'Numero de documento deteve ter no maximo 9 digitos.\n'
        }
        if (form.getValue('dataEmissao') == '') {
            erros += 'Deve ser informada uma data de Emissão.\n'
        }
    }

    return erros;
}
//Valida o painel do Gestor
function validaGestor(form) {
    var erros = ""
    if (form.getValue("dataAprovGestor") == "") {
        erros += "Deve ser inserida uma data de aprovação.\n";
    }
    erros += validaDecisao(form, "aprovGestor", "motivoReijecaoGestor", null)
    return erros;
}
//Valida o painel do DP
function validaDp(form) {
    var erros = ""
    if (form.getValue("dataAprovGestorDP") == "") {
        erros += "Deve ser inserida uma data de aprovação.\n";
    }
    erros += validaDecisao(form, "aprovDp", "motivoRejeicaoDp", "destinoDp");
    return erros;
}
// Valida o painel do Fiscal
function validaFiscal(form) {
    var erros = ""
    if (form.getValue("dataAprovFiscal") == "") {
        erros += "Deve ser inserida uma data de aprovação.\n";
    }
    erros += validaDecisao(form, "aprovFiscal", "motivoReijecaoFiscal", "destinoFiscal");
    return erros;
}
// Valida o painel do Financeiro
function validaFinanceiro(form) {
    var erros = ""
    if (form.getValue("dataAprovFinanceiro") == "") {
        erros += "Deve ser inserida uma data de aprovação.\n";
    }
    erros += validaDecisao(form, "aprovFinanceiro", "motivoReijecaoFinanceiro", "destinoFinanceiro");
    return erros;
}
//Vlida o painel do Solicitante
function validaSolicitante(form) {
    var erros = ""
    if (form.getValue("dataAprovSolicitante") == "") {
        erros += "Deve ser inserida uma data de aprovação.\n";
    }
    erros += validaDecisao(form, "aprovSolicitante", "motivoReijecaoSolicitante", null);
    return erros;
}
function validaInconsistencia(form) {
    var erros = "";
    if (form.getValue("solucaoInconsistencia") == "") {
        erros += "Deve ser informada a solução.\n";
    }
    return erros;
}
// Valida se o genstor aprova ou reporva a solicitacao, em caso de
// reprovar valida se o gestor selecionou o destino da solicitacao
function validaDecisao(form, campoDecisao, campoMotivo, campoDestino) {
    var erros = "";
    if (form.getValue(campoDecisao) == "") {
        erros += "Deve ser informada uma decisão.\n"
    } else {
        if (form.getValue(campoDecisao) == "nao") {
            if (form.getValue(campoMotivo) == "") {
                erros += "Deve ser informado o motivo da rejeição.\n"
            }
            if (campoDestino != undefined || campoDestino != null) {
                if (form.getValue(campoDestino) == "") {
                    erros += "Deve ser informado um destino para a solicitação.\n";
                }
            }
        }
    }
    return erros;
}

