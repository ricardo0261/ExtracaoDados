var ZOOM_WIDTH = screen.width * 0.67;
var ZOOM_HEIGHT = screen.height * 0.67;
var LIST_CC;

function initLoadCSV() {
    //Carrega todos os centros de custo para uma variavel global
    LIST_CC = loadAllCentroCusto();
    //Exibe ou oculta o pai filho de rateio
    $("#existeRateio").change(function() {
        var isRateio = $('#existeRateio').is(':checked'); //$("#existeRateio:checked").val();
        if (isRateio != true) {
            $('.divImportBeneficio').hide();
            $('.divPaiFilhoBeneficio').hide();
            $("#existeRateio").val("")
        } else {
            $('.divImportBeneficio').show();
            $('.divPaiFilhoBeneficio').show();
            $("#existeRateio").val("true")
        }
    });

    //Garante que o totais do rateio não recebam valores
    //A opção disable do HTML, o fluig ignora e não mantem os dados e o readonly não funciona com o maskmoney
    $("#somatorioValorBeneficio, #totalPercentual").on('keyup', function() {
        var simbolo = $('#valorPgtoGuiaTaxaBoletos').val().replace(/[0-9.,]/g, '');
        $("#somatorioValorBeneficio").val(addMascaraMonetaria(somaValoreseMovimento(), simbolo));
        $("#totalPercentual").val(addMascaraPorcentagem(somaPercentualDistribuicao()));
    });

    //Configuarção import csv
    FLUIGC.utilities.parseInputFile("#btnImportCsv");
    $("#btnImportCsv").change(function(event) {
        //Esvazia a tabela beneficios ao alterar o arquivo enviado.
        $('#tbBeneficios tbody tr').not(':first').each(function(count, tr) {
            removeRowBeneficio($(this).find('i')[0]);
        });
        readCSV(event.target.files[0]);
    });
    //Adiciona o botão de adicionar no pai filho beneficios
    var btnAddPaiFilho = '<span  class="fluigicon fluigicon-plus-sign fluigicon-md btn-add-beneficios" id="btn-add-beneficios"></span>'
    $("[name=tbBeneficios] thead td:first").append(btnAddPaiFilho);
    $("#btn-add-beneficios").click(function() {
        addRowBeneficio('', '', '', '');
    });

    //Adiciona Máscaras
    var simbolo = $('#valorPgtoGuiaTaxaBoletos').val().replace(/[0-9.,]/g, '');
    $("[name^=valorBeneficio]").not(':first').each(function() {
        $(this).val(addMascaraMonetaria(removeMascaraMonetaria($(this).val()), simbolo));
    })
    $("#somatorioValorBeneficio").val(addMascaraMonetaria(somaValoreseMovimento(), simbolo));
    $("#totalPercentual").val(addMascaraPorcentagem(somaPercentualDistribuicao()));
}

/**
 * Faz a leitura do arquivo csv.
 * @return Retorna um objeto contendo a lista de Centro 
 * de custo e uma lista com seus respectivos valores
 */
function readCSV(csvfile) {
    var reader = new FileReader();
    reader.readAsText(csvfile);
    reader.onload = function(event) {
        var csv = event.target.result;
        var separator = { "separator": ";" };
        var data = $.csv.toArrays(csv, separator);
        for (var row in data) {
            var ccCSV = data[row][0];
            var valorCSV = data[row][1]
                //Valida o centro de custo do csv com os cc do Protheus
            for (var j = 0; j < LIST_CC.length; j++) {
                var ccProtheusAtual = LIST_CC[j].CTT_CUSTO.trim();
                var nomeCC = LIST_CC[j].CTT_DESC01.trim();
                if (ccCSV == ccProtheusAtual) {
                    addRowBeneficio(ccProtheusAtual, ccProtheusAtual+' - '+nomeCC, valorCSV, '');
                    break;
                } else if (j + 1 == LIST_CC.length) {
                    var labelCodigoInvalido = 'CÓDIGO INVALIDO';
                    addRowBeneficio('', ccProtheusAtual + ' <- ' + labelCodigoInvalido, valorCSV, '');
                }
            }
        }
    }
};

/**
 * Carrega todos os Centros de Custos ativos no Protheus
 * @returns
 */
