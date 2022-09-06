const solve = async (arguments) => {
  const delay = async (ms) => {
    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(), ms)
    })
  }

  const solveCaptchas = async () => {
    const reduceObjectToArray = (obj) => Object.keys(obj).reduce(function (r, k) {
          return r.concat(k, obj[k]);
    }, []);

    const client = ___grecaptcha_cfg.clients[0]
    let result = [];
    result = reduceObjectToArray(client).filter(c => Object.prototype.toString.call(c) === "[object Object]")

    result = result.flatMap(r => {
      return reduceObjectToArray(r)
    })

    result = result.filter(c => Object.prototype.toString.call(c) === "[object Object]")

    const reqObj = result.find( r => r.callback)
    console.log(reqObj.callback)
    console.log(reqObj.sitekey)
    reqObj.callback("${response}")
  }
   
  const response = arguments

  await solveCaptchas()
}
