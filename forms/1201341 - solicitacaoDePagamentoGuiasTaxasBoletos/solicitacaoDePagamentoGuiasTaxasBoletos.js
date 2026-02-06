var PRIMEIRA_ATIVIDADE = 8;
var CORRIGIR_SOLICITACAO = 12;
var ATIVIDADE_ZERO = 0;
var ATRIBUIR_RESPONSAVEL = 43;
var ERRO_INTEGRACAO = 95;
var APROVA_GESTOR = 9;
var VALIDACAO_TESOURARIA = 76;
var VALIDACAO_FINANCEIRA = 105;
var VALIDAR_PAGAMENTO = 13;
var APROVACAO_SOLICITANTE = 15;
var INCONSISTENCIA_SOLICITANTE = 16;
var APROVACAO_FISCAL_IMPOSTO = 133;
var APROVACAO_FISCAL_IMPOSTO_PROTHEUS = 142;
var TIPO_SOLICITACAO;


$(function () {
    var str = $("#numeroDocumento").val();
    var res = str.substr(0, 3);
    $("#prefixoWebS").val(res);

    var str1 = $("#numeroDocumento").val();
    var res1 = str1.substr(3, 9);
    $("#numeroWebS").val(res1);

    var str2 = $("#numeroDocumento").val();
    var res2 = str2.substr(12, 14);
    $("#parcelaWS").val(res2);

    $('.itemContabil').hide();
    if (CURRENT_STATE != ATIVIDADE_ZERO) {
        $('.containerFile').hide();
    }

    if ($("#zoomNumTitulo").val() != "") {
        $("#integraProtheus").val("true")
    } else {
        $("#integraProtheus").val("false")
    }
    
    
    
    $('#tipoProdutoDP').change(function () {		
		 
		 if($('#tipoProdutoDP').val() == "1"){
			 $('#fechamento').removeAttr('readonly');	
			 $('#fechamento').prop('disabled',false);
		 }else{			 
			 $('#fechamento').prop('disabled',true);
			 $('#fechamento').attr('readonly','readonly');
			 $('#fechamento').val('');
			 $('#tbImpostos tbody tr').not(':first').remove();			 
		 }						
	 });
    
    $('#fechamento').change(function () {		
		 
		 $('#tbImpostos tbody tr').not(':first').remove();
		 arrayComDados($('#fechamento').val());
						
	 });

    //Exibe ou oculta o pai filho de rateio
    $("#pagamentoVencido").change(function () {
        var isVencido = $("#pagamentoVencido:checked").val();
        if (isVencido != 'true') {
            $("#vlMulta").val("");
            $("#vlJuros").val("");
            $('#divMulta').hide();
            $('#divJuros').hide();
        } else {
            $('#divMulta').show();
            $('#divJuros').show();
        }
    });

    if ($("#tipoLancamento").val() == "") {
        var parametros = getParametrosURL();
        TIPO_SOLICITACAO = parametros.tipo;
        $("#tipoLancamento").val(TIPO_SOLICITACAO);
    } else {
        TIPO_SOLICITACAO = $("#tipoLancamento").val();
    }


    if (TIPO_SOLICITACAO != "faciliteis") {
        $('#numeroTitulo').attr('readonly', true);
    }
    
    if ($("#tipoLancamento").val() == "estrangeiro") {
    	$('.taxa').show();
    }
    

    /*if (TIPO_SOLICITACAO == "dp" || TIPO_SOLICITACAO == "impostos") {
        $("#divMulta").css('display', 'block');
        $("#divJuros").css('display', 'block');
    }*/

    if ($("#proximoAprovador").val() == "" && ($("#nivelAtualAprovacao").val() == "0" || $("#nivelAtualAprovacao").val() == "")) {
        buscaGestor();
    }

    /*$("#valorPgtoGuiaTaxaBoletos").click(function () {
        if ($("#existeRateio").is(":checked")) {
            $("#valorPgtoGuiaTaxaBoletos").val($("#somatorioValorBeneficio").val());
            //setChangeMoeda();
        }
    });*/

    $("#valorPgtoGuiaTaxaBoletos").change(function () {
        converteValorPagto();
        buscaGestor();
        if ($("#dtDeVencPgtoGuiaTaxaBoletos").val() != '') {
            defineAprovador();
        }
    });

    $("#dtDeVencPgtoGuiaTaxaBoletos").change(function () {
        validaDataVencimento();
        if ($("#valorPgtoGuiaTaxaBoletos").val() != '') {
            defineAprovador();
        }
    });

    if (CURRENT_STATE == ATRIBUIR_RESPONSAVEL || CURRENT_STATE == 43 || CURRENT_STATE == '43') {
        getNatureza();
    }
    if (CURRENT_STATE == APROVA_GESTOR) {
        getNatureza();
        // if ($('#motValidacaoFiscal').val() != ""){
        //         $('.validacaoFiscal').show();  
        //     } else{
        //         $('.validacaoFiscal').hide(); 
        //     }

        //     if ($('#motAprovacaoTesoura').val() != ""){
        //         $('.aprovacaoTesoura').show();  
        //     } else{
        //         $('.aprovacaoTesoura').hide(); 
        //     }

        if ($('#motivoFiscalImpostoProtheus').val() != "") {
            $('.AprovacaoFiscalImpostoProtheus').show();
        } else {
            $('.AprovacaoFiscalImpostoProtheus').hide();
        }

        if ($('#decisaoFiscalImposto').val() == "Sim" || $('#decisaoFiscalImposto').val() == "Nao") {
            $('.AprovacaoFiscalImposto').show();
        } else {
            $('.AprovacaoFiscalImposto').hide();
        }

    }

    if (CURRENT_STATE == APROVA_GESTOR && $("#proximoAprovador").val() == "") {
        verificaPolitica($("#nivelAtualAprovacao").val());
    }

    if ((CURRENT_STATE == ATIVIDADE_ZERO || CURRENT_STATE == PRIMEIRA_ATIVIDADE || CURRENT_STATE == CORRIGIR_SOLICITACAO) && MODO_EDICAO != "VIEW") {
        validaAbertura();
        $("#numeroTitulo").val("");
        showMessage('Atenção!', 'Caso a solicitação tenha excedido o prazo ou esteja na data de vencimento, o pagamento será realizado em 1 dia útil após a aprovação do gestor. </br>Caso a aprovação seja realizada dentro do prazo, segue o mesmo dia do pagamento acordado.', null);
        initLoadCSV();
    }

    if (CURRENT_STATE == ATIVIDADE_ZERO ||
        CURRENT_STATE == CORRIGIR_SOLICITACAO ||
        CURRENT_STATE == PRIMEIRA_ATIVIDADE ||
        CURRENT_STATE == APROVACAO_FISCAL_IMPOSTO ||
        CURRENT_STATE == ERRO_INTEGRACAO ||
        CURRENT_STATE == APROVACAO_FISCAL_IMPOSTO_PROTHEUS ||
        CURRENT_STATE == APROVA_GESTOR ||
        CURRENT_STATE == ATRIBUIR_RESPONSAVEL ||
        CURRENT_STATE == ATRIBUIR_RESPONSAVEL ||
        CURRENT_STATE == APROVACAO_FISCAL_IMPOSTO ||
        CURRENT_STATE == APROVACAO_FISCAL_IMPOSTO_PROTHEUS ||
        CURRENT_STATE == INCONSISTENCIA_SOLICITANTE ||
        CURRENT_STATE == VALIDAR_PAGAMENTO ||
        CURRENT_STATE == VALIDACAO_TESOURARIA ||
        CURRENT_STATE == VALIDACAO_FINANCEIRA ||
        CURRENT_STATE == APROVACAO_SOLICITANTE


    ) {
        var natureza = $('#zoomNatureza').val();

        if (natureza == '41111030' || natureza == '41111027' || natureza == '41111028' || natureza == '41111029') {
            $('.centroCustoImpostoExterior').show();
        } else {
            $('.centroCustoImpostoExterior').hide();
        }
    }


    if (CURRENT_STATE == ATIVIDADE_ZERO || CURRENT_STATE == PRIMEIRA_ATIVIDADE) {

        if ($('#motivoFiscalImposto').val() != "") {
            $('.AprovacaoFiscalImposto').show();
        } else {
            $('.AprovacaoFiscalImposto').hide();
        }


        // if (hAPI.getCardValue('motValidacaoFiscal') != ""){
        //     hAPI.setCardValue('validacaoFiscal').show();  
        // } else{
        //     hAPI.setCardValue('validacaoFiscal').hide(); 
        // }

        // if (hAPI.getCardValue('motAprovacaoTesoura') != ""){
        //     hAPI.setCardValue('aprovacaoTesoura').show();   
        // } else{
        //     hAPI.setCardValue('aprovacaoTesoura').hide(); 
        // }

        // if (hAPI.getCardValue('motAprovacaoFinanc') != ""){
        //     hAPI.setCardValue('aprovacaoFinanc').show();  
        // } else{
        //     hAPI.setCardValue('aprovacaoFinanc').hide();  
        // }

        // if (hAPI.getCardValue('motivoAprovFiscal') != ""){
        //     hAPI.setCardValue('aprovacaoFiscal').show();  
        // } else{
        //     hAPI.setCardValue('aprovacaoFiscal').hide(); 
        // }
    }

    if (CURRENT_STATE == APROVA_GESTOR || CURRENT_STATE == CORRIGIR_SOLICITACAO || CURRENT_STATE == VALIDACAO_TESOURARIA || CURRENT_STATE == VALIDACAO_FINANCEIRA || CURRENT_STATE == VALIDAR_PAGAMENTO || CURRENT_STATE == ERRO_INTEGRACAO || CURRENT_STATE == APROVACAO_SOLICITANTE || CURRENT_STATE == INCONSISTENCIA_SOLICITANTE || CURRENT_STATE == APROVACAO_FISCAL_IMPOSTO) {
        $("#caixaValidaImposto").show();
        if ($("#integraSolicitacao").val() == "false") {
            $('#divMulta').show();
            $('#divJuros').show();
            $('.numeroTitulo').hide();
            $('.buscaNumeroTitulo').show();
        } else {
            $('.numeroTitulo').show();
            $('.buscaNumeroTitulo').hide();
            $('#divMulta').hide();
            $('#divJuros').hide();
        }

        if (CURRENT_STATE == APROVACAO_FISCAL_IMPOSTO_PROTHEUS) {
            $('.AprovacaoFiscalImpostoProtheus').show();
        }
    }
    // $('#CTT_CUSTO_ZOOM').onblur(function () {
    // })

    alimentaFilial();
    alimentarUnidadeProtheus();
    limpaCampoChangeFilial();
    preenchendoOCampoEmergencialHidden();
    preenchendoOCampoPerdCompHidden();
    preencheIdentificadorCustomizado();
    concatenandoCentroDeCustoComDes();
    concatenandoCentroDeCustoExterior();
    recuperarValorAprovadorFiscal();
    bindChangeAceiteSolucao();
    ocultarMsgNovaSc();
    adicionaMascaras();
    escondeCalendario();
    setZooms();
    exibeCamposTipoLancamento();
    //initLoadCSV();
    addEvents();
    bloqueiaZoomsPorAtividade();
    setChangeMoeda();
    //pegaDataVencimento();
    //pegaDataAprovPrevista(); // Pega data prevista de pagamento para o solicitante
    //Inicia pesquisa de satisfação
    //initPesquisa();
    $('#iniciarPesquisa').click(function () {
        window.open(
            "http://chatbot.121labs.io/pc_oncoclinicas", "_blank");
    });
    getParamsURL();



    if ($("#viaWebService").val() == "true") {
        if ($("#origem").val() == "") {
            $("#cdSolicitante").val("Pool:Group:FIN_GUIANDO");
        } else {
            $("#cdSolicitante").val("Pool:Group:Fiscal/Tributário");
        }
    };

    $('#indiceRateio').val($('#tbBeneficios tbody tr').not(':first').length);

    habilitaCodigoBarra();
    validaRateio();

    if(MODO_EDICAO == "VIEW"){

        $('.centroCustoImpostoExterior').show();

       }
});
/* 
function removeMascaraMonetaria(mask) {
    if (mask != undefined && mask != null && mask != '') {
        mask = mask.replace(/[^0-9,.]/g, '');
        mask = mask.replace(' ', '');
        mask = mask = mask.replace(/[\.]/g, '');
        mask = mask.replace(',', '.');
        return parseFloat(mask);
    } else {
        return 0.00;
    }
} */

