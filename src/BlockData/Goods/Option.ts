import assert from "assert";
import Medium from "../Medium";

export default class Option extends Medium {
    ticker: string;
    strike: number;
    amount: number;
    option: 'Calls' | 'Puts';
    expiration: number;
    /**
     * 
     * @param t The ticker of the stock. The ticker must include the '$'
     * @param a Number of Shares of stock being transfered. Must be a positive amount
     * @param o The type of option: 'Calls' or 'Puts'
     * @param s The strike price of the option
     */
    constructor(t: string, a: number, o: 'Calls' | 'Puts', s: number){
        assert(t.charAt(0) == '$', 'Your ticker requires a ticker symbol ($)'); // Check to make sure t is a proper ticker
        assert(a > 0, 'The amount of shares must be a positive value'); // Check to make sure a is a positive number
        assert(a % 1 === 0, 'The amount of shares must be a whole number value'); // Check to make sure a is a whole number
        assert(s > 0, 'The price of the option you are trying to purchase is 0, or the stock does not exist');
        super('Stock');
        this.ticker = t;
        this.option = o;
        this.amount = a;
        this.strike = s;
        this.expiration = -1;
    }
}