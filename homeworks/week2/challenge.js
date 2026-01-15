//輸入值 = 排序好的數列以及待找的數字
//輸出值 = 如果沒有回傳 -1，否則回傳 index
function search(arr,n) {
	// 排序陣列
	arr = sort(arr)
	// 二分搜尋法
	var start = 0
	var end = arr.length-1
	var half = Math.floor((start+end)/2) // 二分點的 index
	if (n === arr[0]) return 0
	if (n === arr[arr.length - 1]) return arr.length - 1
	while (true){
		if (arr[half] === n){ //如果二分點的數值就是目標就結束搜尋
			return half
			break
		} else if (half === end-1){ // 如果二分點緊鄰結束點，而且二分點的數值不是目標，代表找不到
			return -1
			break
		} else {
			if (n > arr[half]){ // 如果二分點的數值小於目標就取右半邊
				start = half
				half = Math.floor((start+end)/2)
			} else { // 如果二分點的數值大於目標就取左半邊
				end = half
				half = Math.floor((start+end)/2)
			}
		}
	}
}

// 插入排序法
function sort(arr) {
	var new_arr = [arr[0]]
	for (var i=1;i<arr.length;i++){
		for (var j=0;j<new_arr.length;j++){
			if (new_arr[j] > arr[i]){
				new_arr.splice(j, 0, arr[i])
				break
			}  else if (j===(new_arr.length-1)){
				new_arr.push(arr[i])
				break
			}
		
		}

	}
	return new_arr
}
console.log(search([1, 3, 10, 14, 39], 14)) //3
console.log(search([1, 3, 10, 14, 39], 299)) //-1

/*
function resetSearchIndex(start, end) {
	return Math.ceil((end - start)/2) + start
}

function search(arr, target) {
	var startIndex = 0
	var endIndex = arr.length - 1
	var index = resetSearchIndex(startIndex, endIndex)
	while(startIndex <= endIndex) {
		// Jackpot!!!!!!
		if (arr[index] === target) {
			return index
		} else {
			// 找不到, 要重新切
			if (arr[index] > target) {
				// target 比 index 小: 取前半部, 重新設定 end index
				endIndex = index - 1
				index = resetSearchIndex(startIndex, endIndex)
			} else {
				// target 比 index 大: 取後半部, 重新設定 startIndex
				startIndex = index + 1
				index = resetSearchIndex(startIndex, endIndex)
			}
		}
	}
	return -1
}
 */
