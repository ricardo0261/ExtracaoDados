function validateForm(form) {
    var ATIVIDADE = getValue('WKNumState')
    var USUARIO = getValue('WKUser')

    if (ATIVIDADE == INICIO || ATIVIDADE == 0) {

        var codHVS = form.getValue('cpCodFilial');
        if (codHVS == "06601"){
            throw 'Prezado (a) as operações de registro de documentos para pagamentos do Hospital Vila da Serra - HVS que se enquadra neste fluxo ainda não estão sendo realizadas pelo CSO e sim internamente no Hospital,gentileza enviar sua demanda para o e-mail centraldenotas@oncoclinicas.com que direcionaremos sua demanda para o responsável do HVS.                                                                                                                                                                          ' 
        }


        validaCp('zmFornecedor', 'Forncedor', form)
        validaCp('zmFilial', 'Filial', form)


        if (form.getValue('cpOrigem') == 'Manual') {
            validaCp('zmEspecieNf', 'Especie Nota Fiscal', form)
            validaData('dtEmissao', 1, 'Data de Emissão', form)
            validaData('dtVencimento', 2, 'Data Vencimento', form)
            validaCp('dtEmissao', 'Data Emissão', form)
            validaCp('dtVencimento', 'Data Vencimento', form)
            validaCp('cpNumNota', 'Número Documento', form)
            validaCp('cpSerie', 'Série', form)
            validaCp('cpLocalServico', 'Local Serviço', form)
            validaCp('zmCentroCusto', 'Centro de Custos', form)
            validaCp('zmProduto', 'Produto', form);
            validaCp('cpvlrUnitario', 'Valor Unitario', form);
        }


    } else if (ATIVIDADE == CORRIGIR_INCONSISTENCIA) {

        validaCp('zmFornecedor', 'Forncedor', form)
        validaCp('zmFilial', 'Filial', form)
        validaCp('zmEspecieNf', 'Especie Nota Fiscal', form)
        validaCp('dtEmissao', 'Data Emissão', form)
        validaCp('dtVencimento', 'Data Vencimento', form)
        validaCp('cpNumNota', 'Número Documento', form)
        validaCp('cpSerie', 'Série', form)
        validaCp('cpLocalServico', 'Local Serviço', form)
        validaCp('zmCentroCusto', 'Centro de Custos', form)
        validaCp('cpvlrUnitario', 'Valor Unitario', form)
        if (form.getValue('cpOrigem') != 'Manual') {
            validaValor(form)
        }
    } else if (ATIVIDADE == ANEXAR_NOTA) {

        validaCp('zmEspecieNf', 'Especie Nota Fiscal', form)
        validaCp('dtEmissao', 'Data Emissão', form)
        validaCp('dtVencimento', 'Data Vencimento', form)
        validaCp('cpNumNota', 'Número Documento', form)
        validaCp('cpSerie', 'Série', form)
        validaCp('cpLocalServico', 'Local Serviço', form)
        validaCp('zmCentroCusto', 'Centro de Custos', form)
        validaCp('zmProduto', 'Produto', form);
        validaCp('cpvlrUnitario', 'Valor Unitario', form)
        validaValor(form)

    } else if (ATIVIDADE == CLASSIFICACAO_FISCAL) {

    } else if (ATIVIDADE == VALIDACAO_FISCAL) {

    } else if (ATIVIDADE == APROVACAO_CLINICA) {

        validaAprovacao(form)

    } else if (ATIVIDADE == ERRO_INTEGRAR) {

    } else if (ATIVIDADE == APROV_SOLIC) {
        validaCp('chamadoAprovado', 'Aprovação', form);

        var decisao = form.getValue('chamadoAprovado');
        if (decisao == 'nao') {
            validaCp('motivoReprov', 'Motivo Reprovação', form);
        }

        validaValor(form)

    } else if (ATIVIDADE == VERIFICACAO_FISCAL) {

        validaCp('slCepom', 'CEPOM', form);
        

        if (form.getValue('cpSimplesNacional') == 'Sim') {
            validaCp('cpAliqISS', 'Alíquota ISS', form);
        }
        validaCp('cpTes', 'TES', form);
        validaAprovacao(form)
    } else if (ATIVIDADE == SOL_INCONSISTENCIA) {
        validaCp('solucao', 'Solução', form);
    } else if (ATIVIDADE == APROV_CARREIRA_MEDICA) {

        validaCp('cpDecisaoCarreira', 'Decisão', form)

        if (form.getValue('cpDecisaoCarreira') == 'nao' &&
            (form.getValue('motivoReprovCarreira') == '' ||
                form.getValue('motivoReprovCarreira') == null)) {
            throw 'Deve ser Informado um motivo para a rejeição!!!!'
        }


    }


}

function validaCp(inputName, mensagem, form) {
    if (form.getValue(inputName) == '' ||
        form.getValue(inputName) == null) {
        throw '<b>' + mensagem + '</b> nao pode ficar em branco!!!'
    }
}

function validaAprovacao(form) {

    validaCp('cpDecisao', 'Decisão', form)

    if (form.getValue('cpDecisao') == 'nao' &&
        (form.getValue('taMotivoGestor') == '' ||
            form.getValue('taMotivoGestor') == null)) {
        throw 'Deve ser Informado um motivo para a rejeição!!!!'
    }
}

function validaData(input, condicao, msg, form) {
    var data = form.getValue(input);
    data = new Date(data.split('-')[0], (data.split('-')[1] - 1), data.split('-')[2])
    var dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0)
    if (condicao == 1) {

        if (data > dataAtual) {
            {
                throw '<b>' + msg + '</b> não pode ser maior que a data atual'
            }
        }

    } else {

        if (data < dataAtual) {
            {
                throw '<b>' + msg + '</b> não pode ser menor que a data atual'
            }
        }

    }
}

function validaValor(form) {
    var valor = form.getValue('cpvlrUnitario')
    var max = form.getValue('cpValorMax')
    var min = form.getValue('cpValorMin')
    var msg = 'O valor Total da nota deve estar entre ' + min + ' e ' + max + ' !!! '
    valor = stringToFloat(valor)
    max = stringToFloat(max)
    min = stringToFloat(min)
    if (valor < min || valor > max) {
        throw msg
    }
}

function stringToFloat(string) {
    string = string.replace('.', ',')
    string = string.replace('.', ',')
    string = string.replace('.', ',')
    string = string.replace('.', ',')
    string = string.replace(',', '.')
    return parseFloat(string)
}