function join(arr, concatStr) {
	ans = ''
	for (var i=0;i<(arr.length-1);i++){
		ans += arr[i]+concatStr
	}
	ans += arr[arr.length-1]
	return ans
}


function repeat(str, times) {
	ans = ''
	for (var i=1;i<=times;i++){
		ans += str
	}
	return ans
}

console.log(join(['a'], '!'));
console.log(repeat('a', 5));
