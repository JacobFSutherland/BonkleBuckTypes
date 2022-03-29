import MainController from "./MainController";
import AssetController from "./AssetController";
import { Client, Intents, TextChannel, Message } from 'discord.js';
import Token from "../../BlockData/FungibleAssets/Token";
import Stock from "../../BlockData/FungibleAssets/Stock";
import Option from "../../BlockData/FungibleAssets/Option";
import NFT from "../../BlockData/NonFungibleAssets/NFT";
import Quote from "../../BlockData/NonFungibleAssets/Quotes";
import { Transaction } from "../../BlockData";
import env from '../../../env';
import EconomyParticipant from "../../BlockData/EconomyParticipant";
import FungibleAsset from "../../BlockData/FungibleAssets/FungibleAsset";
import NonFungibleAsset from "../../BlockData/NonFungibleAssets/NonFungibleAsset";
import BlockController from "./BlockController";
import Block from "../../BlockData/Block/Block";
import { DiscordCaptcha } from "../../BlockData/Captcha/DiscordCaptcha";

jest.setTimeout(80000);

const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms))

let assetControler = new AssetController();
let testBot: Client = new Client({intents:[Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_VOICE_STATES]});
let testChainChannel: TextChannel; 
let testGuessChannel: TextChannel;
EconomyParticipant.GiveAdminBal('Sender');




        
describe('Test Main Controller', () => {

    describe('Test Block Syncer', () => {

        let t1: FungibleAsset, t2: FungibleAsset,t3: FungibleAsset,s1: FungibleAsset,s2: FungibleAsset,s3: FungibleAsset,o1: FungibleAsset,o2: FungibleAsset,o3: FungibleAsset
        let nft1: NonFungibleAsset,nft2: NonFungibleAsset,nft3: NonFungibleAsset,q1: NonFungibleAsset,q2: NonFungibleAsset,q3: NonFungibleAsset;
        let testMainController: MainController;


        beforeAll( async () => {
            await testBot.login(env.testnetToken)
            testGuessChannel = await testBot.channels.fetch(env.testGuess) as TextChannel;
            testChainChannel = await testBot.channels.fetch(env.testChain) as TextChannel;
        })

        beforeEach(() => {

            testMainController = new MainController(testBot, testChainChannel, testGuessChannel, 'Test Token');
            testMainController.setAssetController(assetControler);

            t1 = new Token("Tester Token", 10.95);
            t2 = new Token("Super Tester Token", 5.12);
            t3 = new Token("Super Mega Tester Token", 9.32);
    
            s1 = new Stock("$up", 15);
            s2 = new Stock("$down", 20);
            s3 = new Stock("$Sideways", 40);
    
            o1 = new Option('$up', 20, 'Calls', 5.50);
            o2 = new Option('$down', 42, 'Puts', 4.50);
            o3 = new Option('$Sideways', 42, 'Puts', 4.50);
    
            nft1 = new NFT();
            nft2 = new NFT();
            nft3 = new NFT();
    
            q1 = new Quote();
            q2 = new Quote();
            q3 = new Quote();


        })

        test('multiple FungibleAsset as transactions', () => {
            let transactions: Transaction[] = [];
            let fung = [t1, t2, t3, s1, s2, s3, o1, o2, o3]
            fung = fung.sort(() => Math.random() - 0.5);
            fung.forEach(asset => {
                transactions.push(new Transaction('Reciever', asset, 'Sender'));
            })

            testMainController.syncTransactions(transactions);

            expect(assetControler.userAssets['Reciever'].fungibleAssets[t1.name].amount).toEqual(t1.amount)
            expect(assetControler.userAssets['Reciever'].fungibleAssets[t2.name].amount).toEqual(t2.amount)
            expect(assetControler.userAssets['Reciever'].fungibleAssets[t3.name].amount).toEqual(t3.amount)

            expect(assetControler.userAssets['Reciever'].fungibleAssets[s1.name].amount).toEqual(s1.amount)
            expect(assetControler.userAssets['Reciever'].fungibleAssets[s2.name].amount).toEqual(s2.amount)
            expect(assetControler.userAssets['Reciever'].fungibleAssets[s3.name].amount).toEqual(s3.amount)

            expect(assetControler.userAssets['Reciever'].fungibleAssets[o1.name].amount).toEqual(o1.amount)
            expect(assetControler.userAssets['Reciever'].fungibleAssets[o2.name].amount).toEqual(o2.amount)
            expect(assetControler.userAssets['Reciever'].fungibleAssets[o3.name].amount).toEqual(o3.amount)

        })

        test('multiple NonFungible Asset as transactions', () => {
            let transactions: Transaction[] = [];
            let nonFung = [nft1, nft2, nft3, q1, q2, q3];
            nonFung = nonFung.sort(() => Math.random() - 0.5);
            nonFung.forEach(asset => {
                transactions.push(new Transaction('Reciever 1', asset, 'Sender'));
            })
            testMainController.syncTransactions(transactions);

            expect(Object.keys(assetControler.userAssets['Reciever 1'].nonFungibleAssets)).toContain(nft1.id)
            expect(Object.keys(assetControler.userAssets['Reciever 1'].nonFungibleAssets)).toContain(nft2.id)
            expect(Object.keys(assetControler.userAssets['Reciever 1'].nonFungibleAssets)).toContain(nft3.id)

            expect(Object.keys(assetControler.userAssets['Reciever 1'].nonFungibleAssets)).toContain(q1.id)
            expect(Object.keys(assetControler.userAssets['Reciever 1'].nonFungibleAssets)).toContain(q2.id)
            expect(Object.keys(assetControler.userAssets['Reciever 1'].nonFungibleAssets)).toContain(q3.id)
        })

        test('Combination of multiple fungible, nonfungible assets and services', () => {
            let transactions: Transaction[] = [];
            let assets = [t1, t2, t3, s1, s2, s3, o1, o2, o3, nft1, nft2, nft3, q1, q2, q3]
            assets = assets.sort(() => Math.random() - 0.5);
            assets.forEach(asset => {
                transactions.push(new Transaction('Reciever 2', asset, 'Sender'));
            })
            testMainController.syncTransactions(transactions);

            expect(Object.keys(assetControler.userAssets['Reciever 2'].nonFungibleAssets)).toContain(nft1.id)
            expect(Object.keys(assetControler.userAssets['Reciever 2'].nonFungibleAssets)).toContain(nft2.id)
            expect(Object.keys(assetControler.userAssets['Reciever 2'].nonFungibleAssets)).toContain(nft3.id)

            expect(Object.keys(assetControler.userAssets['Reciever 2'].nonFungibleAssets)).toContain(q1.id)
            expect(Object.keys(assetControler.userAssets['Reciever 2'].nonFungibleAssets)).toContain(q2.id)
            expect(Object.keys(assetControler.userAssets['Reciever 2'].nonFungibleAssets)).toContain(q3.id)

            expect(assetControler.userAssets['Reciever 2'].fungibleAssets[t1.name].amount).toEqual(t1.amount)
            expect(assetControler.userAssets['Reciever 2'].fungibleAssets[t2.name].amount).toEqual(t2.amount)
            expect(assetControler.userAssets['Reciever 2'].fungibleAssets[t3.name].amount).toEqual(t3.amount)

            expect(assetControler.userAssets['Reciever 2'].fungibleAssets[s1.name].amount).toEqual(s1.amount)
            expect(assetControler.userAssets['Reciever 2'].fungibleAssets[s2.name].amount).toEqual(s2.amount)
            expect(assetControler.userAssets['Reciever 2'].fungibleAssets[s3.name].amount).toEqual(s3.amount)

            expect(assetControler.userAssets['Reciever 2'].fungibleAssets[o1.name].amount).toEqual(o1.amount)
            expect(assetControler.userAssets['Reciever 2'].fungibleAssets[o2.name].amount).toEqual(o2.amount)
            expect(assetControler.userAssets['Reciever 2'].fungibleAssets[o3.name].amount).toEqual(o3.amount)

        })

        test('Posting a captcha', async () => {

            let captcha = new DiscordCaptcha();
            let block = new Block(captcha)
            let blockController = new BlockController('Test Token', block);
            testMainController.setBlockController(blockController);

            testMainController.initBotWatcherCommands();
            let assets = [t1, t2, t3, s1, s2, s3, o1, o2, o3, nft1, nft2, nft3, q1, q2, q3]
            assets = assets.sort(() => Math.random() - 0.5);
            assets.forEach(asset => {
                testMainController.addTestTransaction(new Transaction('test reciever', asset, 'Sender'));
            })
            testMainController.forceBlockPost();

        })

    }) 
})