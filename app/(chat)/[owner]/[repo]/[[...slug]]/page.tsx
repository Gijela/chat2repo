import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { auth } from '@/app/(auth)/auth';

export interface RepoParams {
  owner?: string;
  repo?: string;
  slug?: string[];
}

export default async function Page({ params }: { params: Promise<RepoParams> }) {
  const session = await auth();
  if (!session) {
    redirect('/api/auth/guest');
  }

  const id = generateUUID();
  const repoInfo = await params;

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  if (!modelIdFromCookie) {
    return (
      <>
        <Chat
          key={id}
          id={id}
          repoInfo={repoInfo}
          initialMessages={[]}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType="private"
          isReadonly={false}
          session={session}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        key={id}
        id={id}
        repoInfo={repoInfo}
        initialMessages={[]}
        selectedChatModel={modelIdFromCookie.value}
        selectedVisibilityType="private"
        isReadonly={false}
        session={session}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
