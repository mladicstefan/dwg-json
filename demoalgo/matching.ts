#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { remove as stripDiacritics } from 'diacritics';
import { findBestMatch } from 'string-similarity';
import minimist from 'minimist';
import { error } from 'console';

const GLOSSARY: Record<string,string[]> = {
    PartNumber:  ['partnumber','part_number','part num','teilenummer','numero de pieza'],
    PartDesc:    ['partdesc','description','part_description','beschreibung','description de pièce'],
    Quantity:    ['quantity','qty','amount','anzahl','cantidad'],
    ProjectID:   ['projectid','project_id','projekt','projet'],
    Price:       ['price','unitprice','unit price','preis','prix'],
    Currency:    ['currency','währung','monnaie'],
    Supplier:    ['supplier','lieferant','fournisseur'],
    Description: ['description','desc','beschreibung','descripción']
};

const STOP_WORDS = new Set([
    'pcs','piece','pieces','±0','±0.1','mm','cm','inch','in','x'
  ]);

const HDR_THRESHOLD = 0.75;
const DESC_THRESHOLD = 0.7;

const cleanString = (s: string): string =>
    s
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

const mapHeader = (hdr:string): string => {
    
    const cleanedHdr = cleanString(hdr);

    const pool = Object.entries(GLOSSARY)
     .flatMap(([key, syns]) => 
        syns.map(syn => ({key, syn:cleanString(syn)}))
    )

    const scored = pool.map(({ key, syn }) => ({
        key,
        score: findBestMatch(cleanedHdr, [syn]).ratings[0].rating
      }));

    const best = scored.reduce((a, b) => (a.score > b.score ? a : b));
    if (best.score < HDR_THRESHOLD) {
        throw new Error(
          `Unable to map header "${hdr}". Best guess "${best.key}" ` +
          `scored only ${best.score.toFixed(2)} (need ≥${HDR_THRESHOLD}).`
        );
      }
    return best.key;
    };

const normalizeDesc = (raw:string): string => {
    let s = raw
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

    const tokens = s.split(' ').filter(tok => tok && !STOP_WORDS.has(tok));

    return tokens
    .map(tok => stripDiacritics(tok))
    .join(' ');
};

const loadSheet = (filePath: string): Record<string,any>[] => {
    
    const wb  = XLSX.readFile(filePath);
    const ws  = wb.Sheets[wb.SheetNames[0]];
    const raw = XLSX.utils.sheet_to_json<Record<string,any>>(ws, { defval: ''});
    if (raw.length === 0) {throw new Error ('No data found in ${filePath}')};

    const hdrMap = Object.keys(raw[0]).reduce((map,hdr)=> {
        map[hdr] = mapHeader(hdr);
        return map;
    }, {} as Record<string,string>);

    return raw.map(row => {
        const out: Record<string, any> = {};
        for (const [origHdr, val] of Object.entries(row)) {
          const key = hdrMap[origHdr];
          out[key] = val;
        }
        return out;
      });
    };

const main = (): void => {
    const argv      = minimist(process.argv.slice(2));
    const bomPath   = argv.bom      as string;
    const pricePath = argv.price      as string;
    const outFile = argv.out ?? 'matches.xlsx';
    if (!bomPath || !pricePath) {
        console.error('Usage: --bom <bom.xlsx> --price <price.xlsx> [--out <file>]');
        process.exit(1)
    };
    
    const bomRows   = loadSheet(bomPath);
    const priceRows = loadSheet(pricePath);

    bomRows.forEach(r => r._normDesc   = normalizeDesc(r.PartDesc));
    priceRows.forEach(r => r._normDesc = normalizeDesc(r.Description));

    const priceMap = new Map(priceRows.map(p => [p.PartNumber, p]));

const results = bomRows.map(b => {
    
    let match       = priceMap.get(b.PartNumber) || null;
    let confidence  = match ? 1 : 0;

    if (!match) {
        const best = priceRows
         .map(p => ({
          p,
          score: findBestMatch(b._normDesc, [p._normDesc]).ratings[0].rating
      }))
      .reduce((a,c) => (a.score > c.score ? a : c));
        if (best.score >= DESC_THRESHOLD){
            match = best.p;
            confidence = best.score;
        }
    }
    return {
        ...b,
        MatchedPartNumber: match?.PartNumber ?? '',
        MatchedPrice:      match?.Price      ?? null,
        MatchedSupplier:   match?.Supplier   ?? '',
        MatchConfidence:   confidence
      };
    });
    const ws = XLSX.utils.json_to_sheet(results);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Matches');
    XLSX.writeFile(wb, outFile);
  
    console.log(`✅ Matched ${results.length} rows → "${outFile}"`);
  };
  
main();