function converteValorPagto() {
    var pagto = $('#valorPgtoGuiaTaxaBoletos').val();
    $('#valorPagtoNum').val(removeMascaraMonetaria(pagto));
}

function calculaTaxa(){
	
	var moeda = $("#sMoeda").val();
	var taxa = $('#taxaMoeda').val();
	var valor = removeMascaraMonetaria($('#valorPgtoGuiaTaxaBoletos').val());
	var total = 0;
	
	if (moeda != '1'){	
		total = taxa * valor;		
		$('#valorConvertido').val(convertReal(total));	
	}else{		
		total = valor / taxa ;
		$('#valorConvertido').val(convertReal_(total));
	}
	
}

function defineAprovador() {

    var cons = []
    cons.push(DatasetFactory.createConstraint('sqlLimit', '100', '100', ConstraintType.MUST));
    cons.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST));
    var datasetDs_aprovValidacaoFinanceira = DatasetFactory.getDataset('ds_aprovValidacaoFinanceira', null, cons, null);
    try {
        if (parseFloat($('#valorPagtoNum').val()) >= parseFloat(datasetDs_aprovValidacaoFinanceira.values[0].valorNum)) {
            $("input[name='idAprovadorValFinanceiro']").val(datasetDs_aprovValidacaoFinanceira.values[0].idAprovador);
        } else {
            $("input[name='idAprovadorValFinanceiro']").val('');
        }
    } catch (err) {
        $("input[name='idAprovadorValFinanceiro']").val('');
    }
};

function habilitaCodigoBarra() {
    if (CURRENT_STATE == ATIVIDADE_ZERO ||
        CURRENT_STATE == CORRIGIR_SOLICITACAO ||
        CURRENT_STATE == PRIMEIRA_ATIVIDADE ||
        CURRENT_STATE == APROVACAO_FISCAL_IMPOSTO ||
        CURRENT_STATE == ERRO_INTEGRACAO ||
        CURRENT_STATE == APROVACAO_FISCAL_IMPOSTO_PROTHEUS
    ) {

        $("#codigoBarra").removeAttr("readonly");
        $("#codigoBarra").attr("maxlength", 48);
        $('#codigoBarra').mask('999999999999999999999999999999999999999999999999');
        $('#codigoBarra').blur(function () {
            if ($(this).val().length == 0 || $(this).val().length == parseInt($(this).attr("maxlength"))) {
                $('.labelCodigoBarra').hide();
            } else {
                $('.labelCodigoBarra').show();
            }
        });
    }
}

function setChangeMoeda() {
    $('#sMoeda').change(function () {
        if ($(this).val() == '1' || $(this).val() == '4' || $(this).val() == '') {
            var simbolo = 'R$ ';
        } else if ($(this).val() == '2') {
            var simbolo = 'US$ ';
        } else if ($(this).val() == '3') {
            var simbolo = '€ ';
        } else if ($(this).val() == '5') {
            var simbolo = '¥ ';
        }
        $('#valorPgtoGuiaTaxaBoletos,#vlrOutEntidades,#somatorioValorBeneficio,#vlMulta,#vlJuros,#vlFolha,#vlTotal').maskMoney('destroy');
        $('#valorPgtoGuiaTaxaBoletos,#vlrOutEntidades,#somatorioValorBeneficio,#vlMulta,#vlJuros,#vlFolha,#vlTotal').maskMoney({
            prefix: simbolo,
            thousands: '.',
            decimal: ',',
            affixesStay: true,
            allowZero: true
        });
        $('.valorBeneficio').each(function (index) {
            var linha = index + 1;
            $('#valorBeneficio___' + linha).maskMoney('destroy');
            $('#valorBeneficio___' + linha).maskMoney({
                prefix: simbolo,
                allowNegative: true,
                thousands: '.',
                decimal: ',',
                affixesStay: true
            });
            $('#valorBeneficio___' + linha).val(addMascaraMonetaria(removeMascaraMonetaria($('#valorBeneficio___' + linha).val()), simbolo));
        })
        $('#vlrOutEntidades').val(addMascaraMonetaria(removeMascaraMonetaria($('#vlrOutEntidades').val()), simbolo));
        $('#valorPgtoGuiaTaxaBoletos').val(addMascaraMonetaria(removeMascaraMonetaria($('#valorPgtoGuiaTaxaBoletos').val()), simbolo));
        $('#somatorioValorBeneficio').val(addMascaraMonetaria(removeMascaraMonetaria($('#valorPgtoGuiaTaxaBoletos').val()), simbolo));

        $('#vlMulta').val(addMascaraMonetaria(removeMascaraMonetaria($('#vlMulta').val()), simbolo));
        $('#vlJuros').val(addMascaraMonetaria(removeMascaraMonetaria($('#vlJuros').val()), simbolo));
        $('#vlTotal').val(addMascaraMonetaria(removeMascaraMonetaria($('#vlTotal').val()), simbolo));
    });
}

function bloqueiaZoomsPorAtividade() {
    //Bloqueia as zooms 
    if (CURRENT_STATE == 9 || CURRENT_STATE == 95 || CURRENT_STATE == 76 || CURRENT_STATE == 105 || CURRENT_STATE == 13 || CURRENT_STATE == 15 || CURRENT_STATE == 16) {
        $('#btZoomFilial').addClass('disabled');
        $('#btZoomFilial').unbind();
        $('#CTT_CUSTO_ZOOM').addClass('disabled');
        $('#CTT_CUSTO_ZOOM').unbind();
        $('#btnZoomTipolancamento').addClass('disabled');
        $('#btnZoomTipolancamento').unbind();
        $('#btnZoomItemContabil').addClass('disabled');
        $('#btnZoomItemContabil').unbind();
        $('#btnZoomNumTitulo').addClass('disabled');
        $('#btnZoomNumTitulo').unbind();
        $('#FORNECEDOR_ZOOM').addClass('disabled');
        $('#FORNECEDOR_ZOOM').unbind();
    }
}

function adicionaMascaras() {
    adicionaMascaraCpfCnpj('cnpjFornecedor');
    adicionaMascaraCpfCnpj('cgcTributo');
    adicionaDatePicker('dataemissaoPgtoGuiaTaxaBoletos');
    adicionaDatePicker('dtDeVencPgtoGuiaTaxaBoletos');
    adicionaDatePicker('dtDePgtoGuiaTaxaBoletos');
    adicionaDatePicker('dataApuracao');
    adicionaDatePicker('aprovDataPrevista');
    if ($('#sMoeda').val() == '1' || $('#sMoeda').val() == '4' || $('#sMoeda').val() == '') {
        var simbolo = 'R$ ';
    } else if ($('#sMoeda').val() == '2') {
        var simbolo = 'US$ ';
    } else if ($('#sMoeda').val() == '3') {
        var simbolo = '€ ';
    } else if ($('#sMoeda').val() == '5') {
        var simbolo = '¥ ';
    }
    adicionaMascaraMonetaria('valorPgtoGuiaTaxaBoletos', simbolo);
    adicionaMascaraMonetaria('vlrOutEntidades', simbolo);

    adicionaMascaraMonetaria('vlMulta', simbolo);
    adicionaMascaraMonetaria('vlJuros', simbolo);

    adicionaMascaraMonetaria('vlAutonomo', simbolo);
    adicionaMascaraMonetaria('vlFolha', simbolo);
}

function recuperarValorAprovadorFiscal() {
    $("[name=decisaoFiscal]").change(function () {
        var valorSelecionado = $(this).val();
        $("[name=aprovacaoFiscal_Hidden]").val(valorSelecionado);
    });
}

