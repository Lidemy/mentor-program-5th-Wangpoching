var input = ['124902814902890825902840917490127902791247902479027210970941724092174091274902749012740921759037590347438758957283947234273942304239403274093275902375902374092410937290371093719023729103790123','1239128192048129048129021830918209318239018239018239018249082490182490182903182390128390128903182309812093812093820938190380192381029380192381092380192380123802913810381203']
var input1 = input[0]
var input2 = input[1]
var result = []
for (var i=1;i<=input1.length+input2.length;i++){
	result.push(0)
}
var index1 = 0
for (var i=(input2.length-1);i>=0;i--){
	var index2 = 0
	for (var j=(input1.length-1);j>=0;j--){
		res = (Number(input2[i])*Number(input1[j]))%10
		quo = Math.floor( ((Number(input2[i])*Number(input1[j]))/10) )
		result[index1+index2] += res
		// 處理進位
		if (result[index1+index2]>=10){
			x = index1+index2
			while (result[x] >= 10){
				res_ = result[x]%10
				quo_ = Math.floor(result[x]/10)
				result[x] = res_
				result[x+1] += quo_
				x += 1
			}
		}
		result[index1+index2+1] += quo
		// 處理進位
		if (result[index1+index2+1]>=10){
			x = index1+index2+1
			while (result[x] >= 10){
				res_ = result[x]%10
				quo_ = Math.floor(result[x]/10)
				result[x] = res_
				result[x+1] += quo_
				x += 1
			}
		}
		index2 +=1
	}
	index1 += 1
}
//反轉陣列串接字串，把開頭是 0 的位數刪除掉
for (var i=result.length-1;i>=0;i--){
	if (result[i] === 0){
		result.pop()
	}
	if (result[i] !== 0){
		break
	}
}
var ans = []
for (var i=result.length-1;i>=0;i--){
	ans.push(result[i])
}
answer = ans.join('')

console.log(answer) 
/*15477059921234121826428557151741001505503078190287823812775974784617890980
41664961276263706619800328087900049616495708101329933970937581714628336484
30573931982820077357934138465500725654122355115431528560108824273624205622
43845728335428665892452211230138950874256724845100897209088600677816836907
8193075209592426056314957124024831139178307483030144703850736257969*/

/*
function numberToArr(n) {
	var remainder = []
	var quotient = n
	while (quotient > 0) {
		quotient = Math.floor(n / 10)
		remainder.push(n % 10)
		n = quotient
	}
	return remainder
}

function allMultiplyOne(a, b) {
	var carry = 0
	var ans = []
	for (var i = 0; i < a.length; i++) {
		var value = b * a[i] + carry
		ans.push(value % 10)
		carry = Math.floor(value / 10)
	}
	if (carry) {
		ans.push(...numberToArr(carry))
	}
	return ans
}

function sum(arr) {
	var ans = []
	var carry = 0
	while (arr[arr.length - 1].length) {
		var value = 0
		for (var i = 0; i < arr.length; i++) {
			var newValue = arr[i].shift()
			if (!isNaN(newValue)) {
				value += newValue
			}
		}
		value += carry
		//console.log(`value: ${value}`)
		ans.push(value % 10)
		carry = Math.floor(value / 10)
		//console.log(`carry: ${carry}`)		
	}
	if (carry) {
		ans.push(...numberToArr(carry))
	}
	return ans.reverse().join('')
}

function multiply(a, b) {
	var aArray = a.split('').reverse().map(ele => Number(ele))
	var bArray = b.split('').reverse().map(ele => Number(ele))
	var sumation = []
	for (var i = 0; i < bArray.length; i++) {
		var j = i
		var value = allMultiplyOne(aArray, bArray[i])
		while (j > 0) {
			value.splice(0, 0, 0)
			j--
		}
		sumation.push(value)
	}
	return sum(sumation)
}

console.log(numberToArr(123))
console.log(numberToArr(5))
console.log(allMultiplyOne(['4', '2', '3'], 6))
console.log(allMultiplyOne(['9', '6', '6'], 8))
console.log(multiply('12345', '456878') == (12345 * 456878))
console.log(multiply('84035', '456878849') == (84035 * 456878849))
console.log(multiply('12345937', '456878') == (12345937 * 456878))
console.log(multiply(
  '12345678901234567890123456789012345678901234567890',
  '98765432109876543210987654321098765432109876543210'
) == '1219326311370217952261850327338667885945115073915611949397448712086533622923332237463801111263526900')
*/
