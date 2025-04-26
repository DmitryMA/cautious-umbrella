import { useEffect, useRef, useState } from 'react';

import config from '../../../config';
import { useStableFn } from '../../profiles/hooks/useStableFn';

import StatusCard from './StatusCard';

enum STATUS {
  init = 'init',
  pending = 'pending',
  done = 'done',
}

const STATUS_COMPONENT = new Map<STATUS, { text: string; classNames: string }>([
  [
    STATUS.init,
    {
      text: '⏳ Init',
      classNames: 'bg-blue-100 text-blue-800',
    },
  ],
  [
    STATUS.pending,
    {
      text: '● Pending',
      classNames: 'bg-yellow-100 text-yellow-800 animate-pulse',
    },
  ],
  [
    STATUS.done,
    {
      text: '✓ Done',
      classNames: 'bg-green-100 text-green-800',
    },
  ],
]);

const WS_BASE_PATH = config.websocketUrl;
const BASE_API_PATH = config.apiBaseUrl;

type Item = { id: number; status: STATUS };

export default function RequestQueue() {
  const [items, setItems] = useState<Item[]>(
    Array.from({ length: 20 }, (_, idx) => ({ id: idx + 1, status: STATUS.init })),
  );
  const socketRef = useRef<WebSocket>(null);

  const handleUpdateItems = useStableFn(({ id, status }) => {
    setItems(prev => prev.map(item => (item.id === id ? { ...item, status } : item)));
  });

  useEffect(() => {
    socketRef.current = new WebSocket(`${WS_BASE_PATH}/ws`);

    socketRef.current.onmessage = (event: MessageEvent) => {
      const { id, status } = JSON.parse(event.data);
      handleUpdateItems({ id, status });
    };
    return () => {
      socketRef.current?.close();
    };
  }, [handleUpdateItems]);

  useEffect(() => {
    const controllers: AbortController[] = [];

    for (const item of items) {
      const controller = new AbortController();
      controllers.push(controller);

      fetch(`${BASE_API_PATH}/queue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
        signal: controller.signal,
      })
        .then(res => res.json())
        .then(({ id, status }) => handleUpdateItems({ id, status }))
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === 'AbortError') {
            // it's expected
          }
        });
    }
    return () => {
      controllers.forEach(ctrl => ctrl.abort());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleUpdateItems]);

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        {items.map(({ id, status }) => {
          const statusMetaData = STATUS_COMPONENT.get(status);
          return (
            <StatusCard
              key={id}
              id={id}
              classNames={statusMetaData?.classNames || ''}
              text={statusMetaData?.text || ''}
            />
          );
        })}
      </div>
    </div>
  );
}