function preenchendoOCampoEmergencialHidden() {
    $("#pagamentoEmergencial").click(function () {
        if ($(this).prop("checked")) {
            var valorCampoEmergencial = $("#pagamentoEmergencial").val();
            $("#pagamentoEmergencialHidden").val(valorCampoEmergencial);
        } else {
            $("#pagamentoEmergencialHidden").val("");
        }
    });
}

function preenchendoOCampoPerdCompHidden() {
    $("#pagPerdComp").click(function () {
        if ($(this).prop("checked")) {
            // var valorPerdComp = $("#pagPerdComp").val();
            var valorPerdComptrue = "true"
            //var valorPerdCompFalse= "false"
            $("#perdCompHidden").val(valorPerdComptrue);
        } else {
            $("#perdCompHidden").val("");
        }
    });
}

function concatenarIdentificadorCustomizado() {
    var campoPagamentoEmergencialIdentificador = "";
    var campoPagamentoEmergencial = $("#pagamentoEmergencialHidden").val();
    if (campoPagamentoEmergencial == "") {
        campoPagamentoEmergencialIdentificador = "N";
    } else {
        campoPagamentoEmergencialIdentificador = "E";
    }

    var unidade = $("#hiddenFilial").val();
    var data = $("#hiddenDataVencimento").val();
    var variavelConcatenada = campoPagamentoEmergencialIdentificador + " - " +
        unidade + " | " + data;
}

function preencheIdentificadorCustomizado() {
    $(".motivo").blur(function () {
        var dataVencimentoRepasse = '';
        dataVencimentoRepasse = $("#dataVencimentoPagtoAntecipado").val();

        $("#hiddenDataVencimento").val(dataVencimentoRepasse);
        concatenarIdentificadorCustomizado();
    });
}

function concatenandoCentroDeCustoComDes() {
    $("#CTT_DESC01").change(
        function () {
            setTimeout(function () {
                var codigoCentroDeCustos = $("#codigoCentroCustos").val();
                var descricaoCentroDeCustos = $("#CTT_DESC01").val();
                var resultado = codigoCentroDeCustos + ' - ' +
                    descricaoCentroDeCustos;
                $(".campoConcatenado").val(resultado);
            }, 300);
        });
}

function concatenandoCentroDeCustoExterior() {
    $("#CTT_DESC01EXTERIOR").change(
        function () {
            setTimeout(function () {
                var codigoCentroDeCustos = $("#codigoCentroCustosExterior").val();
                var descricaoCentroDeCustos = $("#CTT_DESC01EXTERIOR").val();
                var resultado = codigoCentroDeCustos + ' - ' +
                    descricaoCentroDeCustos;
                $(".campoConcatenadoExterior").val(resultado);
            }, 300);
        });
}

function alimentaFilial() {
    $("#codigo").change(function () {
        var filialId = $("[name=codigo]").val();
        var filialDataSet = new objDataSet("filiais");
        filialDataSet.setCampo("filial");
        filialDataSet.setFiltro("codigo", filialId, filialId, true);
        filialDataSet.filtrarBusca();
        var dadosFilialProtheus = filialDataSet.getDados();
        var unidade = dadosFilialProtheus.values[0].filial;
        $("[name=hiddenFilial]").val(unidade);
        $("#analyticsNmFilial").val(unidade);
    });
}

function alimentarUnidadeProtheus() {
    $("#codigo").change(function () {
        var filialId = $("[name=codigo]").val();
        var filialDataSet = new objDataSet("filiais");
        filialDataSet.setCampo("filial_protheus");
        filialDataSet.setFiltro("codigo", filialId, filialId, true);
        filialDataSet.filtrarBusca();
        var dadosFilialProtheus = filialDataSet.getDados();
        var filialProtheusId = dadosFilialProtheus.values[0].filial_protheus;
        $("[name=filial_protheus]").val(filialProtheusId);
        $("[name=codigo_filial]").val(filialId);
    });
}

function limpaCampoChangeFilial() {
    $("[name=codigo]").change(function () {
        $("[name=CTT_DESC01]").val("");
        $("[name=CTT_CUSTO]").val("");
        $("[name=campoConcatenado]").val("");
    });
}

function bindChangeAceiteSolucao() {
    $("input[name='aceite']").change(function () {
        if ($(this).val() == "N") {
            $(".reqCompSolicitente").show();
            $(".oculto").hide();
            $("#divBtnPesquisa").hide();
        } else {
            $(".reqCompSolicitente").hide();
            $(".oculto").show();
            $("#divBtnPesquisa").show();
        }
    });
}

function ocultarMsgNovaSc() {
    var x = $("#aceiteSim:checked").val();
    if (x == "S") {
        $(".oculto").show();
    }
}

// Função responsavel pela máscara de CPF/CNPJ
function adicionaMascaraCpfCnpj(campo) {
    $('#' + campo).on('change keypress', function (e) {
        if ($('#' + campo).val().trim().replace(/[^0-9]/g, "").length > 11) {
            $('#' + campo).mask('00.000.000/0000-00');
        } else {
            $('#' + campo).mask('000.000.000-000');
        }
        $('#' + campo).trigger("input");
    });
}

// Função responsavel pela máscara monetaria
function adicionaMascaraMonetaria(campo, simbolo) {
    $('#' + campo).maskMoney('destroy');
    $('#' + campo).maskMoney({
        prefix: simbolo,
        thousands: '.',
        decimal: ',',
        affixesStay: true,
        allowZero: true
    });
}

// Função para adicionar o seletor de data à um campo
function adicionaDatePicker(campo) {
    $('#' + campo).datepicker({
        dateFormat: 'dd/mm/yy',
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta',
            'Sexta', 'Sábado', 'Domingo'
        ],
        dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex',
            'Sáb', 'Dom'
        ],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril',
            'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro',
            'Outubro', 'Novembro', 'Dezembro'
        ],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ]
    });
}

function escondeCalendario() {
    if (MODO_EDICAO == "VIEW") {
        $('.ui-datepicker').hide();
    }
}

function setZooms() {
    $("#btnZoomNatureza").on(
        "click",
        function () {
            openZoom("ds_Natureza",
                "CODIGO,Código,DESCRICAO,Natureza",
                "CODIGO,DESCRICAO",
                "&filterValues=",
                "natureza");
        });
    $("#btZoomFilial").on(
        "click",
        function () {
            openZoom("filiais",
                "codigo,Codigo,filial_protheus,Codigo Protheus,filial,Filial,cnpj_filial,CNPJ",
                "codigo,filial_protheus,filial,cnpj_filial", "&filterValues=",
                "filiais");
        });
    $("#CTT_CUSTO_ZOOM").on(
        "click",
        function () {
            openZoom("ds_centroCusto",
                "CODIGO, Codigo, DESCRICAO, Descrição",
                "CODIGO, DESCRICAO",
                "&filterValues=",
                "centroDeCusto");
        });


    $("#CTT_CUSTO_ZOOM_EXTERIOR").on(
        "click",
        function () {
            openZoom("ds_centroCusto",
                "CODIGO, Codigo, DESCRICAO, Descrição",
                "CODIGO, DESCRICAO",
                "&filterValues=",
                "centroDeCusto2");
        });
    $("#btnZoomTipo").on(
        "click",
        function () {
            openZoom("ds_tipoTitulo",
                "CODIGO,Código,DESCRICAO,Tipo de Titulo",
                "CODIGO,DESCRICAO",
                "&filterValues=",
                "tipoDeTitulo");
        });
    $("#btnZoomCodRetencao").on(
        "click",
        function () {
            openZoom("ds_codigoRetencao",
                "CODIGO,Código,DESCRICAO,Descrição",
                "CODIGO,DESCRICAO",
                "&filterValues=",
                "codRetencao");
        });
    // $("#FORNECEDOR_ZOOM").on(
    //     "click",
    //     function () {
    //         openZoom("ds_fornecedor",
    //             "CODIGO,Codigo,DESCRICAO,Fornecedor,CGC,CPF/CNPJ,LOJA,Loja,NATUREZA,Natureza",
    //             "CODIGO,DESCRICAO,CGC,LOJA,NATUREZA",
    //             "&filterValues=",
    //             "fornecedor");
    //     });
    $("#btnZoomItemContabil").on(
        "click",
        function () {
            openZoom("ds_itemContabil",
                "CODIGO,Codigo,DESCRICAO,Descrição,FILTRO,Filtro",
                "CODIGO,DESCRICAO,FILTRO",
                "&filterValues=",
                "itemContabil");
        });
    $("#btnZoomTipolancamento").on(
        "click",
        function () {
            openZoom(verificaLancamento(TIPO_SOLICITACAO),
                "tipoLancamento,Tipo de Lançamento,codRetencao,Código de Retenção,fornecedor,Fornecedor,cnpjFornecedor,CGC,tipoTitulo,Tipo de Titulo" +
                ",tipoTributo,Tipo de Tributo,natureza,Natureza,codTributoGPS, Cod Tributo GPS",
                "tipoLancamento,codRetencao,fornecedor,tipoTitulo,tipoTributo,natureza,fornecedor,lojaFornecedor,cnpjFornecedor,codTributoGPS,codFornecedor,codTipo,tblFilho", "&filterValues=",
                "tipoLancamento");
        });
}

