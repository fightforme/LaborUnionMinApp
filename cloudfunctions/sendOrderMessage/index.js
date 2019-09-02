const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  console.log(event.formId)
  try {
    const result = await cloud.openapi.templateMessage.send({
      touser: cloud.getWXContext().OPENID,
      page: 'pages/order/order',
      data: {
        keyword1: {
          value: event.goodsInfo
        },
        keyword2: {
          value: event.userName
        },
        keyword3: {
          value: event.orderDate
        },
        keyword4: {
          value: event.name
        },
        keyword5: {
          value: event.telNumber
        }, 
        keyword7: {
          value: event.addressInfo
        },
        keyword6: { 
          value: "长银五八工会"
        }
      },
      templateId: 'RZUJJh07A616XM96VpzcrnPTmMAhFG9LcM7z8mvCfwM',
      formId: event.formId,
      emphasisKeyword: "keyword1.DATA"
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
