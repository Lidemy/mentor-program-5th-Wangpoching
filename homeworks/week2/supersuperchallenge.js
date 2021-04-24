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