function getNatureza() {

    var codNatureza = $('#codNatureza').val();

    if (codNatureza == '41111006' || codNatureza == '41111007' || codNatureza == '41111008' || codNatureza == '41111010' || codNatureza == '41111016' || codNatureza == '41111017' || codNatureza == '41111040' || codNatureza == '41111041' || codNatureza == '41111014' || codNatureza == '41111037' || codNatureza == '41111013' || codNatureza == '41111036' || codNatureza == '41111028' || codNatureza == '41111027' || codNatureza == '41111030' || codNatureza == '41202035' || codNatureza == '41111029' || codNatureza == '41111011' || codNatureza == '41111012' || codNatureza == '41111009') {
        $('#responsavelTi').val('imposto1')
    }


    // if($('#solicitante').val() == 'integrador.fluig@oncoclinicas.com'){

    //     var natureza = $('#zoomNatureza').val();
    //     natureza = natureza.split('-')[0].trim() + '-' + natureza.split('-')[1].trim();
    //     var codNatureza = natureza.substr(0, 8);

    //     $('#zoomNatureza').val(codNatureza);


    //     if(codNatureza == '41111006' || codNatureza == '41111007' || codNatureza == '41111008' || codNatureza == '41111010' || codNatureza == '41111016' || codNatureza == '41111017' || codNatureza == '41111040' || codNatureza == '41111041' || codNatureza == '41111014' || codNatureza == '41111037' || codNatureza == '41111013' || codNatureza == '41111036' || codNatureza == '41111028' || codNatureza == '41111027' || codNatureza == '41111030' || codNatureza == '41202035' || codNatureza == '41111029' || codNatureza == '41111011' || codNatureza == '41111012' || codNatureza == '41111009') {
    //         $('#responsavelTiZoom').val('imposto1')
    //     } 
    // } else{
    //     var codNatureza = $('#codNatureza').val();

    //     if(codNatureza == '41111006' || codNatureza == '41111007' || codNatureza == '41111008' || codNatureza == '41111010' || codNatureza == '41111016' || codNatureza == '41111017' || codNatureza == '41111040' || codNatureza == '41111041' || codNatureza == '41111014' || codNatureza == '41111037' || codNatureza == '41111013' || codNatureza == '41111036' || codNatureza == '41111028' || codNatureza == '41111027' || codNatureza == '41111030' || codNatureza == '41202035' || codNatureza == '41111029' || codNatureza == '41111011' || codNatureza == '41111012' || codNatureza == '41111009') {
    //          $('#responsavelTi').val('imposto1')
    //      } 
    // }


}

function getNaturezaImpostoImportacao() {
    var natureza = $('#zoomNatureza').val();

    if (natureza == '41111030' || natureza == '41111027' || natureza == '41111028' || natureza == '41111029') {
        $('.centroCustoImpostoExterior').show();
    } else {
        $('.centroCustoImpostoExterior').hide();
    }

}

function openZoom(datasetId, datafields, resultFields, constraints, type) {
    window.open("/webdesk/zoom.jsp?datasetId=" + datasetId +
        "&dataFields=" + datafields +
        "&resultFields=" + resultFields +
        "&filterValues=" + constraints +
        "&type=" + type, "zoom", "status, scrollbars=no, top=100, left=100, width=900, height=600");
};

function setSelectedZoomItem(item) {

    console.log(item);

    if (item.type == "fornecedor") {
        $("#lojaFornecedor").val(item.LOJA);
        $("#A2_COD").val(item.CODIGO);
        $("#A2_COD").trigger("change");
        $("#FORNECEDOR_BANCO_DESC").val(item.DESCRICAO);
        $("#cnpjFornecedor").val(item.CGC);
        $("#forNatureza").val(item.NATUREZA);
        $("#cnpjFornecedor").trigger("change");
        /*if(TIPO_SOLICITACAO == "diversos" || TIPO_SOLICITACAO == "faciliteis"){
            verificaNatureza();
        }*/
   /* 
    }else if (item.inputId.split('___')[0] == 'forn') {   	
        	var index = item.inputId.split('___')[1];    	
        	$('#cnpjForn___'+index).val(item.CGC); 
        	$('#codigoForn___'+index).val(item.CODIGO);  
        	$('#lojaForn___'+index).val(item.LOJA);   
    */    	
    
    } else if (item.type == "filiais") {
        $("#codigo").val(item.CODIGO);
        $("#codigo").val(item.codigo);
        $("#codigo").trigger("change");
        $("#filial").val(item.filial);
        $("#cgcFilial").val(item.cnpj_filial);
        $("#cnpjContribuinte").val(item.cnpj_filial);

        $("#codFilialProtheus").val(item.filial_protheus);

        var filialRestrita = $('#codFilialProtheus').val()
        restricaoFilialUnity(filialRestrita)
        

        if ($("#zoomTipolancamento").val() == "FGTS" || $("#zoomTipolancamento").val() == "GPS" || $("#zoomTipolancamento").val() == "DARF") {
            $("#cgcTributo").val(item.cnpj_filial);
        }

        buscaGestor();

        if ($('#codigo').val() == "111") {
            FLUIGC.message.alert({
                message: `Prezado (a) as operações de registro de documentos para pagamentos do Hospital Vila da Serra - HVS que se enquadra neste fluxo ainda não estão sendo realizadas pelo CSO e sim internamente no Hospital, gentileza enviar sua demanda para o e-mail centraldenotas@oncoclinicas.com que direcionaremos sua demanda para o responsável do HVS. `,
                title: `Alerta`,
                label: `OK`
            }, function (el, ev) {});
            $("#filial").val("")
            $("#cgcFilial").val("")
        }

    } else if (item.type == "itemContabil") {
        $("#zoomItemContabil").val(item.DESCRICAO);
        $("#codItemContabil").val(item.CODIGO);



    } else if (item.type == "zoomNumTitulo") {
        $("#zoomNumTitulo").val(item.NUMERO);
        $("#prefixoIntegra").val(item.PREFIXO);
        $("#filialIntegra").val(item.FILIAL);
        $("#parcelaIntegra").val(item.PARCELA);
        $("#tipoIntegra").val(item.TIPO);
        $("#fornecedorIntegra").val(item.COD_FORNECEDOR);


    } else if (item.type == "centroDeCusto") {
        // $("#CTT_DESC01").val(item.CTT_DESC01);
        $("#CTT_DESC01").val(item.DESCRICAO);
        $("#CTT_DESC01").trigger("change");
        $("#codigoCentroCustos").val(item.CODIGO);

        let pegaCodFilial = $('#filial_protheus').val();
        let pegaCodCentroCusto = $("#codigoCentroCustos").val();
        // travar abertura de  outro centro de custo que nao esteja entre o cod 30000000 e 69999999 pela filial 05201
        if ((pegaCodFilial == "05201" && pegaCodCentroCusto < "30000000") || (pegaCodFilial == "05201" && pegaCodCentroCusto > "69999999")) {
            FLUIGC.message.alert({
                message: `Prezado (a), 
            O centro de custo selecionado não faz parte da estrutura de centros de custo do Instituto Oncoclínicas. 
            Ao selecionar esta unidade, por gentileza escolher um centro iniciado pelo número <strong>6</strong>. 
            Caso o lançamento seja referente a um projeto, favor selecionar o projeto em questão entre os centros de custo iniciados em <strong>3, 4 ou 5</strong>.
            Em caso de dúvidas, entre em contato com a Controladoria através do e-mail equipe.<strong>controladoria@oncoclinicas.com</strong>`,
                title: 'Atenção !!!',
                label: 'OK'
            }, function (el, ev) {

                $("#campoConcatenado").val("")
                // window["centroDeCusto"].clear();
                $("#codigoCentroCustos").val("")
                // $("#cpCnpjFilial").val("")
                //  window['zmCentroCustos___' + index].clear();
                // $('#cpCodCentroCustos___' + index).val('')
            })
        }

        buscaGestor();
        VerificaCentroCusto()

    } else if (item.type == "centroDeCusto2") {
        $("#CTT_DESC01EXTERIOR").val(item.DESCRICAO);
        $("#CTT_DESC01EXTERIOR").trigger("change");
        $("#codigoCentroCustosExterior").val(item.CODIGO);



    } else if (item.type == "tipoLancamento") {

        $("#zoomTipolancamento").val(item.tipoLancamento);
        $("#tblFilho").val(item.tblFilho);
        $("#zoomTipolancamento").trigger("change");
        $("#codTipolancamento").val(item.codTipo);
        $("#zoomCodRetencao").val(item.codRetencao);
        $("#zoomTipo").val(item.tipoTitulo);
        $("#tipoTributo").val(item.tipoTributo)
        var natureza = item.natureza.split('-')[0].trim() + '-' + item.natureza.split('-')[1].trim();
        var codNatureza = natureza.substr(0, 8);
        $("#zoomNatureza").val(codNatureza);
        $("#A2_COD").val(item.codFornecedor);
        $("#FORNECEDOR_BANCO_DESC").val(item.fornecedor);
        $("#lojaFornecedor").val(item.lojaFornecedor);
        $("#cnpjFornecedor").val(item.cnpjFornecedor);
        $("#cnpjFornecedor").trigger("change");
        $("#codTributoGPS").val(item.codTributoGPS);
        // var codNatureza = natureza.substr(0, 8);
        $("#codNatureza").val(codNatureza);
        getNatureza();
        getNaturezaImpostoImportacao();
        //Oculta a opção de Rateio para lançamentos de GPS
        if (item.tipoLancamento == "GPS") {
            $('.checkboxRateio').hide();
        } else {
            $('.checkboxRateio').show();
        }

        if ($("#cnpjFornecedor").val() == "") {
            $('#FORNECEDOR_ZOOM').removeClass('disabled');
            //$("#FORNECEDOR_ZOOM ").css("pointer-events", "auto");
            $("#FORNECEDOR_ZOOM").on(
                "click",
                function () {
                    openZoom("ds_fornecedor",
                        "CODIGO,Codigo,DESCRICAO,Fornecedor,CGC,CPF/CNPJ,LOJA,Loja,NATUREZA,Natureza",
                        "CODIGO,DESCRICAO,CGC,LOJA,NATUREZA",
                        "&filterValues=",
                        "fornecedor");
                });
        } else {
            //$('#FORNECEDOR_ZOOM').disabled = true;
            $('#FORNECEDOR_ZOOM').addClass('disabled');
            $('#FORNECEDOR_ZOOM').unbind();
            //$('#FORNECEDOR_ZOOM').css("pointer-events", "none");
        }


        if (item.tipoTitulo.trim() == "RECIBO" || item.tblFilho == 'tblINTER') {
            // $('#FORNECEDOR_ZOOM').removeClass('disabled');
            // $("#FORNECEDOR_ZOOM").on(
            //     "click",
            //     function () {
            //         openZoom("ds_fornecedor",
            //             "CODIGO,Codigo,DESCRICAO,Fornecedor,CGC,CPF/CNPJ,LOJA,Loja,NATUREZA,Natureza",
            //             "CODIGO,DESCRICAO,CGC,LOJA,NATUREZA",
            //             "&filterValues=",
            //             "fornecedor");
            //     });
        }
        /*else {
            $('#FORNECEDOR_ZOOM').addClass('disabled');
            $('#FORNECEDOR_ZOOM').unbind();
        }*/
        if (item.tblFilho == 'tblINTER') {
            $('#divMoeda').removeClass('hidden');
            $('#compraExterior').val('sim');
        } else {
            $('#divMoeda').addClass('hidden');
            $('#compraExterior').val('');
        }

        if (item.tipoLancamento.trim() == "DARF") {
            $("#cbGeraDirf").val("S");
        } else {
            $("#cbGeraDirf").val("");
        }

        console.log("Muda valor de integração!!!");
        $('#integraSolicitacao').val("true");
        verificaRetencao();
        buscaGestor();

        if (item.tipoLancamento.trim() == "FGTS" || item.tipoLancamento.trim() == "GPS" || item.tipoLancamento.trim() == "DARF") {
            $("#cgcTributo").val($("#cgcFilial").val());
        } else {
            $("#cgcTributo").val("");
        }
        exibeCampoItemContabil()
        // var webService = hAPI.getCardValue("viaWebService");
        // if(webService == "true"){
        //     $('#divMulta').show();
        //     $('#divJuros').show();
        // } else {
        //     $('#divMulta').hide();
        //     $('#divJuros').hide();
        // }
        var integra = $("#integraSolicitacao").val();
        if (integra == "false") {
            $('#divMulta').show();
            $('#divJuros').show();
            $('.numeroTitulo').hide();
            $('.buscaNumeroTitulo').show();
        } else {
            $('.numeroTitulo').show();
            $('.buscaNumeroTitulo').hide();
            $('#divMulta').hide();
            $('#divJuros').hide();
        }

    } else if (item.type.indexOf("centroDeCustoBeneficio") != -1) {
        var indice = item.type.slice(item.type.indexOf('___'), item.type.length);
        $("#centroCustoBeneficio" + indice).val(item.CODIGO + " - " + item.DESCRICAO);
        $("#centroCustoBeneficio" + indice).trigger("change");
        var codRepeat = true;
        //Verifica se o centro de custo já foi adicionado
        $("[name^=codCentroCustoBeneficio]").each(function () {
            if ($(this).val() == item.CODIGO) {
                if (codRepeat) {
                    codRepeat = false;
                } else {
                    showMessage('Atenção', 'O Centro de Custo ' + item.CODIGO + ' - ' + item.DESCRICAO + ', Já esta incluido na tabela.');
                    removeRowBeneficio($("#codCentroCustoBeneficio___" + indice).get(0));
                }
            } else {
                $("#codCentroCustoBeneficio" + indice).val(item.CODIGO).change();
                $("#codCentroCustoBeneficio" + indice).parent().removeClass('has-error');
            }
        });
        VerificaCentroCusto();
    }
    validaCodSolicitacao();
}

