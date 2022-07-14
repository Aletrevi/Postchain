import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { combineLatest, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import SHA3 from 'sha3';
import { PaginationQueryDto } from 'src/dto/paginationQuery.dto';
import Web3 from 'web3';
import { Block } from './schemas/block.schema';
import * as CONTRACT from "./contracts/postchain.json"


/**
 * Block service
 *
 * @export
 * @class BlockService
 */
@Injectable()
export class BlocksService {
  private readonly myContract = require('../blocks/contracts/postchain.json');
  
  private readonly wallet_privateKey: string;
  private readonly wallet_address: string;
  private readonly infuraUrl: string;
  private readonly etherscanUrl: string;
  private readonly web3: Web3;
  private contract;

  /**
   * Creates an instance of BlockService.
   * @param {Model<Block>} blockModel
   * @memberof BlocksService
   */
  constructor(
    @InjectModel(Block.name) private readonly blockModel: Model<Block>,
    private readonly configService: ConfigService,
  ) {

    // Getting params from config service
    this.wallet_privateKey = this.configService.get('WALLET_PRIVATE_KEY');
    this.wallet_address = this.configService.get('WALLET_ADDRESS');
    this.infuraUrl = `${this.configService.get('INFURA_URL')}/${this.configService.get('INFURA_TOKEN')}`;
    this.etherscanUrl = this.configService.get('ETHERSCAN_URL');

    // Web3 instantiation
    const provider = new Web3.providers.HttpProvider(this.infuraUrl);
    this.web3 = new Web3(provider);
  
    // Web3 private key configuration
    this.web3.eth.accounts.wallet.add(this.wallet_privateKey);
    
    // Get network id and instantiate contract object
    from(this.web3.eth.net.getId()).pipe(
      tap((networkId) => {
      
        this.contract = new this.web3.eth.Contract(
          this.myContract.abi,
          this.myContract.networks[networkId].address,
        );
      }),
    ).subscribe();
  }

  remove(blockBody: any): Observable<any> {
    
    Logger.debug(`Removing block with body ${JSON.stringify(blockBody)}`);

    // Generating sha3 hash of body
    const bodyHash = new SHA3().update(JSON.stringify(blockBody)).digest('hex');

    // Saving to blockchain
    const blockchainSave = this.sendDeleteTransaction(bodyHash);

    // Removing from db
    const dbDelete = this.blockModel.findByIdAndDelete(blockBody._id);
    
    // TODO: Update return type ????
    return combineLatest([blockchainSave, dbDelete]).pipe(
      catchError((err, caught) => {
        Logger.log(err);
        return of(true);
      }),
    )
  }

  /**
   * Creates a new record on database
   *
   * @param {CreateBlockDto} createBlockDto
   * @return {*}  {Observable<Block>}
   * @memberof BlocksService
   */
  create(blockBody: string): Observable<any> {
    Logger.debug(`Creating a new block ${JSON.stringify(blockBody)}`);

    // Generating sha3 hash of body
    const bodyHash = new SHA3().update(JSON.stringify(blockBody)).digest('hex');
    
    // Check if a block with the same body already exists
    return this.isDuplicate(bodyHash).pipe(
      // map(() => {
      //   // Creating bufferedFile using blockBody
      //   return {
      //     // fieldname: '',
      //     originalname: Date.now().toString(),
      //     encoding: 'utf-8',
      //     mimetype: 'application/json',
      //     size: 12345,
      //     // buffer: Buffer.from(blockBody)
      //     buffer: JSON.stringify(blockBody),
      //   } as BufferedFile;
      // }),
      // switchMap((fileBuffer: BufferedFile) => {
      //   return from(this.minioClientService.upload(fileBuffer));
      // }),
      switchMap(() => {
        // Generating object to store in db
        const newBlock = new this.blockModel({
          body: JSON.stringify(blockBody),
          hash: bodyHash,
        });

        // Saving to blockchain
        const blockchainSave = this.sendTransaction(bodyHash);

        // Saving to db
        const dbSave = from(newBlock.save());

        return combineLatest([blockchainSave, dbSave]).pipe(
          switchMap(([receipt, block]) => {
            block.transactionHash = receipt.transactionHash;
            return block.save();
          }),
        );
      }),
      catchError((err, caught) => {
        Logger.log(err);
        return of(false);
      }),

    );
  }

  /**
   * Returns a `Block` array containing all existing blocks; `[]` if no blocks are found
   *
   * @return {*}  {Observable<Block[]>}
   * @memberof BlocksService
   */
  findAll(paginationQuery: PaginationQueryDto): Observable<Block[]> {
    Logger.debug(`Finding all blocks`);

    const { limit, offset } = paginationQuery;

    const blocks = this.blockModel.find().skip(offset).limit(limit).sort('date').exec();

    return from(blocks);
  }

  /**
   * Returns a `Block`; `null` if no blocks are found
   *
   * @param {string} id
   * @return {*}  {Observable<Block>}
   * @memberof BlocksService
   */
  findOne(id: string): Observable<Block> {
    Logger.debug(`Finding block by id: ${id}`);
    return from(this.blockModel.findById(id).exec());
  }

  /**
   * TODO: document this
   *
   * @param {string} hash
   * @return {*}  {Observable<string>}
   * @memberof BlocksService
   */
  findTransaction(hash: string): Observable<any> {
    // Find transaction hash in db
    const transactionHash = from(this.blockModel.findOne({ hash }).exec()).pipe(
      map((block: Block) => {
        return block === null ? null : block.transactionHash;
      }),
    );

    // Find step id with smart contract
    const stepId = from(this.contract.methods.hashToId(hash).call());

    // Resolve observables and return etherscan url
    return combineLatest([transactionHash, stepId]).pipe(
      map(([transactionHash, stepId]) => {
        let found = false;
        let etherscanUrl = null;

        if (stepId && transactionHash) { // TODO: Change to if (stepId > 0 && transactionHash) { ... }
          found = true;
          etherscanUrl = `${this.etherscanUrl}/${transactionHash}`;
        }

        return {
          found: found,
          etherscanUrl: etherscanUrl
        }
      }),
    );
  }

  /**
   * Check if a block with hash `hashOfJson` already exists.
   * Returns true if it already exists, false otherwise
   *
   * @private
   * @param {string} hashOfJson
   * @return {*}  {Observable<boolean>}
   * @memberof BlocksService
   */
  private isDuplicate(hashOfJson: string): Observable<boolean> {
    return from(this.blockModel.findOne({ hash: hashOfJson}).exec()).pipe(
      map((block: Block | null) => {

        // If block already exists throw an error
        if (block !== null) {
          return false;
        }

        return true;
      })
    )
  }

  /**
   *
   *
   * @private
   * @return {*}  {Observable<void>}
   * @memberof BlocksService
   */
  private sendTransaction(hashOfJson): Observable<any> {
    // Build transaction object
    return this.buildTransaction(hashOfJson).pipe(
      
      // Actually calling contract's method to generate step proof
      switchMap((transaction) => {
        return from(this.web3.eth.sendTransaction(transaction));
      }),
    );
  }

  /**
   * Builds a transaction object ready to be sent
   *
   * @private
   * @param {string} hashOfJson
   * @return {*}  {Observable<any>}
   * @memberof BlocksService
   */
  private buildTransaction(hashOfJson: string): Observable<any> {
    // Define which method to call and its' parameters
    const transactionMethod = this.contract.methods.createStepProof(hashOfJson);
    const data = transactionMethod.encodeABI();

    // Get parameters needed in order to send transaction
    const gasObs = from(transactionMethod.estimateGas({ from: this.wallet_address }));
    const gasPriceObs = from(this.web3.eth.getGasPrice());
    const nonceObs = from(this.web3.eth.getTransactionCount(this.wallet_address));

    

    // Build transaction object with all
    return combineLatest([gasObs, gasPriceObs, nonceObs]).pipe(
      map(([gas, gasPrice, nonce]) => {
        return {
          from: this.wallet_address,
          to: this.contract.options.address,
          data,
          gas,
          gasPrice,
          nonce
        };
      }),
    );
  }

  /**
   *
   *
   * @private
   * @return {*}  {Observable<void>}
   * @memberof BlocksService
   */
   private sendDeleteTransaction(hashOfJson): Observable<any> {
    // Build transaction object
    return this.buildDeleteTransaction(hashOfJson).pipe(
      
      // Actually calling contract's method to generate step proof
      switchMap((transaction) => {
        return from(this.web3.eth.sendTransaction(transaction));
      }),
    );
  }

  /**
   * 
   *
   * @private
   * @param {string} hashOfJson
   * @return {*}  {Observable<any>}
   * @memberof BlocksService
   */
   private buildDeleteTransaction(hashOfJson: string): Observable<any> {
    // Define which method to call and its' parameters
    const transactionMethod = this.contract.methods.removeStepProof(hashOfJson);
    const data = transactionMethod.encodeABI();

    // Get parameters needed in order to send transaction
    const gasObs = from(transactionMethod.estimateGas({ from: this.wallet_address }));
    const gasPriceObs = from(this.web3.eth.getGasPrice());
    const nonceObs = from(this.web3.eth.getTransactionCount(this.wallet_address));

    // Build transaction object with all
    return combineLatest([gasObs, gasPriceObs, nonceObs]).pipe(
      map(([gas, gasPrice, nonce]) => {
        return {
          from: this.wallet_address,
          to: this.contract.options.address,
          data,
          gas,
          gasPrice,
          nonce
        };
      }),
    );
  }
}
