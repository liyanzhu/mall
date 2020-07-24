export default {
  addCart(context, payload){
    let oldProduct = null
    for (let item of context.state.cartList) {
      if(item.iid === payload.iid){
        oldProduct = item
      }
    }

    if(oldProduct){
      // oldProduct.count += 1
      context.commit('addCounter', oldProduct)
    }else {
      payload.count = 1
      //state.cartList.push(payload)
      context.commit('addToCart', payload)
    }

  }
}