function restricaoFilialUnity(pegaCodFiliall) {

    var c1 = DatasetFactory.createConstraint('CODFILIAL', pegaCodFiliall, pegaCodFiliall, ConstraintType.MUST);
    var datasetPrincipal = DatasetFactory.getDataset('ds_restricao_filiais', null, new Array(c1), null).values;

    var checkStatus = false

    for (var i = 0; i < datasetPrincipal.length; i++) {
        var codIDFilial = datasetPrincipal[i]["CODFILIAL"];
        if (pegaCodFiliall == codIDFilial) {
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
            
        })
    }

}


function exibeCamposTipoLancamento() {
    exibeCamposZoomTipoLancamento();

    $('#zoomTipolancamento').change(function () {
        exibeCamposZoomTipoLancamento();
    });
}

function exibeCampoItemContabil() {
    var codNatureza = $('#codNatureza').val();
    var codTipoLancamento = $('#codTipolancamento').val();
    if (codNatureza == "41202010" && codTipoLancamento == "JUR") {
        $('.itemContabil').show();
    } else {
        $('.itemContabil').hide();
    }

}

function exibeCamposZoomTipoLancamento() {
    var tipoLancamento = $('#zoomTipolancamento').val();

    if (tipoLancamento == 'GPS') {

        $('.codTributoGPS').show();
        $('.cgcTributo').show();
        $('.vlrOutEntidades').show();
        $('.zoomCodRetencao').hide();
        $('.dataApuracao').show();
        $('.cbGeraDirf').hide();
        $('.tipoTributo').hide();
        $('.vlAutonomo').hide();
        $('.itemContabil').hide();

    } else if (tipoLancamento == 'FGTS') {

        $('.codTributoGPS').hide();
        $('.cgcTributo').show();
        $('.vlrOutEntidades').hide();
        $('.zoomCodRetencao').hide();
        $('.dataApuracao').show();
        $('.cbGeraDirf').hide();
        $('.tipoTributo').show();
        $('.vlAutonomo').hide();
        $('.itemContabil').hide();

    } else if (tipoLancamento == 'DARF') {

        $('.codTributoGPS').hide();
        $('.cgcTributo').show();
        $('.vlrOutEntidades').hide();
        $('.zoomCodRetencao').show();
        $('.dataApuracao').show();
        $('.cbGeraDirf').show();
        $('.tipoTributo').hide();
        $('.vlAutonomo').hide();
        $('.itemContabil').hide();

    } else if (tipoLancamento == 'IPTU') {

        $('.codTributoGPS').hide();
        $('.cgcTributo').show();
        $('.vlrOutEntidades').hide();
        $('.zoomCodRetencao').hide();
        $('.dataApuracao').hide();
        $('.cbGeraDirf').hide();
        $('.tipoTributo').show();
        $('.vlAutonomo').hide();
        $('.itemContabil').hide();

    } else if (tipoLancamento.indexOf("DARF - INSS") != -1 /*&& TIPO_SOLICITACAO == 'dp'*/ ) {
        $('.codTributoGPS').hide();
        $('.cgcTributo').hide();
        $('.vlrOutEntidades').hide();
        $('.zoomCodRetencao').hide();
        $('.dataApuracao').hide();
        $('.cbGeraDirf').hide();
        $('.tipoTributo').hide();
        $('.vlAutonomo').show();
        $('.itemContabil').hide();
        //$('#divMulta').hide();
        //$('#divJuros').hide();
        $('#valorPgtoGuiaTaxaBoletos').attr('readonly', true);

    } else if (tipoLancamento == 'Juros e empréstimo') {
        $('.itemContabil').show();


    } else {
        $('.codTributoGPS').hide();
        $('.cgcTributo').hide();
        $('.vlrOutEntidades').hide();
        $('.zoomCodRetencao').hide();
        $('.dataApuracao').hide();
        $('.cbGeraDirf').hide();
        $('.tipoTributo').hide();
        $('.vlAutonomo').hide();
    }

    if (tipoLancamento.indexOf("DARF - INSS") != -1 && TIPO_SOLICITACAO == 'dp') {
        //$('#divMulta').show();
        //$('#divJuros').show();
        $('#valorPgtoGuiaTaxaBoletos').attr('readonly', false);

    }

    /*if (tipoLancamento == 'DARF - INSS' && TIPO_SOLICITACAO == 'impostos') {
        $('#integraSolicitacao').val("false");
    } else {
        $('#integraSolicitacao').val("true");
    }*/
}

/**
 * Verifica se o codigo retenção informado deve gerar título no protheus. 
 * Os Codigos de Retenção listados a baixo não geram títulos no protheus.
 * @returns {Boolean} True caso deva ser incluido o título e false caso não deva.
 */
function verificaRetencao() {
    var codRetencao = $('#zoomCodRetencao').val();
    var codTributoGps = $('#codTributoGPS').val();
    var codNatureza = $('#zoomNatureza').val().split('-')[0].trim();
    var tipoLancamento = $('#zoomTipolancamento').val();
    if (codRetencao != "" && codRetencao != null && codRetencao != undefined && codNatureza != '41111012' && codNatureza != '41111011') {
        if (tipoLancamento.indexOf("DARF - INSS") != -1 && TIPO_SOLICITACAO == 'impostos') {
            $('#integraSolicitacao').val("false");
        }
        if (codRetencao == 'N/A' && codTributoGps == "2631") {
            $('#integraSolicitacao').val("false");
        }
        codRetencao = codRetencao.split("-")[0].trim();
        if (codRetencao == "1708" ||
            codRetencao == "2631" ||
            codRetencao == "3208" ||
            codRetencao == "3280" ||
            codRetencao == "5952" ||
            codRetencao == "5979" ||
            codRetencao == "5987") {
            $('#integraSolicitacao').val("false");
        }
    } else {
        $('#integraSolicitacao').val("false");
    }
}

function addEvents() {
    //Evento de mudança no valor total
    $("#valorPgtoGuiaTaxaBoletos").change(function () {
        $("[name^=valorBeneficio]").each(function () {
            $(this).change();
        })
    });
    //

    $('#A2_COD').change(function () {
        var codFornecedor = $(this).val();
        if (fornecedorVinculadoPC(codFornecedor)) {
            showMessage('Atenção!', 'Esse fornecedor está vinculado a um pedido de compra', null);
            $("#fornecedorVinculado").val('true');
        }
    });

    //Verifica se a data de apuração é de um mes igual ou anterior ao atual.
    $('#dataApuracao').change(function () {
        var data = new Date();
        var mesAtual = data.getMonth() + 1;
        var anoAtual = data.getFullYear();
        var mesApuracao = $(this).val().split('/')[1];
        var anoApuracao = $(this).val().split('/')[2];
        if (anoApuracao >= anoAtual && mesApuracao > mesAtual) {
            $('#dataApuracao').val('');
            showMessage('Validação de Data', 'Atenção! O campo Data de Apuração deve ser preenchido com uma data do mês atual ou anterior')
        }
    });
}

