import { Dispatch, SetStateAction } from 'react';

function mergeUint8Arrays(chunks: Uint8Array[]): Uint8Array {
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const merged = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }

  return merged;
}

type Props = {
  byteChunksRef: React.RefObject<Uint8Array[]>;
  decoder: TextDecoder;
  setStreamedText: Dispatch<SetStateAction<string>>;
  fullRef: React.RefObject<string>;
  flushTimerRef: React.RefObject<number | null>;
};

export function createFlushBuffer({
  byteChunksRef,
  decoder,
  fullRef,
  flushTimerRef,
  setStreamedText,
}: Props) {
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
