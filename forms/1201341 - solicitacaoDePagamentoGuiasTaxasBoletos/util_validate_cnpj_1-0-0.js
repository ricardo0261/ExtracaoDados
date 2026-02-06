(function($) {

	$.fn.ValidarCNPJ = function(options) {
		var cnpj = $(this).val();
		cnpj = cnpj.replace('.', '');
		cnpj = cnpj.replace('.', '');
		cnpj = cnpj.replace('/', '');
		cnpj = cnpj.replace('-', '');
		var a = new Array();
		var b = new Number;
		var c = [ 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 ];
		var cnpjVazio = 00000000000000;
		for (i = 0; i < 12; i++) {
			a[i] = cnpj.charAt(i);
			b += a[i] * c[i + 1];
		}
		if ((x = b % 11) < 2) {
			a[12] = 0
		} else {
			a[12] = 11 - x
		}
		b = 0;
		for (y = 0; y < 13; y++) {
			b += (a[y] * c[y]);
		}
		if ((x = b % 11) < 2) {
			a[13] = 0;
		} else {
			a[13] = 11 - x;
		}
		if ((cnpj.charAt(12) != a[12]) || (cnpj.charAt(13) != a[13])
				|| (cnpj == cnpjVazio)) {

			return false;
		} else {
			return true;
		}

	}
}(jQuery));