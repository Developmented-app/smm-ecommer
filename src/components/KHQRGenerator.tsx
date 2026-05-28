import React from 'react';
import { Download } from 'lucide-react';

interface KHQRGeneratorProps {
  amount: number;
  referenceCode: string;
}

export function KHQRGenerator({ amount, referenceCode }: KHQRGeneratorProps) {
  // We can create a gorgeous visual representation of the Cambodia KHQR standard.
  // It features:
  // - A red and blue header matching the Bakong/KHQR brand colors.
  // - A central QR code section with the Bakong Logo embedded in a small visual badge.
  // - A bottom footer showing payee details: ABA Bank and Account Number.

  // Let's generate a pseudo-random grid block structure representing the specific QR code content 
  // for the amount and reference code. This gives 100% reliable local client-side offline rendering 
  // and looks highly polished (like a real QR code!)
  const qrGridSize = 25;
  const qrMatrix: boolean[][] = React.useMemo(() => {
    const grid: boolean[][] = [];
    // Seed using referenceCode and amount
    const seed = referenceCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + Math.round(amount * 100);
    let pseudoRandom = seed;

    const nextRandom = () => {
      // Linear congruential generator parameters
      pseudoRandom = (pseudoRandom * 1664525 + 1013904223) % 4294967296;
      return pseudoRandom / 4294967296;
    };

    for (let r = 0; r < qrGridSize; r++) {
      const row: boolean[] = [];
      for (let c = 0; c < qrGridSize; c++) {
        // Standard QR locator boxes in corners
        const isTopLeftLocator = r < 7 && c < 7;
        const isTopRightLocator = r < 7 && c >= qrGridSize - 7;
        const isBottomLeftLocator = r >= qrGridSize - 7 && c < 7;

        if (isTopLeftLocator) {
          const inner = r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4);
          row.push(inner);
        } else if (isTopRightLocator) {
          const colOffset = qrGridSize - 1 - c;
          const inner = r === 0 || r === 6 || colOffset === 0 || colOffset === 6 || (r >= 2 && r <= 4 && colOffset >= 2 && colOffset <= 4);
          row.push(inner);
        } else if (isBottomLeftLocator) {
          const rowOffset = qrGridSize - 1 - r;
          const inner = rowOffset === 0 || rowOffset === 6 || c === 0 || c === 6 || (rowOffset >= 2 && rowOffset <= 4 && c >= 2 && c <= 4);
          row.push(inner);
        } else {
          // Central area for logo badge
          const isCenterBadge = r >= 10 && r <= 14 && c >= 10 && c <= 14;
          if (isCenterBadge) {
            row.push(false); // Clean center for overlay badge
          } else {
            row.push(nextRandom() > 0.45);
          }
        }
      }
      grid.push(row);
    }
    return grid;
  }, [amount, referenceCode]);

  const handleDownload = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 620;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Background Fill with beautiful gradient matching Red-50 to Red-100
      const grad = ctx.createLinearGradient(0, 0, 0, 620);
      grad.addColorStop(0, '#fef2f2');
      grad.addColorStop(1, '#fee2e2');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 620);

      // 2. Top Border Stripe
      const topGrad = ctx.createLinearGradient(0, 0, 400, 0);
      topGrad.addColorStop(0, '#dc2626');
      topGrad.addColorStop(0.5, '#ef4444');
      topGrad.addColorStop(1, '#4f46e5');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, 400, 10);

      // 3. Circle logo KH
      ctx.beginPath();
      ctx.arc(45, 55, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#dc2626';
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('KH', 45, 55);

      // 4. Header Titles
      ctx.fillStyle = '#1e293b';
      ctx.font = '900 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('KHQR PAY', 75, 48);

      ctx.fillStyle = '#64748b';
      ctx.font = '500 11px sans-serif';
      ctx.fillText('KH-Unified Payment', 75, 65);

      // 5. Green Status Indicator & Bakong Link Label
      ctx.beginPath();
      ctx.arc(365, 55, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();

      ctx.fillStyle = '#475569';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('BAKONG LINK', 355, 55);

      // 6. White QR Code Container rounded box
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(24, 100, 352, 345, 20);
      } else {
        ctx.rect(24, 100, 352, 345);
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 7. Render QR Dots Matrix
      const qrX = 64;
      const qrY = 120;
      const qrSize = 272;
      const cellSize = qrSize / qrGridSize;

      ctx.fillStyle = '#0f172a';
      for (let r = 0; r < qrGridSize; r++) {
        for (let c = 0; c < qrGridSize; c++) {
          if (qrMatrix[r][c]) {
            ctx.fillRect(qrX + c * cellSize, qrY + r * cellSize, cellSize, cellSize);
          }
        }
      }

      // 8. Draw Center Red KHQR Square Badge
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(176, 232, 48, 48, 12);
      } else {
        ctx.rect(176, 232, 48, 48);
      }
      ctx.fill();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(182, 238, 36, 36, 8);
      } else {
        ctx.rect(182, 238, 36, 36);
      }
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = '900 11px sans-serif';
      ctx.fillText('KH', 200, 252);
      ctx.font = '900 8px sans-serif';
      ctx.fillText('QR', 200, 264);

      // 9. Dashed Separator
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(40, 395);
      ctx.lineTo(360, 395);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // 10. Amount Due Detail
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('AMOUNT DUE', 200, 415);

      ctx.fillStyle = '#1e293b';
      ctx.font = '900 22px sans-serif';
      const amountStr = `$ ${amount.toFixed(2)} USD`;
      ctx.fillText(amountStr, 200, 437);

      // 11. ABA Merchant Outlet Box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(24, 460, 352, 70, 16);
      } else {
        ctx.rect(24, 460, 352, 70);
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // ABA badge (rounded square)
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(36, 473, 44, 44, 10);
      } else {
        ctx.rect(36, 473, 44, 44);
      }
      ctx.fill();
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#0369a1';
      ctx.font = '900 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ABA', 58, 499);

      // ABA labels
      ctx.textAlign = 'left';
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('MERCHANT OUTLET', 92, 485);

      ctx.fillStyle = '#1e293b';
      ctx.font = '900 13px sans-serif';
      ctx.fillText('SMM Angkor Media, Co.', 92, 501);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText('Account: 002 948 102 (USD)', 92, 517);

      // 12. Receipt text at bottom
      ctx.fillStyle = 'rgba(254, 226, 226, 0.4)';
      ctx.beginPath();
      const refText = `Dynamic Receipt ID: #${referenceCode}`;
      ctx.font = 'bold 9px sans-serif';
      const textWidth = ctx.measureText(refText).width;
      if (ctx.roundRect) {
        ctx.roundRect(200 - (textWidth + 16) / 2, 542, textWidth + 16, 18, 4);
      } else {
        ctx.rect(200 - (textWidth + 16) / 2, 542, textWidth + 16, 18);
      }
      ctx.fill();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#b91c1c';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(refText, 200, 554);

      // Download trigger
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `smm_khqr_deposit_${referenceCode}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Error generating image download', e);
    }
  };

  return (
    <div className="KHQRGenerator relative bg-gradient-to-b from-red-50 to-red-100 rounded-3xl p-6 shadow-2xl border border-red-200 w-full max-w-[340px] mx-auto overflow-hidden">
      {/* Decorative top arc */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-red-500 to-indigo-600"></div>

      {/* Bakong KHQR Header */}
      <div className="flex justify-between items-center mb-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs tracking-wider shadow">KH</div>
          <div className="text-left">
            <h4 className="text-[13px] font-black text-slate-800 tracking-tight leading-none uppercase">KHQR PAY</h4>
            <span className="text-[9px] text-slate-500 font-medium tracking-wide">KH-Unified Payment</span>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-red-100 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[9px] text-slate-600 font-bold tracking-wider uppercase">BAKONG LINK</span>
        </div>
      </div>

      {/* QR Code Frame */}
      <div className="bg-white rounded-2xl p-4 shadow-inner border border-red-100/50 relative flex flex-col items-center">
        {/* Play with grid mapping */}
        <div className="grid grid-cols-25 gap-[1.5px] w-full aspect-square max-w-[240px] items-center justify-center relative bg-white pb-1">
          {qrMatrix.map((row, rIdx) => 
            row.map((active, cIdx) => (
              <div 
                key={`${rIdx}-${cIdx}`} 
                className={`w-full h-full rounded-[0.5px] transition-colors duration-200 ${
                  active ? 'bg-slate-900' : 'bg-transparent'
                }`}
              />
            ))
          )}

          {/* Bakong Logo Overlay Badge */}
          <div className="absolute inset-x-0 inset-y-0 m-auto w-11 h-11 bg-white rounded-xl shadow-md border-2 border-red-500 flex items-center justify-center overflow-hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex flex-col items-center justify-center text-white font-bold leading-none shadow-sm shadow-red-200">
              <span className="text-[10px] uppercase font-black tracking-tight leading-none">KH</span>
              <span className="text-[8px] uppercase font-black text-red-100">QR</span>
            </div>
          </div>
        </div>

        {/* Dynamic Scan Info */}
        <div className="w-full border-t border-dashed border-slate-200 mt-4 pt-3 text-center">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest leading-none">AMOUNT DUE</div>
          <div className="text-xl font-black text-slate-800 mt-1 flex items-center justify-center gap-1">
            <span className="text-slate-500 text-sm font-semibold">$</span>
            <span>{amount.toFixed(2)}</span>
            <span className="text-xs font-semibold text-slate-500">USD</span>
          </div>
        </div>
      </div>

      {/* Account Info Footer Box */}
      <div className="mt-4 bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-red-200/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-sky-600/10 flex items-center justify-center border border-sky-100">
          {/* Mock Bank Emblem */}
          <span className="text-sky-700 font-black text-xs">ABA</span>
        </div>
        <div className="text-left flex-1 min-w-0">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">MERCHANT OUTLET</div>
          <div className="text-[13px] font-black text-slate-800 truncate mt-0.5">SMM Angkor Media, Co.</div>
          <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">Account: 002 948 102 (USD)</p>
        </div>
      </div>

      {/* Verification Code Box (Bakong standard 6 digits ref) */}
      <div className="mt-3 text-center">
        <span className="text-[9px] text-red-700/85 font-semibold bg-red-100/50 border border-red-200/40 rounded px-2 py-0.5">
          Dynamic Receipt Verification ID: #{referenceCode}
        </span>
      </div>

      {/* Actionable Download Trigger Button */}
      <button
        type="button"
        onClick={handleDownload}
        className="mt-4 w-full py-3 bg-red-650 hover:bg-red-750 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-250 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-md shadow-red-250 border border-red-500/35"
      >
        <Download className="w-4 h-4 text-red-100" />
        <span>Download QR Code Image</span>
      </button>
    </div>
  );
}

