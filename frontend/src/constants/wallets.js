// Import all wallet/bank logos
import amex       from '../assets/wallets/bank/amex.png'
import aub        from '../assets/wallets/bank/AUB.jpg'
import bdo        from '../assets/wallets/bank/BDO.png'
import bpi        from '../assets/wallets/bank/BPI.jpg'
import china      from '../assets/wallets/bank/China.png'
import cimb       from '../assets/wallets/bank/CIMB.png'
import citi       from '../assets/wallets/bank/CITI.png'
import coins      from '../assets/wallets/bank/coins.jpg'
import eastwest   from '../assets/wallets/bank/eastwest.png'
import gcash      from '../assets/wallets/bank/gcash.jpg'
import gotyme     from '../assets/wallets/bank/gotyme.jpg'
import grabpay    from '../assets/wallets/bank/grabpay.jpg'
import jpmorgan   from '../assets/wallets/bank/JPmorgan.png'
import landbank   from '../assets/wallets/bank/landbank.png'
import maya       from '../assets/wallets/bank/maya.png'
import maybank    from '../assets/wallets/bank/maybank.png'
import metrobank  from '../assets/wallets/bank/metrobank.jpg'
import paypal     from '../assets/wallets/bank/paypal.jpg'
import pnb        from '../assets/wallets/bank/PNB.png'
import rcbc       from '../assets/wallets/bank/RCBC.jpg'
import securitybank from '../assets/wallets/bank/Securitybank.jpg'
import spay       from '../assets/wallets/bank/spay.png'
import tonik      from '../assets/wallets/bank/tonik.png'
import ubd        from '../assets/wallets/bank/UBD.jpg'
import union      from '../assets/wallets/bank/Union.jpg'

export const WALLET_OPTIONS = [
  { id: 'cash',        name: 'Cash',            logo: null,        type: 'Cash' },
  { id: 'gcash',        name: 'GCash',           logo: gcash,       type: 'E-Wallet' },
  { id: 'maya',         name: 'Maya',             logo: maya,        type: 'E-Wallet' },
  { id: 'grabpay',      name: 'GrabPay',          logo: grabpay,     type: 'E-Wallet' },
  { id: 'spay',         name: 'ShopeePay',        logo: spay,        type: 'E-Wallet' },
  { id: 'coins',        name: 'Coins.ph',         logo: coins,       type: 'E-Wallet' },
  { id: 'paypal',       name: 'PayPal',           logo: paypal,      type: 'E-Wallet' },
  { id: 'gotyme',       name: 'GoTyme Bank',      logo: gotyme,      type: 'E-Wallet' },
  { id: 'tonik',        name: 'Tonik',            logo: tonik,       type: 'E-Wallet' },
  { id: 'bdo',          name: 'BDO',              logo: bdo,         type: 'Bank' },
  { id: 'bpi',          name: 'BPI',              logo: bpi,         type: 'Bank' },
  { id: 'metrobank',    name: 'Metrobank',        logo: metrobank,   type: 'Bank' },
  { id: 'landbank',     name: 'Landbank',         logo: landbank,    type: 'Bank' },
  { id: 'pnb',          name: 'PNB',              logo: pnb,         type: 'Bank' },
  { id: 'rcbc',         name: 'RCBC',             logo: rcbc,        type: 'Bank' },
  { id: 'union',        name: 'UnionBank',        logo: union,       type: 'Bank' },
  { id: 'securitybank', name: 'Security Bank',    logo: securitybank,type: 'Bank' },
  { id: 'eastwest',     name: 'EastWest Bank',    logo: eastwest,    type: 'Bank' },
  { id: 'cimb',         name: 'CIMB Bank',        logo: cimb,        type: 'Bank' },
  { id: 'maybank',      name: 'Maybank',          logo: maybank,     type: 'Bank' },
  { id: 'aub',          name: 'AUB',              logo: aub,         type: 'Bank' },
  { id: 'china',        name: 'China Bank',       logo: china,       type: 'Bank' },
  { id: 'ubd',          name: 'UBP (UnionBank Digital)', logo: ubd,  type: 'Bank' },
  { id: 'citi',         name: 'Citibank',         logo: citi,        type: 'Bank' },
  { id: 'jpmorgan',     name: 'JP Morgan',        logo: jpmorgan,    type: 'Bank' },
  { id: 'amex',         name: 'American Express', logo: amex,        type: 'Credit Card' },
]
