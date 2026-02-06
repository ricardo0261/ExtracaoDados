class Consultas {

    setConfig(codFilial) {
        let constraint = new Array()
        constraint.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST));
        constraint.push(DatasetFactory.createConstraint('filial_protheus', codFilial, codFilial, ConstraintType.MUST))
        var ds_config = DatasetFactory.getDataset('cad_filiais', null, constraint, null).values;
        if (ds_config.length > 0 && ds_config[0].codGstFluig != null) {
            $('#cpAprovadorClinica').val(ds_config[0].codGstFluig)
            $('#codFilialF').val(ds_config[0].codigo)
        } else {
            FLUIGC.message.alert({
                message: `Não Existem gestores cadastrados para essa filial, favor procurar a equipe de melhorias continuas`,
                title: `Alerta`,
                label: `OK`
            }, function (el, ev) { });
            window['zmFilial'].clear()
            removedZoomItem({
                'inputId': 'zmFilial'
            })
        }
    }
// bloqueia codigo hospital vila da serra
    bloqueiaHVS(codFilialHvs){
        if (codFilialHvs=="06601") {
          FLUIGC.message.alert({
               message: `Prezado (a) as operações de registro de documentos para pagamentos do Hospital Vila da Serra - HVS que se enquadra neste fluxo ainda não estão sendo realizadas pelo CSO e sim internamente no Hospital, gentileza enviar sua demanda para o e-mail centraldenotas@oncoclinicas.com que direcionaremos sua demanda para o responsável do HVS. `,
               title: `Alerta`,
               label: `OK`
           }, function (el, ev) { });
            window['zmFilial'].clear();
              removedZoomItem({
               'inputId': 'zmFilial'
           })
        }
     
   }
    getFornecedor(codFornecedor) {
        let cons = []
        cons.push(DatasetFactory.createConstraint('CODIGO', codFornecedor, codFornecedor, ConstraintType.MUST))
        let fornecedor = DatasetFactory.getDataset('ds_fornecedor', null, cons, null).values;
        return fornecedor;
    }

    getFilial(codFilial) {
        let cons = []
        cons.push(DatasetFactory.createConstraint('CODIGO', codFilial, codFilial, ConstraintType.MUST))
        let filial = DatasetFactory.getDataset('ds_filial', null, cons, null).values;
        return filial

    }

    getCentroCusto(codCentroCusto) {
        let cons = []
        cons.push(DatasetFactory.createConstraint('CODIGO', codCentroCusto, codCentroCusto, ConstraintType.MUST))
        let centroCusto = DatasetFactory.getDataset('ds_centroCusto', null, cons, null).values;
        return centroCusto

    }

    getProduto(codProduto) {
        let cons = []
        cons.push(DatasetFactory.createConstraint('CODIGO', codProduto, codProduto, ConstraintType.MUST))
        let produto = DatasetFactory.getDataset('ds_produto', null, cons, null).values;
        return produto

    }
}

class Auxiliar {
    // converte uma string no formato DD/mm/AAAA para um objeto Date
    stringToDate(date) {
        if (date != '' || date != undefined) {
            if (date.indexOf('/') != -1) {
                var dia = date.split('/')[0];
                var mes = parseInt(date.split('/')[1]) - 1;
                var ano = date.split('/')[2]
                if (ano.length < 3) {
                    var ano = '20' + date.split('/')[2]
                } else {
                    var ano = date.split('/')[2]
                }
                var data = new Date(ano, mes, dia)
                return data
            } else {
                var dia = date.split('-')[0];
                var mes = parseInt(date.split('-')[1]) - 1;
                var ano = date.split('-')[2]
                if (ano.length < 3) {
                    var ano = '20' + date.split('-')[2]
                } else {
                    var ano = date.split('-')[2]
                }
                var data = new Date(ano, mes, dia)
                return data
            }
        }

    }
    // converte uma um obj Date para uma string no formato DD-mm-YYYY
    dateToString(date) {
        var ano = date.getFullYear();
        var mes = date.getMonth() + 1
        var dia = date.getDate();
        if (mes < 10) {
            mes = '0' + mes
        }
        if (dia < 10) {
            dia = '0' + dia
        }
        return ano + '-' + mes + '-' + dia;
    }
    // transforma um float em um string com mascara monetaria
    floatToString(numero) {
        if (numero != '0' && numero != '' && numero != undefined && numero != NaN) {
            numero = parseFloat(numero).toFixed(2)
            numero = numero.split('.');
            numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
            numero.join(',');
            return numero;
        } else {
            return '0,00'
        }
    }
    // transforma um valor com mascara em um float sem mascara
    stringToFloat(valor) {
        if (valor != 0 && valor != undefined && valor != null) {
            valor = valor.toString()
            if (valor.indexOf(',') != -1) {
                valor = valor.replace(/[R$.]/g, '');
                valor = valor.replace(',', '.');
                return parseFloat(valor);

            } else {
                valor = '00.' + valor
                valor = valor.replace(/[R$]/g, '');
                return parseFloat(valor);

            }
        }
        return 0;

    }
    // formata o cgc seja para o formato de cpf ou cpCnpj
    formatCgc(cgc) {
        if (cgc != null && cgc != undefined) {
            if (cgc.length <= 11) {
                cgc = cgc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4")
            } else {
                cgc = cgc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
            }
        }
        return cgc
    }
    // atribui aos botoes de aprovaçao seus eventos
    startAprovBtn(BtnAprov, BtnReprov, input) {
        $('.' + BtnAprov).hide()
        $('.' + BtnReprov).hide()

        if ($('#' + input).val() == 'sim') {

            $('.' + BtnAprov).show()

        } else if ($('#' + input).val() == 'nao') {

            $('.' + BtnReprov).show()

        }

        $('#' + BtnAprov).click(function () {

            $('#' + input).val('sim').change()
            $('.' + BtnAprov).show()
            $('.' + BtnReprov).hide()

        });
        $('#' + BtnReprov).click(function () {

            $('#' + input).val('nao').change()
            $('.' + BtnReprov).show()
            $('.' + BtnAprov).hide()

        });
    }
    // retorna a data atual no formato YYYY-mm-DD
    getCurrentDate() {

        var data = new Date();
        var dia = data.getDate();
        var mes = data.getMonth() + 1;
        var ano = data.getFullYear();
        if (dia < 10) {
            dia = "0" + dia
        }
        if (mes < 10) {

            mes = "0" + mes
        }

        return ano + '-' + mes + '-' + dia;

    }
    // remove todos os caracteres especias
    normalizeString(string) {
        string = string.toUpperCase()
        string = string.replace(/[ÁÀÂÃÄ]/g, "A")
        string = string.replace(/[ÉÈÊË]/g, "E")
        string = string.replace(/[ÍÌÎÏ]/g, "I")
        string = string.replace(/[ÓÒÔÕÖ]/g, "O")
        string = string.replace(/[Ç]/g, "C")
        return string
    }