/**
 * Verifica se para o fornecedor já existe em pedidos de compras anteriores
 * @param idFornecedor
 */
function fornecedorVinculadoPC(idFornecedor) {
    var prepareConsultaProtheus = new objDataSet("consultaDadosProtheus");
    prepareConsultaProtheus.setCampo("SC7"); //Informa o nome da tabela
    prepareConsultaProtheus.setCampo("C7_FORNECE = " + idFornecedor);
    prepareConsultaProtheus.setCampo("C7_FORNECE") //Informa as colunas 
    prepareConsultaProtheus.filtrarBusca();
    var result = prepareConsultaProtheus.getDados();
    if (result.columns[0] == 'ERRO') {
        return false;
    } else {
        return true;
    }
}

function showMessage(titulo, mensagem, functionDone) {
    FLUIGC.message.alert({
        message: mensagem,
        title: titulo,
        label: 'OK'
    }, function (el, ev) {
        if (functionDone != null) {
            functionDone.call();
        }
    });
}
/**
 * Retorna o eixo x e y em um array
 */
function getPositionCenter(widthDiv, heightDiv) {
    var alturaTela = screen.height;
    var larguraTela = screen.width;
    var posicaoX = (larguraTela / 2) - (widthDiv / 2); /*Explicado logo abaixo.*/
    var posicaoY = (alturaTela / 2) - (heightDiv / 2);
    return [posicaoX, posicaoY];
}

function buscaGestor() {
    var constraints = new Array();
    if ($("[name=CTT_CUSTO]").val().trim() != '11130245') {
        constraints.push(DatasetFactory.createConstraint("filial", $("[name=filial_protheus]").val(), $("[name=filial_protheus]").val(), ConstraintType.MUST))
    }

    let valorPagamento = $("[name=valorPgtoGuiaTaxaBoletos]").val();
    if($('#zoomTipolancamento').val() == "RATEIO - CSO" && 
        removeMascaraMonetaria(valorPagamento) <= 10000){
        valorPagamento = "R$ 10.001,00";
    }
    
    constraints.push(DatasetFactory.createConstraint("centroCusto", $("[name=CTT_CUSTO]").val(), $("[name=CTT_CUSTO]").val(), ConstraintType.MUST))
    constraints.push(DatasetFactory.createConstraint("valor", valorPagamento, valorPagamento, ConstraintType.MUST))
    var ds_aprov = DatasetFactory.getDataset("ds_alcadaAprovacaoPagamentos", null, constraints, null);
    $("#proximoAprovador").val("");
    $("#nivelAtualAprovacao").val("0");
    $("#idAprovGestor1").val("");
    $("#idAprovGestor2").val("");
    $("#idAprovGestor3").val("");
    $("#idAprovGestor4").val("");
    $("#idAprovGestor5").val("");

    var tipoLancamento = $('#zoomTipolancamento').val();
    if (tipoLancamento == "RATEIO - CSO" && TIPO_SOLICITACAO == "faciliteis") {
        var qtdAlcadas = 0;
        if (removeMascaraMonetaria($("#valorPgtoGuiaTaxaBoletos").val()) >= 100000) {
            qtdAlcadas = ds_aprov.values.length - 1;
        } else {
            qtdAlcadas = ds_aprov.values.length;
        }
        
        /*
        * Se for "RATEIO - CSO", "ignora" o primeiro aprovador
        */
        if(tipoLancamento == "RATEIO - CSO"){
            for (var x = 1; x < qtdAlcadas; x++) {
                if ($("#proximoAprovador").val() == "") {
                    $("#proximoAprovador").val(ds_aprov.values[x].IDAPROVADOR);
                    $("#nivelAtualAprovacao").val("2");
                }
                $("#idAprovGestor" + (x + 1)).val(ds_aprov.values[x].IDAPROVADOR);
            }
        }else{
            for (var x = 0; x < qtdAlcadas; x++) {
                if ($("#proximoAprovador").val() == "") {
                    $("#proximoAprovador").val(ds_aprov.values[x].IDAPROVADOR);
                    $("#nivelAtualAprovacao").val("1");
                }
                $("#idAprovGestor" + (x + 1)).val(ds_aprov.values[x].IDAPROVADOR);
            }
        }

    }else if(TIPO_SOLICITACAO == "impostos"){
        var qtdAlcadas = 0;
        if (removeMascaraMonetaria($("#valorPgtoGuiaTaxaBoletos").val()) >= 300000) {
            qtdAlcadas = 3;
            $("#idAprovGestor3").val("d5vukvl36mngujvp1475268748097");
        } else {
            qtdAlcadas = ds_aprov.values.length;
        }
        for (var x = 0; x < qtdAlcadas; x++) {
            if ($("#proximoAprovador").val() == "") {
                $("#proximoAprovador").val(ds_aprov.values[x].IDAPROVADOR);
                $("#nivelAtualAprovacao").val("1");
            }
            $("#idAprovGestor" + (x + 1)).val(ds_aprov.values[x].IDAPROVADOR);
        }
    }else {
        for (var x = 0; x < ds_aprov.values.length; x++) {
            if ($("#proximoAprovador").val() == "") {
                $("#proximoAprovador").val(ds_aprov.values[x].IDAPROVADOR);
                $("#nivelAtualAprovacao").val("1");
            }
            $("#idAprovGestor" + (x + 1)).val(ds_aprov.values[x].IDAPROVADOR);
        }
    }
}

function numberToReal(valor) {

    valor = parseFloat(valor);

    if (valor == "" || isNaN(valor)) {
        valor = 0.00
    }

    var numero = valor.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');

    return numero.join(',');

}

//Pega data de Vencimento e seta no campo Data Prevista de Pagamento
/* function pegaDataVencimento() {
    var dataPagamento;
    if ($("#dtDePgtoGuiaTaxaBoletos").val() != "" &&
        $("#dtDePgtoGuiaTaxaBoletos").val() != $("#aprovDataPrevista").val()) {
        dataPagamento = $("#dtDePgtoGuiaTaxaBoletos").val();
    } else {
        dataPagamento = $("#dtDeVencPgtoGuiaTaxaBoletos").val();
    }
    $("#aprovDataPrevista").val(dataPagamento);
    $("#aprovDataPrevistaSolici").val(dataPagamento);
} */

//Pega data de Prevista de Pagamento e deixa visível para o solicitante
/* function pegaDataAprovPrevista() {
    var dataPrevistaDoFinanceiro = $("#aprovDataPrevista").val();
    $("#aprovDataPrevistaSolici").val(dataPrevistaDoFinanceiro);
} */

// Pegar valores do get e reotor um array
function getParametrosURL() {
    var partes = parent.window.location.href.slice(parent.window.location.href.indexOf('?') + 1).split('&');
    var data = {};
    partes.forEach(function (parte) {
        var chaveValor = parte.split('=');
        var chave = chaveValor[0];
        var valor = chaveValor[1];
        data[chave] = valor;
    });
    console.log(data);
    return data;
}

//Configurar o dataset a ser utilizado para buscar os Tipos Lancamento
function verificaLancamento(tipo) {
    if (tipo == 'diversos') {
        return "dsTiposLancamentoDiversos";
    } else if (tipo == 'dp') {
        return "dsTiposLancamentoDp";
    } else if (tipo == 'estrangeiro') {
        return "dsTiposLancamentoEstrangeiro";
    } else if (tipo == 'faciliteis') {
        return "dsTiposLancamentoFaciliteis";
    } else if (tipo == 'impostos') {
        return "dsTiposLancamentoImpostos";
    }
}

function somaVlFolha() {
    var vlAutonomo = removeMascaraMonetaria($("#vlAutonomo").val());
    var vlFolha = removeMascaraMonetaria($("#vlFolha").val());
    if (vlAutonomo == "") {
        vlAutonomo = 0;
    } else if (vlFolha == "") {
        vlFolha = 0;
    }
    var total = (parseFloat(vlAutonomo) * 100) + (parseFloat(vlFolha) * 100);
    $('#valorPgtoGuiaTaxaBoletos').val(addMascaraMonetaria(total.toFixed(2) / 100, "R$ "));
    buscaGestor();
}

function validaDataVencimento() {
    atual = $("[name=dataSolicitante]").val().split("/");
    vencimento = $("#dtDeVencPgtoGuiaTaxaBoletos").val().split("/");

    $("#filtroDataVencimento").val(vencimento[2] + "-" + vencimento[1] + "-" + vencimento[0])
    var dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);
    var dataVencimento = new Date(vencimento[2], vencimento[1] - 1, vencimento[0])
    /* if (dataVencimento < dataAtual) {
        $('.dataPagamento').show()
    } else {
        $('.dataPagamento').hide()
    } */

    var i = 0;
    var diasUteis = 0;
    while (dataAtual < dataVencimento) {
        if (dataAtual.getDay() != 0 && dataAtual.getDay() != 6) {
            diasUteis++;
        }
        dataAtual.setDate(dataAtual.getDate() + 1)
    }

    //return diasUteis;	
    if (diasUteis < 7) {

        $('.dataPagamento').show()
        if (TIPO_SOLICITACAO == "diversos" ||
            TIPO_SOLICITACAO == "faciliteis") {
            $('.dataPagamento label').text('Vencimento Negociado')
        }

    } else {
        $('.dataPagamento').hide()
    }
}

function verificaPolitica(nivelAtualAprovacao) {
    try {
        var dt = $("#dataAprovGestor" + nivelAtualAprovacao).val().split("/");
        var dataAprovGestor = new Date(dt[2], dt[1] - 1, dt[0]);
        var dt2 = $("#dtDeVencPgtoGuiaTaxaBoletos").val().split("/");
        var dataVencimento = new Date(dt2[2], dt2[1] - 1, dt2[0]);
        var diasUteis = 0;

        if (dataAprovGestor != "") {
            while (dataAprovGestor < dataVencimento) {
                if (dataAprovGestor.getDay() != 0 && dataAprovGestor.getDay() != 6) {
                    diasUteis++;
                }
                dataAprovGestor.setDate(dataAprovGestor.getDate() + 1)
            }

            if (diasUteis < 7) {
                $("#foraPolitica").val('true');
                $(".dataPagamento").show();
                if ($("#dtDePgtoGuiaTaxaBoletos").val() == '') {
                    $("#dtDePgtoGuiaTaxaBoletos").val($("#dtDeVencPgtoGuiaTaxaBoletos").val());
                }
            } else {
                $("#foraPolitica").val('false');
            }
        }
    } catch (err) {
        console.log("------- ERRO NO ARQUIVO JS: " + err);
    }
}

