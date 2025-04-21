import { Dispatch, SetStateAction } from 'react';

import { mergeUint8Arrays } from '../utils/utils';

export function createFlushBuffer(
  byteChunksRef: React.RefObject<Uint8Array[]>,
  decoder: TextDecoder,
  setStreamedText: Dispatch<SetStateAction<string>>,
  fullRef: React.RefObject<string>,
  flushTimerRef: React.RefObject<number | null>,
) {
  return () => {
    if (byteChunksRef.current.length === 0) return;

    const merged = mergeUint8Arrays(byteChunksRef.current);
    const decoded = decoder.decode(merged, { stream: true });

    setStreamedText(prev => prev + decoded);
    fullRef.current += decoded;
    byteChunksRef.current = [];
    flushTimerRef.current = null;
  };
}
