//輸入值：兩個數字
//輸出值：相加的結果
function add(a,b){
	sum = a ^ b // XOR 取得相加後的當前位數
	c = a & b // AND 取得是否要進位
	c <<= 1 // 因為是要拿來進位的所以要左移一個 bit
	while (c !== 0){
		var new_sum = sum ^ c // XOR 取得當前位數加上進位的新的當前位數
		c = sum & c // AND 取得新的是否進位
		c <<= 1 // 因為是要拿來進位的所以要左移一個 bit
		sum = new_sum // 現在才可以把 SUM 重新賦值
	}
	return sum // 當不用再進位的時候就輸出當前位數
}
console.log(add(127,12)) //139