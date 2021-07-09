import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
    NonfungiblePositionManager,
    Approval,
    ApprovalForAll,
    Collect,
    DecreaseLiquidity,
    IncreaseLiquidity,
    Transfer,
} from "./types/NonfungiblePositionManager/NonfungiblePositionManager";
import { Transaction, TxEvent } from "./types/schema";

export function loadTransaction(event: ethereum.Event): Transaction {
    let transaction = Transaction.load(event.transaction.hash.toHexString());
    if (transaction === null) {
        transaction = new Transaction(event.transaction.hash.toHexString());
    }
    transaction.blockNumber = event.block.number;
    transaction.timestamp = event.block.timestamp;
    transaction.gasUsed = event.transaction.gasUsed;
    transaction.gasPrice = event.transaction.gasPrice;
    transaction.save();
    return transaction as Transaction;
}

function saveTxEvent(
    name: string,
    event: ethereum.Event,
    params: string
): void {
    let tx = loadTransaction(event);
    let e = new TxEvent(`${tx.id}#${event.logIndex}`);
    e.name = name;
    e.params = params;
    e.transaction = tx.id;
    e.save();
}

export function handleApproval(event: Approval): void {
    const json = `{"owner":"${event.params.owner}", "approved":"${event.params.approved}", "tokenId":"${event.params.tokenId}"}`;
    saveTxEvent("approval", event, json);
}

export function handleApprovalForAll(event: ApprovalForAll): void {
    const json = `{"owner":"${event.params.owner}","operator":"${event.params.operator}","approved":"${event.params.approved}"}`;
    saveTxEvent("approvalForAll", event, json);
}

export function handleCollect(event: Collect): void {
    const json = `{"tokenId":"${event.params.tokenId}","recipient":"${event.params.recipient}","amount0":"${event.params.amount0}","amount1":"${event.params.amount1}"}`;
    saveTxEvent("collect", event, json);
}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
    const json = `{"tokenId":"${event.params.tokenId}","liquidity":"${event.params.liquidity}","amount0":"${event.params.amount0}","amount1":"${event.params.amount1}"}`;
    saveTxEvent("decreaseLiquidity", event, json);
}

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
    const json = `{"tokenId":"${event.params.tokenId}","liquidity":"${event.params.liquidity}","amount0":"${event.params.amount0}","amount1":"${event.params.amount1}"}`;
    saveTxEvent("increaseLiquidity", event, json);
}

export function handleTransfer(event: Transfer): void {
    const json = `{"from":"${event.params.from}","to":"${event.params.to}","tokenId":"${event.params.tokenId}"}`;
    saveTxEvent("transfer", event, json);
}
