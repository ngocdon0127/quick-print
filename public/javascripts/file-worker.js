onmessage = function (msg) {
	if (msg.data.type == 'upload'){
		var files = msg.data.files;
		var result = [];

		for (var i = 0; i < files.length; i++) {
			file = files[i];
			var reader = new FileReaderSync();
			var dataURL = reader.readAsDataURL(file);
			result.push({
				filename: file.name,
				dataURL: dataURL,
				size: file.size
			})
		}
		postMessage({
			files: result
		});
	}
	else if (msg.data.type = 'decrypt'){
		var key = msg.data.key;
		var file = msg.data.file;
		var reader = new FileReaderSync();
		var data = reader.readAsText(file);
		var ciphers = data.split('?')[1];
		var filenames = data.split('?')[0];
		var arrCipher = ciphers.split(STR_SEPERATOR);
		var dataURL = [];
		for (var i = 0; i < arrCipher.length; i++) {
			cipher = arrCipher[i];
			var decrypted = CryptoJS.AES.decrypt(cipher, key).toString(CryptoJS.enc.Utf8);
			dataURL.push(decrypted);
		}
		postMessage({
			dataURL: dataURL,
			filenames: filenames
		});
	}
}