function loadAllCentroCusto() {
    var prepareConsultaProtheus = new objDataSet("consultaDadosProtheus");
    prepareConsultaProtheus.setCampo("CTT"); //Informa o nome da tabela
    prepareConsultaProtheus.setCampo("CTT_BLOQ = '2'");
    prepareConsultaProtheus.setCampo("CTT_CUSTO,CTT_DESC01") //Informa as colunas 
    prepareConsultaProtheus.filtrarBusca();
    var result = prepareConsultaProtheus.getDados();
    return result.values;
}
/**
 * Adiciona uma linha ao pai filho de beneficios
 */
function addRowBeneficio(codigo, nome, valor, percentual) {
    if (CURRENT_STATE == PRIMEIRA_ATIVIDADE || CURRENT_STATE == CORRIGIR_SOLICITACAO || CURRENT_STATE == ATIVIDADE_ZERO) {
        var indice = wdkAddChild('tbBeneficios');
        var simbolo = $('#valorPgtoGuiaTaxaBoletos').val().replace(/[0-9.,]/g, '');
        $('#valorPgtoGuiaTaxaBoletos').val("");
        configRowBeneficio(indice, valor);
        $("#centroCustoBeneficio___" + indice).val(nome).change();
        $("#codCentroCustoBeneficio___" + indice).val(codigo).change();
        $("#valorBeneficio___" + indice).val(addMascaraMonetaria(valor, simbolo));
        //Adiciona classe de erro em caso de centro de custo invalido
        if (nome.indexOf('INVALIDO') != -1) {
            $("#codCentroCustoBeneficio___" + indice).parent().addClass("has-error");
        }
        //Atualiza o valor total
        $("#somatorioValorBeneficio").val(addMascaraMonetaria(somaValoreseMovimento(), simbolo));
        $("#totalPercentual").val(addMascaraPorcentagem(somaPercentualDistribuicao()));
    }
    $('#indiceRateio').val($('#tbBeneficios tbody tr').not(':first').length);
}
/**
 * Configurações obrigatórias para as linhas do pai filho de beneficios
 * @param indice da linha que foi adicionada
 */
