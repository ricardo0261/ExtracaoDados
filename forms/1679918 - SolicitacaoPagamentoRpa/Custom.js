$(function () {
    startAprovBtn('btnAprovGestor', 'btnReprovGestor', 'aprovGestor');
    startAprovBtn('btnAprovDp', 'btnReprovDp', 'aprovDp');
    startAprovBtn('btnAprovFiscal', 'btnReprovFiscal', 'aprovFiscal');
    startAprovBtn('btnAprovFinanceiro', 'btnReprovFinanceiro', 'aprovFinanceiro');
    startAprovBtn('btnAprovSolicitante', 'btnReprovSolicitante', 'aprovSolicitante')
    $("#codSolic").val(parent.WCMAPI.userCode);
    $("#emailSolic").val(parent.WCMAPI.userEmail);

    $("#cbRecolhimentoINSS").click(function (e) {
        if ($(this).prop('checked')) {
            FLUIGC.message.alert({
                message: 'Favor anexar, obrigatoriamente, o comprovante de recolhimento de INSS de outras fontes.',
                title: 'Aviso',
                label: 'OK'
            }, function (el, ev) {

            });
        }
    });

    $('#dataVencimento').change(function () {
        var data = $('#dataVencimento').val();
        var dia = data.split('/')[0];
        var mes = data.split('/')[1];
        var ano = data.split('/')[2];
        $('#vencimento').val(ano + '-' + mes + '-' + dia);
    });
    $("#valorEstimado").change(function () {
        calculaValorBruto()
    });
    $("input[name^=aprovF]").change(function () {
        configDestino();
    });
    $("#codFilial,#codCentroCustos,#valorEstimado").change(function () {
        setAprovadores();
    });
    $('input[name^=tipoSolicitacao]').change(function () {
        setTipoNota();
    });
    $('#numeroDoc').change(function () {
        validaNumeroDoc();
    })
    $('input[name^=aprovSolicitante]').change(function () {
        if ($('#aprovSolicitante').val() == 'sim') {
            //$('#iniciarPesquisa').show()
        } else {
            //$('#iniciarPesquisa').hide()
        }
    });
    //getParamsURL()
    //$('#iniciarPesquisa').hide()
    setTipoNota()
    configCalendarios();
    setProximoAprovador();
    configDestino();
    //initPesquisa();
});
// pega as  informações do fichario de configuração e seta nas devidas variaveis no html
function getConfiFichario() {
    var cst = DatasetFactory.createConstraint("metadata#active", "true", "true", ConstraintType.MUST);
    var ds_configRPA = DatasetFactory.getDataset("ds_configuracaoRPA", null, [cst], null).values;

    $('#aliquotaInss').val(ds_configRPA[0].cpAlicotaINSS + ' %')
    $('#cpTetoINSS').val(ds_configRPA[0].cptTetoINSS)

}
//configura quais campos estaram visiveis de  acordo com o tipo de solicitacao
function setTipoNota() {
    if ($('#_tipoSolicitacao:checked').val() == 'nf' || $('#tipoSolicitacao:checked').val() == 'nf') {
        $('.infoNF').show();
        $('.infoRpa').hide();
    } else if ($('#_tipoSolicitacao:checked').val() == 'rpa' || $('#tipoSolicitacao:checked').val() == 'rpa') {
        $('.infoRpa').show();
        $('.infoNF').hide()
    } else {
        $('.infoRpa').hide();
        $('.infoNF').hide()
    }
}
// aplica os valores selecionados nos campos hidden, e para os zooms serviço,
//  municipio e natureza, aplica filtro em seu zoom subseguente
function setSelectedZoomItem(selectedItem) {
    var type = selectedItem.inputId;
    if (type == "zoomFilial") {
        $("#codFilial").val(selectedItem.CODIGO).change()
        $("#nomeFilial").val(selectedItem.DESCRICAO).change()
        $("#cidadeFilial").val(selectedItem.CIDADE).change()
    } else if (type == "zoomCentroCusto") {
        $("#codCentroCustos").val(selectedItem.CODIGO).change()
        $("#centroCustos").val(selectedItem.DESCRICAO).change()

        let pegaCodFilial = $('#codFilial').val();
        let pegaCodCentroCusto = $("#codCentroCustos").val();
        // travar abertura de  outro centro de custo que nao esteja entre o cod 30000000 e 69999999 pela filial 05201
        if ((pegaCodFilial == "05201" && pegaCodCentroCusto < "30000000") ||  (pegaCodFilial == "05201" && pegaCodCentroCusto >"69999999")) {
            FLUIGC.message.alert({
                message: `Prezado (a), 
            O centro de custo selecionado não faz parte da estrutura de centros de custo do Instituto Oncoclínicas. 
            Ao selecionar esta unidade, por gentileza escolher um centro iniciado pelo número <strong>6</strong>. 
            Caso o lançamento seja referente a um projeto, favor selecionar o projeto em questão entre os centros de custo iniciados em <strong>3, 4 ou 5</strong>.
            Em caso de dúvidas, entre em contato com a Controladoria através do e-mail equipe.<strong>controladoria@oncoclinicas.com</strong>`,
                title: 'Atenção !!!',
                label: 'OK'
            }, function (el, ev) {
                window["zoomCentroCusto"].clear();
                $("#codCentroCustos").val("")
                
            })
        }
    } else if (type == "zoomFornecedor") {
        $("#codFornecedor").val(selectedItem.CODIGO).change()
        $("#fornecedor").val(selectedItem.DESCRICAO).change()
        $("#loja").val(selectedItem.LOJA).change()
        var cpf = selectedItem.CGC
        if (cpf.length <= 11) {
            cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4")
        } else {
            cpf = cpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5");
        }
        $("#cpf").val(cpf)
        $("#banco").val(selectedItem.BANCO)
        $("#agencia").val(selectedItem.AGENCIA)
        $("#agenciaDigito").val(selectedItem.DV_AGENCIA)
        $("#conta").val(selectedItem.CONTA)
        $("#contaDigito").val(selectedItem.DV_CONTA)
        $("#endereco").val("CEP: " + selectedItem.CEP + " - " + selectedItem.ENDERECO + " Bairro:  " + selectedItem.BAIRRO).change();
        $("#cidade").val(selectedItem.DESC_MUNICIPIO + " - " + selectedItem.ESTADO).change();
        $('#dependentes').val(selectedItem.NUM_DEPENDENTES);
    } else if (type == "zoomServico") {
        $("#codServico").val(selectedItem.CODSERVICO).change();
        $("#servico").val(selectedItem.SERVICO).change();
        $("#unidadeMedida").val(selectedItem.UNIDADE).change();
        $("#codCidade").val('').change();
        $("#municipio").val('').change();
        $("#codNatureza").val('').change();
        $("#natureza").val('').change();
        $('#porcentagemIss').val('0,00%');
        reloadZoomFilterValues('zoomMunicipio', "CODSERVICO," + selectedItem.CODSERVICO)
    } else if (type == "zoomMunicipio") {
        $("#codCidade").val(selectedItem.CODMUNICIPIO).change();
        $("#municipio").val(selectedItem.MUNICIPIO).change();
        $("#estado").val(selectedItem.ESTADO).change();
        $("#codNatureza").val(selectedItem.CODNATUREZA).change();
        $("#natureza").val(selectedItem.CODNATUREZA + ' - ' + selectedItem.NATUREZA).change();
        $('#porcentagemIss').val(selectedItem.ALIQUOTA);
        calculaValorBruto();
    } else if (type == "zoomTipoTitulo") {
        $("#codTipoTitulo").val(selectedItem.CODIGO).change();
        $("#tipoTitulo").val(selectedItem.DESCRICAO).change();
    } else if (type == "zoomEspecieNf") {
        $("#codEspecie").val(selectedItem.CODIGO).change();
        $("#especieNf").val(selectedItem.CODIGO + ' - ' + selectedItem.DESCRICAO).change();
    }
}

