// src/app/checkout/shippingCalculator.ts
import type { CartItem, Address } from '../store/types';
import { resolveStateCode } from './state-codes';

// ─────────────────────────────────────────────────────────
// ZONE TYPES
// ─────────────────────────────────────────────────────────
export type ShippingZone =
  | 'ALL_BENGAL'      // West Bengal destination
  | 'NE_NORTH_MP'     // NE states + HP, Uttarakhand, Chandigarh, MP
  | 'SPECIAL'         // J&K, Ladakh, Lakshadweep, A&N
  | 'REST_OF_INDIA';  // Everything else

// ─────────────────────────────────────────────────────────
// ZONE MAPS  (destination state codes → zone)
// ─────────────────────────────────────────────────────────
const ALL_BENGAL_SET = new Set(['19']);

const NE_NORTH_MP_SET = new Set([
  '18', // Assam
  '16', // Tripura
  '13', // Nagaland
  '14', // Manipur
  '15', // Mizoram
  '17', // Meghalaya
  '12', // Arunachal Pradesh
  '11', // Sikkim
  '23', // Madhya Pradesh
  '02', // Himachal Pradesh
  '05', // Uttarakhand
  '04', // Chandigarh
]);

const SPECIAL_SET = new Set([
  '01', // Jammu & Kashmir
  '38', // Ladakh
  '31', // Lakshadweep
  '35', // Andaman & Nicobar Islands
]);

export function getDestinationZone(stateCode: string): ShippingZone {
  if (ALL_BENGAL_SET.has(stateCode))  return 'ALL_BENGAL';
  if (NE_NORTH_MP_SET.has(stateCode)) return 'NE_NORTH_MP';
  if (SPECIAL_SET.has(stateCode))     return 'SPECIAL';
  return 'REST_OF_INDIA';
}

// ─────────────────────────────────────────────────────────
// WEIGHT HELPERS
// ─────────────────────────────────────────────────────────

/**
 * Volumetric weight in grams.
 * Formula: (L × W × H in CM) / 5 → grams
 */
export function calcVolumetricWeight(l: number, w: number, h: number): number {
  return (l * w * h) / 5;
}

/**
 * Chargeable weight = max(actual, volumetric), rounded UP to nearest 500g.
 */
export function chargeableWeight(actualG: number, volG: number): number {
  return Math.ceil(Math.max(actualG, volG) / 500) * 500;
}

// ─────────────────────────────────────────────────────────
// XPRESSBEES RATE FUNCTIONS
// ─────────────────────────────────────────────────────────

function allBengalRate(g: number): number {
  // ≤500g=₹50 | ≤1kg=₹70 | +₹25/500g | 10kg+: ₹30/kg | 20kg+: ₹25/kg
  if (g <= 500)  return 50;
  if (g <= 1000) return 70;
  if (g <= 10000) {
    return 70 + Math.ceil((g - 1000) / 500) * 25;
  }
  const base10 = 70 + Math.ceil((10000 - 1000) / 500) * 25; // ₹520
  if (g <= 20000) return base10 + Math.ceil((g - 10000) / 1000) * 30;
  const base20 = base10 + 10 * 30; // ₹820
  return base20 + Math.ceil((g - 20000) / 1000) * 25;
}

function restOfIndiaRate(g: number): number {
  // ≤500g=₹70 | ≤1kg=₹90 | +₹40/500g | 10kg+: ₹40/kg | 20kg+: ₹30/kg
  if (g <= 500)  return 70;
  if (g <= 1000) return 90;
  if (g <= 10000) {
    return 90 + Math.ceil((g - 1000) / 500) * 40;
  }
  const base10 = 90 + Math.ceil((10000 - 1000) / 500) * 40; // ₹810
  if (g <= 20000) return base10 + Math.ceil((g - 10000) / 1000) * 40;
  const base20 = base10 + 10 * 40; // ₹1210
  return base20 + Math.ceil((g - 20000) / 1000) * 30;
}

function neNorthMpRate(g: number): number {
  // ≤500g=₹90 | ≤1kg=₹140 | +₹60/500g | 10kg+: ₹55/kg
  if (g <= 500)  return 90;
  if (g <= 1000) return 140;
  if (g <= 10000) {
    return 140 + Math.ceil((g - 1000) / 500) * 60;
  }
  const base10 = 140 + Math.ceil((10000 - 1000) / 500) * 60; // ₹1220
  return base10 + Math.ceil((g - 10000) / 1000) * 55;
}

