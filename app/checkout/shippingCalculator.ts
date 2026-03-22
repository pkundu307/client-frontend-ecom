// src/app/checkout/shippingCalculator.ts
import type { CartItem, Address } from '../store/types';
import { resolveStateCode } from './state-codes';

// ─────────────────────────────────────────────────────────
// CONSTANTS & TYPES
// ─────────────────────────────────────────────────────────
export type ShippingZone = 'ALL_BENGAL' | 'NE_NORTH_MP' | 'SPECIAL' | 'REST_OF_INDIA';

const BENGAL_CODE = '19';
const NE_NORTH_MP_SET = new Set(['18', '16', '13', '14', '15', '17', '12', '11', '23', '02', '05', '04']);
const SPECIAL_SET = new Set(['01', '38', '31', '35']);

// REAL MARKET COD RATES (Xpressbees SME Tier)
const MIN_COD_CHARGE = 45; // Minimum fixed fee
const COD_PERCENTAGE = 0.012; // 1.2% of order value

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────

export function calcVolumetricWeight(l: number, w: number, h: number): number {
  return (l * w * h) / 5; // (L*W*H)/5000 * 1000 for grams
}

export function getChargeableGrams(actualG: number, volG: number): number {
  return Math.ceil(Math.max(actualG, volG) / 500) * 500;
}

// ─────────────────────────────────────────────────────────
// RATE TABLES (Xpressbees 2025-26)
// ─────────────────────────────────────────────────────────

function allBengalRate(g: number): number {
  if (g <= 500)  return 50;
  if (g <= 1000) return 70;
  if (g <= 10000) return 70 + Math.ceil((g - 1000) / 500) * 25;
  
  // Bulk Bengal
  const base10 = 520; 
  if (g <= 20000) return base10 + Math.ceil((g - 10000) / 1000) * 30;
  return 820 + Math.ceil((g - 20000) / 1000) * 25;
}

function restOfIndiaRate(g: number): number {
  if (g <= 500)  return 70;
  if (g <= 1000) return 90;
  if (g <= 10000) return 90 + Math.ceil((g - 1000) / 500) * 40;
  
  // Bulk National
  const base10 = 810;
  if (g <= 20000) return base10 + Math.ceil((g - 10000) / 1000) * 40;
  return 1210 + Math.ceil((g - 20000) / 1000) * 30;
}

function neNorthMpRate(g: number): number {
  if (g <= 500)  return 90;
  if (g <= 1000) return 140;
  if (g <= 10000) return 140 + Math.ceil((g - 1000) / 500) * 60;
  return 1220 + Math.ceil((g - 10000) / 1000) * 55;
}

function specialZoneRate(g: number): number {
  const kg = Math.max(Math.ceil(g / 1000), 1);
  if (kg <= 5)  return kg * 75;
  if (kg <= 10) return 375 + (kg - 5) * 70;
  return 725 + (kg - 10) * 60;
}

// ─────────────────────────────────────────────────────────
// MAIN CALCULATOR
// ─────────────────────────────────────────────────────────

export interface SellerShipment {
  businessId: string;
  businessName: string;
  items: CartItem[];
  chargeableWeightGrams: number;
  shippingCharge: number;
  codCharge: number; // New field
  zone: ShippingZone;
}

export interface ShippingResult {
  shipments: SellerShipment[];
  totalShippingCharge: number;
  totalCodCharge: number; // New field
  grandTotalLogistics: number; // shipping + cod
}

/**
 * @param items - Cart items
 * @param deliveryAddress - Address object
 * @param isCod - Whether the user selected Cash on Delivery
 */
export function calculateShipping(
  items: CartItem[],
  deliveryAddress: Address,
  isCod: boolean = false 
): ShippingResult {
  
  const destCode = deliveryAddress.stateCode || resolveStateCode(deliveryAddress.state) || '00';

  // 1. Group by Seller
  const sellerMap = new Map<string, CartItem[]>();
  items.forEach(item => {
    const bId = item.variant?.product?.businessId || 'unknown';
    if (!sellerMap.has(bId)) sellerMap.set(bId, []);
    sellerMap.get(bId)!.push(item);
  });

  const shipments: SellerShipment[] = [];

  // 2. Process per Seller
  sellerMap.forEach((sellerItems, businessId) => {
    let actualWeight = 0;
    let volWeight = 0;
    let sellerSubtotal = 0;

    sellerItems.forEach(item => {
      const qty = item.quantity;
      const price = Number(item.variant?.price || 0);
      sellerSubtotal += price * qty;

      actualWeight += (item.variant?.weightInGrams || 500) * qty;

      const l = parseFloat(item.variant?.length?.toString() || '0');
      const w = parseFloat(item.variant?.width?.toString() || '0');
      const h = parseFloat(item.variant?.height?.toString() || '0');
      if (l > 0 && w > 0 && h > 0) {
        volWeight += calcVolumetricWeight(l, w, h) * qty;
      }
    });

    const chargeableGrams = getChargeableGrams(actualWeight, volWeight);
    
    // Zone Selection (with origin-destination validation)
    const originCode = sellerItems[0]?.supplyStateCode || '00';
    let zone: ShippingZone = 'REST_OF_INDIA';

    if (destCode === BENGAL_CODE && originCode === BENGAL_CODE) {
      zone = 'ALL_BENGAL';
    } else if (SPECIAL_SET.has(destCode)) {
      zone = 'SPECIAL';
    } else if (NE_NORTH_MP_SET.has(destCode)) {
      zone = 'NE_NORTH_MP';
    }

    // Shipping Charge
    let shipRate = 0;
    switch (zone) {
      case 'ALL_BENGAL':    shipRate = allBengalRate(chargeableGrams); break;
      case 'NE_NORTH_MP':   shipRate = neNorthMpRate(chargeableGrams); break;
      case 'SPECIAL':       shipRate = specialZoneRate(chargeableGrams); break;
      case 'REST_OF_INDIA': shipRate = restOfIndiaRate(chargeableGrams); break;
    }

    // REAL COD Calculation
    let codFee = 0;
    if (isCod) {
      // Whichever is higher: ₹45 or 1.2% of the amount collected from customer
      const percentFee = sellerSubtotal * COD_PERCENTAGE;
      codFee = Math.max(MIN_COD_CHARGE, percentFee);
    }

    shipments.push({
      businessId,
      businessName: sellerItems[0]?.variant?.product?.business?.name || 'Seller',
      items: sellerItems,
      chargeableWeightGrams: chargeableGrams,
      shippingCharge: shipRate,
      codCharge: codFee,
      zone
    });
  });

  const totalShipping = shipments.reduce((sum, s) => sum + s.shippingCharge, 0);
  const totalCod = shipments.reduce((sum, s) => sum + s.codCharge, 0);

  return {
    shipments,
    totalShippingCharge: totalShipping,
    totalCodCharge: totalCod,
    grandTotalLogistics: totalShipping + totalCod
  };
}