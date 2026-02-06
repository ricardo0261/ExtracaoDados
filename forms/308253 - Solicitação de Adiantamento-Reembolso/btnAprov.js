function btnAprov() {
	// BOTAO DE APROVACAO
	$(".btnAprov").on("click", function() {
		var botao = $(this).attr("id").split("Btn")
		var decisao = botao[0];
		var btnAprov = decisao + "BtnAprov";
		var btnReprov = decisao + "BtnReprov";
		var acao = botao[1];

		decisaoSolicitacao(decisao, btnAprov, btnReprov, acao);
	});
};

function decisaoSolicitacao(decisao, btnAprov, btnReprov, acao){
	if(acao == "Aprov"){
		$("#" + decisao).val("sim");
	} else {
		$("#" + decisao).val("nao");
	}

	altBtnAprov(decisao, btnAprov, btnReprov);
};

function altBtnAprov(decisao, btnAprov, btnReprov){
	if($("#" + decisao).val() == "sim"){
		$("#" + btnAprov).removeClass("btn-default").addClass("btn-success active");
		$("#" + btnReprov).removeClass("btn-danger active").addClass("btn-default");
	} else if($("#" + decisao).val() == "nao"){
		$("#" + btnAprov).removeClass("btn-success active").addClass("btn-default");
		$("#" + btnReprov).removeClass("btn-default").addClass("btn-danger active");
	}
};

function blqAllBtnAprov(){
	$(".btnAprov").each(function(){
		var botao = $(this).attr("id").split("Btn")
		var decisao = botao[0];
		blqBtnAprov(decisao);
	});
};

function blqBtnAprov(decisao){
	var btnAprov = decisao + "BtnAprov";
	var btnReprov = decisao + "BtnReprov";

	altBtnAprov(decisao, btnAprov, btnReprov);

	$("#" + btnAprov).prop("disabled", true);
	$("#" + btnReprov).prop("disabled", true);
};