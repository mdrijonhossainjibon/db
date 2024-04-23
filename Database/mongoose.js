const { Schema } =require('mongoose') 
  const CurrencySchema = new Schema({
    code: { type: String  },
    name: { type: String },
    symbol: { type: String },
    type: { type: String },
    blockchain_key: [{ key: { type: String } }],
    position: { type: Number },
    precision: { type: Number },
    subunits: { type: Number },
    min_collection_amount: { type: Number },
    min_deposit_amount: { type: Number },
    min_withdraw_amount: { type: Number },
    withdraw_fee: { type: Number },
    withdraw_limit_24h: { type: Number },
    withdraw_limit_72h: { type: Number },
    visible: { type: String },
    deposit_enabled: { type: String },
    deposit_fee: { type: Number },
    withdrawal_enabled: { type: String },
    details: { type: String },
    options: [{ key: { type: String }, value: { type: String } }],
    icon_url: { type: String, default: null },
    timestamp: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  });


const BlockchainSchema = new Schema ({
    key: { type: String, unique: true },
    name: String,
    client: String,
    height: Number,
    explorer_address: String,
    explorer_transaction: String,
    min_confirmations: String,
    server: String,
    Websoket: { type: String  },
    chainid: { type: String  },
    timestamp: { type: Date, default: Date.now },
    enabled: Boolean,
  });  


  const marketSchema = new Schema ({
    id: {
      type: String,
      
    },
    name: {
      type: String,
      
    },
    base_currency: {
      type: String,
      
    },
    quote_currency: {
      type: String,
      
    },
    amount_precision: {
      type: Number,
      
    },
    price_precision: {
      type: Number,
      
    },
    max_price: {
      type: Number,
      
    },
    min_price: {
      type: Number,
      
    },
    min_amount: {
      type: Number,
      
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  });


  
 const assetSchema = new Schema ({
    uid: {
      type: String,
      
    },
    
    balance: {
      type: Number,
      default : 0.00
    },
    currency: {
      type: String,
    },
    type: {
      type: String,
      enum: ['fiat', 'coin'],
      default : 'coin'
      
    },
    locked: {
      type: Number,
      default: 0.00,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  });
  
  
 const userSchema = new Schema ({
    email: { type: String  },
    password: { type: String  },
    level: { type: Number  ,default : 0},
    role: {
      type: String,
      enum: ['admin', 'superadmin', 'accountant', 'technical', 'support', 'user'], default : 'user'
    },
    status: { type: String, enum: ['active', 'suspend', 'pending', 'inactive'],default : 'pending'},
    uid: { type: String  },
    referal_uid: { type: String, default: null },
    two_factor_auth: { type: Boolean, default: false }, // Updated to lowercase
    kyc_status: { type: String, enum: ['pending', 'verified', 'rejected', 'hold', 'review' , 'notsubmit'] }, // Added kyc_status field
    language : { type : String, default : 'en'},
    created_at: {  type: Date , default : Date.now() },
    updated_at: { type: Date , default : Date.now() },
    
});

  const APISchema = new Schema ({
  uid : {type: String, required: true},
  apiKey: { type: String, required: true },
  apiSecret: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  timestamp : { type : Date , default : Date.now() },
  
});

 const google2FASchema = new Schema ({
  uid: { type: String  },
  secret: { type: String  },
  timestamp: { type: Date  },
});



 const CounterModelSchema = new Schema ({
  value: {
    type: Number,
    
  },
});

 const VerificationSchema  = new Schema ({
  userId: { type:String   },
  token: { type: String , unique: true },
  Otp : { type : Number ,  default : null},
  createdAt: { type: Date, default: Date.now, expires: '24h' } // Token expires after 24 hours
});


 const orderSchema = new Schema({
  market_id: { type: String ,required : true },
  bid: { type: String ,required : true},
  ask: { type: String ,required : true },
  ord_type: { type: String ,enum : ['limit' , 'market'] ,default : 'limit'},
  side : { type: String ,enum : [ 'buy', 'sell'],default : 'buy'},
  volume: { type: Number  ,default : 0.00},
  origin_volume: { type: Number  ,default : 0.00},
  executed_volume :{ type: Number  ,default : 0.00},
  price: { type: Number  ,default : 0.00},
  state: { type: String  , enum : ['pending' , 'wait' , 'filled' ,'cancelled'],default : 'pending'},
  member_id: { type: String ,required : true },
  locked: { type: Number  ,default : 0.00 },
  remaining_volume : { type : Number ,default : 0.00},
  origin_locked: { type: Number  ,default : 0.00},
  funds_received: { type: Number  ,default : 0.00},
  trades_count: { type: Number  ,default : 0},
  created_at: { type: Date  ,default : Date.now()},
  updated_at: { type: Date  , default : Date.now()},
});
 

 
 

module.exports = { orderSchema , userSchema,assetSchema, APISchema , VerificationSchema , marketSchema , CurrencySchema ,CounterModelSchema,  BlockchainSchema  , google2FASchema}




