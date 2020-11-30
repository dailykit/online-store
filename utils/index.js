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
            duration: 1500,
         })
      } else if (type === 'error') {
         toast({
            message,
            bg: '#E53E3E',
            borderColor: '#E53E3E',
            color: '#fff',
            closeIconColor: '#fff',
            iconColor: '#fff',
            duration: 1500,
         })
      } else {
         toast({
            message,
            bg: '#ED8936',
            borderColor: '#ED8936',
            color: '#fff',
            closeIconColor: '#fff',
            iconColor: '#fff',
            duration: 1500,
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

const browserVersion = (userAgent, regex) => {
   return userAgent.match(regex) ? userAgent.match(regex)[2] : null
}

const getBrowser = () => {
   const userAgent = navigator.userAgent
   let browser = 'unkown'
   // Detect browser name
   browser = /ucbrowser/i.test(userAgent) ? 'UCBrowser' : browser
   browser = /edg/i.test(userAgent) ? 'Edge' : browser
   browser = /googlebot/i.test(userAgent) ? 'GoogleBot' : browser
   browser = /chromium/i.test(userAgent) ? 'Chromium' : browser
   browser =
      /firefox|fxios/i.test(userAgent) && !/seamonkey/i.test(userAgent)
         ? 'Firefox'
         : browser
   browser =
      /; msie|trident/i.test(userAgent) && !/ucbrowser/i.test(userAgent)
         ? 'IE'
         : browser
   browser =
      /chrome|crios/i.test(userAgent) &&
      !/opr|opera|chromium|edg|ucbrowser|googlebot/i.test(userAgent)
         ? 'Chrome'
         : browser
   browser =
      /safari/i.test(userAgent) &&
      !/chromium|edg|ucbrowser|chrome|crios|opr|opera|fxios|firefox/i.test(
         userAgent
      )
         ? 'Safari'
         : browser
   browser = /opr|opera/i.test(userAgent) ? 'Opera' : browser
   // detect browser version
   switch (browser) {
      case 'UCBrowser':
         return `${browser}/${browserVersion(
            userAgent,
            /(ucbrowser)\/([\d\.]+)/i
         )}`
      case 'Edge':
         return `${browser}/${browserVersion(
            userAgent,
            /(edge|edga|edgios|edg)\/([\d\.]+)/i
         )}`
      case 'GoogleBot':
         return `${browser}/${browserVersion(
            userAgent,
            /(googlebot)\/([\d\.]+)/i
         )}`
      case 'Chromium':
         return `${browser}/${browserVersion(
            userAgent,
            /(chromium)\/([\d\.]+)/i
         )}`
      case 'Firefox':
         return `${browser}/${browserVersion(
            userAgent,
            /(firefox|fxios)\/([\d\.]+)/i
         )}`
      case 'Chrome':
         return `${browser}/${browserVersion(
            userAgent,
            /(chrome|crios)\/([\d\.]+)/i
         )}`
      case 'Safari':
         return `${browser}/${browserVersion(
            userAgent,
            /(safari)\/([\d\.]+)/i
         )}`
      case 'Opera':
         return `${browser}/${browserVersion(
            userAgent,
            /(opera|opr)\/([\d\.]+)/i
         )}`
      case 'IE':
         const version = browserVersion(userAgent, /(trident)\/([\d\.]+)/i)
         // IE version is mapped using trident version
         // IE/8.0 = Trident/4.0, IE/9.0 = Trident/5.0
         return version
            ? `${browser}/${parseFloat(version) + 4.0}`
            : `${browser}/7.0`
      default:
         return `unknown/0.0.0.0`
   }
}

export const isKeycloakSupported = () => {
   const [browser, version] = getBrowser().split('/')
   console.log({ browser, version })
   const v = +version.split('.')[0]
   const { userAgent } = window.navigator
   if (userAgent.includes('Mac') || userAgent.includes('Apple')) {
      return false
   }
   if (browser === 'Chrome' && v >= 66) {
      return true
   } else if (browser === 'Firefox' && v >= 60) {
      return true
   } else {
      return false
   }
}
