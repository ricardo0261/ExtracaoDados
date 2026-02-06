$(document).ready(function () {
	
  $("#btnValidaDadosTrans").click(function(validaMicro){  
  var token = geraToken();
  var valida = validaBanco(token)
  var validaMicro =  validaBancoMicro(token)
  $("#idConsultaT").val(validaMicro);
  // var webhook =  webhook(token)
  console.log(validaMicro)
  var resultado = valida;
  $("#idConsultaTB").val(resultado.valid);
  if(resultado.valid == false){
    mensagemComConfirmacao('Erro', (resultado.errors[0].message), null);
    $("#valTransfeera_01").val('nao');
  }else{
    mensagemComConfirmacao('Validados', ("Dados validados!!"), null);
    $("#valTransfeera_01").val('sim');
  }

    console.log(resultado);
  
  // mensagemComConfirmacao('Erro', (resultado), null);
});

if(($("#atvAtual").val() == "173")){
    var token = geraToken();
    var idTransfeera =  $("#idConsultaT").val()
    var respostaMicro =  consultaValidacao(idTransfeera, token)
    var resultado = respostaMicro.valid
    console.log(respostaMicro)
    $("#respostaMicro").val(resultado);
    if(resultado == true){
      mensagemComConfirmacao('Validados', ("Micro Depósito Validado!!"), null);
       $("#descisaoFBtnAprov").prop('disabled', false);
	   $("#descisaoFBtnReprov").prop('disabled', false);
	   $("#valTransfeera_02").val('sim');
    }else if(resultado == false){
      mensagemComConfirmacao('Erro', (respostaMicro.errors[0].message), null);
       $("#descisaoFBtnAprov").prop('disabled', false)
	   $("#descisaoFBtnReprov").prop('disabled', false)
    }
    else if(resultado == null){
      mensagemComConfirmacao('Atenção', ("O Micro Depósito ainda não foi validado, por favor atualize a página!!"), null);
       $("#descisaoFBtnAprov").prop('disabled', true)
	   $("#descisaoFBtnReprov").prop('disabled', true)
    }
  }
});

function geraToken(){
  var origem = window.location.origin;
  /*if (origem == "https://oncoclinicastst.fluig.com" || origem == "https://oncoclinicasdev.fluig.com") { //TST e DEV
    var resposta = "";
    var status = false;
    $.ajax({
      "url": "https://login-api-sandbox.transfeera.com/authorization",
      "method": "POST",
      "timeout": 3000,
      "async": false,
      "headers": {
        "Content-Type": "application/json",
        "User-Agent": "ONCOCLINICAS DO BRASIL SERVICOS MEDICOS SA (equipe.financeiro@oncoclinicas.com)"
      },
      "data": JSON.stringify({ 
          "grant_type": "client_credentials",
          "client_id": "c353cf25-61ce-4e8e-bbef-b0a06a0c6c38",
          "client_secret": "9b2eeab1-20b7-4ba6-9dcd-3ade80e7b3a2e2f26304-d7b2-446c-8b5e-a0e105aa05fa"
        }),
        success:function(dado){
          resposta =  dado.access_token
        }
    })
    return resposta;

  }else if (origem == "https://oncoclinicas.fluig.com") {  //PROD*/
    var resposta = "";
    var status = false;
    $.ajax({
      "url": "https://login-api.transfeera.com/authorization",
      "method": "POST",
      "timeout": 3000,
      "async": false,
      "headers": {
        "Content-Type": "application/json",
        "User-Agent": "ONCOCLINICAS DO BRASIL SERVICOS MEDICOS SA (equipe.financeiro@oncoclinicas.com)"
      },
      "data": JSON.stringify({ 
          "grant_type": "client_credentials",
          "client_id": "649fe80f-c49c-4a9c-a84b-0a912e0bb8ce",
          "client_secret": "7c35658a-0f9f-4182-b4cd-6984e934d7efd970bce7-7c71-41d6-bf0f-8aa0940be7c2"
        }),
        success:function(dado){
          resposta =  dado.access_token
        }
  })
  return resposta;
 // }
}