function specialZoneRate(g: number): number {
  // 1–5kg: ₹75/kg | 6–10kg: ₹70/kg | 11kg+: ₹60/kg
  const kg = Math.max(Math.ceil(g / 1000), 1);
  if (kg <= 5)  return kg * 75;
  if (kg <= 10) return 5 * 75 + (kg - 5) * 70;
  return 5 * 75 + 5 * 70 + (kg - 10) * 60;
}

export function calcXpressbeesRate(grams: number, zone: ShippingZone): number {
  switch (zone) {
    case 'ALL_BENGAL':    return allBengalRate(grams);
    case 'NE_NORTH_MP':   return neNorthMpRate(grams);
    case 'SPECIAL':       return specialZoneRate(grams);
    case 'REST_OF_INDIA': return restOfIndiaRate(grams);
  }
}

// ─────────────────────────────────────────────────────────
// RESULT TYPES
// ─────────────────────────────────────────────────────────
export interface SellerShipment {
  businessId: string;
  businessName: string;
  supplyState: string;
  supplyStateCode: string;
  items: CartItem[];
  totalActualGrams: number;
  totalVolumetricGrams: number;
  chargeableGrams: number;
  destinationZone: ShippingZone;
  shippingCharge: number;
}

export interface ShippingResult {
  shipments: SellerShipment[];
  totalShippingCharge: number;
  destinationState: string;
  destinationStateCode: string;
  destinationZone: ShippingZone;
}

// ─────────────────────────────────────────────────────────
// MAIN CALCULATOR
// ─────────────────────────────────────────────────────────
export function calculateShipping(
  items: CartItem[],
  deliveryAddress: Address,
): ShippingResult {
  // 1. Resolve destination state code
  const destStateCode =
    (deliveryAddress.stateCode?.trim() || null) ??
    resolveStateCode(deliveryAddress.state) ??
    '00';

  const destinationZone = getDestinationZone(destStateCode);

  // 2. Group items by seller businessId
  const sellerMap = new Map<string, CartItem[]>();
  for (const item of items) {
    const key =
      item.variant?.product?.business?.id ??
      item.variant?.product?.businessId ??
      item.productId;
    if (!sellerMap.has(key)) sellerMap.set(key, []);
    sellerMap.get(key)!.push(item);
  }

  // 3. Per-seller shipment calculation
  const shipments: SellerShipment[] = [];

  for (const [businessId, sellerItems] of sellerMap) {
    let totalActualGrams = 0;
    let totalVolumetricGrams = 0;

    for (const item of sellerItems) {
      const qty = item.quantity;

      // Actual weight (fallback 500g if missing)
      const wPerUnit =
        item.snapshotWeightInGrams ??
        item.variant?.weightInGrams ??
        500;
      totalActualGrams += wPerUnit * qty;

      // Volumetric weight
      const l = parseFloat(item.snapshotLength ?? item.variant?.length ?? '0');
      const w = parseFloat(item.snapshotWidth  ?? item.variant?.width  ?? '0');
      const h = parseFloat(item.snapshotHeight ?? item.variant?.height ?? '0');
      if (l > 0 && w > 0 && h > 0) {
        totalVolumetricGrams += calcVolumetricWeight(l, w, h) * qty;
      }
    }

    const chargeableGrams = chargeableWeight(totalActualGrams, totalVolumetricGrams);
    const shippingCharge  = calcXpressbeesRate(chargeableGrams, destinationZone);
    const firstItem       = sellerItems[0];

    shipments.push({
      businessId,
      businessName:    firstItem.variant?.product?.business?.name ?? 'Seller',
      supplyState:     firstItem.supplyState     ?? '',
      supplyStateCode: firstItem.supplyStateCode ?? '',
      items:           sellerItems,
      totalActualGrams,
      totalVolumetricGrams,
      chargeableGrams,
      destinationZone,
      shippingCharge,
    });
  }

  return {
    shipments,
    totalShippingCharge: shipments.reduce((s, x) => s + x.shippingCharge, 0),
    destinationState:     deliveryAddress.state,
    destinationStateCode: destStateCode,
    destinationZone,
  };
}
