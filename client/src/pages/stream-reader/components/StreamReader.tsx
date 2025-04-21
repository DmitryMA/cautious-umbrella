import { useTextStream } from '../hooks/useTextStream';

import StreamReaderLoader from './StreamReaderLoader';

export default function StreamReader() {
  const { streamedText, fullText, isLoading, error } = useTextStream();

  return (
    <div className='p-4 space-y-4'>
      <h2 className='text-lg font-semibold'>Streaming Output</h2>

      {error && <div className='text-red-500 font-medium'>Error: {error}</div>}

      <div className='bg-gray-50 p-2 rounded h-[300px] overflow-auto'>
        {isLoading && <StreamReaderLoader />}
        {!isLoading && !streamedText && <p>Nothing yet</p>}
        {!isLoading && streamedText && <pre className='whitespace-pre-wrap'>{streamedText}</pre>}
      </div>

      <div className='space-y-2'>
        <h3 className='text-md font-medium mt-4'>Final Full Text</h3>
        <div className='bg-gray-50 p-2 rounded h-[300px] overflow-auto'>
          {!fullText && !isLoading ? (
            <StreamReaderLoader />
          ) : (
            <pre className='whitespace-pre-wrap'>{fullText}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