function formataNumTitulo() {

    var numero = ("000000000" + $("#numeroTitulo").val()).slice(-9);

    if (numero != "" && numero != "000000000") {
        $("#numeroTitulo").val(numero);
    } else {
        $("#numeroTitulo").val("");
    }
}

function somenteNumeros(num) {
    var er = /[^0-9.]/;
    er.lastIndex = 0;
    var campo = num;
    if (er.test(campo.value)) {
        campo.value = "";
    }
}

/*function verificaNatureza() {
    var naturezaTipo = $("#zoomNatureza").val().split('-')[0].trim()
    var naturezaFornecedor = $("#forNatureza").val().trim();
    if (naturezaTipo != naturezaFornecedor) {
        $("#fornecedorVinculado").val("");
        $("#lojaFornecedor").val("");
        $("#forNatureza").val("");
        $("#A2_COD").val("");
        $("#FORNECEDOR_BANCO_DESC").val("");
        $("#cnpjFornecedor").val("");		
        showMessage('Atenção!', 'Natureza invalida ou não cadastrada ao fornecedor.', null);
    }
}*/


function validaCodSolicitacao() { //Valida no protheus se o Codigo do titulo já existe registrado.

    if ($("#numeroTitulo").val() != '' && $("#numeroTitulo").val() != null && $("#numeroTitulo").val() != undefined && (CURRENT_STATE == ATIVIDADE_ZERO || CURRENT_STATE == PRIMEIRA_ATIVIDADE)) {

        var constraintCodTitulo = [];
        var constraintNumero = DatasetFactory.createConstraint('NUMERO', $("#numeroTitulo").val(), $("#numeroTitulo").val(), ConstraintType.SHOULD);
        var constraintCodFornecedor = DatasetFactory.createConstraint('COD_FORNECEDOR', $("#A2_COD").val(), $("#A2_COD").val(), ConstraintType.SHOULD);
        var constraintNatureza = DatasetFactory.createConstraint('NATUREZA', $("#zoomNatureza").val().split("-")[0].trim(), $("#zoomNatureza").val().split("-")[0].trim(), ConstraintType.SHOULD);

        if ($("#tipoLancamento").val() == 'dp' && $("#zoomTipolancamento").val() == 'DARF - INSS') {
            var constraintValor = DatasetFactory.createConstraint('VALOR', removeMascaraMonetaria($("#vlFolha").val()), removeMascaraMonetaria($("#vlFolha").val()), ConstraintType.SHOULD);
        } else {
            var constraintValor = DatasetFactory.createConstraint('VALOR', removeMascaraMonetaria($("#valorPgtoGuiaTaxaBoletos").val()), removeMascaraMonetaria($("#valorPgtoGuiaTaxaBoletos").val()), ConstraintType.SHOULD);
        }
        constraintCodTitulo.push(constraintNumero);
        constraintCodTitulo.push(constraintCodFornecedor);
        constraintCodTitulo.push(constraintNatureza);
        constraintCodTitulo.push(constraintValor);
        var ds_codigoTitulo = DatasetFactory.getDataset('ds_contasPagar', null, constraintCodTitulo, null);
        var numeroTitulo = ds_codigoTitulo.values[0].NUMERO;

        if (numeroTitulo != "" && numeroTitulo != undefined) {
            FLUIGC.message.alert({
                message: "Já existe um registro para este <b>Número de Título</b>!",
                title: 'Atenção !!!',
                label: 'OK'
            }, function (el, ev) {});
            $("#numeroTitulo").val("");
        }

        var cons = []
        cons.push(DatasetFactory.createConstraint('metadata#active', 'true', 'true', ConstraintType.MUST));
        cons.push(DatasetFactory.createConstraint('CTT_CUSTO', $("#codigoCentroCustos").val(), $("#codigoCentroCustos").val(), ConstraintType.MUST));
        cons.push(DatasetFactory.createConstraint('filial_protheus', $("#filial_protheus").val(), $("#filial_protheus").val(), ConstraintType.MUST));
        cons.push(DatasetFactory.createConstraint('A2_COD', $("#A2_COD").val(), $("#A2_COD").val(), ConstraintType.MUST));
        cons.push(DatasetFactory.createConstraint('numeroTitulo', $("#numeroTitulo").val(), $("#numeroTitulo").val(), ConstraintType.MUST));

        var colunas = new Array('solicitante', 'codSolicitacao', 'FORNECEDOR_BANCO_DESC', 'cnpjFornecedor', 'metadata#active', 'metadata#id');
        var ds_solicitacao = DatasetFactory.getDataset('ds_solicitacaoDePagamentos', colunas, cons, null).values;
        if (ds_solicitacao.length > 0) {
            var numeroSolicitacao = ds_solicitacao[0].codSolicitacao;
        }

        if (numeroSolicitacao != "" && numeroSolicitacao != undefined) {
            FLUIGC.message.alert({
                message: "Já existe um registro com as mesmas características <b>" + numeroSolicitacao + "</b>!",
                title: 'Atenção !!!',
                label: 'OK'
            }, function (el, ev) {});
            $("#numeroTitulo").val("");
        }
    }
}

function consultaGrupo(user, grupo) {
    var filter = DatasetFactory.createConstraint("colleagueGroupPK.groupId", grupo, grupo, ConstraintType.MUST);
    var filter1 = DatasetFactory.createConstraint("colleagueGroupPK.colleagueId", user, user, ConstraintType.MUST);
    var constraints = new Array(filter, filter1);
    var datasetGrupos = DatasetFactory.getDataset("colleagueGroup", null, constraints, null);

    return datasetGrupos.values.length;
}

function validaAbertura() {
    var userId = parent.WCMAPI.userCode;
    if (TIPO_SOLICITACAO == 'dp') {
        if (consultaGrupo(userId, "PAG_DP") == 0) { //// teste
            FLUIGC.message.alert({
                message: "Você não possui permissão para abrir este tipo de solicitação de pagamentos!",
                title: 'Atenção !!!',
                label: 'OK'
            }, function (el, ev) {
                $(".hideCompos").hide()
            });
        }
    } else if (TIPO_SOLICITACAO == 'faciliteis') {
        if (consultaGrupo(userId, "PAG_COMP") == 0) {
            FLUIGC.message.alert({
                message: "Você não possui permissão para abrir este tipo de solicitação de pagamentos!",
                title: 'Atenção !!!',
                label: 'OK'
            }, function (el, ev) {
                $(".hideCompos").hide()
            });
        }
    } else if (TIPO_SOLICITACAO == 'impostos') {
        if (consultaGrupo(userId, "PAG_FIS") == 0) {
            FLUIGC.message.alert({
                message: "Você não possui permissão para abrir este tipo de solicitação de pagamentos!",
                title: 'Atenção !!!',
                label: 'OK'
            }, function (el, ev) {
                $(".hideCompos").hide()
            });
        }
    }

}

function validaRateio() { // Validações referente a abertura via WS
    if ($("viaWebService").val() == "true") {
        var isRateio = $("#possuiRateio").val();
        if (isRateio != 'sim') {
            //$('.divImportBeneficio').hide();
            //$('.divPaiFilhoBeneficio').hide();
            $('.divImportBeneficio').css("display", "none");
            $('.divPaiFilhoBeneficio').css("display", "none");
            $("#_existeRateio").prop("checked", false);
            $("#existeRateio").val("");

        } else {
            //$('.divImportBeneficio').show();
            //$('.divPaiFilhoBeneficio').show();
            $('.divImportBeneficio').css("display", "block");
            $('.divPaiFilhoBeneficio').css("display", "block");
            $("#existeRateio").val("true");
            $("#_existeRateio").prop("checked", true);
        }
    }
}

function buscaTitulos() {
    var filtroPorFornecedor = "";
    var filtroPorFilial = "";
    var filtroPorNatureza = "";
    var codFornecedor = $("#A2_COD").val();
    var codFilial = $("#filial_protheus").val();
    var codNatureza = $("#codNatureza").val();

    filtroPorFornecedor = 'COD_FORNECEDOR,' + codFornecedor;
    filtroPorFilial = 'FILIAL,' + codFilial;
    filtroPorNatureza = 'NATUREZA,' + codNatureza;
    filtroPorSaldo = 'SALDO,' + "";

    openZoom("ds_contasPagar",
        "NUMERO,Número do Título,FILIAL,Filial,TIPO,Tipo,DESC_FORNECEDOR,Fornecedor,COD_FORNECEDOR,Cod Fornecedor,NATUREZA,codNatureza,VALOR,Valor,DT_EMISSAO,Data de Emissão,DT_VENCIMENTO,Data de Vencimento,PREFIXO,Prefixo,PARCELA,Parcela",
        "NUMERO,FILIAL,TIPO,DESC_FORNECEDOR,COD_FORNECEDOR,NATUREZA,VALOR,DT_EMISSAO,DT_VENCIMENTO,PREFIXO,PARCELA",
        filtroPorFilial + ',' + filtroPorFornecedor + ',' + filtroPorNatureza + ',' + filtroPorSaldo,
        "zoomNumTitulo");

}

