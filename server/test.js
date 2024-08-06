let loop = 100
let previous = 0
let next = 1
let temp = 0
let arr = []
let stri = ''
function fibonacci(loop) {
    temp = next
    next = next + previous
    previous = temp
    loop = loop - 1
    arr.push(next)
    if(loop >= 0) {
        fibonacci(loop)
    } else return
}
fibonacci(loop)
for(let i = 1; i <= arr.length; i ++) {
    stri += i.toString() + ':' + arr[i - 1].toString() + ' | '
}
console.log(stri)