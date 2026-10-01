"use client";

import React, { useState } from "react";
import Image from "next/image";
import SectionMay from "./SectionMay";


const assets = {
  AAPLx: { name: 'Apple token', price: 243.42, icon: 'A' },
  NVDAx: { name: 'NVIDIA token', price: 162.15, icon: 'N' }
};

const money = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

export default function NedWalletDemo() {
  const [cash, setCash] = useState(75000);
  const [holdings, setHoldings] = useState({ AAPLx: 0.5, NVDAx: 0.6 });
  const [symbol, setSymbol] = useState<'AAPLx'|'NVDAx'>('AAPLx');
  const [side, setSide] = useState<'buy'|'sell'>('buy');
  const [stage, setStage] = useState<'home'|'amount'|'review'|'success'>('home');
  const [amountStr, setAmountStr] = useState('50');
  const [receipt, setReceipt] = useState<{cents:number;fee:number;quantity:number;side:'buy'|'sell';symbol:'AAPLx'|'NVDAx'} | null>(null);
  
  const [mayMood, setMayMood] = useState<"idle" | "happy" | "thinking" | "coding">("coding");
  const [mayMessage, setMayMessage] = useState("Start with an asset. I’ll walk you through it.");
  const [isMinimized, setIsMinimized] = useState(false);


  const handleReact = (mood: typeof mayMood, message: string) => {
    setMayMood(mood);
    setMayMessage(message);
  };

  const go = (next: 'home'|'amount'|'review'|'success') => {
    setStage(next);
    if (next === "review") setAckChecked(false);
    const messages = {
      home: ['coding', 'Choose a token to explore. Everything here is sample data.'],
      amount: ['coding', 'Try an amount. I’ll help you check the sample balance.'],
      review: ['thinking', 'Check the quantity and sample fee before confirming.'],
      success: ['happy', 'Done! Only the sample ledger changed.']
    } as const;
    handleReact(messages[next][0], messages[next][1]);
  };

  const maxCents = () => side === 'buy' ? cash : Math.floor(holdings[symbol] * assets[symbol].price * 100 + 1e-7);

  const getQuote = () => {
    const valid = /^\d+(?:[.,]\d{1,2})?$/.test(amountStr);
    const cents = valid ? Math.round(Number(amountStr.replace(',', '.')) * 100) : 0;
    const fee = Math.round(cents * 0.0025);
    const quantity = (side === 'buy' ? cents - fee : cents) / 100 / assets[symbol].price;
    let error = '';
    
    if (!valid || cents <= 0) error = 'Enter an amount greater than $0, with up to two decimals.';
    else if (cents > maxCents()) error = `Available to ${side}: ${money(maxCents() / 100)}.`;
    else if (cents <= fee) error = 'Amount is too small.';
    
    return { cents, fee, quantity, error };
  };

  const [ackChecked, setAckChecked] = useState(false);
  
  // For amount input
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountStr(e.target.value);
  };

  const handleAssetClick = (sym: 'AAPLx'|'NVDAx') => {
    setSymbol(sym);
    setSide('buy');
    setAmountStr('50');
    go('amount');
  };

  const handlePreset = (v: string) => {
    let newAmt = v;
    if (v === 'Max') newAmt = (maxCents() / 100).toFixed(2);
    else if (v.endsWith('%')) {
      newAmt = (Math.floor(maxCents() * parseInt(v) / 100) / 100).toFixed(2);
    }
    setAmountStr(newAmt);
  };

  const confirmTrade = () => {
    const q = getQuote();
    if (q.error || !ackChecked) return;
    setReceipt({ ...q, side, symbol });
    if (side === 'buy') {
      setCash(c => c - q.cents);
      setHoldings(h => ({ ...h, [symbol]: h[symbol] + q.quantity }));
    } else {
      setCash(c => c + q.cents - q.fee);
      setHoldings(h => ({ ...h, [symbol]: Math.max(0, h[symbol] - q.quantity) }));
    }
    go('success');
  };
  
  const resetDemo = () => {
    const dialog = document.getElementById('reset-dialog') as HTMLDialogElement;
    dialog?.showModal();
  };

  const confirmReset = () => {
    setCash(75000);
    setHoldings({ AAPLx: 0.5, NVDAx: 0.6 });
    setSymbol('AAPLx');
    setSide('buy');
    setAmountStr('50');
    setReceipt(null);
    const dialog = document.getElementById('reset-dialog') as HTMLDialogElement;
    dialog?.close();
    go('home');
  };

  const quote = getQuote();

  return (
    <section className="demo-section" id="ned-chapter-2"><span id="demo" className="ned-anchor" />
      <div className="demo-intro">
        <p className="eyebrow">02 / TRY THE EXPERIENCE</p>
        <h2>Your first<br /><em>sample investment.</em></h2>
        <p>Explore a portfolio, review a purchase, then sell part of a holding. This small walkthrough is inspired by N.E.D’s xStocks design.</p>
        <p className="demo-disclaimer"><strong>Portfolio simulation only.</strong> Fixed sample prices and balances. No wallet connection, live quotes or transactions. Refreshing resets the session.</p>
        
        <ol className="demo-steps">
          <li aria-current={stage === 'home' ? 'step' : undefined}><span>01</span> Explore assets</li>
          <li aria-current={stage === 'amount' ? 'step' : undefined}><span>02</span> Choose an amount</li>
          <li aria-current={stage === 'review' ? 'step' : undefined}><span>03</span> Review the details</li>
          <li aria-current={stage === 'success' ? 'step' : undefined}><span>04</span> See the result</li>
        </ol>

        <div className={`may-guide ${isMinimized ? 'is-minimized' : ''}`}>
          {!isMinimized && <SectionMay place="demo" mood={mayMood} message={mayMessage} />}
          <button className="may-collapse" type="button" aria-expanded={!isMinimized} aria-label={isMinimized ? 'Expand Mây guide' : 'Minimize Mây guide'} onClick={() => setIsMinimized(!isMinimized)}>{isMinimized ? '+' : '−'}</button>
        </div>
        <p className="small-note">Mây guides this portfolio. Teddy, the purple bear, belongs to N.E.D Wallet.</p>
      </div>

      <div className="demo-device">
        <div className="device-top">
          <strong>N.E.D</strong><span>SAMPLE DATA</span>
          <button id="reset-demo" aria-label="Reset demo balances" onClick={resetDemo}>Reset ↺</button>
        </div>
        
        <div id="demo-screen" tabIndex={-1}>
          {stage === 'home' && (
            <>
              <p className="demo-caption">YOUR PRACTICE WALLET</p>
              <div className="wallet-card">
                <p>Available sample dollars</p>
                <h3>{money(cash / 100)}</h3>
                <small>USDC-inspired balance · fixed USD fixtures</small>
              </div>
              <h3>Your sample assets</h3>
              {(Object.keys(assets) as ('AAPLx'|'NVDAx')[]).map(key => (
                <button key={key} className="asset-row" onClick={() => handleAssetClick(key)} aria-label={`Explore ${key}`}>
                  <span className="asset-icon">{assets[key].icon}</span>
                  <span><strong>{key}</strong><small>{assets[key].name}</small></span>
                  <span className="asset-price">
                    <strong>{money(assets[key].price)}</strong>
                    <small>{holdings[key].toFixed(6)} held →</small>
                  </span>
                </button>
              ))}
              <p className="demo-caption">Fixed sample prices. Tokenized stock exposure is not direct ownership of company shares. Select an asset to try buying or selling.</p>
            </>
          )}

          {stage === 'amount' && (
            <>
              <button className="back" onClick={() => go('home')}>← Wallet</button>
              <h3 className="trade-title">{symbol} <span className="demo-caption">{assets[symbol].name}</span></h3>
              <p className="demo-caption">Fixed sample price {money(assets[symbol].price)}</p>
              <div className="segmented" aria-label="Trade direction">
                <button onClick={() => { setSide('buy'); setAmountStr('50'); }} aria-pressed={side === 'buy'}>Buy</button>
                <button onClick={() => { setSide('sell'); setAmountStr('50'); }} aria-pressed={side === 'sell'}>Sell</button>
              </div>
              <label className="amount-label" htmlFor="trade-amount">Amount in sample USD</label>
              <input 
                className="amount-input" id="trade-amount" inputMode="decimal" autoComplete="off" 
                aria-describedby="amount-error available" value={amountStr} onChange={handleAmountChange} 
              />
              <p className="demo-caption" id="available">Available: {money(maxCents() / 100)}</p>
              <div className="presets">
                {(side === 'buy' ? ['10', '50', '100', 'Max'] : ['25%', '50%', '100%']).map(v => (
                  <button key={v} onClick={() => handlePreset(v)}>{v}</button>
                ))}
              </div>
              <p className="error" id="amount-error" aria-live="polite">{quote.error}</p>
              <p className="demo-caption">Illustrative fee: 0.25%, rounded to cents. This is a walkthrough assumption, not N.E.D’s published pricing.</p>
              <button className="button purple-button wide" disabled={!!quote.error} onClick={() => go('review')} id="review-button">Review sample {side} →</button>
            </>
          )}

          {stage === 'review' && (
            <>
              <button className="back" onClick={() => go('amount')}>← Edit amount</button>
              <h3 className="trade-title">Review sample {side}</h3>
              <dl className="receipt-lines">
                <div><dt>Asset</dt><dd>{symbol}</dd></div>
                <div><dt>Sample amount</dt><dd>{money(quote.cents / 100)}</dd></div>
                <div><dt>Illustrative fee</dt><dd>{money(quote.fee / 100)}</dd></div>
                <div><dt>{side === 'buy' ? 'Tokens received' : 'Tokens sold'}</dt><dd>{quote.quantity.toFixed(6)}</dd></div>
                <div><dt>{side === 'buy' ? 'Total debit' : 'Net credit'}</dt><dd>{money((side === 'buy' ? quote.cents : quote.cents - quote.fee) / 100)}</dd></div>
              </dl>
              <label className="ack">
                <input type="checkbox" id="ack" checked={ackChecked} onChange={e => setAckChecked(e.target.checked)} />
                I understand this changes sample data only. No real funds, shares or tokens are transferred.
              </label>
              <button className="button purple-button wide" disabled={!!quote.error || !ackChecked} onClick={confirmTrade} id="confirm-trade">Confirm sample {side}</button>
            </>
          )}

          {stage === 'success' && receipt && (
            <>
              <div className="success">
                <Image width={120} height={120} src={`${process.env.NODE_ENV === 'production' ? '/teichi-portfolio' : ''}/assets/ned/teddy-happy.png`} alt="Teddy, N.E.D’s purple bear mascot, celebrates" />
                <p className="demo-caption">SAMPLE TRANSACTION COMPLETE</p>
                <h3>{receipt.side === 'buy' ? 'Added to' : 'Sold from'} your<br />practice wallet.</h3>
                <p>{receipt.quantity.toFixed(6)} {receipt.symbol} · {money(receipt.cents / 100)}</p>
              </div>
              <dl className="receipt-lines">
                <div><dt>Sample dollars remaining</dt><dd>{money(cash / 100)}</dd></div>
                <div><dt>Sample holding</dt><dd>{holdings[symbol].toFixed(6)} {symbol}</dd></div>
              </dl>
              <button className="button purple-button wide" onClick={() => go('home')}>Back to wallet →</button>
              <button className="button wide" onClick={() => { setSide('sell'); setAmountStr((Math.floor(holdings[symbol] * assets[symbol].price * 100 / 2) / 100).toFixed(2)); go('amount'); }}>Try a sample sell</button>
            </>
          )}
        </div>
        
        <div className="device-bottom"><span className="dot"></span> Sandbox · No real funds</div>
      </div>

      <dialog id="reset-dialog" aria-labelledby="reset-title">
        <h2 id="reset-title">Start fresh?</h2>
        <p>This resets only the sample balance and holdings in this walkthrough.</p>
        <div className="dialog-actions">
          <button id="cancel-reset" className="button" onClick={() => (document.getElementById('reset-dialog') as HTMLDialogElement)?.close()}>Keep exploring</button>
          <button id="confirm-reset" className="button purple-button" onClick={confirmReset}>Reset demo</button>
        </div>
      </dialog>
    </section>
  );
}