    //recebe o numero e caso o mesmo contenha menos que a quantidade de digitos necessarios, adicina os 0 a esqueda
    addZero(numero, digitos) {
        numero = numero.replace(/[eE.,]/g, '')
        for (var i = numero.length; i < digitos; i++) {
            numero = "0" + numero
        }
        return numero
    }
}

class Validacao {
    verificaNotaExistente(numNota, codFornecedor) {
        let retorno = {
            'notaValida': true,
            'msgErro': '',
            'numNota': numNota,
            'codFornecedor': codFornecedor
        }
        if (numNota != '' && codFornecedor != '') {

            let aux = new Auxiliar()
            numNota = aux.addZero(numNota, 9)
            retorno.numNota = numNota
            // consula se existem outras solicitacoes abertas com as mesmas caracteristicas
            var cons = []
            cons.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST));
            cons.push(DatasetFactory.createConstraint('cpCodFornecedor', codFornecedor, codFornecedor, ConstraintType.MUST));
            cons.push(DatasetFactory.createConstraint('cpNumNota', numNota, numNota, ConstraintType.MUST));
            var solicitacoes = DatasetFactory.getDataset('ds_pagamentoMedico', null, cons, null).values;
            // verifica se as solicitaçoe com as mesmas caracteristicas estao ativas ou finalizadas
            if (solicitacoes.length > 0) {

                var filtroSolicitacoes = new Array()
                solicitacoes.forEach(element => {
                    filtroSolicitacoes.push(DatasetFactory.createConstraint('cardDocumentId', element.documentid, element.documentid, ConstraintType.SHOULD))
                });
                filtroSolicitacoes.push(DatasetFactory.createConstraint('active', 'true', 'true', ConstraintType.MUST));
                filtroSolicitacoes.push(DatasetFactory.createConstraint('processInstanceId', $('#codSolicitacao').val(), $('#codSolicitacao').val(), ConstraintType.MUST_NOT))

                var colunasWorkflowProcess = new Array('active', 'workflowProcessPK.processInstanceId');
                var datasetWorkflowProcess = DatasetFactory.getDataset('workflowProcess', colunasWorkflowProcess, filtroSolicitacoes, null).values;
                if (datasetWorkflowProcess.length > 0) {

                    retorno.notaValida = false;
                    retorno.msgErro = `Nota fiscal com as mesmas características já enviada pra pagamento através da Solicitacao` +
                        datasetWorkflowProcess[0]['workflowProcessPK.processInstanceId'] + `!!!`;
                    retorno.numNota = numNota;
                    return retorno

                }

            }
            if (retorno.notaValida == true) {

                var cst = [];
                cst.push(DatasetFactory.createConstraint("COD_FORNECEDOR", codFornecedor, codFornecedor, ConstraintType.MUST));
                cst.push(DatasetFactory.createConstraint("NUMERO", numNota, numNota, ConstraintType.MUST));
                var dataset = DatasetFactory.getDataset("ds_notasFiscaisEntrada", null, cst, null).values;

                if (dataset[0].NUMERO != '') {

                    retorno.notaValida = false
                    retorno.msgErro = `Nota fiscal com as mesmas características já inserida no Protheus!!!`
                    retorno.numNota = numNota;
                    return retorno

                }
            }
        }
        return retorno

    }
}