function validaBanco(token){
  var origem = window.location.origin;
/*  if (origem == "https://oncoclinicastst.fluig.com" || origem == "https://oncoclinicasdev.fluig.com") { //TST e DEV
    var result = "";
    $.ajax({
      "url": "https://contacerta-api-sandbox.transfeera.com/validate?type=BASICA",
      "method": "POST",
      "timeout": 3000,
      "async": false,
      "headers": {
        "Authorization": token,
        "User-Agent": "ONCOCLINICAS DO BRASIL SERVICOS MEDICOS SA (equipe.financeiro@oncoclinicas.com)",
        "Content-Type": "application/json"
      },
      "data": JSON.stringify({
                  "name":  $('#fornecedor').val(),
                  "cpf_cnpj": $('#cpf').val(),
                  "bank_code": $('#codBanco').val(),
                  "agency": $('#agencia').val(),
                  "agency_digit": $('#digVAgencia').val(),
                  "account": $('#contaCorrente').val(),
                  "account_digit":  $('#digVConta').val(),
                  "account_type": "CONTA_CORRENTE"
        }),
        success:function(dado){
          //  console.log("Teste" + dado)
          result =  dado._validation
        }
        })
        
        return result;

  }else if (origem == "https://oncoclinicas.fluig.com") { //PROD*/
  var result = "";
  $.ajax({
    "url": "https://contacerta-api.transfeera.com/validate?type=BASICA",
    "method": "POST",
    "timeout": 3000,
    "async": false,
    "headers": {
      "Authorization": token,
      "Content-Type": "application/json",
      "User-Agent": "ONCOCLINICAS DO BRASIL SERVICOS MEDICOS SA (equipe.financeiro@oncoclinicas.com)"
    },
    "data": JSON.stringify({
		    	"name":  $('#fornecedor').val(),
		        "cpf_cnpj": $('#cpf').val(),
		        "bank_code": $('#codBanco').val(),
		        "agency": $('#agencia').val(),
		        "agency_digit": $('#digVAgencia').val(),
		        "account": $('#contaCorrente').val(),
		        "account_digit":  $('#digVConta').val(),
		        "account_type": "CONTA_CORRENTE"
      }),
      success:function(dado){
        //  console.log("Teste" + dado)
        result =  dado._validation
      }
      })
      
      return result;  
 // }
}

function validaBancoMicro(token){
        var origem = window.location.origin;
       /* if (origem == "https://oncoclinicastst.fluig.com" || origem == "https://oncoclinicasdev.fluig.com") { //TST e DEV
          var resultM = "";
          $.ajax({
            "url": "https://contacerta-api-sandbox.transfeera.com/validate?type=MICRO_DEPOSITO",
            "method": "POST",
            "timeout": 3000,
            "async": false,
            "headers": {
              "Authorization": token,
              "User-Agent": "ONCOCLINICAS DO BRASIL SERVICOS MEDICOS SA (equipe.financeiro@oncoclinicas.com)",
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({
		            	"name":  $('#fornecedor').val(),
				        "cpf_cnpj": $('#cpf').val(),
				        "bank_code": $('#codBanco').val(),
				        "agency": $('#agencia').val(),
				        "agency_digit": $('#digVAgencia').val(),
				        "account": $('#contaCorrente').val(),
				        "account_digit":  $('#digVConta').val(),
				        "account_type": "CONTA_CORRENTE"
              }),
              success:function(dado){
                //  console.log("Teste" + dado)
                resultM =  dado.id
              }
              })
              
              return resultM;
        }else if (origem == "https://oncoclinicas.fluig.com") { //PROD*/
          var resultM = "";
          $.ajax({
            "url": "https://contacerta-api.transfeera.com/validate?type=MICRO_DEPOSITO",
            "method": "POST",
            "timeout": 3000,
            "async": false,
            "headers": {
              "Authorization": token,
              "User-Agent": "ONCOCLINICAS DO BRASIL SERVICOS MEDICOS SA (equipe.financeiro@oncoclinicas.com)",
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({
		            	"name":  $('#fornecedor').val(),
				        "cpf_cnpj": $('#cpf').val(),
				        "bank_code": $('#codBanco').val(),
				        "agency": $('#agencia').val(),
				        "agency_digit": $('#digVAgencia').val(),
				        "account": $('#contaCorrente').val(),
				        "account_digit":  $('#digVConta').val(),
				        "account_type": "CONTA_CORRENTE"
              }),
              success:function(dado){
                //  console.log("Teste" + dado)
                resultM =  dado.id
              }
              })
              
              return resultM;
     //   }
}

 function consultaValidacao (idTransfeera, token){
          var origem = window.location.origin;
          /*if (origem == "https://oncoclinicastst.fluig.com" || origem == "https://oncoclinicasdev.fluig.com") { //TST e DEV
            var resultVM = "";
            $.ajax({
              "url": "https://contacerta-api-sandbox.transfeera.com/validation/" + idTransfeera,
              "method": "GET",
              "timeout": 3000,
              "async": false,
              "headers": {
                "Authorization": token,
                "User-Agent": "ONCOCLINICAS DO BRASIL SERVICOS MEDICOS SA (equipe.financeiro@oncoclinicas.com)",
                "Content-Type": "application/json"
              },
                success:function(dado){
                  //  console.log("Teste" + dado)
                  resultVM =  dado
                }
                })
                
                return resultVM;
          }else if (origem == "https://oncoclinicas.fluig.com") { //PROD*/
            var resultVM = "";
            $.ajax({
              "url": "https://contacerta-api.transfeera.com/validation/" + idTransfeera,
              "method": "GET",
              "timeout": 3000,
              "async": false,
              "headers": {
                "Authorization": token,
                "User-Agent": "ONCOCLINICAS DO BRASIL SERVICOS MEDICOS SA (equipe.financeiro@oncoclinicas.com)",
                "Content-Type": "application/json"
              },
                success:function(dado){
                  //  console.log("Teste" + dado)
                  resultVM =  dado
                }
                })
                
                return resultVM;
        //  }
  }

 
function mensagemComConfirmacao(titulo, mensagem, functionDone) {
  FLUIGC.message.alert({
      message: mensagem,
      title: titulo,
      label: 'OK'
  }, function(el, ev) {
      if (functionDone != null) {
          functionDone.call();
      }
  });
}