function VerificaCentroCusto() {
    var tipoSolic = $("#tipoLancamento").val();
    if (tipoSolic == "faciliteis") {
        codCC = $("#CTT_CUSTO").val();
        var constraintDs_centroCusto1 = DatasetFactory.createConstraint('CODIGO', codCC, codCC, ConstraintType.MUST);
        var ds_centroCusto = DatasetFactory.getDataset('ds_centroCusto', null, new Array(constraintDs_centroCusto1), null).values;
        if (ds_centroCusto.values(0, 'CODIGO') == '') {
            $("#centroCustosBloqueado").val('true');
            $("#centroCustosAnterior").val(codCC);
            mensagemComConfirmacao('Aviso', 'Centro de Custos Principal!!! Favor procurar a área responsável para desbloqueio ou selecionar outro centro de custo.', null);
        } else {
            $("#centroCustosBloqueado").val('false');
        }

        if ($("#existeRateio").val() == "true" && $('#indiceRateio').val() != '0') {
            var index = $("#indiceRateio").val();
            var cons = new Array()

            for (var i = 1; i <= index; i++) {
                var filtroCodigo = $('#codCentroCustoBeneficio___' + i).val();
                cons.push(DatasetFactory.createConstraint('CODIGO', filtroCodigo, filtroCodigo, ConstraintType.MUST))
            }

            var ds_centroCusto = DatasetFactory.getDataset('ds_centroCusto', null, cons, null);
            // log.info('' + getValue("WKNumProces") + '<<<< LINHAS qtde rateio >>>>' + index);
            // log.info('' + getValue("WKNumProces") + '<<<< DSCENTROCUSTOS do rateio >>>>' + ds_centroCusto.rowsCount);
            if (ds_centroCusto.values >= index) {
                $("#centroCustosBloqueado").val("false");
            } else {
                $("#centroCustosBloqueado").val("true");
                mensagemComConfirmacao('Aviso', 'Centro de Custos Rateio Bloqueado!!! Favor procurar a área responsável para desbloqueio ou selecionar outro centro de custo.', null);
            }
        }
    }
}

function arrayComDados(opc){
	
	var opcao = [];
	
	var maxDate = new Date();		
	maxDate.setDate(maxDate.getDate()+90);
	var minDate = new Date();
	minDate.setDate(minDate.getDate());
		
	if (opc == "1"){	
		var opcao = [{'IMPOSTO':'IRRF','ALIQ':'15.00','DIRF':'S','DARF':'0422','NATUREZA':'41202025','RESP':'Banco','INTEGRA':'','TP':'TX','TRIB':'','FORNECEDOR':'001387','CNPJ':'00.394.460/0058-87','LOJA':'00'}, //02
		             {'IMPOSTO':'CIDE','ALIQ':'10.00','DIRF':'S','DARF':'8741','NATUREZA':'41111030','RESP':'Fiscal','INTEGRA':'S','TP':'TX','TRIB':'','FORNECEDOR':'001387','CNPJ':'00.394.460/0058-87','LOJA':'00'},
		             {'IMPOSTO':'PIS','ALIQ':'1.65','DIRF':'S','DARF':'5434','NATUREZA':'41111028','RESP':'Fiscal','INTEGRA':'S','TP':'TX','TRIB':'','FORNECEDOR':'001387','CNPJ':'00.394.460/0058-87','LOJA':'00'},
		             {'IMPOSTO':'COFINS','ALIQ':'7.60','DIRF':'S','DARF':'5442','NATUREZA':'41111027','RESP':'Fiscal','INTEGRA':'S','TP':'TX','TRIB':'','FORNECEDOR':'001387','CNPJ':'00.394.460/0058-87','LOJA':'00'},
		             {'IMPOSTO':'ISS','ALIQ':'5.00','DIRF':'N','DARF':'','NATUREZA':'41111029','RESP':'Fiscal','INTEGRA':'S','TP':'ISS','TRIB':'ISS/IPTU/OUTROS','FORNECEDOR':'','CNPJ':'','LOJA':''},
		             {'IMPOSTO':'IOF','ALIQ':'0.38','DIRF':'S','DARF':'5220','NATUREZA':'41111024','RESP':'Banco','INTEGRA':'','TP':'TX','TRIB':'','FORNECEDOR':'001387','CNPJ':'00.394.460/0058-87','LOJA':'00'}
		            ]
	}else if (opc == "2"){
		var opcao = [{'IMPOSTO':'IRRF','ALIQ':'15.00','DIRF':'S','DARF':'0422','NATUREZA':'41202025','RESP':'Banco','INTEGRA':'','TP':'TX','TRIB':'','FORNECEDOR':'001387','CNPJ':'00.394.460/0058-87','LOJA':'00'}, //02
		             {'IMPOSTO':'IOF','ALIQ':'0.38','DIRF':'S','DARF':'5220','NATUREZA':'41111024','RESP':'Banco','INTEGRA':'','TP':'TX','TRIB':'','FORNECEDOR':'001387','CNPJ':'00.394.460/0058-87','LOJA':'00'}
		            ]
	}else if (opc == "3"){
		var opcao = [{'IMPOSTO':'IRRF','ALIQ':'15.00','DIRF':'S','DARF':'0422','NATUREZA':'41202025','RESP':'Banco','INTEGRA':'','TP':'TX','TRIB':'','FORNECEDOR':'001387','CNPJ':'00.394.460/0058-87','LOJA':'00'}, //02
		             {'IMPOSTO':'ISS','ALIQ':'5.00','DIRF':'N','DARF':'','NATUREZA':'41111029','RESP':'Fiscal','INTEGRA':'S','TP':'ISS','TRIB':'ISS/IPTU/OUTROS','FORNECEDOR':'','CNPJ':'','LOJA':''},
		             {'IMPOSTO':'IOF','ALIQ':'0.38','DIRF':'S','DARF':'5220','NATUREZA':'41111024','RESP':'Banco','INTEGRA':'','TP':'TX','TRIB':'','FORNECEDOR':'001387','CNPJ':'00.394.460/0058-87','LOJA':'00'}
		            ]
	}else {
		var opcao = [{'IMPOSTO':'IRRF','ALIQ':'15.00','DIRF':'S','DARF':'0422','NATUREZA':'41202025','RESP':'Banco','INTEGRA':'','TP':'TX','TRIB':'','FORNECEDOR':'001387','CNPJ':'00.394.460/0058-87','LOJA':'00'}, //02
		             {'IMPOSTO':'CIDE','ALIQ':'10.00','DIRF':'S','DARF':'8741','NATUREZA':'41111030','RESP':'Fiscal','INTEGRA':'S','TP':'TX','TRIB':'','FORNECEDOR':'001387','CNPJ':'00.394.460/0058-87','LOJA':'00'},
		             {'IMPOSTO':'IOF','ALIQ':'0.38','DIRF':'S','DARF':'5220','NATUREZA':'41111024','RESP':'Banco','INTEGRA':'','TP':'TX','TRIB':'','FORNECEDOR':'001387','CNPJ':'00.394.460/0058-87','LOJA':'00'}
		            ]
	}		
		
	for (var i = 0; i < opcao.length; i++) {				
		var row = wdkAddChild("tbImpostos");		
		$('#imposto___'+row).val(opcao[i]['IMPOSTO']);		
		if ( opcao[i]['IMPOSTO'] == "IRRF" || opcao[i]['IMPOSTO'] == "ISS" ) $('#aliq___'+row).removeAttr('readonly');		
		$('#aliq___'+row).val(opcao[i]['ALIQ']);
		$('#dirf___'+row).val(opcao[i]['DIRF']);
		$('#darf___'+row).val(opcao[i]['DARF']);
		$('#natur___'+row).val(opcao[i]['NATUREZA']);
		$('#resp___'+row).val(opcao[i]['RESP']);
		$('#integra___'+row).val(opcao[i]['INTEGRA']);
		$('#tit___'+row).val(opcao[i]['TP']);
		$('#trib___'+row).val(opcao[i]['TRIB']);
		if (opcao[i]['FORNECEDOR'] == "001387") window['forn___'+row].setValue(opcao[i]['FORNECEDOR'])
		$('#codigoForn___'+row).val(opcao[i]['FORNECEDOR']);
		$('#lojaForn___'+row).val(opcao[i]['LOJA']);
		$('#cnpjForn___'+row).val(opcao[i]['CNPJ']);
		FLUIGC.calendar(("#venc___"+row), { language: 'pt-br', minDate: minDate, maxDate: maxDate, pickDate: true, pickTime: false });
		MaskEvent.init();
		
		
	}
	
}


function calcValor(){
	
	$('input[id^="imposto___"]').each(function(index, value){
		var seq = $(this).attr("id").split("___")[1];
					
			var base = convertFloat($('#base___'+seq).val());		
			var aliq = convertFloat($('#aliq___'+seq).val());
					
			var tot = base * aliq / 100;
			$('#vlimp___'+seq).val(convertReal_(tot));									
		
	});	
	
}


//transforma um float em um string com mascara monetaria
function convertReal_(string) {
	if (string != '0' && string != '' && string != undefined && string != NaN) {
		string = this.convertFloat(string)
		string = parseFloat(string).toFixed(2)
		string = string.split('.');
		string[0] = string[0].split(/(?=(?:...)*$)/).join('.');
		string.join(',');
		return string;
	} else {
		return '0,00'
	}
}

function convertReal(string) {
	if (string != '0' && string != '' && string != undefined && string != NaN) {
		string = this.convertFloat(string)
		string = parseFloat(string).toFixed(2)
		string = string.split('.');
		string[0] = string[0].split(/(?=(?:...)*$)/).join('.');
		string.join(',');
		return "R$ " + string;
	} else {
		return 'R$ 0,00'
	}
}
//transforma um valor com mascara em um float sem mascara
function convertFloat(valor) {
	if (valor != 0 && valor != undefined && valor != null) {
		valor = valor.toString()
		if (valor.indexOf(',') != -1) {

			valor = valor.replace(/[R$.]/g, '');
			valor = valor.replace(',', '.');
			return parseFloat(valor);

		} else {

			valor = valor.replace(/[R$]/g, '');
			return parseFloat(valor);

		}
	}
	return 0;

}


function mensagemComConfirmacao(titulo, mensagem, functionDone) {
    FLUIGC.message.alert({
        message: mensagem,
        title: titulo,
        label: 'OK'
    }, function (el, ev) {
        if (functionDone != null) {
            functionDone.call();
        }
    });
}