//import { Ticker } from '../models/bittrex-api-response-data-model';
var Keys = require('./../keys.json');
var Config = require('./../config.json');
var bittrex = require('node-bittrex-api');

bittrex.options({
  'apikey' : Keys.BittrexKey,
  'apisecret' : Keys.BittrexSecret,
});
var tickerData;


export class Bittrex {


/*
    private getTicker(ticker):void{
        bittrex.getticker( { market : 'BTC-'+ticker }, function( data, err ) {
        console.log( data.result );
        return data.result;
        });
    }
*/
    public getHistory(ticker):void{
        bittrex.getmarkethistory({ market : 'BTC-LTC' }, function( data, err ) {
          console.log( data );
        });
    }
/*
    public getQuantity(ticker):void{
        bittrex.getticker( { market : 'BTC-'+ticker }, function( data, err ) {
        console.log("Quantity"+ ((1/data.result.Last)-((1/data.result.Last)*0.2)) );
      //  return (1/data.result.Last)-((1/data.result.Last)*0.2);
        });
    }
*/



//#####################################
//####         РАБОЧИЙ МЕТОД       ####
//#####################################
  /*  public buyNow(ticker):void{
        bittrex.tradebuy({
        MarketName: 'BTC-XVG',
        OrderType: 'LIMIT',
        Quantity: 2000.00000000,
        Rate: 0.00000320,
        TimeInEffect: 'IMMEDIATE_OR_CANCEL', // supported options are 'IMMEDIATE_OR_CANCEL', 'GOOD_TIL_CANCELLED', 'FILL_OR_KILL'
        ConditionType: 'NONE', // supported options are 'NONE', 'GREATER_THAN', 'LESS_THAN'
        Target: 0, // used in conjunction with ConditionType
      }, function( data, err ) {
        console.log( err );
      });
  }*/
}
