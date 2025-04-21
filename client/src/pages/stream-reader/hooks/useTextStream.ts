import { useEffect, useRef, useState } from 'react';

import config from '../../../config';

import { createFlushBuffer } from './useFlushBuffer';

const BASE_API_PATH = config.apiBaseUrl;

const STREAM_URL = `${BASE_API_PATH}/stream-text`;

export function useTextStream() {
  const [streamedText, setStreamedText] = useState('');
  const [fullText, setFullText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const byteChunksRef = useRef<Uint8Array[]>([]);
  const flushTimerRef = useRef<number | null>(null);
  const fullRef = useRef('');

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const decoder = new TextDecoder('utf-8');
    const flushBuffer = createFlushBuffer(
      byteChunksRef,
      decoder,
      setStreamedText,
      fullRef,
      flushTimerRef,
    );

    const fetchStream = async () => {
      setIsLoading(true);
      setStreamedText('');
      setFullText('');
      setError(null);
      byteChunksRef.current = [];
      fullRef.current = '';
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
      }

      try {
        const response = await fetch(STREAM_URL, { signal });
        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (value) {
            byteChunksRef.current.push(value);
            if (!flushTimerRef.current) {
              flushTimerRef.current = setTimeout(flushBuffer, 20);
            }
          }

          if (signal.aborted) {
            reader.cancel();
            throw new Error('Aborted');
          }
        }

        flushBuffer();
        const finalChunk = decoder.decode(); // close stream
        if (finalChunk) {
          setStreamedText(prev => prev + finalChunk);
          fullRef.current += finalChunk;
        }

        setFullText(fullRef.current);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // it's expected
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStream();

    return () => {
      controller.abort();
      if (flushTimerRef.current) {
        clearTimeout(flushTimerRef.current);
        flushTimerRef.current = null;
      }
    };
  }, []);

  return { streamedText, fullText, isLoading, error };
}
