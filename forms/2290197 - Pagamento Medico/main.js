$(function () {

    validarCpom();
    new Auxiliar().startAprovBtn('btnAprov', 'btnReprov', 'cpDecisao')
    new Auxiliar().startAprovBtn('btnAprovSol', 'btnReprovSol', 'chamadoAprovado');
    new Auxiliar().startAprovBtn('btnAprovCarreira', 'btnReprovCarreira', 'cpDecisaoCarreira');
    startEvents();
    getParamsURL()
    $('#cpSerie').blur(function () {
        evtCpSerie(this)
    });

    $('#iniciarPesquisa').click(function () {
        window.open(
            "http://chatbot.121labs.io/pc_oncoclinicas", "_blank");
    });

    $('#cpAliqISS').change(function () {
        let valor = $(this).val()
        valor = valor.replace('.', '')
        if (valor.length > 4) {
            valor = valor.substring(0, 3);
        } else {
            while (valor.length < 4) {
                valor = '0' + valor;
            }
        }
        $(this).val(valor)
        MaskEvent.init()

    });

    if ($('#cpSimplesNacional').val() != 'Sim') {
        $('#cpAliqISS').val('00.00');
        $('#cpAliqISS').prop('readonly', true)
    } else {
        $('#cpAliqISS').val('');
        $('#cpAliqISS').prop('readonly', false)
    }
});

function somenteNumeros(num) {
    var er = /[^0-9]/;
    er.lastIndex = 0;
    var campo = num;
    if (er.test(campo.value)) {
        campo.value = "";
    }
}

function setSelectedZoomItem(selectedItem) {
    let indice = selectedItem.inputId.split('___')[1]
    let field = selectedItem.inputId.split('___')[0]
    let aux = new Auxiliar();

    if (field == 'zmFornecedor') {

        $('#cpCodFornecedor').val(selectedItem.CODIGO)
        $('#cpFornecedor, #descFornecedor').val(selectedItem.DESCRICAO)
        $('#cpCnpjFornecedor').val(aux.formatCgc(selectedItem.CGC))
        $('#cpEstadoFornecedor').val(selectedItem.ESTADO)
        $('#cpCidadeFornecedor').val(selectedItem.DESC_MUNICIPIO)
        $('#cpLojaFornecedor').val(selectedItem.LOJA);
        $('#cpSimplesNacional').val(selectedItem.SIMPLES_NACIONAL);
        $('#cpNumNota').blur();

    } else if (field == 'zmFilial') {

        $('#cpCodFilial,#codFilialP').val(selectedItem.CODIGO)
        $('#cpFilial, #descFilial').val(selectedItem.DESCRICAO)
        $('#cpCnpjFilial').val(aux.formatCgc(selectedItem.CGC))
        $('#cpLocalServico').val(selectedItem.DESCRICAO)
        let consultas = new Consultas();
        consultas.setConfig(selectedItem.CODIGO)
        //consulta e captura codigo
        let consultaHVS = new Consultas();
        consultaHVS.bloqueiaHVS(selectedItem.CODIGO);

        var filialRestrita = $('#cpCodFilial').val()
        restricaoFilialUnity(filialRestrita)

    } else if (field == 'zmEspecieNf') {

        $('#cpCodEspecieNf').val(selectedItem.CODIGO)

    } else if (field == 'zmCentroCusto') {

        $('#cpCodCentroCustos, #codCentroCusto').val(selectedItem.codCentroCusto)
        $('#descCentroCusto').val(selectedItem.descCentroCusto)

    } else if (field == 'zmProduto') {

        $('#cpCodProduto').val(selectedItem.CODIGO)
        $('#cpQuant').val(selectedItem.QUANTIDADE)

    }
}

function removedZoomItem(removedItem) {
    let indice = removedItem.inputId.split('___')[1]
    let field = removedItem.inputId.split('___')[0]

    if (field == 'zmFornecedor') {

        $('#cpCodFornecedor').val('')
        $('#cpFornecedor').val('')
        $('#cpCnpjFornecedor').val('')
        $('#cpCidadeFornecedor').val('')

    } else if (field == 'zmFilial') {

        $('#cpCodFilial').val('')
        $('#cpFilial').val('')
        $('#cpCnpjFilial').val('')
        $('#cpLocalServico').val('')

    } else if (field == 'zmEspecieNf') {

        $('#cpCodEspecieNf').val('')

    } else if (field == 'zmCentroCusto') {

        $('#cpCodCentroCustos').val()

    } else if (field == 'zmProduto') {

        $('#cpCodProduto').val('')
        $('#cpQuant').val('')
    }
}

function startEvents() {

    $('#cpNumNota').blur(function () {

        let nota = $(this).val()

        while (nota.length < 9) {
            nota = ('0' + nota);
        };

        $(this).val(nota);

        let codFornecedor = $('#cpCodFornecedor').val();

        if ($('#atvAtual').val() == '0' || $('#atvAtual').val() == '4') {
            let validacao = new Validacao().verificaNotaExistente(nota, codFornecedor)
            $(this).val(validacao.numNota)
            $('#cpnotaValida').val(validacao.notaValida)
            if (validacao.notaValida == false) {

                FLUIGC.message.alert({
                    message: validacao.msgErro,
                    title: `Atenção !!!`,
                    label: `OK`
                }, function (el, ev) {});

            }
        }
    })


    $('.valores').change(function () {
        let aux = new Auxiliar()
        let valorUnitario = aux.stringToFloat($('#cpvlrUnitario').val())
        let valorIpi = aux.stringToFloat($('#cpIpi').val())
        let valorDesconto = aux.stringToFloat($('#cpDesconto').val())
        let quantidade = parseFloat($('#cpQuant').val())
        let valorTotal = valorUnitario * quantidade + valorIpi - valorDesconto;

        console.log(quantidade)
        console.log(valorUnitario * quantidade)

        $('#cpVlrTotal').val(aux.floatToString(valorTotal))

    })
    $('#dtEmissao').blur(function () {
        validaData('dtEmissao', 1, 'Data Emissão')
    })

    $('#dtVencimento').blur(function () {
        validaData('dtVencimento', 2, 'Data Vencimento')
    })
}

