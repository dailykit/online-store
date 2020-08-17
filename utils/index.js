import { useToast } from 'react-native-styled-toast'

export function uuid() {
   let d = new Date().getTime()

   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)

      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
   })
}

export const priceSort = (item1, item2) => {
   if (item1.price[0].value > item2.price[0].value) {
      return 1
   } else {
      return -1
   }
}

export const discountedPrice = ({ value, discount }) => {
   return parseFloat((value - value * (discount / 100)).toFixed(2))
}

export const useStoreToast = () => {
   const { toast } = useToast()

   const toastr = (type, message) => {
      if (type === 'success') {
         toast({
            message,
            bg: '#48BB78',
            borderColor: '#48BB78',
            color: '#fff',
            closeIconColor: '#fff',
            iconColor: '#fff',
         })
      } else if (type === 'error') {
         toast({
            message,
            bg: '#E53E3E',
            borderColor: '#E53E3E',
            color: '#fff',
            closeIconColor: '#fff',
            iconColor: '#fff',
         })
      } else {
         toast({
            message,
            bg: '#ED8936',
            borderColor: '#ED8936',
            color: '#fff',
            closeIconColor: '#fff',
            iconColor: '#fff',
         })
      }
   }

   return { toastr }
}

export const mergeCarts = carts => {
   const masterCart = carts.shift()
   const ids = []
   for (let cart of carts) {
      masterCart.cartInfo.total += cart.cartInfo.total
      masterCart.cartInfo.products = [
         ...masterCart.cartInfo.products,
         ...cart.cartInfo.products,
      ]
      ids.push(cart.id)
   }
   return [masterCart, ids]
}
