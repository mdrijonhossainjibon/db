const mongoose =require('mongoose') 
const { orderSchema , marketSchema , CurrencySchema ,assetSchema,userSchema, BlockchainSchema ,CounterModelSchema,  google2FASchema, APISchema } = require('./mongoose')
const CurrencyModel = mongoose.model('Currencies',  CurrencySchema);
const BlockchainModel = mongoose.model('Blockchain', BlockchainSchema);
const MarketModel = mongoose.model('Market', marketSchema);
const UserBalanceModel = mongoose.model('Asset', assetSchema);
const UserModel = mongoose.model('User', userSchema);
const APIModel = mongoose.model('APIKEYS', APISchema);
const Google2FAModel =  mongoose.model('Google2FA', google2FASchema);
const CounterModel = mongoose.model('Counter', CounterModelSchema);
//const Verification = mongoose.model<IVerification>('Verification', VerificationSchema);
const OrderModel =  mongoose.model('OrderModel', orderSchema);
///const TradeModel = mongoose.model ('Trade', tradeSchema);
///const OHLCModel =  mongoose.model('OHLC', OHLCSchema);
////export const SubscriptionModel = mongoose.model('Subscription', subscriptionSchema);
 const NOSQL = { OrderModel , MarketModel ,APIModel , UserBalanceModel,UserModel, CurrencyModel , CounterModel, BlockchainModel , Google2FAModel }

module.exports = NOSQL 