//configura os calendarios
function configCalendarios() {
    var dataVencimento = FLUIGC.calendar("#dataVencimento");
    dataVencimento.setMinDate(new Date());
    FLUIGC.calendar("#dataEmissao")
    FLUIGC.calendar("#dtNascimento")

}
// calcula o valor Bruto da solicitacao descontando o valor do Iss e do Inss
function calculaValorBruto() {
    var inss = calculaInss();
    var iss = calculaIss();
    let descontos = iss + inss;
    let valor = $("#valorEstimado").val().replace(/[R$.]/g, '');
    valor = valor.replace(',', '.');
    let valorBruto = (valor - descontos).toFixed(2);
    valorBruto = valorBruto.split('.');
    valorBruto[0] = valorBruto[0].split(/(?=(?:...)*$)/).join('.');
    valorBruto.join(',');
    $("#valorBruto").val(valorBruto);
    descontos = descontos.toFixed(2).split('.');
    descontos[0] = descontos[0].split(/(?=(?:...)*$)/).join('.');
    descontos.join(',');
    $('#descontos').val(descontos);
}

//realiza calculo do valor do Inss
function calculaInss() {
    let valor = $("#valorEstimado").val().replace(/[R$.]/g, '');
    valor = valor.replace(',', '.')
    let alicotaInss = $('#aliquotaInss').val().split(' ')[0];
    let tetoInss = $('#cpTetoINSS').val()
    var valorInss = (valor * alicotaInss) / 100;
    if (valorInss > parseFloat(tetoInss)) {
        valorInss = parseFloat(tetoInss);
    }
    valorInss = valorInss.toFixed(2);
    $("#inss,#_inss").val(valorInss.toString().replace(".", ","));
    return parseFloat(valorInss);
}
//realiza calculo do valor do ISS
function calculaIss() {
    var aliquota = convertStringToFloat("porcentagemIss");
    let valor = $("#valorEstimado").val().replace(/[R$.]/g, '');
    valor = valor.replace(',', '.')
    if (aliquota != NaN) {
        var valorIss = (valor * aliquota) / 100;
        valorIss = valorIss.toFixed(2)
        numero = valorIss.split('.');
        numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
        numero.join(',');
        $("#valorIss").val(numero);
    }
    return parseFloat(valorIss);
}
// converte sotring em float
function convertStringToFloat(id) {
    let valor = $("#" + id).val();
    if (valor == "") {
        return 0;
    }
    valor = valor.replace("%", "");
    valor = valor.replace(".", "");
    valor = valor.replace(",", ".");
    valor = parseFloat(valor);
    return valor;

}
//configura quando os campos de selecao de destino devem aparecer
function configDestino() {
    if ($("#aprovFiscal").val() == "sim" || $("#aprovFiscal").val() == '') {
        $("#destinoFiscal").hide();
    } else {
        $("#destinoFiscal").show();
    }
    if ($("#aprovFinanceiro").val() == "sim" || $("#aprovFinanceiro").val() == '') {
        $("#destinoFinanceiro").hide();
    } else {
        $("#destinoFinanceiro").show();
    }
}
//verficar se a filial, o centro de custos e o valorEstimado foi preenchido e define a alçada de aprovacao
function setAprovadores() {
    if ($("#codFilial").val() != "" && $("#codCentroCustos").val() != "" && $("#valorEstimado").val() != "") {
        definirAlcadaAprovacao();
    }
}
// define a alcada de aprovacao
function definirAlcadaAprovacao() {
    var c1 = DatasetFactory.createConstraint("filial", $("#codFilial").val(), $("#codFilial").val(), ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("centroCusto", $("#codCentroCustos").val(), $("#codCentroCustos").val(), ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("valor", $("#valorEstimado").val(), $("#valorEstimado").val(), ConstraintType.MUST);
    var constraints = new Array(c1, c2, c3);
    var ds_aprov = DatasetFactory.getDataset("ds_alcadaAprovacaoPagamentos", null, constraints, null);
    var gestores = [];
    for (var x = 0; x < ds_aprov.values.length; x++) {
        var aprovador = {
            id: ds_aprov.values[x].IDAPROVADOR,
            nome: ds_aprov.values[x].APROVADOR
        }
        gestores.push(aprovador)
    }
    if (ds_aprov.values.length >= 1) {
        $("#alcada").val(JSON.stringify(gestores));
        var indice = 0;
        $("#alcadaAtual").val(indice);
        $("#aprovacao").val(true);
        $("#proximoAprovador").val(gestores[indice].id)
        $('#GestorEncontrado').val(true);
    } else {
        $('#GestorEncontrado').val(false);
    }

}
// seta o proximo aprovador da solicitacao caso exista um.
function setProximoAprovador() {
    if (atividade != 74) {
        if ($("#aprovacao").val() == "true") {
            var indice = parseInt($("#alcadaAtual").val());
            var aprovadores = JSON.parse($("#alcada").val());
            if (indice < aprovadores.length) {
                $("#codGestor").val(aprovadores[indice].id);
                $("#aprovador").val(aprovadores[indice].nome);
                $("#aprovacao").val(true);
                indice++;
                if (indice < aprovadores.length) {
                    $("#proximoAprovador").val(aprovadores[indice].id)
                } else {
                    $("#aprovacao").val(false);
                }
            }
        }
    }

}
// Valida o numero do documento caso o mesmo contenha menos de 9 caracteres a funcao acrecenta os demais
function validaNumeroDoc() {
    var num = $('#numeroDoc').val();
    if (num.length < 9) {
        for (let i = num.length; i < 9; i++) {
            num = '0' + num;
        }
        $('#numeroDoc').val(num)
    }
}

function startAprovBtn(BtnAprov, BtnReprov, input) {
    if ($('#' + input).val() == 'sim') {
        $('.' + BtnAprov).show()
    } else if ($('#' + input).val() != '') {
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

function addZero(x, n) {
    if (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
};