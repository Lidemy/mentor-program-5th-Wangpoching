function capitalize(str) {
	var ans = ''
	if (str.charCodeAt(0)>=97 && str.charCodeAt(0)<=122){
		ans += String.fromCharCode(str.charCodeAt(0)-32)
	} else {
		ans += str[0]
	}
	for (var i=1;i<str.length;i++){
		ans += str[i]
	}
	return ans	
}

console.log(capitalize('hello'));