function configRowBeneficio(indice, valor) {
    //Adiciona mascara nos campos
    $("#valorBeneficio___" + indice).maskMoney('destroy');
    if ($('#sMoeda').val() == '1' || $('#sMoeda').val() == '4' || $('#sMoeda').val() == '') {
        $("#valorBeneficio___" + indice + ",#somatorioValorBeneficio").maskMoney({
            prefix: 'R$ ',
            allowNegative: true,
            thousands: '.',
            decimal: ',',
            affixesStay: true
        });
    } else if ($('#sMoeda').val() == '2') {
        $("#valorBeneficio___" + indice + ",#somatorioValorBeneficio").maskMoney({
            prefix: 'US$ ',
            allowNegative: true,
            thousands: '.',
            decimal: ',',
            affixesStay: true
        });
    } else if ($('#sMoeda').val() == '3') {
        $("#valorBeneficio___" + indice + ",#somatorioValorBeneficio").maskMoney({
            suffix: '€ ',
            allowNegative: true,
            thousands: '.',
            decimal: ',',
            affixesStay: true
        });
    } else if ($('#sMoeda').val() == '5') {
        $("#valorBeneficio___" + indice + ",#somatorioValorBeneficio").maskMoney({
            prefix: '¥ ',
            allowNegative: true,
            thousands: '.',
            decimal: ',',
            affixesStay: true
        });
    }
    //$('#percentualBeneficio___'+indice).maskMoney({suffix:'%', thousands:'', decimal:'.', affixesStay: true, allowZero : true});
    //Adiciona os eventos dos campos
    $("#CENTRO_CUSTO_BENEFICIO___" + indice).on("click", function() {
        openZoom(
            "ds_centroCusto",
            "CODIGO,Codigo,DESCRICAO,Centro de Custo",
            "CODIGO,DESCRICAO",
            "&filterValues=",
            "centroDeCustoBeneficio___" + indice);
    });
    $("#codCentroCustoBeneficio___" + indice).change(function() {
        //verifica a dublicidade de centro de custo
        var codigo = $(this).val();
        if (codigo != '' && codigo != undefined) {
            var codRepeat = true;
            //Verifica se o centro de custo já foi adicionado
            $("[name^=codCentroCustoBeneficio]").each(function() {
                if ($(this).val() == codigo) {
                    if (codRepeat) {
                        codRepeat = false;
                    } else {
                        $('#tbBeneficios tbody tr').not(':first').each(function(count, tr) {
                            var indiceAtual = $(this).find("input[id^='codCentroCustoBeneficio']")[0].id.split('___')[1];
                            var codAtual = $('#codCentroCustoBeneficio___' + indiceAtual).val();
                            if (codAtual == codigo) {
                                //Soma os valores de Centro de Custo repetidos.
                                var simbolo = $('#valorBeneficio___' + indiceAtual).val().replace(/[0-9.,]/g, '');
                                var valAtual = removeMascaraMonetaria($('#valorBeneficio___' + indiceAtual).val());
                                $('#valorBeneficio___' + indiceAtual).val(addMascaraMonetaria((valAtual + parseFloat(valor)).toFixed(2), simbolo));
                            }
                        });
                        removeRowBeneficio($("#codCentroCustoBeneficio___" + indice).get(0));
                    }
                }
            });
        }
    });
    //*****Evento CHANGE dos valores de movimento
    $("#valorBeneficio___" + indice).change(function() {
        //Atualiza o somatorio dos valores do movimento
        var simbolo = $('#valorPgtoGuiaTaxaBoletos').val().replace(/[0-9.,]/g, '');
        $("#somatorioValorBeneficio").val(addMascaraMonetaria(somaValoreseMovimento(), simbolo));
        $("#totalPercentual").val(addMascaraPorcentagem(somaPercentualDistribuicao()));
        //Calcula e seta o percentual da linha
        var valorTotal = removeMascaraMonetaria($('#valorPgtoGuiaTaxaBoletos').val());
        var valorAtual = removeMascaraMonetaria($(this).val());
        var percentual = ((valorAtual / valorTotal) * 100);
        percentual = percentual.toFixed(2);
        percentual = parseFloat(percentual);
        $('#percentualBeneficio___' + indice).val(addMascaraPorcentagem(percentual));
    });

    //*****Evento CHANGE dos percentuais 
    $("#percentualBeneficio___" + indice).change(function() {

        var valorTotal = removeMascaraMonetaria($('#valorPgtoGuiaTaxaBoletos').val());
        var percentualAtual = removeMascaraMonetaria($(this).val());
        var valor = ((percentualAtual * valorTotal) / 100);
        var simbolo = $('#valorPgtoGuiaTaxaBoletos').val().replace(/[0-9.,]/g, '');
        valor = valor.toFixed(2);
        $('#valorBeneficio___' + indice).val(addMascaraMonetaria(valor, simbolo));
        $("#somatorioValorBeneficio").val(addMascaraMonetaria(somaValoreseMovimento(), simbolo));
        $("#totalPercentual").val(addMascaraPorcentagem(somaPercentualDistribuicao()));
    });
}

function removeRowBeneficio(row) {
    if (CURRENT_STATE == PRIMEIRA_ATIVIDADE || CURRENT_STATE == CORRIGIR_SOLICITACAO || CURRENT_STATE == ATIVIDADE_ZERO) {
        fnWdkRemoveChild(row);
        $('#valorPgtoGuiaTaxaBoletos').val("");
        var simbolo = $('#valorPgtoGuiaTaxaBoletos').val().replace(/[0-9.,]/g, '');
        $("#somatorioValorBeneficio").val(addMascaraMonetaria(somaValoreseMovimento(), simbolo));
        $("#totalPercentual").val(addMascaraPorcentagem(somaPercentualDistribuicao()));
    }
    $('#indiceRateio').val($('#tbBeneficios tbody tr').not(':first').length);
}

function somaValoreseMovimento() {
    var total = 0.00;
    $("[name^=valorBeneficio]").each(function() {
        total += removeMascaraMonetaria($(this).val());
    });
    total = total.toFixed(2);
    return parseFloat(total);
}

function somaPercentualDistribuicao() {
    var valorTotalGuia = removeMascaraMonetaria($('#valorPgtoGuiaTaxaBoletos').val());
    var valorTotalMovimento = removeMascaraMonetaria($('#somatorioValorBeneficio').val());
    var percentualTotal = 0.00;
    if (valorTotalGuia != 0) {
        percentualTotal = ((valorTotalMovimento / valorTotalGuia) * 100);
        percentualTotal = percentualTotal.toFixed(2);
    }
    return parseFloat(percentualTotal);
}