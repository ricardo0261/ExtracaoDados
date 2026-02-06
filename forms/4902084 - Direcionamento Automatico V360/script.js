$(document).ready( () => { 
    $("#usuarioRegistro").val(parent.WCMAPI.user);     
    $("#codUsuarioRegistro").val(parent.WCMAPI.userCode);
    $("#emailUsuarioRegistro").val(parent.WCMAPI.userEmail); 
    $("#dataRegistro").val(getDate()); 
    FLUIGC.popover('#complement-popover',{trigger: 'hover', placement: 'auto'});
    defineGrupo()
    defineFilial()
    setTimeout(ocultaCampo, 600);

    $('#tipoSolicitacao').change(function (){
        var tipoLancamento = $('#tipoSolicitacao').val()
        $(".zoomGrupo .select2-selection__choice__remove").click()
        $("#grupoDestino").select2("close");
        if(tipoLancamento == "medicao"){
            reloadZoomFilterValues('grupoDestino', "grupoId,nf_medicao_")
        }else if(tipoLancamento == "pagamentoMedico"){
            reloadZoomFilterValues('grupoDestino', "grupoId,nf_pgto_med_")
        }else if(tipoLancamento == "GDE"){
            reloadZoomFilterValues('grupoDestino', "grupoId,nf_recebidas_")
        }else{
            reloadZoomFilterValues('grupoDestino', "")
        }     
    }); 

    $('#defineGrupo').change(function (){defineGrupo()}); 

    $("[name='ckdefineFilial']").click((event) => {    
        $('#defineFilial').val($("[name='ckdefineFilial']:checked").val()) 
        defineFilial()        
    });

}); 

function defineFilial(){
    if($('#defineFilial').val() == "on"){
        $('.descricaoUnidade span').show()
        $('.dadosUnidade').show()
    }else{
        $('.descricaoUnidade span').hide()
        $('.dadosUnidade').hide()
    } 
}

function defineGrupo(){
    if($('#defineGrupo').val() == "predefinido" || $('#defineGrupo').html() == "Predefinido"){
        $(".zoomGrupo").show()
    }else{
        $(".zoomGrupo").hide()
    }   
}

function setSelectedZoomItem(item) {

    if (item.inputId == "descricaoUnidade") {
        $("#codUnidade").val(item.CODIGO);
        $("#cnpjUnidade").val(item.CGC);
    } else if (item.inputId == "descricaoFornecedor") {
        $("#codFornecedor").val(item.CODIGO);
        $('#cnpjFornecedor').val(item.CGC);
    }else if (item.inputId == "grupoDestino") {
        $("#codigoGrupo").val(item.grupoId);
    }

}

function ocultaCampo(){
    if($('#defineFilial').val() != "on"){
        $('.descricaoUnidade span').hide()
        $('.dadosUnidade').hide()
    }
}

function getDate(){
	var now = new Date();
    var year = now.getFullYear();
    var month = addZero(now.getMonth() + 1, 2);
    var day = addZero(now.getDate(), 2);
    var currentDate = year + '-' + month + '-' + day;
	return currentDate;    
}

function addZero(x, n) {
    if (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
};