import { ChatPanel } from '@/components/chat/ChatPanel';
export default function M12_1_Chat() {
  return (
    <div className="w-full h-full bg-ice-50 flex items-center justify-center p-4">
      {' '}
      <div className="w-full max-w-4xl h-full bg-white rounded-2xl shadow-lg overflow-hidden border border-ice-100">
        {' '}
        <ChatPanel isFullscreen={true} />{' '}
      </div>{' '}
    </div>
  );
}