function setInputs() {

    let consultas = new Consultas();
    let aux = new Auxiliar();
    let fornecedor = $('#_zmFornecedor').val().split(' - ')[0];
    fornecedor = consultas.getFornecedor(fornecedor)[0];
    fornecedor.inputId = 'zmFornecedor';
    setSelectedZoomItem(fornecedor);

    let filial = $('#_zmFilial').val().split(' - ')[0];
    filial = consultas.getFilial(filial)[0];
    filial.inputId = 'zmFilial';
    setSelectedZoomItem(filial);

    let centroCusto = $('#_zmCentroCusto').val().split(' - ')[0];
    centroCusto = consultas.getCentroCusto(centroCusto)[0];
    centroCusto.inputId = 'zmEspecieNf'
    setSelectedZoomItem(centroCusto)

    let margem = aux.stringToFloat($('#cpValorMax').val())
    let valor = aux.stringToFloat($('#cpvlrUnitario').val())
    $('#cpValorMax').val(aux.floatToString(valor + margem))
    $('#cpValorMin').val(aux.floatToString(valor - margem))
    $('#cpvlrUnitario').val('')
    $('#cpIpi').val('0')
    $('#cpDesconto').val('0')
    //$('#cpQuant').val('1')


    $('#cpCodEspecieNf').val('NF');
    $('#cpTipoLancamento').val('Débito');
    $('#cpTipoPagamento').val('Repasse Médico');
    //$('#cpProduto').val('SERVICO MEDICO TOMADO/ REPASSE MEDICO');
    //$('#cpCodProduto').val('000136');
    MaskEvent.init()
}

function validaData(inputData, condicao, msg) {
    var data = $('#' + inputData).val();
    data = new Date(data.split('-')[0], (data.split('-')[1] - 1), data.split('-')[2])
    var dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0)
    if (condicao == 1) {

        if (data > dataAtual) {
            {
                FLUIGC.message.alert({
                    message: '<b>' + msg + '</b> não pode ser maior que a data atual',
                    title: `Atenção !!!`,
                    label: `OK`
                }, function (el, ev) {});
            }
        }

    } else {

        if (data < dataAtual) {
            {
                FLUIGC.message.alert({
                    message: '<b>' + msg + '</b> não pode ser menor que a data atual',
                    title: `Atenção !!!`,
                    label: `OK`
                }, function (el, ev) {});
            }
        }

    }
}

// padroniza o numero da serie para o padrao do protheus
function evtCpSerie(that) {
    let valor = $(that).val();
    valor = new Auxiliar().normalizeString(valor)
    valor = valor.replace(/[R$.'",@#$%¨&*()+={}´`^~;.]/g, '');
    if (valor != '' &&
        valor != undefined &&
        valor != null &&
        valor.length < 3) {


        while (valor.length < 3) {
            valor = '0' + valor
        }
        $(that).val(valor)

    } else {

        valor = valor.substring(0, 3);
        $(that).val(valor)

    }

}

function validarCpom() {

    var municipioFornecedor = $('#municipioFornecedor').val();
    var codFilial = $('#cpCodFilial').val();

    if (municipioFornecedor != '' && codFilial != '') {


        var listconstraint = [];
        listconstraint.push(DatasetFactory.createConstraint("CodFilial", codFilial, codFilial, ConstraintType.MUST));
        var datasetPrincipal = DatasetFactory.getDataset("ds_filial_cpom", null, listconstraint, null);

        if (datasetPrincipal.values.length > 0) {
            var cidades = datasetPrincipal.values[0].codMunicipio;
            var filial = datasetPrincipal.values[0].codFilial;

            if (filial == codFilial && cidades != municipioFornecedor) {
                $('#mostraCpom').val('');
                $('#slCepom').val('')
                $('#slCepomShow').show()



            } else {
                $('#mostraCpom').val('nao');
                $('#slCepom').val('S')
                $('#slCepomShow').hide()

            }
        } else {
            $('#mostraCpom').val('nao');
            $('#slCepom').val('S')
            $('#slCepomShow').hide()

        }
    }
}

function restricaoFilialUnity(pegaCodFilial) {

    var c1 = DatasetFactory.createConstraint('CODFILIAL', pegaCodFilial, pegaCodFilial, ConstraintType.MUST);
    var datasetPrincipal = DatasetFactory.getDataset('ds_restricao_filiais', null, new Array(c1), null).values;

    var checkStatus = false

    for (var i = 0; i < datasetPrincipal.length; i++) {
        var codIDFilial = datasetPrincipal[i]["CODFILIAL"];
        if (pegaCodFilial == codIDFilial) {
            checkStatus = false
            break;
        }  else {
            checkStatus = true
        }
    }

    if (checkStatus == false) {


        FLUIGC.message.alert({
            message: 'Prezado (a) as operações de registro de documentos para pagamentos desta empresa ainda não estão sendo realizadas por este fluxo no CSO. Favor entrar em contato com o setor de fiscal para maiores informações.',
            title: 'Atenção !!!',
            label: 'OK'
        }, function (el, ev) {
            $("#zmFilial").val("").change();
            $("#cpCodFilial").val("").change();

            //window['zoomFilial'].clear();
            //$('#cpCodFilial').val("");
        })
    }

}