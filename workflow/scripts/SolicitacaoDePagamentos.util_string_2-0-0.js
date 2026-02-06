var objString =
/**
 * objString destinado a executar funções de tratamento de string
 * 
 * @constructor Parametro = objeto Jquery ou valor da string e TipoParametro = 1 -
 *              objeto Jquery e 2 - para string
 * @returns String tratada com os parametros solicitados
 * @author sergio.santos
 */
function(parametro) {
	var buscar = '';
	var texto;
	var obj;
	var tipoObjeto;
	var find = "";
	var reg_replaceAll = 'g';
	var reg_com_acento = "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
	var reg_mais_espaco = '\\s+';
	var reg_caracter_especiais = "ºª!@#%¨'~´`";
	var reg_aspas = '"';
	var reg_interrogacao = '\\?';
	var reg_circunflexo = '\\^';
	var reg_asterisco = '\\*';
	var reg_pontoVirgula = '\\;';
	var reg_pipe = '\\|';
	var resp_sem_acento = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";
	var resp_unico_espaco = ' ';
	var resp_sem_espaco = '';
	/**
	 * Metodo para setar os parametro obrigatórios para o objeto
	 */
	var setParametros = function(parametro) {
		setObj(parametro);
		setTexto(parametro);
	}
	/**
	 * 
	 */
	var setObj = function(parametro) {
		obj = parametro;
	};
	/**
	 * Metodo para setar o campo texto com a string informada
	 */
	var setTexto = function(string) {
		texto = string;
	};
	/**
	 * Metodo para setar o campo Find, usado em toda expressão regular
	 */
	var setFind = function(buscar) {
		find = new RegExp(buscar, reg_replaceAll);
	};
	/**
	 * Metodo para executar o Replace em cada item
	 */
	var execReplaceNOVO = function(buscar, substituir) {
		setFind(buscar);
		
		var textoAux = new String(texto);
		texto = textoAux.replace(find, substituir);
	};
	/**
	 * Metodo para retirar acentuacoes
	 */
	var retirarAcentuacoes = function() {		
		for (var pos = 0; pos < reg_com_acento.length; pos++) {
			execReplaceNOVO(reg_com_acento[pos], resp_sem_acento[pos]);
		}
	};
	/**
	 * Funcao para tratar 2 ou mais espaço
	 */
	var retirarExcessoEspaco = function() {
		execReplaceNOVO(reg_mais_espaco, resp_unico_espaco);
	};
	/**
	 * Funcao para tratar Caracteres especiais
	 */
	var retirarCaracteresEspeciais = function() {
		for ( var pos in reg_caracter_especiais) {
			execReplaceNOVO(reg_caracter_especiais[pos], resp_sem_espaco);
		}
	};
	/**
	 * Funcao para tratar Acento circunflexo
	 */
	var retirarAcentoCircunflexo = function() {
		execReplaceNOVO(reg_circunflexo, resp_sem_espaco);
	};
	/**
	 * Funcao para tratar Ponto e virgula
	 */
	var retirarPontoVirgula = function() {
		execReplaceNOVO(reg_pontoVirgula, resp_sem_espaco);
	};
	/**
	 * Funcao para tratar Pipe
	 */
	var retirarPipe = function() {
		execReplaceNOVO(reg_pipe, resp_sem_espaco);
	};
	/**
	 * Funcao para tratar Interrogação
	 */
	var retirarInterrogacao = function() {
		execReplaceNOVO(reg_interrogacao, resp_sem_espaco);
	};
	/**
	 * Funcao para tratar Asterisco
	 */
	var retirarAsterisco = function() {
		execReplaceNOVO(reg_asterisco, resp_sem_espaco);
	};
	/**
	 * Funcao para tratar Aspas
	 */
	var retirarAspas = function() {
		execReplaceNOVO(reg_aspas, resp_sem_espaco);
	};
	/**
	 * Funcao para tratar caracteres WebService
	 */
	var retirarCaracteresWebService = function() {
		retirarPontoVirgula();
		retirarPipe();
	};
	/**
	 * Metodo para retirar todos os caracteres especiais, espaços duplos e
	 * acentuacoes
	 * 
	 * @returns Texto processado conforme os parametros solicitados
	 * 
	 * @author sergio.santos
	 */
	this.execCompleto = function() {
		retirarAcentuacoes();
		retirarCaracteresEspeciais();
		retirarExcessoEspaco();
		retirarAcentoCircunflexo();
		retirarInterrogacao();
		retirarAsterisco();
		retirarAspas();
		retirarCaracteresWebService();
		
		return getTexto();
	};
	/**
	 * Metodo para retornar o valor do texto
	 * 
	 * @returns Texto
	 */
	var getTexto = function() {
		texto = texto.toUpperCase();
		log.info("Retorno string: " + texto);
		return texto;		
	};
	/**
	 * Construtor
	 * 
	 * @author sergio.santos
	 */
	__construct = function(parametro) {
		setParametros(parametro);
	}(parametro);
};