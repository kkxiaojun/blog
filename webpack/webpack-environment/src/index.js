const base = process.env.BASE_API
console.log('base:', process.env)
function addValue(params) {
  this.params = params
  console.log(params)
}
