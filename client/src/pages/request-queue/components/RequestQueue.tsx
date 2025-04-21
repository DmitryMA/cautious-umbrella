import { useEffect, useRef, useState } from 'react';

import config from '../../../config';

enum STATUS {
  pending = 'pending',
  done = 'done',
}

const WS_BASE_PATH = config.websocketUrl;
const BASE_API_PATH = config.apiBaseUrl;

type Item = { id: number; status: STATUS; result?: string };

export default function RequestQueue() {
  const [items, setItems] = useState<Item[]>(
    Array.from({ length: 20 }, (_, idx) => ({ id: idx + 1, status: STATUS.pending })),
  );
  const socketRef = useRef<WebSocket>(null);

  useEffect(() => {
    socketRef.current = new WebSocket(`${WS_BASE_PATH}/ws`);
    socketRef.current.onmessage = (event: MessageEvent) => {
      const { id, result } = JSON.parse(event.data);
      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, status: STATUS.done, result } : item)),
      );
    };
    return () => {
      socketRef.current?.close();
    };
  }, []);

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
        .then(() => {
          // status is already "pending" for all items
        })
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
  }, []);

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        {items.map(it => (
          <div
            key={it.id}
            className='bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200'
          >
            <div className='flex items-center justify-between'>
              <span className='text-lg font-normal text-gray-700 text-nowrap'>
                Request #{it.id}
              </span>
              {it.status === STATUS.pending ? (
                <span className='inline-flex text-nowrap items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 animate-pulse'>
                  ● Pending
                </span>
              ) : (
                <span className='inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
                  ✓ Done
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
